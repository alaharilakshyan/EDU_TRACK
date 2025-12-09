const express = require('express');
const { Event } = require('../models');
const router = express.Router();

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const { 
      universityId, 
      type, 
      upcoming, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    const query = { isActive: true };
    if (universityId) query.universityId = universityId;
    if (type) query.type = type;
    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('universityId', 'name country')
      .populate('createdBy', 'fullName')
      .sort({ startDate: upcoming === 'true' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: {
        events,
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
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_EVENTS_ERROR',
        message: 'Failed to get events'
      }
    });
  }
});

module.exports = router;
