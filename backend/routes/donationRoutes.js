const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { protect, authorize } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { donationSuccessEmail } = require('../utils/emailTemplates');

// Get your razorpay instance
const Razorpay = require('razorpay');
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Import controllers
const {
  createOrder,
  verifyPayment,
  getMyDonations,
  getDonationById,
  getAllDonations,
  downloadReceipt,
} = require('../controllers/donationController');

// Import middleware

// Routes

// Create order (Donor)
router.post('/create-order', protect, authorize('donor', 'admin'), createOrder);

// Verify payment (Donor)
router.post('/verify-payment', protect, authorize('donor', 'admin'), verifyPayment);

// Get my donations (Donor)
router.get('/my-donations', protect, authorize('donor', 'admin'), getMyDonations);

// Download receipt (Donor) - ADD THIS LINE
router.get('/:id/receipt', protect, downloadReceipt);

// Get single donation (Donor)
router.get('/:id', protect, getDonationById);

// Get all donations (Admin)
router.get('/', protect, authorize('admin'), getAllDonations);

// Check if already donated this month
router.get('/check-monthly-donation', protect, authorize('donor'), async (req, res) => {
  try {
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const donation = await Transaction.findOne({
      donor: req.user.id,
      type: 'donation',
      createdAt: { $gte: thisMonthStart },
    });

    res.json({
      success: true,
      alreadyDonated: !!donation,
      lastDonation: donation?.createdAt,
    });
  } catch (error) {
    console.error('Check donation error:', error);
    res.status(500).json({ success: false, message: 'Error checking donation' });
  }
});

// Create monthly donation order
router.post('/create-monthly-order', protect, authorize('donor'), async (req, res) => {
  try {
    const { amount } = req.body;

    // ✅ FIX: Generate SHORT receipt ID (max 40 chars)
    const shortUserId = req.user.id.toString().slice(-8); // Last 8 chars of user ID
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const receipt = `M${shortUserId}${timestamp}`; // Total: 1 + 8 + 8 = 17 chars

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: receipt,
    };

    console.log('Creating Razorpay order with receipt:', receipt); // Debug log

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: error.message 
    });
  }
});


// Verify monthly payment and update streak
router.post('/verify-monthly-payment', protect, authorize('donor'), async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      baseAmount,
      extraAmount,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Create transaction
    const totalAmount = baseAmount + (extraAmount || 0);
    const transaction = await Transaction.create({
      type: 'donation',
      amount: totalAmount,
      donor: req.user.id,
      paymentMethod: 'razorpay',
      paymentId: razorpay_payment_id,
      description: `Monthly Regular Donation (Base: ₹${baseAmount}${extraAmount ? `, Extra: ₹${extraAmount}` : ''})`,
      status: 'completed',
    });

    // Update user's total donated and streak
    const user = await User.findById(req.user.id);
    user.totalDonated = (user.totalDonated || 0) + totalAmount;

    // ✅ UPDATE STREAK
    if (!user.recurringDonation) {
      user.recurringDonation = { consecutiveMonths: 0 };
    }
    
    const currentStreak = user.recurringDonation.consecutiveMonths || 0;
    user.recurringDonation.consecutiveMonths = currentStreak + 1;
    user.recurringDonation.lastDonationDate = new Date();

    // Calculate next donation date
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    nextDate.setDate(user.recurringDonation.donationDay || 1);
    user.recurringDonation.nextDonationDate = nextDate;

    await user.save();

    console.log(`✅ Streak updated for ${user.email}: ${user.recurringDonation.consecutiveMonths} months`);

    // ✅ SEND PAYMENT SUCCESS EMAIL
    if (user.emailNotifications || user.recurringDonation?.emailNotifications) {
      try {
        const emailTemplate = donationSuccessEmail(
          user.name,
          totalAmount,
          transaction._id,
          user.recurringDonation.consecutiveMonths
        );
        
        await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
        console.log(`✅ Payment success email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send payment email:', emailError.message);
        // Don't fail the payment if email fails
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      transaction,
      newStreak: user.recurringDonation.consecutiveMonths,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed',
      error: error.message 
    });
  }
});
module.exports = router;
