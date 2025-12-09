const express = require('express');
const { StudentProfile, Certificate, Report, Internship, Event, User, AuditLog } = require('../models');
const { facultyOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/faculty/:uid7/students
router.get('/:uid7/students', facultyOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;
    const { page = 1, limit = 20, department, year, search } = req.query;

    // Ensure faculty can only access their own students
    if (req.user.uid7 !== uid7) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied'
        }
      });
    }

    // Build query
    const query = { universityId: req.user.universityId };
    
    if (department) query.department = department;
    if (year) query.year = parseInt(year);
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await StudentProfile.find(query)
      .populate('userId', 'uid7 email lastLogin')
      .sort({ fullName: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StudentProfile.countDocuments(query);

    res.json({
      success: true,
      data: {
        students,
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
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_STUDENTS_ERROR',
        message: 'Failed to get students'
      }
    });
  }
});

// GET /api/faculty/:uid7/pending-approvals
router.get('/:uid7/pending-approvals', facultyOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;
    const { type, page = 1, limit = 20 } = req.query;

    // Ensure faculty can only access their own pending approvals
    if (req.user.uid7 !== uid7) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied'
        }
      });
    }

    let pendingItems = [];
    let total = 0;

    if (!type || type === 'certificates') {
      const certificates = await Certificate.find({
        verificationStatus: 'pending'
      })
      .populate('studentId', 'fullName rollNo department year userId')
      .populate('studentId.userId', 'uid7 email')
      .sort({ createdAt: -1 });

      pendingItems = pendingItems.concat(
        certificates.map(cert => ({
          _id: cert._id,
          type: 'certificate',
          title: cert.title,
          issuer: cert.issuer,
          issueDate: cert.issueDate,
          student: cert.studentId,
          createdAt: cert.createdAt,
          fileUrl: cert.fileUrl,
          fileName: cert.fileName
        }))
      );
    }

    if (!type || type === 'reports') {
      const reports = await Report.find({
        verificationStatus: 'pending'
      })
      .populate('studentId', 'fullName rollNo department year userId')
      .populate('studentId.userId', 'uid7 email')
      .sort({ createdAt: -1 });

      pendingItems = pendingItems.concat(
        reports.map(report => ({
          _id: report._id,
          type: 'report',
          title: report.title,
          reportType: report.type,
          submissionDate: report.submissionDate,
          student: report.studentId,
          createdAt: report.createdAt,
          fileUrl: report.fileUrl,
          fileName: report.fileName
        }))
      );
    }

    if (!type || type === 'internships') {
      const internships = await Internship.find({
        verificationStatus: 'pending'
      })
      .populate('studentId', 'fullName rollNo department year userId')
      .populate('studentId.userId', 'uid7 email')
      .sort({ createdAt: -1 });

      pendingItems = pendingItems.concat(
        internships.map(internship => ({
          _id: internship._id,
          type: 'internship',
          company: internship.company,
          role: internship.role,
          startDate: internship.startDate,
          endDate: internship.endDate,
          isSummerInternship: internship.isSummerInternship,
          student: internship.studentId,
          createdAt: internship.createdAt,
          fileUrl: internship.fileUrl,
          fileName: internship.fileName
        }))
      );
    }

    // Sort by creation date
    pendingItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedItems = pendingItems.slice(startIndex, endIndex);
    total = pendingItems.length;

    res.json({
      success: true,
      data: {
        pendingItems: paginatedItems,
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
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_PENDING_APPROVALS_ERROR',
        message: 'Failed to get pending approvals'
      }
    });
  }
});

