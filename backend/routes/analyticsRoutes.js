const express = require('express');
const router = express.Router();

// Import controllers
const {
  getDashboardStats,
  getMonthlyStats,
  getBeneficiaryStats,
} = require('../controllers/analyticsController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes (all protected and admin-only)
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/monthly', protect, authorize('admin'), getMonthlyStats);
router.get('/beneficiaries', protect, authorize('admin'), getBeneficiaryStats);

module.exports = router;