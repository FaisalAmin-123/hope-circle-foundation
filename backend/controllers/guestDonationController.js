const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const { sendSMS } = require('../services/smsService');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create guest donation order
// @route   POST /api/guest-donations/create-order
// @access  Public (No authentication required)
exports.createGuestDonationOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount',
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `guest_donation_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating guest donation order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create donation order',
      error: error.message,
    });
  }
};

// @desc    Verify and save guest donation
// @route   POST /api/guest-donations/verify
// @access  Public
exports.verifyGuestDonation = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      donorName,
      donorPhone,
      donorEmail,
      message,
    } = req.body;

    console.log('Received payment verification request:', {
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      donorName,
    });

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    console.log('Signature verification:', {
      received: razorpay_signature,
      expected: expectedSign,
      match: razorpay_signature === expectedSign,
    });

    if (razorpay_signature !== expectedSign) {
      console.error('Signature mismatch!');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    console.log('Payment verified successfully, saving to database...');

    // Payment verified - Save guest donation
    const donation = await Transaction.create({
      type: 'donation',
      amount: amount / 100, // Convert from paise to rupees
      donor: null, // Guest donation - no user ID
      description: message || 'Guest donation to Hope Circle Foundation',
      paymentMethod: 'card',
      paymentId: razorpay_payment_id,
      status: 'completed',
      // Store guest donor info in a new field
      guestDonor: {
        name: donorName || 'Anonymous',
        phone: donorPhone || null,
        email: donorEmail || null,
      },
    });

    console.log('Donation saved:', donation._id);

    // Send SMS if phone provided
    if (donorPhone) {
      try {
        const smsMessage = `Dear ${donorName || 'Donor'},

Thank you for your generous donation of Rs.${(amount / 100).toLocaleString()} to Hope Circle Foundation!

Your contribution will help those in need. Receipt: ${razorpay_payment_id}

- Hope Circle Foundation Team`;

        console.log('Sending SMS to:', donorPhone);
        await sendSMS(donorPhone, smsMessage);
        console.log('SMS sent successfully');
      } catch (smsError) {
        console.error('SMS Error (non-critical):', smsError.message);
        // Don't fail donation if SMS fails
      }
    }

    console.log('Sending success response to frontend...');

    res.status(201).json({
      success: true,
      message: 'Thank you for your donation!',
      donation: {
        id: donation._id,
        amount: donation.amount,
        paymentId: donation.paymentId,
        donorName: donorName || 'Anonymous',
        createdAt: donation.createdAt,
      },
    });
  } catch (error) {
    console.error('Error verifying guest donation:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// @desc    Get guest donation receipt
// @route   GET /api/guest-donations/receipt/:id
// @access  Public
exports.getGuestDonationReceipt = async (req, res) => {
  try {
    const donation = await Transaction.findById(req.params.id);

    if (!donation || donation.type !== 'donation') {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: donation._id,
        amount: donation.amount,
        donorName: donation.guestDonor?.name || 'Anonymous',
        paymentId: donation.paymentId,
        date: donation.createdAt,
        description: donation.description,
      },
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receipt',
      error: error.message,
    });
  }
};