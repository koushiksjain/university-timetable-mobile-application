// controllers/student/timetable.controller.js
const User = require('../../models/User.model');
const Timetable = require('../../models/Timetable.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');

const getStudentTimetable = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { view = 'week' } = req.query;

    // Get student details
    const student = await User.findById(studentId)
      .select('semester section department');
    
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    // Get current timetable
    const timetable = await Timetable.findOne({
      department: student.department,
      semester: student.semester,
      section: student.section,
      isCurrent: true,
      status: 'published'
    })
    .populate('classes.subject', 'name code')
    .populate('classes.teacher', 'firstName lastName');

    if (!timetable) {
      throw new ApiError(404, 'No timetable found for your class');
    }

    // Format timetable data for frontend
    const formattedTimetable = helpers.formatTimetable(timetable, view);

    logger.info(`Fetched timetable for student ${studentId}`);

    res.json({
      success: true,
      data: formattedTimetable
    });

  } catch (error) {
    logger.error(`Get timetable error: ${error.message}`);
    throw error;
  }
};

const getClassDetails = async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.user._id;

    // Verify student has access to this class
    const student = await User.findById(studentId)
      .select('semester section department');
    
    const classInfo = await Class.findOne({
      _id: classId,
      department: student.department,
      semester: student.semester,
      section: student.section
    })
    .populate('subject', 'name code credits')
    .populate('teacher', 'firstName lastName email');

    if (!classInfo) {
      throw new ApiError(404, 'Class not found or not in your schedule');
    }

    // Get related materials (would be from another model in a real app)
    const materials = [
      { name: 'Lecture Notes 1', type: 'pdf', date: '2023-10-15' },
      { name: 'Assignment 2', type: 'doc', date: '2023-10-20' }
    ];

    logger.info(`Fetched class details ${classId} for student ${studentId}`);

    res.json({
      success: true,
      data: {
        ...classInfo.toObject(),
        materials
      }
    });

  } catch (error) {
    logger.error(`Get class details error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getStudentTimetable,
  getClassDetails
};