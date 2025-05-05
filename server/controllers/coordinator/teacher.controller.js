// controllers/coordinator/teacher.controller.js
const User = require('../../models/User.model');
const Department = require('../../models/Department.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');

const addTeacher = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const { email, firstName, lastName, phone, designation, qualifications } = req.body;

    // Check if user already exists
    let teacher = await User.findOne({ email });
    if (teacher) {
      if (teacher.department.toString() === departmentId) {
        throw new ApiError(400, 'Teacher already exists in your department');
      }
      throw new ApiError(400, 'Email already registered in another department');
    }

    // Create new teacher
    teacher = new User({
      email,
      firstName,
      lastName,
      phone,
      role: 'teacher',
      department: departmentId,
      designation,
      qualifications: qualifications || []
    });

    // Generate random password
    const password = helpers.generateRandomString(10);
    teacher.password = password; // Will be hashed by pre-save hook

    await teacher.save();

    // Add teacher to department
    await Department.findByIdAndUpdate(
      departmentId,
      { $addToSet: { teachers: teacher._id } }
    );

    // TODO: Send welcome email with credentials

    logger.info(`Teacher ${email} added to department ${departmentId}`);

    res.status(201).json({
      success: true,
      message: 'Teacher added successfully',
      data: helpers.formatUserResponse(teacher)
    });

  } catch (error) {
    logger.error(`Add teacher error: ${error.message}`);
    throw error;
  }
};

const getDepartmentTeachers = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const { semester } = req.query;

    // Base query
    let query = { 
      department: departmentId,
      role: 'teacher'
    };

    // If semester is provided, get teachers teaching that semester
    if (semester) {
      const subjects = await Subject.find({ 
        department: departmentId,
        semester 
      }).distinct('_id');
      
      query = {
        ...query,
        subjects: { $in: subjects }
      };
    }

    const teachers = await User.find(query)
      .select('-password -resetToken -resetTokenExpires')
      .populate('subjects', 'name code semester');

    logger.info(`Fetched teachers for department ${departmentId}`);

    res.json({
      success: true,
      data: teachers.map(teacher => helpers.formatUserResponse(teacher))
    });

  } catch (error) {
    logger.error(`Get teachers error: ${error.message}`);
    throw error;
  }
};

const updateTeacher = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const { teacherId } = req.params;
    const updates = req.body;

    // Verify teacher belongs to coordinator's department
    const teacher = await User.findOneAndUpdate(
      {
        _id: teacherId,
        department: departmentId,
        role: 'teacher'
      },
      updates,
      { new: true, runValidators: true }
    ).select('-password -resetToken -resetTokenExpires');

    if (!teacher) {
      throw new ApiError(404, 'Teacher not found in your department');
    }

    logger.info(`Updated teacher ${teacherId}`);

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: helpers.formatUserResponse(teacher)
    });

  } catch (error) {
    logger.error(`Update teacher error: ${error.message}`);
    throw error;
  }
};

const assignSubjects = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const { teacherId, subjectIds } = req.body;

    // Verify all subjects belong to department
    const subjectCount = await Subject.countDocuments({
      _id: { $in: subjectIds },
      department: departmentId
    });

    if (subjectCount !== subjectIds.length) {
      throw new ApiError(400, 'One or more subjects not found in your department');
    }

    // Update teacher's subjects
    const teacher = await User.findOneAndUpdate(
      {
        _id: teacherId,
        department: departmentId,
        role: 'teacher'
      },
      { subjects: subjectIds },
      { new: true }
    ).select('subjects');

    if (!teacher) {
      throw new ApiError(404, 'Teacher not found in your department');
    }

    logger.info(`Assigned ${subjectIds.length} subjects to teacher ${teacherId}`);

    res.json({
      success: true,
      message: 'Subjects assigned successfully',
      data: teacher.subjects
    });

  } catch (error) {
    logger.error(`Assign subjects error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  addTeacher,
  getDepartmentTeachers,
  updateTeacher,
  assignSubjects
};