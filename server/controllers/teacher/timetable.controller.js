// controllers/teacher/timetable.controller.js
const Timetable = require('../../models/Timetable.model');
const Class = require('../../models/Class.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');

const getTeacherTimetable = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { semester, detailed = false } = req.query;

    // Get current timetable for the teacher's department
    const timetable = await Timetable.findOne({
      department: req.user.department,
      isCurrent: true,
      ...(semester && { semester })
    });

    if (!timetable) {
      throw new ApiError(404, 'No current timetable found');
    }

    // Get teacher's classes from the timetable
    let teacherSchedule = timetable.schedule.filter(
      slot => slot.teacher.toString() === teacherId.toString()
    );

    if (detailed) {
      // Populate additional details
      teacherSchedule = await Class.populate(teacherSchedule, [
        { path: 'subject', select: 'name code credits' },
        { path: 'room', select: 'name capacity' },
        { path: 'classGroup', select: 'name section' }
      ]);
    }

    // Group by day for easier display
    const groupedSchedule = helpers.groupClassesByDay(teacherSchedule);

    logger.info(`Fetched timetable for teacher ${teacherId}`);

    res.json({
      success: true,
      data: {
        timetableId: timetable._id,
        semester: timetable.semester,
        status: timetable.status,
        schedule: groupedSchedule
      }
    });

  } catch (error) {
    logger.error(`Get timetable error: ${error.message}`);
    throw error;
  }
};

const getClassDetails = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user._id;

    // Get class details and verify teacher is assigned
    const classDetails = await Class.findOne({
      _id: classId,
      teacher: teacherId
    })
    .populate('subject', 'name code description')
    .populate('room', 'name')
    .populate('students', 'firstName lastName usn')
    .populate('assignments', 'title dueDate submissions');

    if (!classDetails) {
      throw new ApiError(404, 'Class not found or not assigned to you');
    }

    // Get attendance stats
    const attendanceStats = await helpers.calculateAttendanceStats(classId);

    logger.info(`Fetched details for class ${classId}`);

    res.json({
      success: true,
      data: {
        ...classDetails.toObject(),
        attendanceStats
      }
    });

  } catch (error) {
    logger.error(`Get class details error: ${error.message}`);
    throw error;
  }
};

const recordAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user._id;
    const { date, attendanceRecords } = req.body;

    // Verify the teacher is assigned to this class
    const classInfo = await Class.findOne({
      _id: classId,
      teacher: teacherId
    });

    if (!classInfo) {
      throw new ApiError(404, 'Class not found or not assigned to you');
    }

    // Validate attendance records
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      throw new ApiError(400, 'Invalid attendance data');
    }

    // Verify all students belong to the class
    const studentIds = attendanceRecords.map(r => r.studentId);
    const studentCount = await User.countDocuments({
      _id: { $in: studentIds },
      classes: classId
    });

    if (studentCount !== studentIds.length) {
      throw new ApiError(400, 'One or more students not enrolled in this class');
    }

    // Create attendance records
    const attendance = new Attendance({
      class: classId,
      date: date || new Date(),
      records: attendanceRecords.map(r => ({
        student: r.studentId,
        status: r.status || 'present',
        remarks: r.remarks
      })),
      recordedBy: teacherId
    });

    await attendance.save();

    logger.info(`Recorded attendance for class ${classId}`);

    res.json({
      success: true,
      message: 'Attendance recorded successfully',
      data: attendance
    });

  } catch (error) {
    logger.error(`Record attendance error: ${error.message}`);
    throw error;
  }
};

const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user._id;

    // Verify the teacher is assigned to this class
    const classInfo = await Class.findOne({
      _id: classId,
      teacher: teacherId
    }).populate('students', 'firstName lastName usn email');

    if (!classInfo) {
      throw new ApiError(404, 'Class not found or not assigned to you');
    }

    // Get attendance summary for each student
    const studentsWithAttendance = await Promise.all(
      classInfo.students.map(async student => {
        const attendance = await Attendance.aggregate([
          { $match: { class: classInfo._id, 'records.student': student._id } },
          { $unwind: '$records' },
          { $match: { 'records.student': student._id } },
          { 
            $group: {
              _id: null,
              total: { $sum: 1 },
              present: { 
                $sum: { 
                  $cond: [{ $eq: ['$records.status', 'present'] }, 1, 0] 
                } 
              }
            }
          }
        ]);

        return {
          ...student.toObject(),
          attendance: attendance[0] ? {
            present: attendance[0].present,
            total: attendance[0].total,
            percentage: Math.round((attendance[0].present / attendance[0].total) * 100)
          } : null
        };
      })
    );

    logger.info(`Fetched students for class ${classId}`);

    res.json({
      success: true,
      data: studentsWithAttendance
    });

  } catch (error) {
    logger.error(`Get class students error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getTeacherTimetable,
  getClassDetails,
  recordAttendance,
  getClassStudents
};