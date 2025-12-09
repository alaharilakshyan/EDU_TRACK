const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, StudentProfile, FacultyProfile, University } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

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

// Generate JWT tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { uid7: user.uid7, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { uid7: user.uid7 },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, universityId, profileData } = req.body;

    // Validate required fields
    if (!email || !password || !role || !universityId || !profileData) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'All required fields must be provided'
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Verify university exists
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'UNIVERSITY_NOT_FOUND',
          message: 'University not found'
        }
      });
    }

    // Generate unique ID
    const uid7 = await generateUid7();

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      uid7,
      email,
      passwordHash,
      role,
      universityId,
      isActive: true
    });

    await user.save();

    // Create profile based on role
    let profile;
    if (role === 'student') {
      profile = new StudentProfile({
        userId: user._id,
        ...profileData
      });
    } else if (role === 'faculty') {
      profile = new FacultyProfile({
        userId: user._id,
        ...profileData
      });
    }

    if (profile) {
      await profile.save();
      user.profileRef = profile._id;
      await user.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        user: {
          uid7: user.uid7,
          email: user.email,
          role: user.role,
          universityId: user.universityId
        },
        token: accessToken,
        refreshToken
      },
      error: null
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'REGISTRATION_ERROR',
        message: 'Registration failed'
      }
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required'
        }
      });
    }

    // Find user and populate university
    const user = await User.findOne({ 
      email, 
      isActive: true 
    }).populate('universityId');

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token (limit to 5 tokens per user)
    user.refreshTokens = user.refreshTokens.slice(-4);
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          uid7: user.uid7,
          email: user.email,
          role: user.role,
          universityId: user.universityId
        },
        token: accessToken,
        refreshToken
      },
      error: null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Login failed'
      }
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'NO_REFRESH_TOKEN',
          message: 'Refresh token is required'
        }
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user with this refresh token
    const user = await User.findOne({ 
      uid7: decoded.uid7,
      'refreshTokens.token': refreshToken,
      isActive: true 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token'
        }
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({
      success: true,
      data: {
        token: accessToken,
        refreshToken: newRefreshToken
      },
      error: null
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token'
        }
      });
    }

    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'REFRESH_ERROR',
        message: 'Token refresh failed'
      }
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove specific refresh token
      req.user.refreshTokens = req.user.refreshTokens.filter(
        rt => rt.token !== refreshToken
      );
      await req.user.save();
    } else {
      // Remove all refresh tokens
      req.user.refreshTokens = [];
      await req.user.save();
    }

    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
      error: null
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'LOGOUT_ERROR',
        message: 'Logout failed'
      }
    });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('universityId')
      .select('-passwordHash -refreshTokens');

    res.json({
      success: true,
      data: { user },
      error: null
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_USER_ERROR',
        message: 'Failed to get user information'
      }
    });
  }
});

module.exports = router;
