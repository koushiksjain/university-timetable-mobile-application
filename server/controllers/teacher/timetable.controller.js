const User = require('../../models/User.model');
const Timetable = require('../../models/Timetable.model');
const Class = require('../../models/Class.model');
const Teacher = require('../../models/Teacher.model');
// const Appointment = require('../../models/Appointment.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');

// Get student's timetable
const getTimetable = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { semester, academicYear, department } = req.query;

    // Get student details
    const student = await User.findById(studentId)
      .select('semester section department');
    
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    // Get timetable
    const timetable = await Timetable.findOne({
      department: department || student.department,
      semester: semester || student.semester,
      academicYear,
      isCurrent: true,
      status: 'published'
    })
    .populate('classes.subject', 'name code')
    .populate('classes.teacher', 'firstName lastName');

    if (!timetable) {
      throw new ApiError(404, 'No timetable found for your class');
    }

    // Format timetable data for frontend
    const formattedTimetable = helpers.formatTimetable(timetable);

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

// Get class schedule
const getClassSchedule = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { date } = req.query;

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
      isCurrent: true,
      status: 'published'
    })
    .populate('classes.subject', 'name code')
    .populate('classes.teacher', 'firstName lastName');

    if (!timetable) {
      throw new ApiError(404, 'No timetable found for your class');
    }

    // Filter classes for the requested date
    const schedule = timetable.classes.filter(cls => 
      cls.day.toLowerCase() === new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    );

    logger.info(`Fetched class schedule for student ${studentId} on ${date}`);

    res.json({
      success: true,
      data: schedule
    });

  } catch (error) {
    logger.error(`Get class schedule error: ${error.message}`);
    throw error;
  }
};

// Find available teachers
const findAvailableTeachers = async (req, res) => {
  try {
    const { date, timeSlot } = req.query;
    const studentId = req.user._id;

    // Get student details
    const student = await User.findById(studentId)
      .select('department semester');
    
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    // Get all teachers in the department
    const teachers = await Teacher.find({
      department: student.department,
      isActive: true
    })
    .select('firstName lastName email subjects');

    // Get existing appointments for the time slot
    const existingAppointments = await Appointment.find({
      date,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    // Filter out teachers who are already booked
    const availableTeachers = teachers.filter(teacher => {
      return !existingAppointments.some(appointment => 
        appointment.teacher.toString() === teacher._id.toString()
      );
    });

    logger.info(`Found ${availableTeachers.length} available teachers for ${date} ${timeSlot}`);

    res.json({
      success: true,
      data: availableTeachers
    });

  } catch (error) {
    logger.error(`Find available teachers error: ${error.message}`);
    throw error;
  }
};

// Book appointment with teacher
const bookAppointment = async (req, res) => {
  try {
    const { teacherId, date, timeSlot, purpose, duration } = req.body;
    const studentId = req.user._id;

    // Check if teacher exists and is active
    const teacher = await Teacher.findById(teacherId);
    if (!teacher || !teacher.isActive) {
      throw new ApiError(404, 'Teacher not found or inactive');
    }

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      teacher: teacherId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      throw new ApiError(400, 'Time slot is already booked');
    }

    // Create new appointment
    const appointment = new Appointment({
      student: studentId,
      teacher: teacherId,
      date,
      timeSlot,
      purpose,
      duration,
      status: 'scheduled'
    });

    await appointment.save();

    logger.info(`Appointment booked for student ${studentId} with teacher ${teacherId}`);

    res.status(201).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    logger.error(`Book appointment error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getTimetable,
  getClassSchedule,
  findAvailableTeachers,
  bookAppointment
};