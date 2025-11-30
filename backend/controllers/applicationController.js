const Application = require('../models/Application');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');
const sendEmail = require('../utils/sendEmail');
const {
  applicationSubmittedEmail,
  applicationApprovedEmail,
  applicationRejectedEmail,
} = require('../utils/emailTemplates');
const {
  sendApplicationApprovedSMS,
  sendApplicationRejectedSMS,
} = require('../services/smsService');

// @desc    Submit new application with documents
// @route   POST /api/applications
// @access  Private/Beneficiary
exports.submitApplication = async (req, res) => {
  try {
    // ✅ UPDATED: Extract bank details from request body
    const { 
      category, 
      fullName, 
      phone, 
      address,
      accountNumber,
      accountHolderName,
      ifscCode,
      bankName
    } = req.body;

    // Check if user already has a pending/approved application
    const existingApplication = await Application.findOne({
      beneficiary: req.user.id,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active application',
      });
    }

    // Get uploaded files from request
    const files = req.files;

    // Build documents object
    const documents = {};

    if (files.aadhaarCard) {
      documents.aadhaarCard = {
        url: files.aadhaarCard[0].path,
        publicId: files.aadhaarCard[0].filename,
      };
    }

    if (files.rationCard) {
      documents.rationCard = {
        url: files.rationCard[0].path,
        publicId: files.rationCard[0].filename,
      };
    }

    if (files.incomeCertificate) {
      documents.incomeCertificate = {
        url: files.incomeCertificate[0].path,
        publicId: files.incomeCertificate[0].filename,
      };
    }

    if (files.medicalCertificate) {
      documents.medicalCertificate = {
        url: files.medicalCertificate[0].path,
        publicId: files.medicalCertificate[0].filename,
      };
    }

    // ✅ NEW: Create application with bank details
    const application = await Application.create({
      beneficiary: req.user.id,
      category,
      fullName,
      phone,
      address,
      bankDetails: {
        accountNumber,
        accountHolderName,
        ifscCode,
        bankName,
      },
      documents,
      status: 'pending',
    });

    
    // Update user's verification status
    await User.findByIdAndUpdate(req.user.id, {
      verificationStatus: 'pending',
    });

        // ✅ SEND EMAIL NOTIFICATION
    const user = await User.findById(req.user.id);
    const emailTemplate = applicationSubmittedEmail(user.name);
    sendEmail(user.email, emailTemplate.subject, emailTemplate.html);

    console.log(`📧 Application submitted email sent to ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message,
    });
  }
};

// @desc    Get my application
// @route   GET /api/applications/my-application
// @access  Private/Beneficiary
exports.getMyApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      beneficiary: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;

    // Build filter
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate('beneficiary', 'name email phone')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single application (Admin)
// @route   GET /api/applications/:id
// @access  Private/Admin
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('beneficiary', 'name email phone')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Approve application (Admin)
// @route   PUT /api/applications/:id/approve
// @access  Private/Admin
exports.approveApplication = async (req, res) => {
  try {
    const { comments } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Update application
    application.status = 'approved';
    application.reviewedBy = req.user.id;
    application.reviewDate = Date.now();
    application.reviewComments = comments;

    await application.save();

    
    // Update user's verification status
    const user = await User.findByIdAndUpdate(
      application.beneficiary,
      {
        verificationStatus: 'approved',
      },
      { new: true }
    );
   // ✅ SEND EMAIL NOTIFICATION
    if (user && user.email) {
      const emailTemplate = applicationApprovedEmail(
        user.name,
        user.beneficiaryCategory
      );
      sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
      console.log(`📧 Approval email sent to ${user.email}`);
    }
    // Send SMS notification
    if (user && user.phone) {
      await sendApplicationApprovedSMS(user);
    }

    res.status(200).json({
      success: true,
      message: 'Application approved successfully',
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Reject application (Admin)
// @route   PUT /api/applications/:id/reject
// @access  Private/Admin
exports.rejectApplication = async (req, res) => {
  try {
    const { reason, comments } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Update application
    application.status = 'rejected';
    application.reviewedBy = req.user.id;
    application.reviewDate = Date.now();
    application.rejectionReason = reason;
    application.reviewComments = comments;

    await application.save();

    // Update user's verification status
    const user = await User.findByIdAndUpdate(
      application.beneficiary,
      {
        verificationStatus: 'rejected',
      },
      { new: true }
    );

        // ✅ SEND EMAIL NOTIFICATION
    if (user && user.email) {
      const emailTemplate = applicationRejectedEmail(user.name, reason);
      sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
      console.log(`📧 Rejection email sent to ${user.email}`);
    }
    // Send SMS notification
    if (user && user.phone) {
      await sendApplicationRejectedSMS(user, reason);
    }

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};