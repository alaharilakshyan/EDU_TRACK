const mongoose = require('mongoose');

const facultyProfileSchema = new mongoose.Schema({
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
  department: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  about: {
    type: String,
    trim: true,
    maxlength: 500
  },
  specializations: [{
    type: String,
    trim: true
  }],
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  permissions: [{
    type: String,
    enum: ['verify_student_activities', 'manage_students', 'create_events', 'view_analytics'],
    default: ['verify_student_activities']
  }]
}, {
  timestamps: true
});

// Indexes
facultyProfileSchema.index({ userId: 1 });
facultyProfileSchema.index({ universityId: 1 });
facultyProfileSchema.index({ department: 1 });

module.exports = mongoose.model('FacultyProfile', facultyProfileSchema);
