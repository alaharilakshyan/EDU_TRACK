const mongoose = require('mongoose');

const activityEventSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true
  },
  type: {
    type: String,
    enum: ['certificate', 'report', 'internship', 'event', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  metadata: {
    verified: { type: Boolean, default: false },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    tags: [String],
    points: Number
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
activityEventSchema.index({ studentId: 1, date: -1 });
activityEventSchema.index({ universityId: 1 });
activityEventSchema.index({ type: 1 });
activityEventSchema.index({ date: 1 });

module.exports = mongoose.model('ActivityEvent', activityEventSchema);
