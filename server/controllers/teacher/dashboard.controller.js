// controllers/teacher/dashboard.controller.js
const Class = require('../../models/Class.model');
const Notification = require('../../models/Notification.model');
const Assignment = require('../../models/Assignment.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');

const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;
    
    // Get today's date and calculate start/end of week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    // Fetch data in parallel
    const [todaysClasses, upcomingClasses, announcements, assignments] = await Promise.all([
      // Today's classes
      Class.find({
        teacher: teacherId,
        day: helpers.getDayName(today.getDay()),
        isCancelled: false
      }).sort('time')
      .populate('subject', 'name code')
      .populate('room', 'name'),

      // Upcoming classes this week
      Class.find({
        teacher: teacherId,
        day: { $in: helpers.getWeekDays(today.getDay()) },
        date: { $gte: today, $lte: endOfWeek },
        isCancelled: false
      }).sort('date time')
      .populate('subject', 'name code')
      .populate('room', 'name')
      .limit(5),

      // Recent announcements
      Notification.find({
        recipient: teacherId,
        type: { $in: ['announcement', 'system'] }
      })
      .sort('-createdAt')
      .limit(3),

      // Pending assignments to grade
      Assignment.find({
        teacher: teacherId,
        dueDate: { $gte: today },
        gradingStatus: 'pending'
      })
      .sort('dueDate')
      .populate('course', 'name code')
      .limit(3)
    ]);

    // Calculate stats
    const stats = {
      totalClasses: await Class.countDocuments({ teacher: teacherId }),
      students: await helpers.countStudentsForTeacher(teacherId),
      officeHours: await Availability.countDocuments({ 
        teacher: teacherId,
        'officeHours.0': { $exists: true }
      })
    };

    logger.info(`Fetched dashboard data for teacher ${teacherId}`);

    res.json({
      success: true,
      data: {
        stats,
        todaysClasses: todaysClasses.map(c => helpers.formatClassResponse(c)),
        upcomingClasses: upcomingClasses.map(c => helpers.formatClassResponse(c)),
        announcements,
        assignments
      }
    });

  } catch (error) {
    logger.error(`Get dashboard error: ${error.message}`);
    throw error;
  }
};

const getTeacherSchedule = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { weekOffset = 0 } = req.query;

    // Calculate date range for the requested week
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + (weekOffset * 7) - now.getDay());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Get all classes for the week
    const classes = await Class.find({
      teacher: teacherId,
      date: { $gte: startDate, $lte: endDate },
      isCancelled: false
    })
    .sort('date time')
    .populate('subject', 'name code')
    .populate('room', 'name');

    // Format as weekly schedule
    const weeklySchedule = helpers.groupClassesByDay(classes);

    logger.info(`Fetched schedule for teacher ${teacherId}`);

    res.json({
      success: true,
      data: {
        startDate,
        endDate,
        schedule: weeklySchedule
      }
    });

  } catch (error) {
    logger.error(`Get schedule error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getTeacherDashboard,
  getTeacherSchedule
};