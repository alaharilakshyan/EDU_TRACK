// Export all models for easy importing
const User = require('./User');
const University = require('./University');
const StudentProfile = require('./StudentProfile');
const FacultyProfile = require('./FacultyProfile');
const ActivityEvent = require('./ActivityEvent');
const Certificate = require('./Certificate');
const Report = require('./Report');
const Internship = require('./Internship');
const CVVersion = require('./CVVersion');
const Event = require('./Event');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');
const BlogPost = require('./BlogPost');

module.exports = {
  User,
  University,
  StudentProfile,
  FacultyProfile,
  ActivityEvent,
  Certificate,
  Report,
  Internship,
  CVVersion,
  Event,
  Notification,
  AuditLog,
  BlogPost
};
