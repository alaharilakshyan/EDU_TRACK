const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock auth routes for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock admin user
  if (email === 'admin@studentplatform.com' && password === 'Admin123!') {
    res.json({
      success: true,
      data: {
        user: {
          uid7: '1000001',
          email: 'admin@studentplatform.com',
          role: 'admin',
          universityId: 'demo-university-id'
        },
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      },
      error: null
    });
    return;
  }
  
  // Mock faculty user
  if (email === 'faculty@demo.edu' && password === 'Faculty123!') {
    res.json({
      success: true,
      data: {
        user: {
          uid7: '2000001',
          email: 'faculty@demo.edu',
          role: 'faculty',
          universityId: 'demo-university-id'
        },
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      },
      error: null
    });
    return;
  }
  
  res.status(401).json({
    success: false,
    data: null,
    error: {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, role } = req.body;
  
  // Simple validation
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email, password, and role are required'
      }
    });
  }
  
  // Mock successful registration
  res.status(201).json({
    success: true,
    data: {
      user: {
        uid7: Math.floor(1000000 + Math.random() * 9000000).toString(),
        email,
        role,
        universityId: 'demo-university-id'
      },
      accessToken: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    },
    error: null
  });
});

// Mock admin routes
app.get('/api/admin/dashboard-stats', (req, res) => {
  res.json({
    success: true,
    data: {
      users: {
        total: 150,
        students: 120,
        faculty: 25,
        admins: 5
      },
      universities: 10,
      activities: {
        certificates: 450,
        reports: 320,
        internships: 180,
        pendingApprovals: 25
      },
      recentActivity: [
        {
          action: 'login',
          user: 'admin@studentplatform.com',
          timestamp: new Date()
        }
      ]
    },
    error: null
  });
});

// Mock student routes
app.get('/api/students/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Student profile endpoint working',
      uid7: '3000001',
      email: 'student@demo.edu',
      role: 'student'
    },
    error: null
  });
});

// Mock faculty routes
app.get('/api/faculty/:uid7/students', (req, res) => {
  res.json({
    success: true,
    data: {
      students: [
        {
          uid7: '3000001',
          fullName: 'John Doe',
          rollNo: 'CS2021001',
          department: 'Computer Science',
          year: 3
        }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        pages: 1
      }
    },
    error: null
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log('\nMock login credentials:');
  console.log('Admin: admin@studentplatform.com / Admin123!');
  console.log('Faculty: faculty@demo.edu / Faculty123!');
});

module.exports = app;
