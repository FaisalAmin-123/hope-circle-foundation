const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Application = require('../models/Application');
const { sendAidDistributedSMS } = require('../services/smsService');

// @desc    Distribute funds to beneficiary
// @route   POST /api/distributions
// @access  Private/Admin
exports.distributeFunds = async (req, res) => {
  try {
    // ✅ EXTRACT transactionReference from req.body
    const { beneficiaryId, amount, description, transactionReference } = req.body;

    console.log('Received distribution request:', { beneficiaryId, amount, description, transactionReference });

    // Validate
    if (!beneficiaryId || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid beneficiary and amount',
      });
    }

    // ✅ Validate transaction reference
    if (!transactionReference || transactionReference.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide transaction reference number',
      });
    }

    // Check if beneficiary exists and is approved
    const beneficiary = await User.findById(beneficiaryId);

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found',
      });
    }

    if (beneficiary.role !== 'beneficiary') {
      return res.status(400).json({
        success: false,
        message: 'User is not a beneficiary',
      });
    }

    if (beneficiary.verificationStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Beneficiary is not approved yet',
      });
    }

    // ✅ Get beneficiary's bank details
    const application = await Application.findOne({
      beneficiary: beneficiaryId,
      status: 'approved',
    });

    if (!application || !application.bankDetails) {
      return res.status(400).json({
        success: false,
        message: 'Beneficiary bank details not found',
      });
    }

    // ✅ Create distribution transaction WITH transactionReference
    const distribution = await Transaction.create({
      type: 'distribution',
      amount,
      beneficiary: beneficiaryId,
      approvedBy: req.user.id,
      description: description || 'Financial assistance from Hope Circle Foundation',
      transactionReference: transactionReference.trim(), // ✅ INCLUDE THIS
      status: 'completed',
    });

    // Populate details
    await distribution.populate('beneficiary', 'name email phone');
    await distribution.populate('approvedBy', 'name email');

    // ✅ Send SMS notification with transaction reference
    if (beneficiary.phone) {
      try {
        await sendAidDistributedSMS(
          beneficiary,
          amount,
          transactionReference.trim(),
          application.bankDetails.accountNumber
        );
      } catch (smsError) {
        console.error('SMS Error (non-critical):', smsError.message);
        // Don't fail the distribution if SMS fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Funds distributed successfully',
      data: distribution,
    });
  } catch (error) {
    console.error('Distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to distribute funds',
      error: error.message,
    });
  }
};

// @desc    Get all distributions
// @route   GET /api/distributions
// @access  Private/Admin
exports.getAllDistributions = async (req, res) => {
  try {
    const distributions = await Transaction.find({ type: 'distribution' })
      .sort({ createdAt: -1 })
      .populate('beneficiary', 'name email phone beneficiaryCategory')
      .populate('approvedBy', 'name email');

    // Calculate total distributed
    const totalDistributed = distributions.reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
      success: true,
      count: distributions.length,
      totalDistributed,
      data: distributions,
    });
  } catch (error) {
    console.error('Error fetching distributions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch distributions',
      error: error.message,
    });
  }
};

// @desc    Get distributions for a specific beneficiary
// @route   GET /api/distributions/beneficiary/:id
// @access  Private/Admin
exports.getBeneficiaryDistributions = async (req, res) => {
  try {
    const distributions = await Transaction.find({
      type: 'distribution',
      beneficiary: req.params.id,
    })
      .sort({ createdAt: -1 })
      .populate('approvedBy', 'name email');

    // Calculate total received
    const totalReceived = distributions.reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
      success: true,
      count: distributions.length,
      totalReceived,
      data: distributions,
    });
  } catch (error) {
    console.error('Error fetching beneficiary distributions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch distributions',
      error: error.message,
    });
  }
};