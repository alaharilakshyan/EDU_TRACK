const express = require('express');
const { ActivityEvent } = require('../models');
const router = express.Router();

// GET /api/activity/:uid7/heatmap
router.get('/:uid7/heatmap', async (req, res) => {
  try {
    const { uid7 } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'From and to dates are required'
        }
      });
    }

    // Build date range query
    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999); // End of day

    // Find activity events for the user within date range
    const events = await ActivityEvent.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // Aggregate daily counts
    const dailyCounts = {};
    events.forEach(event => {
      const dateStr = event.date.toISOString().split('T')[0];
      dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
    });

    // Fill missing dates with 0
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (!dailyCounts[dateStr]) {
        dailyCounts[dateStr] = 0;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: {
        dailyCounts,
        totalEvents: events.length,
        dateRange: { from, to }
      },
      error: null
    });
  } catch (error) {
    console.error('Get heatmap error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_HEATMAP_ERROR',
        message: 'Failed to get activity heatmap'
      }
    });
  }
});

// POST /api/activity
router.post('/', async (req, res) => {
  try {
    const { userId, date, type, typeMeta, source } = req.body;

    // Create activity event
    const activity = new ActivityEvent({
      userId: req.user._id,
      date: date ? new Date(date) : new Date(),
      type,
      typeMeta,
      source: source || 'manual',
      universityId: req.user.universityId
    });

    await activity.save();

    res.status(201).json({
      success: true,
      data: activity,
      error: null
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'CREATE_ACTIVITY_ERROR',
        message: 'Failed to create activity event'
      }
    });
  }
});

module.exports = router;
