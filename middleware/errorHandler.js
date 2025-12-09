const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));

    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'DUPLICATE_ERROR',
        message: `${field} already exists`,
        details: {
          field,
          value: error.keyValue[field]
        }
      }
    });
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_ID',
        message: 'Invalid ID format'
      }
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      data: null,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token'
      }
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      data: null,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token expired'
      }
    });
  }

  // Multer file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'File size exceeds the limit'
      }
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'TOO_MANY_FILES',
        message: 'Too many files uploaded'
      }
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'UNEXPECTED_FILE',
        message: 'Unexpected file field'
      }
    });
  }

  // Custom application errors
  if (error.code) {
    return res.status(error.statusCode || 400).json({
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message
    }
  });
};

module.exports = errorHandler;
