const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { generateReceipt } = require('../services/pdfService');
const { sendDonationReceivedSMS } = require('../services/smsService');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// helper: build a receipt id <= 40 chars
function makeReceipt(prefix = 'rcpt', userId = '', maxLen = 40) {
  const time = Date.now().toString().slice(-8); // 8 digits of time
  const shortUid = String(userId || '').slice(-8); // last 8 chars if present
  let receipt = shortUid ? `${prefix}_${shortUid}_${time}` : `${prefix}_${time}`;

  // fallback random if somehow still missing
  if (!receipt) {
    const rand = crypto.randomBytes(6).toString('hex'); // 12 chars
    receipt = `${prefix}_${rand}_${time}`;
  }

  // ensure <= maxLen
  if (receipt.length > maxLen) receipt = receipt.slice(0, maxLen);
  return receipt;
}

// @desc    Create Razorpay order
// @route   POST /api/donations/create-order
// @access  Private/Donor
// @desc    Create Razorpay order
// @route   POST /api/donations/create-order
// @access  Private/Donor
exports.createOrder = async (req, res) => {
  try {
    let { amount } = req.body;

    // Validate amount (accept rupees input)
    amount = Number(amount);
    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least ₹1',
      });
    }

    // Convert to paise (integer)
    const amountPaise = Math.round(amount * 100);

    // Build receipt (<=40 chars)
    const receipt = makeReceipt('receipt', req.user?.id || '');

    const options = {
      amount: amountPaise,
      currency: 'INR',
      receipt,
      payment_capture: 1,
      notes: { createdBy: req.user?.id || 'guest' },
    };

    // Create order
    const order = await razorpay.orders.create(options);

    // Optionally: save order/receipt in DB here (Transaction or a separate Order model)
    // e.g. await Transaction.create({ type: 'donation', amount: amount, donor: req.user.id, paymentMethod: null, paymentId: null, status: 'pending', transactionReference: receipt });

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      receipt,
    });
  } catch (error) {
    // Log nested razorpay error details if present
    console.error('Error creating order:', error);
    if (error.error) {
      console.error('Razorpay error details:', error.error);
    }

    const razorErr = error.error || error;
    const message = razorErr?.description || error.message || 'Failed to create order';

    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: message,
      statusCode: error.statusCode || null,
    });
  }
};

// @desc    Verify payment and save donation
// @route   POST /api/donations/verify-payment
// @access  Private/Donor
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      description,
      paymentMethod,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Payment is verified - Save donation
    const donation = await Transaction.create({
      type: 'donation',
      amount: amount / 100, // Convert paise back to rupees
      donor: req.user.id,
      description: description || 'Donation to Baitul Maal',
      paymentMethod: paymentMethod || 'card',
      paymentId: razorpay_payment_id,
      status: 'completed',
    });

    // Populate donor details
    await donation.populate('donor', 'name email');

    res.status(201).json({
      success: true,
      message: 'Payment verified and donation recorded',
      donation,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// @desc    Get my donations
// @route   GET /api/donations/my-donations
// @access  Private/Donor
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Transaction.find({
      donor: req.user.id,
      type: 'donation',
    })
      .sort({ createdAt: -1 })
      .populate('donor', 'name email');

    // Calculate total donated
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
      success: true,
      count: donations.length,
      totalDonated,
      data: donations,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
      error: error.message,
    });
  }
};

// @desc    Get single donation (for receipt)
// @route   GET /api/donations/:id
// @access  Private/Donor
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Transaction.findById(req.params.id).populate(
      'donor',
      'name email phone'
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    // Check if donation belongs to user
    if (donation.donor._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this donation',
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation',
      error: error.message,
    });
  }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations
// @access  Private/Admin
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Transaction.find({ type: 'donation' })
      .sort({ createdAt: -1 })
      .populate('donor', 'name email phone');

    // Calculate total
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
      success: true,
      count: donations.length,
      totalDonations,
      data: donations,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
      error: error.message,
    });
  }
};


// @desc    Download donation receipt (PDF)
// @route   GET /api/donations/:id/receipt
// @access  Private/Donor
exports.downloadReceipt = async (req, res) => {
  try {
    const donation = await Transaction.findById(req.params.id).populate(
      'donor',
      'name email phone'
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    // Check if donation belongs to user (or is admin)
    if (
      donation.donor._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this receipt',
      });
    }

    // Generate and send PDF
    generateReceipt(donation, res);
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate receipt',
      error: error.message,
    });
  }
};
