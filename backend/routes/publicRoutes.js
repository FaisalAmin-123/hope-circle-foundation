const express = require('express');
const router = express.Router();

const {
  getPublicStatistics,
  getRecentActivities,
} = require('../controllers/publicController');

// Public routes (no authentication required)
router.get('/statistics', getPublicStatistics);
router.get('/recent-activities', getRecentActivities);

module.exports = router;