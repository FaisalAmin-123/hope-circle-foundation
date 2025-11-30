const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ✅ MONTHLY REMINDER - Runs daily at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Running monthly donation reminder cron...');
  
  try {
    const today = new Date().getDate();
    
    // Find regular donors whose donation day is today
    const donors = await User.find({
      role: 'donor',
      isRegularDonor: true,
      'recurringDonation.active': true,
      'recurringDonation.donationDay': today,
    });

    console.log(`Found ${donors.length} donors to remind today (Day ${today})`);

    for (const donor of donors) {
      // Check if donated this month
      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);

      const donated = await Transaction.findOne({
        donor: donor._id,
        type: 'donation',
        createdAt: { $gte: thisMonthStart },
      });

      if (!donated && donor.recurringDonation.emailNotifications) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: donor.email,
          subject: '💚 Monthly Donation Reminder - Hope Circle',
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #f97316 0%, #eab308 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
                  <h1>💚 Monthly Donation Reminder</h1>
                  <p style="font-size: 18px;">Hope Circle Foundation</p>
                </div>
                
                <div style="background: #f9fafb; padding: 30px; margin-top: 20px; border-radius: 10px;">
                  <h2>Hi ${donor.name}! 👋</h2>
                  <p>Your monthly donation of <strong style="color: #10b981; font-size: 24px;">₹${donor.recurringDonation.amount}</strong> is due today.</p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #f97316;">Your Impact So Far:</h3>
                    <ul style="list-style: none; padding: 0;">
                      <li style="padding: 8px 0;">✅ <strong>${donor.recurringDonation.consecutiveMonths || 0}</strong> consecutive months</li>
                      <li style="padding: 8px 0;">✅ Total donated: <strong>₹${donor.totalDonated || 0}</strong></li>
                      <li style="padding: 8px 0;">🔥 Keep your streak going!</li>
                    </ul>
                  </div>
                  
                  <p style="font-size: 16px; color: #666;">Your consistent support helps families in need every single month.</p>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                       style="background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                      Donate Now
                    </a>
                  </div>
                  
                  <p style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
                    If you've already donated, please ignore this reminder. Thank you! 💙
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
                  <p>Hope Circle Foundation - Building Trust Through Transparency</p>
                  <p>Srinagar, Jammu & Kashmir</p>
                </div>
              </div>
            </body>
            </html>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`✅ Reminder sent to ${donor.email}`);
        } catch (emailError) {
          console.error(`❌ Failed to send email to ${donor.email}:`, emailError.message);
        }
      } else if (donated) {
        console.log(`✓ ${donor.email} already donated this month`);
      }
    }
  } catch (error) {
    console.error('❌ Cron job error:', error);
  }
});

// ✅ GENTLE REMINDER - Runs daily at 10:00 AM (3 days after due date)
cron.schedule('0 10 * * *', async () => {
  console.log('🔔 Running gentle reminder cron...');
  
  try {
    const today = new Date().getDate();
    const threeDaysAgo = today - 3;
    
    if (threeDaysAgo <= 0) return; // Skip if invalid day
    
    const donors = await User.find({
      role: 'donor',
      isRegularDonor: true,
      'recurringDonation.active': true,
      'recurringDonation.donationDay': threeDaysAgo,
    });

    console.log(`Found ${donors.length} donors for gentle reminder`);

    for (const donor of donors) {
      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);

      const donated = await Transaction.findOne({
        donor: donor._id,
        type: 'donation',
        createdAt: { $gte: thisMonthStart },
      });

      if (!donated && donor.recurringDonation.emailNotifications) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: donor.email,
          subject: 'We miss you! 💙 - Hope Circle Foundation',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #3b82f6;">Hi ${donor.name},</h2>
              <p style="font-size: 16px; color: #333;">We noticed you haven't made this month's donation yet. No worries! Life gets busy. 😊</p>
              
              <p style="font-size: 18px; color: #333;">Your contribution of <strong style="color: #10b981;">₹${donor.recurringDonation.amount}</strong> makes a real difference to families in need.</p>
              
              <p style="font-size: 16px; color: #666;">Your current streak: <strong>${donor.recurringDonation.consecutiveMonths || 0} months</strong> 🔥</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                   style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Donate Now
                </a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
                No pressure - donate when you're ready! We appreciate your support. 💚
              </p>
            </div>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`✅ Gentle reminder sent to ${donor.email}`);
        } catch (emailError) {
          console.error(`❌ Failed to send gentle reminder to ${donor.email}:`, emailError.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ Gentle reminder cron error:', error);
  }
});

// ✅ STREAK RESET - Runs at 11:59 PM daily
cron.schedule('59 23 * * *', async () => {
  console.log('🔄 Checking for missed donations (streak reset)...');
  
  try {
    const today = new Date().getDate();
    
    const donors = await User.find({
      role: 'donor',
      isRegularDonor: true,
      'recurringDonation.active': true,
      'recurringDonation.donationDay': today,
    });

    for (const donor of donors) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const donation = await Transaction.findOne({
        donor: donor._id,
        type: 'donation',
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });

      if (!donation && donor.recurringDonation.consecutiveMonths > 0) {
        console.log(`⚠️ Resetting streak for ${donor.email} - missed donation`);
        donor.recurringDonation.consecutiveMonths = 0;
        await donor.save();
      }
    }
  } catch (error) {
    console.error('❌ Streak reset error:', error);
  }
});

console.log('✅ Monthly reminder cron jobs initialized!');
console.log('📅 Schedule:');
console.log('  - 9:00 AM: Monthly reminders');
console.log('  - 10:00 AM: Gentle reminders (3 days late)');
console.log('  - 11:59 PM: Streak reset check');

module.exports = { transporter };