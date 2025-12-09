const express = require('express');
const bcrypt = require('bcryptjs');
const { User, StudentProfile, FacultyProfile, University, AuditLog } = require('../models');
const { adminOnly } = require('../middleware/auth');
const { generateUid7 } = require('../utils/helpers');
const router = express.Router();

// GET /api/admin/users
router.get('/users', adminOnly, async (req, res) => {
  try {
    const { role, universityId, page = 1, limit = 20, search } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (universityId) query.universityId = universityId;
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { uid7: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .populate('universityId', 'name country')
      .populate('profileRef')
      .select('-passwordHash -refreshTokens')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_USERS_ERROR',
        message: 'Failed to get users'
      }
    });
  }
});

// POST /api/admin/create-user
router.post('/create-user', adminOnly, async (req, res) => {
  try {
    const { email, password, role, universityId, profileData, sendWelcomeEmail } = req.body;

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

    // Create audit log
    await AuditLog.create({
      userId: req.user._id,
      action: 'create',
      resourceType: 'user',
      resourceId: user._id,
      newValues: { email, role, universityId, profileData },
      reason: 'Admin user creation',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // TODO: Send welcome email if requested
    if (sendWelcomeEmail) {
      // Implement email sending logic
      console.log('Welcome email would be sent to:', email);
    }

    res.status(201).json({
      success: true,
      data: {
        user: {
          uid7: user.uid7,
          email: user.email,
          role: user.role,
          universityId: user.universityId,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        profile
      },
      error: null
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'CREATE_USER_ERROR',
        message: 'Failed to create user'
      }
    });
  }
});

// PUT /api/admin/users/:uid7
router.put('/users/:uid7', adminOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;
    const updates = req.body;

    const user = await User.findOne({ uid7 });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const oldValues = { ...user.toObject() };

    // Handle password change if provided
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 12);
      delete updates.password;
    }

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { uid7 },
      updates,
      { new: true, runValidators: true }
    ).populate('universityId').select('-passwordHash -refreshTokens');

    // Create audit log
    await AuditLog.create({
      userId: req.user._id,
      action: 'update',
      resourceType: 'user',
      resourceId: user._id,
      oldValues,
      newValues: updates,
      reason: 'Admin user update',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: updatedUser,
      error: null
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'UPDATE_USER_ERROR',
        message: 'Failed to update user'
      }
    });
  }
});

// DELETE /api/admin/users/:uid7
router.delete('/users/:uid7', adminOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;

    const user = await User.findOne({ uid7 });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Prevent self-deletion
    if (user.uid7 === req.user.uid7) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'CANNOT_DELETE_SELF',
          message: 'Cannot delete your own account'
        }
      });
    }

    // Store old values for audit
    const oldValues = { ...user.toObject() };

    // Delete user and related profile
    await User.findByIdAndDelete(user._id);

    // Delete associated profile
    if (user.profileRef) {
      if (user.role === 'student') {
        await StudentProfile.findByIdAndDelete(user.profileRef);
      } else if (user.role === 'faculty') {
        await FacultyProfile.findByIdAndDelete(user.profileRef);
      }
    }

    // Create audit log
    await AuditLog.create({
      userId: req.user._id,
      action: 'delete',
      resourceType: 'user',
      resourceId: user._id,
      oldValues,
      reason: 'Admin user deletion',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        message: 'User deleted successfully',
        deletedUser: {
          uid7: user.uid7,
          email: user.email,
          role: user.role
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'DELETE_USER_ERROR',
        message: 'Failed to delete user'
      }
    });
  }
});

