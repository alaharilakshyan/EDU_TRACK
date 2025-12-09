const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'login', 'logout', 'register', 'approve', 'reject', 'upload', 'download']
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resourceType: {
    type: String,
    required: true
  },
  resourceId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ipAddress: String,
  userAgent: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ targetUser: 1 });
auditLogSchema.index({ resourceType: 1 });
auditLogSchema.index({ resourceId: 1 });
auditLogSchema.index({ universityId: 1 });
auditLogSchema.index({ createdAt: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
