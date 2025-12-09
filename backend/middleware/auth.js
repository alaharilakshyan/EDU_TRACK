const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware - verifies JWT token and attaches user to request
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'NO_TOKEN',
          message: 'Access denied. No token provided.'
        }
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user and populate profile reference
      const user = await User.findOne({ uid7: decoded.uid7 })
        .populate('profileRef')
        .populate('universityId');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          data: null,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Token is valid but user not found.'
          }
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          data: null,
          error: {
            code: 'USER_INACTIVE',
            message: 'User account is deactivated.'
          }
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token is not valid.'
        }
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication error occurred.'
      }
    });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Authentication required.'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Insufficient permissions to access this resource.'
        }
      });
    }

    next();
  };
};

// Specific role middleware functions
const studentOnly = authorize('student');
const facultyOnly = authorize('faculty');
const adminOnly = authorize('admin');

// Middleware for faculty and admin
const facultyOrAdmin = authorize('faculty', 'admin');

// Middleware for all authenticated users
const authOnly = authenticate;

// Optional authentication - doesn't fail if no token, but attaches user if token exists
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token, continue without authentication
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ uid7: decoded.uid7 })
        .populate('profileRef')
        .populate('universityId');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (jwtError) {
      // Ignore token errors for optional auth
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    next(); // Continue even if there's an error
  }
};

// Middleware to check if user belongs to the same university as the resource
const sameUniversity = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      data: null,
      error: {
        code: 'NOT_AUTHENTICATED',
        message: 'Authentication required.'
      }
    });
  }

  // For faculty and admin, check if they're accessing their own university's resources
  if (req.user.role === 'faculty' || req.user.role === 'admin') {
    const { uid7 } = req.params;
    
    if (req.user.uid7 !== uid7) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED_ACCESS',
          message: 'You can only access your own university\'s resources.'
        }
      });
    }
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  studentOnly,
  facultyOnly,
  adminOnly,
  facultyOrAdmin,
  authOnly,
  optionalAuth,
  sameUniversity
};