// POST /api/admin/assign-role
router.post('/assign-role', adminOnly, async (req, res) => {
  try {
    const { uid7, newRole, reason } = req.body;

    if (!uid7 || !newRole) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'UID7 and new role are required'
        }
      });
    }

    const user = await User.findOne({ uid7 });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const oldRole = user.role;
    const oldValues = { role: oldRole };

    // Update role
    user.role = newRole;
    await user.save();

    // Handle profile migration if needed
    if (oldRole !== newRole) {
      // Delete old profile if it exists
      if (user.profileRef) {
        if (oldRole === 'student') {
          await StudentProfile.findByIdAndDelete(user.profileRef);
        } else if (oldRole === 'faculty') {
          await FacultyProfile.findByIdAndDelete(user.profileRef);
        }
        user.profileRef = null;
      }

      // Create new profile if profile data is provided
      if (req.body.profileData) {
        let newProfile;
        if (newRole === 'student') {
          newProfile = new StudentProfile({
            userId: user._id,
            ...req.body.profileData
          });
        } else if (newRole === 'faculty') {
          newProfile = new FacultyProfile({
            userId: user._id,
            ...req.body.profileData
          });
        }

        if (newProfile) {
          await newProfile.save();
          user.profileRef = newProfile._id;
          await user.save();
        }
      }
    }

    // Create audit log
    await AuditLog.create({
      userId: req.user._id,
      action: 'update',
      resourceType: 'user',
      resourceId: user._id,
      oldValues,
      newValues: { role: newRole },
      reason: reason || 'Role assignment by admin',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        uid7: user.uid7,
        oldRole,
        newRole,
        reason: reason || 'Role assignment by admin'
      },
      error: null
    });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'ASSIGN_ROLE_ERROR',
        message: 'Failed to assign role'
      }
    });
  }
});

// GET /api/admin/universities
router.get('/universities', adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, country } = req.query;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } }
      ];
    }
    if (country) query.country = country;

    const universities = await University.find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await University.countDocuments(query);

    res.json({
      success: true,
      data: {
        universities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Get universities error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_UNIVERSITIES_ERROR',
        message: 'Failed to get universities'
      }
    });
  }
});

// POST /api/admin/universities
router.post('/universities', adminOnly, async (req, res) => {
  try {
    const { name, country, domain, apiId } = req.body;

    if (!name || !country) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name and country are required'
        }
      });
    }

    // Check if university already exists
    const existingUniversity = await University.findOne({ 
      $or: [{ name }, { domain }] 
    });

    if (existingUniversity) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'UNIVERSITY_EXISTS',
          message: 'University with this name or domain already exists'
        }
      });
    }

    // Create university
    const university = new University({
      name,
      country,
      domain,
      apiId,
      isActive: true
    });

    await university.save();

    // Create audit log
    await AuditLog.create({
      userId: req.user._id,
      action: 'create',
      resourceType: 'university',
      resourceId: university._id,
      newValues: { name, country, domain, apiId },
      reason: 'Admin university creation',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      success: true,
      data: university,
      error: null
    });
  } catch (error) {
    console.error('Create university error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'CREATE_UNIVERSITY_ERROR',
        message: 'Failed to create university'
      }
    });
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', adminOnly, async (req, res) => {
  try {
    const { 
      userId, 
      action, 
      resourceType, 
      from, 
      to, 
      page = 1, 
      limit = 50 
    } = req.query;

    // Build query
    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const logs = await AuditLog.find(query)
      .populate('userId', 'uid7 email role')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_AUDIT_LOGS_ERROR',
        message: 'Failed to get audit logs'
      }
    });
  }
});

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalFaculty,
      totalAdmins,
      totalUniversities,
      totalCertificates,
      totalReports,
      totalInternships,
      pendingApprovals,
      recentActivity
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'faculty', isActive: true }),
      User.countDocuments({ role: 'admin', isActive: true }),
      University.countDocuments({ isActive: true }),
      Certificate.countDocuments(),
      Report.countDocuments(),
      Internship.countDocuments(),
      Promise.all([
        Certificate.countDocuments({ verificationStatus: 'pending' }),
        Report.countDocuments({ verificationStatus: 'pending' }),
        Internship.countDocuments({ verificationStatus: 'pending' })
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
      AuditLog.find()
        .populate('userId', 'uid7 email role')
        .sort({ timestamp: -1 })
        .limit(10)
    ]);

    const stats = {
      users: {
        total: totalUsers,
        students: totalStudents,
        faculty: totalFaculty,
        admins: totalAdmins
      },
      universities: totalUniversities,
      activities: {
        certificates: totalCertificates,
        reports: totalReports,
        internships: totalInternships,
        pendingApprovals
      },
      recentActivity
    };

    res.json({
      success: true,
      data: stats,
      error: null
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_DASHBOARD_STATS_ERROR',
        message: 'Failed to get dashboard statistics'
      }
    });
  }
});

module.exports = router;
