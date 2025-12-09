const express = require('express');
const { StudentProfile, Certificate, Report, Internship, CVVersion, ActivityEvent } = require('../models');
const { studentOnly } = require('../middleware/auth');
const fileService = require('../services/fileService');
const router = express.Router();

// Fallback scoring function (replaces LLM service)
function fallbackScoring(cvText, jobDescription, verificationData = {}) {
  // Simple keyword-based fallback scoring
  const cvLower = cvText.toLowerCase();
  const requiredSkills = jobDescription.requiredSkills || [];
  
  const skillMatch = requiredSkills.filter(skill => 
    cvLower.includes(skill.toLowerCase())
  ).length / Math.max(requiredSkills.length, 1);

  const experienceMatch = cvLower.includes('year') ? 0.7 : 0.3;
  const educationMatch = cvLower.includes('bachelor') || cvLower.includes('master') ? 1.0 : 0.5;
  const activityMatch = cvLower.includes('project') ? 0.6 : 0.3;
  const certificationMatch = cvLower.includes('certified') || cvLower.includes('certificate') ? 0.5 : 0.2;
  const verificationScore = verificationData.verificationRatio || 0.5;

  const finalATS = (
    0.40 * skillMatch +
    0.20 * experienceMatch +
    0.15 * educationMatch +
    0.10 * activityMatch +
    0.10 * certificationMatch +
    0.05 * verificationScore
  ) * 100;

  return {
    parsedResume: {
      name: 'Unknown',
      email: 'Unknown',
      phone: 'Unknown',
      education: [],
      experience: [],
      projects: [],
      skills: requiredSkills.filter(skill => cvLower.includes(skill.toLowerCase())),
      certifications: []
    },
    scores: {
      skillMatch,
      experience: experienceMatch,
      education: educationMatch,
      activity: activityMatch,
      certification: certificationMatch,
      verification: verificationScore
    },
    finalATSPercent: Math.round(finalATS * 10) / 10,
    topReasons: ['Basic keyword analysis performed'],
    missing: ['Advanced analysis unavailable'],
    recommendations: ['Add more detailed experience information']
  };
}

// GET /api/students/:uid7/profile
router.get('/:uid7/profile', studentOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;

    // Ensure user can only access their own profile
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

    const profile = await StudentProfile.findOne({ userId: req.user._id })
      .populate('userId', 'uid7 email role universityId')
      .populate('activityEvents');

    if (!profile) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Student profile not found'
        }
      });
    }

    res.json({
      success: true,
      data: profile,
      error: null
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_PROFILE_ERROR',
        message: 'Failed to get profile'
      }
    });
  }
});

// PUT /api/students/:uid7/profile
router.put('/:uid7/profile', studentOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;
    const updates = req.body;

    // Ensure user can only update their own profile
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

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Student profile not found'
        }
      });
    }

    // Create activity event for profile update
    await ActivityEvent.create({
      userId: req.user._id,
      date: new Date(),
      type: 'profile-updated',
      typeMeta: { fields: Object.keys(updates) },
      source: 'manual',
      universityId: req.user.universityId
    });

    res.json({
      success: true,
      data: profile,
      error: null
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'UPDATE_PROFILE_ERROR',
        message: 'Failed to update profile'
      }
    });
  }
});

// POST /api/students/:uid7/upload/certificate
router.post('/:uid7/upload/certificate', studentOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;
    const { title, issuer, issueDate, expiryDate, description } = req.body;

    // Ensure user can only upload to their own profile
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

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'NO_FILE',
          message: 'Certificate file is required'
        }
      });
    }

    // Upload file to storage
    const fileUrl = await fileService.uploadFile(req.file, 'certificates');

    // Create certificate record
    const certificate = new Certificate({
      studentId: req.user.profileRef,
      title,
      issuer,
      issueDate: new Date(issueDate),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      description,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      verificationStatus: 'pending'
    });

    await certificate.save();

    // Update student profile activity counts
    await StudentProfile.findByIdAndUpdate(
      req.user.profileRef,
      { $inc: { 'activityCounts.certificates': 1, 'activityCounts.totalActivities': 1 } }
    );

    // Create activity event
    await ActivityEvent.create({
      userId: req.user._id,
      date: new Date(),
      type: 'certificate-uploaded',
      typeMeta: { certificateId: certificate._id, title },
      source: 'manual',
      universityId: req.user.universityId
    });

    res.status(201).json({
      success: true,
      data: {
        certificateId: certificate._id,
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        verificationStatus: 'pending',
        createdAt: certificate.createdAt
      },
      error: null
    });
  } catch (error) {
    console.error('Upload certificate error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'UPLOAD_CERTIFICATE_ERROR',
        message: 'Failed to upload certificate'
      }
    });
  }
});

// POST /api/students/:uid7/upload/report
router.post('/:uid7/upload/report', studentOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;
    const { title, type, description } = req.body;

    // Ensure user can only upload to their own profile
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'NO_FILE',
          message: 'Report file is required'
        }
      });
    }

    // Upload file to storage
    const fileUrl = await fileService.uploadFile(req.file, 'reports');

    // Create report record
    const report = new Report({
      studentId: req.user.profileRef,
      title,
      type,
      description,
      submissionDate: new Date(),
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      verificationStatus: 'pending'
    });

    await report.save();

    // Update student profile activity counts
    await StudentProfile.findByIdAndUpdate(
      req.user.profileRef,
      { $inc: { 'activityCounts.reports': 1, 'activityCounts.totalActivities': 1 } }
    );

    // Create activity event
    await ActivityEvent.create({
      userId: req.user._id,
      date: new Date(),
      type: 'report-submitted',
      typeMeta: { reportId: report._id, title },
      source: 'manual',
      universityId: req.user.universityId
    });

    res.status(201).json({
      success: true,
      data: {
        reportId: report._id,
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        verificationStatus: 'pending',
        createdAt: report.createdAt
      },
      error: null
    });
  } catch (error) {
    console.error('Upload report error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'UPLOAD_REPORT_ERROR',
        message: 'Failed to upload report'
      }
    });
  }
});