// POST /api/faculty/:uid7/approve/:itemId
router.post('/:uid7/approve/:itemId', facultyOnly, async (req, res) => {
  try {
    const { uid7, itemId } = req.params;
    const { comments, itemType } = req.body;

    // Ensure faculty can only approve their own university's items
    if (req.user.uid7 !== uid7) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied'
        }
      });
    }

    let item;
    let studentProfile;

    // Find and update the appropriate item
    switch (itemType) {
      case 'certificate':
        item = await Certificate.findById(itemId).populate('studentId');
        break;
      case 'report':
        item = await Report.findById(itemId).populate('studentId');
        break;
      case 'internship':
        item = await Internship.findById(itemId).populate('studentId');
        break;
      default:
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: 'INVALID_ITEM_TYPE',
            message: 'Invalid item type'
          }
        });
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Item not found'
        }
      });
    }

    // Verify student is from the same university
    const studentUser = await User.findById(item.studentId.userId);
    if (studentUser.universityId.toString() !== req.user.universityId.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED_UNIVERSITY',
          message: 'Cannot approve items from other universities'
        }
      });
    }

    // Update item status
    item.verificationStatus = 'verified';
    item.verifiedBy = req.user.profileRef;
    item.verificationDate = new Date();
    item.verificationComments = comments;
    await item.save();

    // Update student verification ratio
    studentProfile = item.studentId;
    const totalItems = await Promise.all([
      Certificate.countDocuments({ studentId: studentProfile._id }),
      Report.countDocuments({ studentId: studentProfile._id }),
      Internship.countDocuments({ studentId: studentProfile._id })
    ]).then(counts => counts.reduce((sum, count) => sum + count, 0));

    const verifiedItems = await Promise.all([
      Certificate.countDocuments({ studentId: studentProfile._id, verificationStatus: 'verified' }),
      Report.countDocuments({ studentId: studentProfile._id, verificationStatus: 'verified' }),
      Internship.countDocuments({ studentId: studentProfile._id, verificationStatus: 'verified' })
    ]).then(counts => counts.reduce((sum, count) => sum + count, 0));

    const verificationRatio = totalItems > 0 ? verifiedItems / totalItems : 0;
    
    await StudentProfile.findByIdAndUpdate(
      studentProfile._id,
      { 'analytics.verificationRatio': verificationRatio }
    );

    // Create audit log
    await AuditLog.create({
      userId: req.user._id,
      action: 'approve',
      resourceType: itemType,
      resourceId: itemId,
      oldValues: { verificationStatus: 'pending' },
      newValues: { verificationStatus: 'verified', verificationComments: comments },
      reason: comments,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        itemId: item._id,
        verificationStatus: 'verified',
        verifiedBy: req.user.uid7,
        verificationDate: item.verificationDate,
        verificationComments: comments
      },
      error: null
    });
  } catch (error) {
    console.error('Approve item error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'APPROVE_ITEM_ERROR',
        message: 'Failed to approve item'
      }
    });
  }
});

// POST /api/faculty/:uid7/reject/:itemId
router.post('/:uid7/reject/:itemId', facultyOnly, async (req, res) => {
  try {
    const { uid7, itemId } = req.params;
    const { comments, itemType } = req.body;

    // Ensure faculty can only reject their own university's items
    if (req.user.uid7 !== uid7) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied'
        }
      });
    }

    let item;

    // Find and update the appropriate item
    switch (itemType) {
      case 'certificate':
        item = await Certificate.findById(itemId).populate('studentId');
        break;
      case 'report':
        item = await Report.findById(itemId).populate('studentId');
        break;
      case 'internship':
        item = await Internship.findById(itemId).populate('studentId');
        break;
      default:
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: 'INVALID_ITEM_TYPE',
            message: 'Invalid item type'
          }
        });
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Item not found'
        }
      });
    }

    // Verify student is from the same university
    const studentUser = await User.findById(item.studentId.userId);
    if (studentUser.universityId.toString() !== req.user.universityId.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED_UNIVERSITY',
          message: 'Cannot reject items from other universities'
        }
      });
    }

    // Update item status
    item.verificationStatus = 'rejected';
    item.verifiedBy = req.user.profileRef;
    item.verificationDate = new Date();
    item.verificationComments = comments;
    await item.save();

    // Create audit log
    await AuditLog.create({
      userId: req.user._id,
      action: 'reject',
      resourceType: itemType,
      resourceId: itemId,
      oldValues: { verificationStatus: 'pending' },
      newValues: { verificationStatus: 'rejected', verificationComments: comments },
      reason: comments,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        itemId: item._id,
        verificationStatus: 'rejected',
        verifiedBy: req.user.uid7,
        verificationDate: item.verificationDate,
        verificationComments: comments
      },
      error: null
    });
  } catch (error) {
    console.error('Reject item error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'REJECT_ITEM_ERROR',
        message: 'Failed to reject item'
      }
    });
  }
});

