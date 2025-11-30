// // Import User model
// const User = require('../models/User');

// // Import jsonwebtoken to create tokens
// const jwt = require('jsonwebtoken');

// // Import email utilities
// const sendEmail = require('../utils/sendEmail');
// const { 
//   regularDonorWelcomeEmail,
//   beneficiaryRegistrationEmail,
//   adminNewBeneficiaryEmail,
// } = require('../utils/emailTemplates');

// // Helper function: Generate JWT token
// const generateToken = (id) => {
//   return jwt.sign(
//     { id }, // Payload: what data to store in token (user ID)
//     process.env.JWT_SECRET, // Secret key (from .env)
//     { expiresIn: '30d' } // Token expires in 30 days
//   );
// };

// // @desc    Register a new user
// // @route   POST /api/auth/register
// // @access  Public (anyone can register)
// exports.register = async (req, res) => {
//   try {
//     // Get data from request body
//     const { name, email, password, role, phone, beneficiaryCategory } = req.body;

//     // Check if user already exists
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email',
//       });
//     }

//     // Create user in database
//     const user = await User.create({
//       name,
//       email,
//       password, // Will be automatically hashed by pre-save middleware
//       role,
//       phone,
//       beneficiaryCategory: role === 'beneficiary' ? beneficiaryCategory : null,
//       verificationStatus: role === 'beneficiary' ? 'pending' : null,
//     });

//     // Generate JWT token
//     const token = generateToken(user._id);

//     // Send response
//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         beneficiaryCategory: user.beneficiaryCategory,
//         verificationStatus: user.verificationStatus,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message,
//     });
//   }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate email and password provided
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password',
//       });
//     }

//     // Find user by email (include password field)
//     const user = await User.findOne({ email }).select('+password');

//     // Check if user exists
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials',
//       });
//     }

//     // Check if password matches
//     const isPasswordMatch = await user.matchPassword(password);

//     if (!isPasswordMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials',
//       });
//     }

//     // Check if account is active
//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: 'Account is deactivated. Please contact admin.',
//       });
//     }

//     // Generate token
//     const token = generateToken(user._id);

//     // Send response
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         beneficiaryCategory: user.beneficiaryCategory,
//         verificationStatus: user.verificationStatus,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message,
//     });
//   }
// };

// // @desc    Get current logged in user
// // @route   GET /api/auth/me
// // @access  Private (must be logged in)
// exports.getMe = async (req, res) => {
//   try {
//     // req.user is set by auth middleware (we'll create next)
//     const user = await User.findById(req.user.id);

//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//     });
//   }
// };


// backend/controllers/authController.js

// Import User model
const User = require('../models/User');

// Import jsonwebtoken to create tokens
const jwt = require('jsonwebtoken');

// Import email utilities
const sendEmail = require('../utils/sendEmail');
const { 
  regularDonorWelcomeEmail,
  beneficiaryRegistrationEmail,
  adminNewBeneficiaryEmail,
} = require('../utils/emailTemplates');

// Helper function: Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload: what data to store in token (user ID)
    process.env.JWT_SECRET, // Secret key (from .env)
    { expiresIn: '30d' } // Token expires in 30 days
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (anyone can register)
exports.register = async (req, res) => {
  try {
    // Get data from request body
    const { 
      name, 
      email, 
      password, 
      role, 
      phone, 
      beneficiaryCategory,
      // Regular donor specific fields
      isRegularDonor,
      monthlyAmount,
      donationDay,
      emailNotifications,
      smsNotifications,
      whatsappNotifications,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create base user object
    const userData = {
      name,
      email,
      password, // Will be automatically hashed by pre-save middleware
      role: role || 'donor',
      phone,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
      smsNotifications: smsNotifications !== undefined ? smsNotifications : false,
      whatsappNotifications: whatsappNotifications !== undefined ? whatsappNotifications : false,
    };

    // If beneficiary, add beneficiary-specific fields
    if (role === 'beneficiary') {
      userData.beneficiaryCategory = beneficiaryCategory;
      userData.verificationStatus = 'pending';
    }

    // If regular donor, add recurring donation details
    if (isRegularDonor) {
      userData.isRegularDonor = true;
      
      // Calculate next donation date
      const nextDate = new Date();
      const day = donationDay || '1';
      
      if (day === '30') {
        // Last day of next month
        nextDate.setMonth(nextDate.getMonth() + 2);
        nextDate.setDate(0);
      } else {
        // Specific day of next month
        nextDate.setMonth(nextDate.getMonth() + 1);
        nextDate.setDate(parseInt(day));
      }
      
      userData.recurringDonation = {
        active: true,
        amount: monthlyAmount || 500,
        donationDay: day,
        nextDonationDate: nextDate,
        consecutiveMonths: 0,
        lastDonationDate: null,
        emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
      };
    }

    // Create user in database
    const user = await User.create(userData);

    // ========== SEND EMAILS BASED ON USER TYPE ==========

    // 1. Send welcome email for REGULAR DONORS
    if (isRegularDonor && emailNotifications) {
      try {
        const emailTemplate = regularDonorWelcomeEmail(
          user.name,
          userData.recurringDonation.amount,
          userData.recurringDonation.donationDay
        );
        
        await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
        console.log(`✅ Regular donor welcome email sent to: ${user.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send regular donor welcome email:', emailError.message);
        // Don't fail registration if email fails
      }
    }

    // 2. Send registration confirmation for BENEFICIARIES
    if (role === 'beneficiary' && emailNotifications) {
      try {
        const emailTemplate = beneficiaryRegistrationEmail(user.name, user.email);
        await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
        console.log(`✅ Beneficiary registration email sent to: ${user.email}`);

        // Also notify admin about new beneficiary
        if (process.env.ADMIN_EMAIL) {
          const adminTemplate = adminNewBeneficiaryEmail(
            user.name,
            user.email,
            beneficiaryCategory
          );
          await sendEmail(process.env.ADMIN_EMAIL, adminTemplate.subject, adminTemplate.html);
          console.log(`✅ Admin notification sent for new beneficiary: ${user.email}`);
        }
      } catch (emailError) {
        console.error('❌ Failed to send beneficiary emails:', emailError.message);
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isRegularDonor: user.isRegularDonor,
        beneficiaryCategory: user.beneficiaryCategory,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email (include password field)
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Build user response object
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      beneficiaryCategory: user.beneficiaryCategory,
      verificationStatus: user.verificationStatus,
      isRegularDonor: user.isRegularDonor,
    };

    // Add recurring donation info if regular donor
    if (user.isRegularDonor && user.recurringDonation) {
      userResponse.recurringDonation = {
        active: user.recurringDonation.active,
        amount: user.recurringDonation.amount,
        donationDay: user.recurringDonation.donationDay,
        nextDonationDate: user.recurringDonation.nextDonationDate,
        consecutiveMonths: user.recurringDonation.consecutiveMonths,
      };
    }

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private (must be logged in)
exports.getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('❌ GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};