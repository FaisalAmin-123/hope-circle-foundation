const express = require('express');
const router = express.Router();

const {
  getDonorImpact,
  setupRecurringDonation,
  cancelRecurringDonation,
  checkMonthlyDonation,
} = require('../controllers/donorController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require donor authentication
router.get('/my-impact', protect, authorize('donor', 'admin'), getDonorImpact);
router.get('/check-monthly-donation', protect, authorize('donor', 'admin'), checkMonthlyDonation); 
router.post('/recurring-donation', protect, authorize('donor', 'admin'), setupRecurringDonation);
router.delete('/recurring-donation', protect, authorize('donor', 'admin'), cancelRecurringDonation);

module.exports = router;