


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');
const {
  beneficiaryRegistrationEmail,
  adminNewBeneficiaryEmail,
} = require('../utils/emailTemplates');

// ==========================================
// REGISTER - With Email Notifications
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      password, 
      role,
      isRegularDonor,
      monthlyAmount,
      donationDay,
      emailNotifications,
      smsNotifications,
      whatsappNotifications,
      beneficiaryCategory,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    const userData = { name, email, phone, password, role };

    // Handle Regular Donor Registration
    if (role === 'donor' && (isRegularDonor === 'true' || isRegularDonor === true)) {
      userData.isRegularDonor = true;
      userData.recurringDonation = {
        active: true,
        amount: parseFloat(monthlyAmount),
        frequency: 'monthly',
        donationDay: parseInt(donationDay),
        emailNotifications: emailNotifications === 'true' || emailNotifications === true,
        smsNotifications: smsNotifications === 'true' || smsNotifications === true,
        whatsappNotifications: whatsappNotifications === 'true' || whatsappNotifications === true,
        consecutiveMonths: 0,
        startDate: new Date(),
        nextDonationDate: calculateNextDonationDate(parseInt(donationDay)),
      };
    }

    // Handle Beneficiary Registration
    if (role === 'beneficiary') {
      userData.beneficiaryCategory = beneficiaryCategory;
      userData.verificationStatus = 'not_submitted';
    }

    const user = await User.create(userData);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // ✅ SEND EMAIL NOTIFICATIONS FOR BENEFICIARY
    if (role === 'beneficiary') {
      // Send email to beneficiary
      const beneficiaryEmail = beneficiaryRegistrationEmail(name, email);
      sendEmail(email, beneficiaryEmail.subject, beneficiaryEmail.html);

      // Send email to admin
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      const adminNotification = adminNewBeneficiaryEmail(name, email, beneficiaryCategory);
      sendEmail(adminEmail, adminNotification.subject, adminNotification.html);

      console.log(`📧 Beneficiary registration emails sent for ${email}`);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isRegularDonor: user.isRegularDonor,
        beneficiaryCategory: user.beneficiaryCategory,
        verificationStatus: user.verificationStatus,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});
// ==========================================
// REGISTER - Simple registration (NO file uploads here)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      password, 
      role,
      // Regular Donor specific fields
      isRegularDonor,
      monthlyAmount,
      donationDay,
      emailNotifications,
      smsNotifications,
      whatsappNotifications,
      // Beneficiary specific field
      beneficiaryCategory,
    } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Build user data
    const userData = {
      name,
      email,
      phone,
      password, // Will be hashed by pre-save hook
      role,
    };

    // ✅ Handle Regular Donor Registration
    if (role === 'donor' && isRegularDonor === 'true' || isRegularDonor === true) {
      userData.isRegularDonor = true;
      userData.recurringDonation = {
        active: true,
        amount: parseFloat(monthlyAmount),
        frequency: 'monthly',
        donationDay: parseInt(donationDay),
        emailNotifications: emailNotifications === 'true' || emailNotifications === true,
        smsNotifications: smsNotifications === 'true' || smsNotifications === true,
        whatsappNotifications: whatsappNotifications === 'true' || whatsappNotifications === true,
        consecutiveMonths: 0,
        startDate: new Date(),
        nextDonationDate: calculateNextDonationDate(parseInt(donationDay)),
      };
    }

    // ✅ Handle Beneficiary Registration (basic info only)
    if (role === 'beneficiary') {
      userData.beneficiaryCategory = beneficiaryCategory;
      userData.verificationStatus = 'not_submitted'; // They haven't submitted application yet
    }

    // Create user
    const user = await User.create(userData);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isRegularDonor: user.isRegularDonor,
        beneficiaryCategory: user.beneficiaryCategory,
        verificationStatus: user.verificationStatus,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// ==========================================
// LOGIN - Fixed login logic
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // ✅ Check verification status for beneficiaries
    if (user.role === 'beneficiary') {
      if (user.verificationStatus === 'rejected') {
        return res.status(403).json({ 
          success: false,
          message: 'Your application has been rejected. Please contact admin.' 
        });
      }
      // Allow login even if status is 'not_submitted' or 'pending'
      // They need to login to submit/view application
    }

    // Compare password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isRegularDonor: user.isRegularDonor,
        totalDonated: user.totalDonated,
        beneficiaryCategory: user.beneficiaryCategory,
        verificationStatus: user.verificationStatus,
        recurringDonation: user.recurringDonation
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message 
    });
  }
});

// ==========================================
// GET ME - Get current user
// ==========================================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isRegularDonor: user.isRegularDonor,
        totalDonated: user.totalDonated,
        beneficiaryCategory: user.beneficiaryCategory,
        verificationStatus: user.verificationStatus,
        recurringDonation: user.recurringDonation, 
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Could not fetch user data',
      error: error.message 
    });
  }
});

// Helper function to calculate next donation date
function calculateNextDonationDate(donationDay) {
  const now = new Date();
  const nextDate = new Date(now.getFullYear(), now.getMonth(), donationDay);
  
  // If the donation day has passed this month, set to next month
  if (nextDate < now) {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate;
}

module.exports = router;