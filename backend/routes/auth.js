const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateUid7, validateEmail, validatePassword } = require('../utils/helpers');

const router = express.Router();

// Generate JWT tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    user.getJWTPayload(),
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

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, universityId, fullName, department, year, rollNo } = req.body;
    
    // Validation
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    if (!emailValidation || !passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Invalid email or password',
          details: passwordValidation.errors || []
        }
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'USER_EXISTS', message: 'User already exists' }
      });
    }
    
    const uid7 = generateUid7();
    const user = new User({
      uid7,
      email,
      passwordHash: password,
      role,
      universityId
    });
    
    await user.save();
    
    const { accessToken, refreshToken } = generateTokens(user);
    
    res.status(201).json({
      success: true,
      data: { user, accessToken, refreshToken },
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' }
      });
    }
    
    const { accessToken, refreshToken } = generateTokens(user);
    
    res.json({
      success: true,
      data: { user, accessToken, refreshToken },
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ uid7: decoded.uid7 });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' }
      });
    }
    
    const tokens = generateTokens(user);
    
    res.json({
      success: true,
      data: tokens,
      error: null
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      data: null,
      error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' }
    });
  }
});

module.exports = router;
