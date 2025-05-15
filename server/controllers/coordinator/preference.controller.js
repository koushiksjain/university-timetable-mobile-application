// controllers/coordinator/preference.controller.js
const Preference = require('../../models/Preference.model');
const User = require('../../models/User.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');

const collectTeacherPreferences = async (req, res) => {
  try {
    const { teacherId, preferences } = req.body;
    const coordinatorId = req.user._id;
    const departmentId = req.user.department;

    // Verify teacher belongs to coordinator's department
    const teacher = await User.findOne({
      _id: teacherId,
      department: departmentId,
      role: 'teacher'
    });

    if (!teacher) {
      throw new ApiError(404, 'Teacher not found in your department');
    }

    // Create or update preferences
    const preference = await Preference.findOneAndUpdate(
      { teacher: teacherId },
      { 
        ...preferences,
        coordinator: coordinatorId,
        department: departmentId,
        lastUpdated: new Date()
      },
      { upsert: true, new: true, runValidators: true }
    );

    logger.info(`Preferences collected for teacher ${teacherId} by coordinator ${coordinatorId}`);

    res.json({
      success: true,
      message: 'Preferences saved successfully',
      data: preference
    });

  } catch (error) {
    logger.error(`Collect preferences error: ${error.message}`);
    throw error;
  }
};

const getDepartmentPreferences = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const { semester } = req.query;

    const query = { department: departmentId };
    if (semester) {
      query.semester = semester;
    }

    const preferences = await Preference.find(query)
      .populate('teacher', 'firstName lastName')
      .populate('subjects', 'name code');

    const stats = {
      totalTeachers: await User.countDocuments({ 
        department: departmentId, 
        role: 'teacher' 
      }),
      withPreferences: preferences.length,
      withoutPreferences: 0 // Will be calculated below
    };
    stats.withoutPreferences = stats.totalTeachers - stats.withPreferences;

    logger.info(`Fetched preferences for department ${departmentId}`);

    res.json({
      success: true,
      data: preferences,
      stats
    });

  } catch (error) {
    logger.error(`Get preferences error: ${error.message}`);
    throw error;
  }
};

const validatePreferences = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const { semester } = req.query;

    // Get all teachers without preferences
    const teachersWithoutPrefs = await User.find({
      department: departmentId,
      role: 'teacher',
      _id: { 
        $nin: await Preference.find({ 
          department: departmentId, 
          ...(semester && { semester }) 
        }).distinct('teacher')
      }
    }).select('firstName lastName email');

    // Get potential conflicts in preferences
    const preferences = await Preference.find({
      department: departmentId,
      ...(semester && { semester })
    }).populate('teacher', 'firstName lastName');

    // Simple conflict detection (would be enhanced with actual timetable logic)
    const conflicts = [];
    preferences.forEach(pref => {
      if (pref.unavailableDays.length > 3) {
        conflicts.push({
          teacher: pref.teacher,
          issue: 'Too many unavailable days',
          severity: 'high'
        });
      }
      if (pref.maxHoursPerWeek < 15) {
        conflicts.push({
          teacher: pref.teacher,
          issue: 'Minimum hours not met',
          severity: 'medium'
        });
      }
    });

    logger.info(`Validated preferences for department ${departmentId}`);

    res.json({
      success: true,
      data: {
        missing: teachersWithoutPrefs,
        conflicts,
        ready: teachersWithoutPrefs.length === 0 && conflicts.length === 0
      }
    });

  } catch (error) {
    logger.error(`Validate preferences error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  collectTeacherPreferences,
  getDepartmentPreferences,
  validatePreferences
};