// POST /api/students/:uid7/upload/internship
router.post('/:uid7/upload/internship', studentOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;
    const { company, role, startDate, endDate, description, isSummerInternship } = req.body;

    // Ensure user can only upload to their own profile
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

    let fileUrl, fileName, fileSize, fileType;

    // Handle optional file upload
    if (req.file) {
      fileUrl = await fileService.uploadFile(req.file, 'internships');
      fileName = req.file.originalname;
      fileSize = req.file.size;
      fileType = req.file.mimetype;
    }

    // Create internship record
    const internship = new Internship({
      studentId: req.user.profileRef,
      company,
      role,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      isSummerInternship: isSummerInternship || false,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      verificationStatus: 'pending'
    });

    await internship.save();

    // Update student profile activity counts
    const incrementField = isSummerInternship ? 'summerInternships' : 'internships';
    await StudentProfile.findByIdAndUpdate(
      req.user.profileRef,
      { $inc: { [`activityCounts.${incrementField}`]: 1, 'activityCounts.totalActivities': 1 } }
    );

    // Create activity event
    await ActivityEvent.create({
      userId: req.user._id,
      date: new Date(),
      type: 'internship-completed',
      typeMeta: { internshipId: internship._id, company, role },
      source: 'manual',
      universityId: req.user.universityId
    });

    res.status(201).json({
      success: true,
      data: {
        internshipId: internship._id,
        fileUrl,
        fileName,
        fileSize,
        verificationStatus: 'pending',
        createdAt: internship.createdAt
      },
      error: null
    });
  } catch (error) {
    console.error('Upload internship error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'UPLOAD_INTERNSHIP_ERROR',
        message: 'Failed to upload internship'
      }
    });
  }
});

// POST /api/students/:uid7/cv
router.post('/:uid7/cv', studentOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;

    // Ensure user can only upload to their own profile
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'NO_FILE',
          message: 'CV file is required'
        }
      });
    }

    // Get current version number
    const lastCV = await CVVersion.findOne({ studentId: req.user.profileRef })
      .sort({ version: -1 });

    const version = lastCV ? lastCV.version + 1 : 1;

    // Upload file to storage
    const fileUrl = await fileService.uploadFile(req.file, 'cv');

    // Extract text from PDF (simplified - in production use proper PDF parser)
    const parsedContent = req.file.buffer.toString('utf-8', 0, 10000); // First 10KB as preview

    // Create CV version record
    const cvVersion = new CVVersion({
      studentId: req.user.profileRef,
      version,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      parsedContent,
      isActive: true
    });

    await cvVersion.save();

    // Deactivate previous versions
    await CVVersion.updateMany(
      { studentId: req.user.profileRef, _id: { $ne: cvVersion._id } },
      { isActive: false }
    );

    // Update student profile
    await StudentProfile.findByIdAndUpdate(
      req.user.profileRef,
      { $push: { cvVersions: cvVersion._id } }
    );

    res.status(201).json({
      success: true,
      data: {
        cvVersionId: cvVersion._id,
        version,
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        parsedContent,
        isActive: true,
        createdAt: cvVersion.createdAt
      },
      error: null
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'UPLOAD_CV_ERROR',
        message: 'Failed to upload CV'
      }
    });
  }
});

// POST /api/students/:uid7/cv/score
router.post('/:uid7/cv/score', studentOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;
    const { jobDescription } = req.body;

    // Ensure user can only score their own CV
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

    // Get active CV version
    const cvVersion = await CVVersion.findOne({ 
      studentId: req.user.profileRef, 
      isActive: true 
    });

    if (!cvVersion) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'NO_CV',
          message: 'No active CV found'
        }
      });
    }

    // Get student verification data
    const profile = await StudentProfile.findById(req.user.profileRef);
    const verificationRatio = profile.analytics?.verificationRatio || 0;

    // Fallback scoring function (replaces LLM service)
    const scoreResult = fallbackScoring(cvVersion.parsedContent, jobDescription, { verificationRatio });

    // Update CV version with score results
    cvVersion.parsedData = scoreResult.parsedResume;
    cvVersion.atsScore = scoreResult.finalATSPercent;
    cvVersion.scoreBreakdown = scoreResult.scores;
    cvVersion.topReasons = scoreResult.topReasons;
    cvVersion.missingSkills = scoreResult.missing;
    await cvVersion.save();

    res.json({
      success: true,
      data: {
        cvVersionId: cvVersion._id,
        finalATSPercent: scoreResult.finalATSPercent,
        scores: scoreResult.scores,
        topReasons: scoreResult.topReasons,
        missing: scoreResult.missing,
        recommendations: scoreResult.recommendations
      },
      error: null
    });
  } catch (error) {
    console.error('CV scoring error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'CV_SCORING_ERROR',
        message: 'Failed to score CV'
      }
    });
  }
});

// GET /api/students/:uid7/cv/versions
router.get('/:uid7/cv/versions', studentOnly, async (req, res) => {
  try {
    const { uid7 } = req.params;

    // Ensure user can only access their own CV versions
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

    const versions = await CVVersion.find({ studentId: req.user.profileRef })
      .sort({ version: -1 })
      .select('version fileName atsScore isActive createdAt');

    res.json({
      success: true,
      data: { versions },
      error: null
    });
  } catch (error) {
    console.error('Get CV versions error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_CV_VERSIONS_ERROR',
        message: 'Failed to get CV versions'
      }
    });
  }
});

module.exports = router;
