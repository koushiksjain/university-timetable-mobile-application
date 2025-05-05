// controllers/auth/register.controller.js
const User = require('../../models/User.model');
const Student = require('../../models/Student.model');
const Teacher = require('../../models/Teacher.model');
const Coordinator = require('../../models/Coordinator.model');
const Department = require('../../models/Department.model');
const logger = require('../../utils/logger');
const { ROLES } = require('../../config/constants');
const emailService = require('../../services/email.service');

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role, department, semester, usn, section } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // 2. Create base user
    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone,
      role
    };

    let user;
    
    // 3. Create role-specific user
    switch (role) {
      case ROLES.STUDENT:
        user = new Student({
          ...userData,
          department,
          semester,
          usn,
          section,
          batch: new Date().getFullYear()
        });
        break;

      case ROLES.TEACHER:
        user = new Teacher({
          ...userData,
          department,
          designation: 'Assistant Professor' // Default
        });
        break;

      case ROLES.COORDINATOR:
        // Verify department exists
        const dept = await Department.findById(department);
        if (!dept) {
          return res.status(400).json({
            success: false,
            error: 'Department not found'
          });
        }
        
        user = new Coordinator({
          ...userData,
          department,
          academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid role specified'
        });
    }

    // 4. Save user
    await user.save();
    logger.info(`New user registered: ${user._id} (${user.role})`);

    // 5. Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.firstName);

    // 6. Respond with success
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please login.'
    });

  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

module.exports = { register };