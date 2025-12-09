const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['workshop', 'seminar', 'competition', 'conference', 'cultural', 'sports', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  participants: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    }
  }],
  maxParticipants: {
    type: Number,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  requirements: [String],
  benefits: [String]
}, {
  timestamps: true
});

// Indexes for performance
eventSchema.index({ title: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ endDate: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ universityId: 1 });
eventSchema.index({ 'participants.student': 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Event', eventSchema);
