const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Get all regular donors with stats
router.get('/regular-donors', protect, authorize('admin'), async (req, res) => {
  try {
    const donors = await User.find({
      role: 'donor',
      isRegularDonor: true,
    }).select('-password').sort({ createdAt: -1 });

    // Calculate stats
    const totalRegularDonors = donors.length;
    const activeDonors = donors.filter(d => d.recurringDonation?.active).length;
    const totalMonthlyCommitment = donors
      .filter(d => d.recurringDonation?.active)
      .reduce((sum, d) => sum + (d.recurringDonation?.amount || 0), 0);
    
    const avgStreak = donors.reduce((sum, d) => 
      sum + (d.recurringDonation?.consecutiveMonths || 0), 0) / (donors.length || 1);

    res.json({
      success: true,
      donors,
      stats: {
        totalRegularDonors,
        activeDonors,
        totalMonthlyCommitment,
        avgStreak,
      },
    });
  } catch (error) {
    console.error('Error fetching regular donors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donors' });
  }
});

// Toggle donor active status
router.put('/regular-donors/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);
    
    if (!donor || !donor.isRegularDonor) {
      return res.status(404).json({ success: false, message: 'Regular donor not found' });
    }

    donor.recurringDonation.active = !donor.recurringDonation.active;
    await donor.save();

    res.json({
      success: true,
      message: `Donor ${donor.recurringDonation.active ? 'activated' : 'deactivated'} successfully`,
      donor,
    });
  } catch (error) {
    console.error('Error toggling donor status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Send manual reminder to donor
router.post('/regular-donors/:id/send-reminder', protect, authorize('admin'), async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);
    
    if (!donor || !donor.isRegularDonor) {
      return res.status(404).json({ success: false, message: 'Regular donor not found' });
    }

    if (!donor.recurringDonation.emailNotifications) {
      return res.status(400).json({ 
        success: false, 
        message: 'Donor has disabled email notifications' 
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donor.email,
      subject: '💚 Donation Reminder - Hope Circle Foundation',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #eab308 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { background: #f9fafb; padding: 30px; margin-top: 20px; border-radius: 10px; }
            .button { background: #10b981; color: white; padding: 15px 30px; 
                     text-decoration: none; border-radius: 8px; display: inline-block; 
                     font-weight: bold; margin-top: 20px; }
            .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💚 Monthly Donation Reminder</h1>
              <p>Hope Circle Foundation</p>
            </div>
            
            <div class="content">
              <h2>Hi ${donor.name}! 👋</h2>
              <p>This is a friendly reminder about your monthly contribution of <strong>₹${donor.recurringDonation.amount}</strong> to Hope Circle Foundation.</p>
              
              <div class="stats">
                <h3>Your Amazing Impact:</h3>
                <ul>
                  <li>✅ ${donor.recurringDonation.consecutiveMonths || 0} consecutive months</li>
                  <li>✅ Total donated: ₹${donor.totalDonated || 0}</li>
                  <li>🔥 Keep your streak going!</li>
                </ul>
              </div>
              
              <p>Your consistent support changes lives every month. Thank you for being part of our mission!</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
                Donate Now
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Reminder sent successfully',
    });
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ success: false, message: 'Failed to send reminder' });
  }
});

module.exports = router;