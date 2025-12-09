const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    trim: true,
    lowercase: true
  },
  apiId: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verifiedActivities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  settings: {
    allowStudentRegistration: {
      type: Boolean,
      default: true
    },
    requireEmailVerification: {
      type: Boolean,
      default: false
    },
    defaultStudentRole: {
      type: String,
      enum: ['student'],
      default: 'student'
    }
  }
}, {
  timestamps: true
});

// Indexes
universitySchema.index({ name: 1 });
universitySchema.index({ domain: 1 });
universitySchema.index({ country: 1 });
universitySchema.index({ isActive: 1 });

module.exports = mongoose.model('University', universitySchema);