// GET /api/faculty/:uid7/student/:studentUid7/analytics
router.get('/:uid7/student/:studentUid7/analytics', facultyOnly, async (req, res) => {
  try {
    const { uid7, studentUid7 } = req.params;

    // Ensure faculty can only access analytics for their own university's students
    if (req.user.uid7 !== uid7) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied'
        }
      });
    }

    // Find student user
    const studentUser = await User.findOne({ uid7: studentUid7 });
    if (!studentUser) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'STUDENT_NOT_FOUND',
          message: 'Student not found'
        }
      });
    }

    // Verify student is from the same university
    if (studentUser.universityId.toString() !== req.user.universityId.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED_UNIVERSITY',
          message: 'Cannot access analytics for students from other universities'
        }
      });
    }

    // Get student profile with all data
    const studentProfile = await StudentProfile.findOne({ userId: studentUser._id })
      .populate('userId', 'uid7 email lastLogin')
      .populate('activityEvents');

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Student profile not found'
        }
      });
    }

    // Get detailed statistics
    const [certificates, reports, internships] = await Promise.all([
      Certificate.find({ studentId: studentProfile._id }),
      Report.find({ studentId: studentProfile._id }),
      Internship.find({ studentId: studentProfile._id })
    ]);

    const analytics = {
      profile: studentProfile,
      certificates: {
        total: certificates.length,
        verified: certificates.filter(c => c.verificationStatus === 'verified').length,
        pending: certificates.filter(c => c.verificationStatus === 'pending').length,
        rejected: certificates.filter(c => c.verificationStatus === 'rejected').length,
        items: certificates
      },
      reports: {
        total: reports.length,
        verified: reports.filter(r => r.verificationStatus === 'verified').length,
        pending: reports.filter(r => r.verificationStatus === 'pending').length,
        rejected: reports.filter(r => r.verificationStatus === 'rejected').length,
        items: reports
      },
      internships: {
        total: internships.length,
        verified: internships.filter(i => i.verificationStatus === 'verified').length,
        pending: internships.filter(i => i.verificationStatus === 'pending').length,
        rejected: internships.filter(i => i.verificationStatus === 'rejected').length,
        summerInternships: internships.filter(i => i.isSummerInternship).length,
        items: internships
      }
    };

    res.json({
      success: true,
      data: analytics,
      error: null
    });
  } catch (error) {
    console.error('Get student analytics error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_STUDENT_ANALYTICS_ERROR',
        message: 'Failed to get student analytics'
      }
    });
  }
});

// POST /api/faculty/:uid7/events
router.post('/:uid7/events', facultyOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;
    const eventData = req.body;

    // Ensure faculty can only create events for their own university
    if (req.user.uid7 !== uid7) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied'
        }
      });
    }

    // Create event
    const event = new Event({
      ...eventData,
      universityId: req.user.universityId,
      createdBy: req.user.profileRef
    });

    await event.save();

    // Update university with new event
    const University = require('../models').University;
    await University.findByIdAndUpdate(
      req.user.universityId,
      { $push: { verifiedActivities: event._id } }
    );

    // Create audit log
    await AuditLog.create({
      userId: req.user._id,
      action: 'create',
      resourceType: 'event',
      resourceId: event._id,
      newValues: eventData,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      success: true,
      data: {
        eventId: event._id,
        ...eventData,
        universityId: req.user.universityId,
        createdBy: req.user.profileRef,
        createdAt: event.createdAt
      },
      error: null
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'CREATE_EVENT_ERROR',
        message: 'Failed to create event'
      }
    });
  }
});

module.exports = router;
