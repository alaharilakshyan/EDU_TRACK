const { User } = require('../models');

// Generate 7-digit unique ID
const generateUid7 = async () => {
  let uid7;
  let attempts = 0;
  const maxAttempts = 5;

  do {
    uid7 = Math.floor(1000000 + Math.random() * 9000000).toString();
    attempts++;
    
    try {
      const existing = await User.findOne({ uid7 });
      if (!existing) {
        return uid7;
      }
    } catch (error) {
      // If there's an error, assume the ID is available
      return uid7;
    }
  } while (attempts < maxAttempts);

  throw new Error('Failed to generate unique ID after multiple attempts');
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors: [
      password.length < minLength ? 'Password must be at least 8 characters long' : null,
      !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
      !hasNumbers ? 'Password must contain at least one number' : null,
      !hasSpecialChar ? 'Password must contain at least one special character' : null
    ].filter(Boolean)
  };
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate verification ratio
const calculateVerificationRatio = async (studentId) => {
  const [Certificate, Report, Internship] = require('../models');
  
  const [totalCerts, totalReports, totalInterns] = await Promise.all([
    Certificate.countDocuments({ studentId }),
    Report.countDocuments({ studentId }),
    Internship.countDocuments({ studentId })
  ]);

  const [verifiedCerts, verifiedReports, verifiedInterns] = await Promise.all([
    Certificate.countDocuments({ studentId, verificationStatus: 'verified' }),
    Report.countDocuments({ studentId, verificationStatus: 'verified' }),
    Internship.countDocuments({ studentId, verificationStatus: 'verified' })
  ]);

  const total = totalCerts + totalReports + totalInterns;
  const verified = verifiedCerts + verifiedReports + verifiedInterns;

  return total > 0 ? verified / total : 0;
};

module.exports = {
  generateUid7,
  validateEmail,
  validatePassword,
  formatDate,
  calculateVerificationRatio
};
