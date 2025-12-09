const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  stipend: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'remote', 'hybrid'],
    default: 'full-time'
  },
  applicationDeadline: Date,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  applicants: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes for performance
internshipSchema.index({ company: 1 });
internshipSchema.index({ location: 1 });
internshipSchema.index({ postedBy: 1 });
internshipSchema.index({ universityId: 1 });
internshipSchema.index({ 'applicants.student': 1 });
internshipSchema.index({ isActive: 1 });

module.exports = mongoose.model('Internship', internshipSchema);
