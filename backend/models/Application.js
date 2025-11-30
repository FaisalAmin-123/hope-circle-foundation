const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    // Beneficiary who submitted
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Beneficiary category
    category: {
      type: String,
      enum: ['poor', 'orphan', 'physically_challenged'],
      required: true,
    },

    // Personal details
    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    // ✅ NEW: Bank Account Details
    bankDetails: {
      accountNumber: {
        type: String,
        required: true,
      },
      accountHolderName: {
        type: String,
        required: true,
      },
      ifscCode: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
    },

    // Documents uploaded
    documents: {
      aadhaarCard: {
        url: String,
        publicId: String, // Cloudinary public ID for deletion
      },
      rationCard: {
        url: String,
        publicId: String,
      },
      incomeCertificate: {
        url: String,
        publicId: String,
      },
      medicalCertificate: {
        url: String,
        publicId: String,
      },
      otherDocuments: [
        {
          name: String,
          url: String,
          publicId: String,
        },
      ],
    },

    // Application status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // Admin review
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    reviewDate: {
      type: Date,
    },

    reviewComments: {
      type: String,
    },

    // Rejection reason (if rejected)
    rejectionReason: {
      type: String,
    },
    
    // AI Verification fields
    aiVerification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: {
        type: Date,
      },
      extractedData: {
        aadhaarCard: {
          name: String,
          aadhaarNumber: String,
          dob: String,
          address: String,
          rawText: String,
        },
        rationCard: {
          name: String,
          cardNumber: String,
          rawText: String,
        },
        incomeCertificate: {
          name: String,
          income: String,
          rawText: String,
        },
      },
      verificationResults: {
        nameMatch: {
          type: Boolean,
          default: null,
        },
        documentsConsistent: {
          type: Boolean,
          default: null,
        },
        suspiciousFlags: [String],
      },
      confidenceScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);