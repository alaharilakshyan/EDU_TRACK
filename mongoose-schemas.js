// Mongoose Schemas for Student Activity Platform

const mongoose = require('mongoose');

// User Schema - Base authentication and role management
const UserSchema = new mongoose.Schema({
  uid7: { type: String, unique: true, required: true, index: true }, // 7-digit code
  email: { type: String, unique: true, required: true, lowercase: true },
  passwordHash: { type: String }, // optional for OAuth-only accounts
  role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
  profileRef: { type: mongoose.Schema.Types.ObjectId }, // ref to student or faculty profile
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// University Schema
const UniversitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  domain: { type: String },
  apiId: { type: String }, // from external API
  verifiedActivities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Student Profile Schema
const StudentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  rollNo: { type: String, required: true },
  year: { type: Number, required: true, min: 1, max: 6 },
  department: { type: String, required: true },
  about: { type: String },
  linkedAccounts: {
    github: { type: String },
    leetcode: { type: String },
    codechef: { type: String },
    codeforces: { type: String },
    hackerrank: { type: String },
    linkedin: { type: String },
    kaggle: { type: String },
    other: [{ name: String, url: String }]
  },
  activityCounts: {
    totalActivities: { type: Number, default: 0 },
    certificates: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },
    internships: { type: Number, default: 0 },
    summerInternships: { type: Number, default: 0 }
  },
  activityEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ActivityEvent' }],
  cvVersions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CVVersion' }],
  analytics: {
    gpa: { type: Number, min: 0, max: 10 },
    verificationRatio: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    badges: [String]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Faculty Profile Schema
const FacultyProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  employeeId: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  about: { type: String },
  specializations: [String],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Activity Event Schema - For heatmap tracking
const ActivityEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  type: { type: String, required: true }, // certificate-uploaded, report-submitted, internship-completed, etc.
  typeMeta: { type: mongoose.Schema.Types.Mixed }, // additional metadata specific to event type
  source: { type: String, required: true }, // manual, github, leetcode, etc.
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
  createdAt: { type: Date, default: Date.now }
});

// Certificate Schema
const CertificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date },
  description: { type: String },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'FacultyProfile' },
  verificationDate: { type: Date },
  verificationComments: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Report Schema
const ReportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  title: { type: String, required: true },
  type: { type: String, required: true }, // internship, project, assignment, etc.
  description: { type: String },
  submissionDate: { type: Date, required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'FacultyProfile' },
  verificationDate: { type: Date },
  verificationComments: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Internship Schema
const InternshipSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  fileType: { type: String },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'FacultyProfile' },
  verificationDate: { type: Date },
  verificationComments: { type: String },
  isSummerInternship: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// CV Version Schema
const CVVersionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  version: { type: Number, default: 1 },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String },
  parsedContent: { type: String }, // extracted text from PDF
  parsedData: { type: mongoose.Schema.Types.Mixed }, // structured data from LLM
  atsScore: { type: Number, min: 0, max: 100 },
  scoreBreakdown: {
    skillMatch: { type: Number, min: 0, max: 1 },
    experience: { type: Number, min: 0, max: 1 },
    education: { type: Number, min: 0, max: 1 },
    activity: { type: Number, min: 0, max: 1 },
    certification: { type: Number, min: 0, max: 1 },
    verification: { type: Number, min: 0, max: 1 }
  },
  topReasons: [String],
  missingSkills: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Event Schema (University activities, hackathons, drives)
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true }, // hackathon, drive, workshop, seminar
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  organizer: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String },
  isVirtual: { type: Boolean, default: false },
  registrationLink: { type: String },
  eligibilityCriteria: { type: String },
  maxParticipants: { type: Number },
  currentParticipants: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'FacultyProfile' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true }, // info, success, warning, error
  category: { type: String, required: true }, // verification, event, placement, system
  isRead: { type: Boolean, default: false },
  actionUrl: { type: String },
  actionText: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date }
});

// Audit Log Schema
const AuditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // create, update, delete, approve, reject
  resourceType: { type: String, required: true }, // user, certificate, report, etc.
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  oldValues: { type: mongoose.Schema.Types.Mixed },
  newValues: { type: mongoose.Schema.Types.Mixed },
  reason: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Blog Post Schema
const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'FacultyProfile', required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
  tags: [String],
  isGlobal: { type: Boolean, default: false }, // true = visible to all universities
  isPublished: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index optimizations
UserSchema.index({ email: 1 });
UserSchema.index({ uid7: 1 });
StudentProfileSchema.index({ userId: 1 });
ActivityEventSchema.index({ userId: 1, date: -1 });
ActivityEventSchema.index({ universityId: 1, date: -1 });
CertificateSchema.index({ studentId: 1, verificationStatus: 1 });
ReportSchema.index({ studentId: 1, verificationStatus: 1 });
InternshipSchema.index({ studentId: 1, verificationStatus: 1 });
CVVersionSchema.index({ studentId: 1, createdAt: -1 });
EventSchema.index({ universityId: 1, startDate: 1 });
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
AuditLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = {
  User: mongoose.model('User', UserSchema),
  University: mongoose.model('University', UniversitySchema),
  StudentProfile: mongoose.model('StudentProfile', StudentProfileSchema),
  FacultyProfile: mongoose.model('FacultyProfile', FacultyProfileSchema),
  ActivityEvent: mongoose.model('ActivityEvent', ActivityEventSchema),
  Certificate: mongoose.model('Certificate', CertificateSchema),
  Report: mongoose.model('Report', ReportSchema),
  Internship: mongoose.model('Internship', InternshipSchema),
  CVVersion: mongoose.model('CVVersion', CVVersionSchema),
  Event: mongoose.model('Event', EventSchema),
  Notification: mongoose.model('Notification', NotificationSchema),
  AuditLog: mongoose.model('AuditLog', AuditLogSchema),
  BlogPost: mongoose.model('BlogPost', BlogPostSchema)
};
