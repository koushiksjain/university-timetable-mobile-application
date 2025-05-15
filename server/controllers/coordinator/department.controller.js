// controllers/coordinator/department.controller.js
const Department = require('../../models/Department.model');
const User = require('../../models/User.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');

const getDepartmentDetails = async (req, res) => {
  try {
    const departmentId = req.user.department;
    
    const department = await Department.findById(departmentId)
      .populate('hod', 'firstName lastName email')
      .populate('teachers', 'firstName lastName email')
      .populate('students', 'firstName lastName email usn');

    if (!department) {
      throw new ApiError(404, 'Department not found');
    }

    logger.info(`Fetched department details for ${department.name}`);
    
    res.json({
      success: true,
      data: {
        ...department.toObject(),
        teacherCount: department.teachers.length,
        studentCount: department.students.length
      }
    });

  } catch (error) {
    logger.error(`Get department error: ${error.message}`);
    throw error;
  }
};

const updateDepartment = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const updates = req.body;

    // Validate HOD if being updated
    if (updates.hod) {
      const hod = await User.findOne({
        _id: updates.hod,
        department: departmentId,
        role: 'teacher'
      });
      
      if (!hod) {
        throw new ApiError(400, 'Selected teacher not found in department');
      }
    }

    const department = await Department.findByIdAndUpdate(
      departmentId,
      updates,
      { new: true, runValidators: true }
    ).populate('hod', 'firstName lastName email');

    if (!department) {
      throw new ApiError(404, 'Department not found');
    }

    // Update coordinator's isHod status if they are the HOD
    if (department.hod?._id.toString() === req.user._id.toString()) {
      await User.findByIdAndUpdate(req.user._id, { isHod: true });
    } else if (req.user.isHod) {
      await User.findByIdAndUpdate(req.user._id, { isHod: false });
    }

    logger.info(`Updated department ${department.name}`);

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });

  } catch (error) {
    logger.error(`Update department error: ${error.message}`);
    throw error;
  }
};

const manageDepartmentResources = async (req, res) => {
  try {
    const departmentId = req.user.department;
    const { action, resourceType, data } = req.body;

    const validResources = ['courses', 'rooms', 'semesters', 'classes'];
    if (!validResources.includes(resourceType)) {
      throw new ApiError(400, 'Invalid resource type');
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      throw new ApiError(404, 'Department not found');
    }

    // Initialize array if it doesn't exist
    if (!department[resourceType]) {
      department[resourceType] = [];
    }

    switch (action) {
      case 'add':
        department[resourceType].push(data);
        break;
      case 'update':
        const index = department[resourceType].findIndex(
          item => item._id.toString() === data._id
        );
        if (index === -1) {
          throw new ApiError(404, `${resourceType.slice(0, -1)} not found`);
        }
        department[resourceType][index] = data;
        break;
      case 'remove':
        department[resourceType] = department[resourceType].filter(
          item => item._id.toString() !== data._id
        );
        break;
      default:
        throw new ApiError(400, 'Invalid action');
    }

    await department.save();

    logger.info(`Updated department ${resourceType}`);

    res.json({
      success: true,
      message: `${resourceType.slice(0, -1)} ${action}ed successfully`,
      data: department[resourceType]
    });

  } catch (error) {
    logger.error(`Manage resources error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getDepartmentDetails,
  updateDepartment,
  manageDepartmentResources
};