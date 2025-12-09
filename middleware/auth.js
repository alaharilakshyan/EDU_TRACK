const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'NO_TOKEN',
          message: 'Access token is required'
        }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ 
      uid7: decoded.uid7, 
      isActive: true 
    }).populate('universityId');

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token'
        }
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token expired'
        }
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
};

// Role-based access control middleware
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
};

// Student only middleware
const studentOnly = roleMiddleware(['student']);

// Faculty only middleware
const facultyOnly = roleMiddleware(['faculty']);

// Admin only middleware
const adminOnly = roleMiddleware(['admin']);

// Faculty or admin middleware
const facultyOrAdmin = roleMiddleware(['faculty', 'admin']);

module.exports = {
  authMiddleware,
  roleMiddleware,
  studentOnly,
  facultyOnly,
  adminOnly,
  facultyOrAdmin
};
