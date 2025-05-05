// controllers/common/profile.controller.js
const User = require('../../models/User.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');
const validators = require('../../utils/validators');

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user with role-specific data
    let user;
    switch (req.user.role) {
      case 'student':
        user = await User.findById(userId)
          .select('-password -resetToken -resetTokenExpires')
          .populate('department', 'name code');
        break;
      case 'teacher':
        user = await User.findById(userId)
          .select('-password -resetToken -resetTokenExpires')
          .populate('department', 'name code')
          .populate('subjects', 'code name');
        break;
      case 'coordinator':
        user = await User.findById(userId)
          .select('-password -resetToken -resetTokenExpires')
          .populate('department', 'name code hod');
        break;
      default:
        user = await User.findById(userId)
          .select('-password -resetToken -resetTokenExpires');
    }

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Format response
    const profileData = helpers.formatUserResponse(user);

    logger.info(`Fetched profile for user ${userId}`);

    res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    throw error;
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Validate phone number if provided
    if (updates.phone && !validators.validatePhoneNumber(updates.phone)) {
      throw new ApiError(400, 'Invalid phone number format');
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -resetToken -resetTokenExpires');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Format response
    const profileData = helpers.formatUserResponse(user);

    logger.info(`Updated profile for user ${userId}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profileData
    });

  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    throw error;
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // 1. Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // 2. Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    // 3. Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user ${userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error(`Change password error: ${error.message}`);
    throw error;
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      throw new ApiError(400, 'Image URL is required');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password -resetToken -resetTokenExpires');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    logger.info(`Updated profile picture for user ${userId}`);

    res.json({
      success: true,
      message: 'Profile picture updated',
      data: { profilePicture: user.profilePicture }
    });

  } catch (error) {
    logger.error(`Update profile picture error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateProfilePicture
};