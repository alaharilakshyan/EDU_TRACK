const express = require('express');
const axios = require('axios');
const { University } = require('../models');
const router = express.Router();

// GET /api/universities
router.get('/', async (req, res) => {
  try {
    const { query, country } = req.query;

    if (query) {
      // Search via external API
      try {
        const response = await axios.get(`http://universities.hipolabs.com/search`, {
          params: {
            name: query,
            country: country || ''
          },
          timeout: 5000
        });

        const universities = response.data.map(uni => ({
          name: uni.name,
          country: uni.country,
          domain: uni.domains?.[0] || '',
          apiId: uni.domains?.[0] || ''
        }));

        res.json({
          success: true,
          data: { universities },
          error: null
        });
      } catch (apiError) {
        console.error('External API error:', apiError);
        
        // Fallback to local database search
        const localQuery = {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { domain: { $regex: query, $options: 'i' } }
          ]
        };
        if (country) localQuery.country = country;

        const universities = await University.find(localQuery)
          .sort({ name: 1 })
          .limit(20);

        res.json({
          success: true,
          data: { universities },
          error: null
        });
      }
    } else {
      // Return all local universities
      const universities = await University.find({ isActive: true })
        .sort({ name: 1 });

      res.json({
        success: true,
        data: { universities },
        error: null
      });
    }
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

module.exports = router;
