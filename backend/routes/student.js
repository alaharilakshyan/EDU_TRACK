const express = require('express');
const router = express.Router();

// Placeholder routes for students
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: { message: 'Student profile endpoint' },
    error: null
  });
});

module.exports = router;
