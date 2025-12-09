const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  rollNo: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  about: {
    type: String,
    trim: true,
    maxlength: 500
  },
  linkedAccounts: {
    github: String,
    leetcode: String,
    codechef: String,
    codeforces: String,
    hackerrank: String,
    linkedin: String,
    kaggle: String
  },
  activityCounts: {
    certificates: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },
    internships: { type: Number, default: 0 },
    totalActivities: { type: Number, default: 0 }
  },
  analytics: {
    verificationRatio: { type: Number, default: 0 },
    gpa: Number,
    lastActivityDate: Date
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  activityEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityEvent'
  }]
}, {
  timestamps: true
});

// Indexes
studentProfileSchema.index({ userId: 1 });
studentProfileSchema.index({ universityId: 1 });
studentProfileSchema.index({ department: 1 });
studentProfileSchema.index({ year: 1 });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
