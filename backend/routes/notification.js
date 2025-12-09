const express = require('express');
const { Notification } = require('../models');
const router = express.Router();

// GET /api/notifications/:uid7
router.get('/:uid7', async (req, res) => {
  try {
    const { uid7 } = req.params;
    const { unread, category, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { userId: req.user._id };
    if (unread === 'true') query.isRead = false;
    if (category) query.category = category;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_NOTIFICATIONS_ERROR',
        message: 'Failed to get notifications'
      }
    });
  }
});

// POST /api/notifications/send
router.post('/send', async (req, res) => {
  try {
    const { userIds, title, message, type, category, actionUrl, actionText, metadata } = req.body;

    const notifications = userIds.map(userId => ({
      userId,
      title,
      message,
      type,
      category,
      actionUrl,
      actionText,
      metadata
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      data: {
        sent: createdNotifications.length,
        notifications: createdNotifications
      },
      error: null
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'SEND_NOTIFICATION_ERROR',
        message: 'Failed to send notification'
      }
    });
  }
});

// PUT /api/notifications/:notificationId/read
router.put('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { 
        _id: notificationId, 
        userId: req.user._id 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: 'Notification not found'
        }
      });
    }

    res.json({
      success: true,
      data: notification,
      error: null
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'MARK_READ_ERROR',
        message: 'Failed to mark notification as read'
      }
    });
  }
});

module.exports = router;
