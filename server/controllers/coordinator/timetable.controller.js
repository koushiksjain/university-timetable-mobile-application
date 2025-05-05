// controllers/coordinator/timetable.controller.js
const Timetable = require('../../models/Timetable.model');
const Department = require('../../models/Department.model');
const Class = require('../../models/Class.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const timetableService = require('../../services/timetable/generator.service');

const generateTimetable = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const { semester, section, algorithm = 'genetic' } = req.body;

    // Validate department resources
    const [subjects, teachers, preferences] = await Promise.all([
      Subject.find({ department: departmentId, semester }),
      User.find({ 
        department: departmentId, 
        role: 'teacher',
        subjects: { $in: await Subject.find({ department: departmentId, semester }).distinct('_id') }
      }),
      Preference.find({ 
        department: departmentId,
        semester 
      }).populate('teacher', 'firstName lastName')
    ]);

    if (subjects.length === 0) {
      throw new ApiError(400, 'No subjects found for this semester');
    }

    if (teachers.length === 0) {
      throw new ApiError(400, 'No teachers available for these subjects');
    }

    if (preferences.length < teachers.length * 0.7) {
      throw new ApiError(400, 'Insufficient teacher preferences collected');
    }

    // Generate timetable
    const timetableData = await timetableService.generateTimetable({
      subjects,
      teachers,
      preferences,
      algorithm
    });

    // Create timetable document
    const timetable = new Timetable({
      department: departmentId,
      semester,
      section,
      schedule: timetableData.schedule,
      conflicts: timetableData.conflicts,
      generatedBy: req.user._id,
      status: timetableData.conflicts.length > 0 ? 'draft' : 'pending_approval'
    });

    await timetable.save();

    logger.info(`Generated timetable for ${semester} ${section}`);

    res.json({
      success: true,
      message: timetableData.conflicts.length > 0 
        ? 'Timetable generated with conflicts' 
        : 'Timetable generated successfully',
      data: {
        ...timetable.toObject(),
        stats: timetableData.stats
      }
    });

  } catch (error) {
    logger.error(`Generate timetable error: ${error.message}`);
    throw error;
  }
};

const approveTimetable = async (req, res) => {
  try {
    const { timetableId } = req.params;
    const departmentId = req.user.department;

    const timetable = await Timetable.findOneAndUpdate(
      {
        _id: timetableId,
        department: departmentId,
        status: 'pending_approval'
      },
      { 
        status: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!timetable) {
      throw new ApiError(404, 'Timetable not found or already approved/rejected');
    }

    // Mark as current timetable if specified
    if (req.body.markAsCurrent) {
      await Timetable.updateMany(
        { 
          department: departmentId,
          semester: timetable.semester,
          section: timetable.section,
          isCurrent: true
        },
        { isCurrent: false }
      );
      
      timetable.isCurrent = true;
      await timetable.save();
    }

    logger.info(`Approved timetable ${timetableId}`);

    res.json({
      success: true,
      message: 'Timetable approved successfully',
      data: timetable
    });

  } catch (error) {
    logger.error(`Approve timetable error: ${error.message}`);
    throw error;
  }
};

const publishTimetable = async (req, res) => {
  try {
    const { timetableId } = req.params;
    const departmentId = req.user.department;

    const timetable = await Timetable.findOneAndUpdate(
      {
        _id: timetableId,
        department: departmentId,
        status: 'approved'
      },
      { 
        status: 'published',
        publishedAt: new Date()
      },
      { new: true }
    );

    if (!timetable) {
      throw new ApiError(404, 'Timetable not found or not approved');
    }

    // TODO: Notify teachers and students

    logger.info(`Published timetable ${timetableId}`);

    res.json({
      success: true,
      message: 'Timetable published successfully',
      data: timetable
    });

  } catch (error) {
    logger.error(`Publish timetable error: ${error.message}`);
    throw error;
  }
};

const getDepartmentTimetables = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const { semester, section, status } = req.query;

    const query = { department: departmentId };
    if (semester) query.semester = semester;
    if (section) query.section = section;
    if (status) query.status = status;

    const timetables = await Timetable.find(query)
      .sort({ createdAt: -1 })
      .populate('generatedBy approvedBy', 'firstName lastName');

    logger.info(`Fetched timetables for department ${departmentId}`);

    res.json({
      success: true,
      data: timetables
    });

  } catch (error) {
    logger.error(`Get timetables error: ${error.message}`);
    throw error;
  }
};

const resolveConflict = async (req, res) => {
  try {
    const { timetableId, conflictId } = req.params;
    const { resolution } = req.body;
    const departmentId = req.user.department;

    const timetable = await Timetable.findOne({
      _id: timetableId,
      department: departmentId,
      status: 'draft'
    });

    if (!timetable) {
      throw new ApiError(404, 'Timetable not found or not in draft status');
    }

    const conflict = timetable.conflicts.id(conflictId);
    if (!conflict) {
      throw new ApiError(404, 'Conflict not found');
    }

    // Apply resolution
    conflict.resolved = true;
    conflict.resolution = resolution;
    conflict.resolvedBy = req.user._id;
    conflict.resolvedAt = new Date();

    // Update schedule if resolution requires it
    if (resolution.action === 'reschedule') {
      timetable.schedule[resolution.day][resolution.period] = resolution.newAssignment;
    }

    // Check if all conflicts are resolved
    const unresolvedConflicts = timetable.conflicts.filter(c => !c.resolved);
    if (unresolvedConflicts.length === 0) {
      timetable.status = 'pending_approval';
    }

    await timetable.save();

    logger.info(`Resolved conflict ${conflictId} in timetable ${timetableId}`);

    res.json({
      success: true,
      message: 'Conflict resolved successfully',
      data: {
        remainingConflicts: unresolvedConflicts.length,
        timetableStatus: timetable.status
      }
    });

  } catch (error) {
    logger.error(`Resolve conflict error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  generateTimetable,
  approveTimetable,
  publishTimetable,
  getDepartmentTimetables,
  resolveConflict
};