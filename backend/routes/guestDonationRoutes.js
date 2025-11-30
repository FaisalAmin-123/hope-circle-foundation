const express = require('express');
const router = express.Router();

const {
  createGuestDonationOrder,
  verifyGuestDonation,
  getGuestDonationReceipt,
} = require('../controllers/guestDonationController');

// All routes are public (no authentication required)
router.post('/create-order', createGuestDonationOrder);
router.post('/verify', verifyGuestDonation);
router.get('/receipt/:id', getGuestDonationReceipt);

module.exports = router;