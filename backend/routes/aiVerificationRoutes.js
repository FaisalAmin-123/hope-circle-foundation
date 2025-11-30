const express = require('express');
const router = express.Router();

const {
  performAIVerification,
  getAIVerificationResults,
} = require('../controllers/aiVerificationController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Routes (admin only)
router.post('/:applicationId', protect, authorize('admin'), performAIVerification);
router.get('/:applicationId', protect, authorize('admin'), getAIVerificationResults);

module.exports = router;