const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockUsers = [
  {
    _id: '1',
    uid7: 'ADM001',
    email: 'admin@default.edu',
    role: 'admin',
    universityId: '1',
    isActive: true,
    emailVerified: true
  },
  {
    _id: '2',
    uid7: 'STU001',
    email: 'student@default.edu',
    role: 'student',
    universityId: '1',
    isActive: true,
    emailVerified: true
  },
  {
    _id: '3',
    uid7: 'FAC001',
    email: 'faculty@default.edu',
    role: 'faculty',
    universityId: '1',
    isActive: true,
    emailVerified: true
  }
];

// Mock authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  const user = mockUsers.find(u => u.email === email);
  
  if (user && (password === 'Admin123!@#' || password === 'Student123!@#' || password === 'Faculty123!@#')) {
    res.json({
      success: true,
      data: {
        token: 'mock-jwt-token-' + user._id,
        refreshToken: 'mock-refresh-token-' + user._id,
        user: user
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, role, fullName } = req.body;
  
  // Mock registration
  const newUser = {
    _id: Date.now().toString(),
    uid7: role === 'admin' ? 'ADM' : role === 'student' ? 'STU' : 'FAC' + Date.now().toString().slice(-6),
    email: email,
    role: role,
    universityId: '1',
    isActive: true,
    emailVerified: false
  };
  
  res.json({
    success: true,
    data: {
      token: 'mock-jwt-token-' + newUser._id,
      refreshToken: 'mock-refresh-token-' + newUser._id,
      user: newUser
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  // Mock current user endpoint
  res.json({
    success: true,
    data: {
      user: mockUsers[0] // Return admin user as default
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

app.post('/api/auth/refresh', (req, res) => {
  res.json({
    success: true,
    data: {
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token'
    }
  });
});

// Mock notifications endpoint
app.get('/api/notifications/current', (req, res) => {
  res.json({
    success: true,
    data: {
      notifications: [],
      unreadCount: 0
    }
  });
});

// Mock university endpoint
app.get('/api/universities', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        name: 'Default University',
        country: 'United States',
        domain: 'default.edu',
        isActive: true
      }
    ]
  });
});

// Mock student endpoints
app.get('/api/students/:uid7/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      uid7: req.params.uid7,
      fullName: 'Test Student',
      email: 'student@default.edu',
      major: 'Computer Science',
      year: 3,
      gpa: 3.5
    }
  });
});

// Mock faculty endpoints
app.get('/api/faculty/:uid7/students', (req, res) => {
  res.json({
    success: true,
    data: mockUsers.filter(u => u.role === 'student')
  });
});

// Mock admin endpoints
app.get('/api/admin/users', (req, res) => {
  res.json({
    success: true,
    data: {
      users: mockUsers,
      total: mockUsers.length
    }
  });
});

app.get('/api/admin/dashboard-stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: mockUsers.length,
      totalStudents: mockUsers.filter(u => u.role === 'student').length,
      totalFaculty: mockUsers.filter(u => u.role === 'faculty').length,
      totalAdmins: mockUsers.filter(u => u.role === 'admin').length
    }
  });
});

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  POST /api/auth/login`);
  console.log(`  POST /api/auth/register`);
  console.log(`  GET  /api/auth/me`);
  console.log(`  POST /api/auth/logout`);
  console.log(`  POST /api/auth/refresh`);
  console.log(`  GET  /api/notifications/current`);
  console.log(`  GET  /api/universities`);
  console.log(`  GET  /api/students/:uid7/profile`);
  console.log(`  GET  /api/faculty/:uid7/students`);
  console.log(`  GET  /api/admin/users`);
  console.log(`  GET  /api/admin/dashboard-stats`);
  console.log(`\nMock Login Credentials:`);
  console.log(`  Admin: admin@default.edu / Admin123!@#`);
  console.log(`  Student: student@default.edu / Student123!@#`);
  console.log(`  Faculty: faculty@default.edu / Faculty123!@#`);
});

module.exports = app;
