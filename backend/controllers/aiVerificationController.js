const Application = require('../models/Application');
const {
  extractTextFromImage,
  extractAadhaarDetails,
  extractRationCardDetails,
  extractIncomeCertificateDetails,
  crossVerifyDocuments,
  calculateConfidenceScore,
} = require('../services/ocrService');

// @desc    Perform AI verification on application
// @route   POST /api/ai-verification/:applicationId
// @access  Private/Admin
exports.performAIVerification = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    console.log('Starting AI verification for application:', application._id);

    const extractedData = {};

    // Extract text from Aadhaar Card
    if (application.documents?.aadhaarCard?.url) {
      console.log('Processing Aadhaar Card...');
      const aadhaarText = await extractTextFromImage(
        application.documents.aadhaarCard.url
      );
      extractedData.aadhaarCard = extractAadhaarDetails(aadhaarText);
    }

    // Extract text from Ration Card
    if (application.documents?.rationCard?.url) {
      console.log('Processing Ration Card...');
      const rationText = await extractTextFromImage(
        application.documents.rationCard.url
      );
      extractedData.rationCard = extractRationCardDetails(rationText);
    }

    // Extract text from Income Certificate
    if (application.documents?.incomeCertificate?.url) {
      console.log('Processing Income Certificate...');
      const incomeText = await extractTextFromImage(
        application.documents.incomeCertificate.url
      );
      extractedData.incomeCertificate = extractIncomeCertificateDetails(incomeText);
    }

    // Cross-verify data
    const verificationResults = crossVerifyDocuments(extractedData, {
      fullName: application.fullName,
      phone: application.phone,
      address: application.address,
    });

    // Calculate confidence score
    const confidenceScore = calculateConfidenceScore(
      extractedData,
      verificationResults
    );

    // Update application with AI verification results
    application.aiVerification = {
      isVerified: true,
      verifiedAt: Date.now(),
      extractedData,
      verificationResults,
      confidenceScore,
    };

    await application.save();

    console.log('AI verification completed:', {
      confidenceScore,
      nameMatch: verificationResults.nameMatch,
      suspiciousFlags: verificationResults.suspiciousFlags,
    });

    res.status(200).json({
      success: true,
      message: 'AI verification completed',
      data: {
        extractedData,
        verificationResults,
        confidenceScore,
      },
    });
  } catch (error) {
    console.error('AI Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'AI verification failed',
      error: error.message,
    });
  }
};

// @desc    Get AI verification results
// @route   GET /api/ai-verification/:applicationId
// @access  Private/Admin
exports.getAIVerificationResults = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application.aiVerification,
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