// controllers/common/notification.controller.js
const Notification = require('../../models/Notification.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');

const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, filter } = req.query;
    const userId = req.user._id;

    // Build query based on filter
    let query = { recipient: userId };
    
    if (filter === 'unread') {
      query.isRead = false;
    } else if (filter && filter !== 'all') {
      query.type = filter;
    }

    // Get paginated notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Notification.countDocuments(query);

    // Format response
    const formattedNotifications = notifications.map(notification => ({
      id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      time: helpers.formatTimeAgo(notification.createdAt),
      read: notification.isRead,
      icon: getNotificationIcon(notification.type),
      metadata: notification.relatedEntity
    }));

    logger.info(`Fetched notifications for user ${userId}`);

    res.json({
      success: true,
      data: formattedNotifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });

  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    throw new ApiError(500, 'Failed to fetch notifications');
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    logger.info(`Marked notification as read: ${id}`);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    logger.error(`Mark as read error: ${error.message}`);
    throw error;
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    logger.info(`Marked all notifications as read for user ${userId}`);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    logger.error(`Mark all as read error: ${error.message}`);
    throw new ApiError(500, 'Failed to mark all notifications as read');
  }
};

const clearAll = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ recipient: userId });

    logger.info(`Cleared all notifications for user ${userId}`);

    res.json({
      success: true,
      message: 'All notifications cleared'
    });

  } catch (error) {
    logger.error(`Clear notifications error: ${error.message}`);
    throw new ApiError(500, 'Failed to clear notifications');
  }
};

// Helper function to get icon based on notification type
const getNotificationIcon = (type) => {
  const icons = {
    timetable: 'calendar-clock',
    academic: 'school',
    system: 'cog',
    alert: 'alert-circle'
  };
  return icons[type] || 'bell';
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAll
};