const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  uid7: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  profileRef: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'roleModel'
  },
  roleModel: {
    type: String,
    enum: ['StudentProfile', 'FacultyProfile']
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ uid7: 1 });
userSchema.index({ universityId: 1 });
userSchema.index({ role: 1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Generate JWT payload
userSchema.methods.getJWTPayload = function() {
  return {
    uid7: this.uid7,
    email: this.email,
    role: this.role,
    universityId: this.universityId,
    profileRef: this.profileRef
  };
};

// Clean expired refresh tokens
userSchema.methods.cleanExpiredTokens = function() {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(token => 
    !token.expiresAt || token.expiresAt > now
  );
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
