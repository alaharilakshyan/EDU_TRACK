const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'system'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['verification', 'activity', 'system', 'academic', 'placement'],
    default: 'system'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionUrl: String,
  actionText: String,
  metadata: {
    relatedId: mongoose.Schema.Types.ObjectId,
    relatedType: String
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
