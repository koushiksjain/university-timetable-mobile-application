// routes/common.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  updateProfilePicture
} = require('../controllers/common/profile.controller');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAll
} = require('../controllers/common/notification.controller');
const validate = require('../middleware/validate');
const {
  profileSchema,
  passwordSchema,
  pictureSchema
} = require('../validations/common.validation');

// Profile routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(profileSchema), updateProfile);
router.post('/profile/change-password', authenticate, validate(passwordSchema), changePassword);
router.post('/profile/picture', authenticate, validate(pictureSchema), updateProfilePicture);

// Notification routes
router.get('/notifications', authenticate, getNotifications);
router.patch('/notifications/:id/read', authenticate, markAsRead);
router.patch('/notifications/read-all', authenticate, markAllAsRead);
router.delete('/notifications', authenticate, clearAll);

module.exports = router;