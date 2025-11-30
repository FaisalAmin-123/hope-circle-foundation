const express = require('express');
const router = express.Router();

const {
  distributeFunds,
  getAllDistributions,
  getBeneficiaryDistributions,
} = require('../controllers/distributionController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are admin only
router.post('/', protect, authorize('admin'), distributeFunds);
router.get('/', protect, authorize('admin'), getAllDistributions);
router.get('/beneficiary/:id', protect, authorize('admin'), getBeneficiaryDistributions);

module.exports = router;