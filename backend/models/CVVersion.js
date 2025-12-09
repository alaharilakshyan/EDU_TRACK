const mongoose = require('mongoose');

const cvVersionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  analysis: {
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    keywords: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
cvVersionSchema.index({ student: 1 });
cvVersionSchema.index({ version: 1 });
cvVersionSchema.index({ isActive: 1 });
cvVersionSchema.index({ isCurrent: 1 });
cvVersionSchema.index({ uploadedAt: 1 });

module.exports = mongoose.model('CVVersion', cvVersionSchema);
