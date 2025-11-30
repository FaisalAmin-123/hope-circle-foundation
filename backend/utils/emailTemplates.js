// Beneficiary Registration Confirmation
const beneficiaryRegistrationEmail = (name, email) => {
  return {
    subject: '✅ Application Received - Hope Circle Foundation',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { background: #f9fafb; padding: 30px; margin-top: 20px; border-radius: 10px; }
          .button { background: #10b981; color: white; padding: 15px 30px; 
                   text-decoration: none; border-radius: 8px; display: inline-block; 
                   font-weight: bold; margin-top: 20px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; 
                     border-left: 4px solid #3b82f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Application Received!</h1>
            <p style="font-size: 18px; opacity: 0.9;">Hope Circle Foundation</p>
          </div>
          
          <div class="content">
            <h2>Hi ${name}! 👋</h2>
            <p style="font-size: 16px;">Thank you for registering with Hope Circle Foundation.</p>
            
            <div class="info-box">
              <h3 style="color: #3b82f6; margin-top: 0;">What Happens Next?</h3>
              <ol style="padding-left: 20px; line-height: 1.8;">
                <li>Login to your account</li>
                <li>Submit your complete application with documents</li>
                <li>Upload Aadhaar Card, Ration Card & bank details</li>
                <li>Our team will review within 48-72 hours</li>
                <li>You'll receive email notification on approval/rejection</li>
              </ol>
            </div>
            
            <p style="font-size: 16px; color: #666;">
              <strong>Registered Email:</strong> ${email}<br>
              <strong>Category:</strong> As selected during registration
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
                Login to Dashboard
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
              If you have questions, contact us at support@hopecircle.org
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
};

// Admin Notification - New Beneficiary Registration
const adminNewBeneficiaryEmail = (beneficiaryName, beneficiaryEmail, category) => {
  return {
    subject: '🆕 New Beneficiary Registered - Hope Circle',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #eab308 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1>🆕 New Beneficiary Registration</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; margin-top: 20px; border-radius: 10px;">
            <h2>New Registration Details:</h2>
            
            <table style="width: 100%; background: white; padding: 20px; border-radius: 8px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${beneficiaryName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${beneficiaryEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Category:</strong></td>
                <td style="padding: 10px;">${category.replace('_', ' ').toUpperCase()}</td>
              </tr>
            </table>
            
            <p style="margin-top: 20px; background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              ⚠️ <strong>Action Required:</strong> User needs to login and submit documents before final review.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/applications" 
                 style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                View Applications
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// Application Submitted Notification (when documents uploaded)
const applicationSubmittedEmail = (name) => {
  return {
    subject: '📤 Application Submitted for Review - Hope Circle',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1>📤 Application Submitted!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; margin-top: 20px; border-radius: 10px;">
            <h2>Hi ${name}!</h2>
            <p style="font-size: 16px;">Your complete application with documents has been submitted successfully.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #3b82f6; margin-top: 0;">Review Process:</h3>
              <ul style="padding-left: 20px; line-height: 1.8;">
                <li>✅ Documents uploaded successfully</li>
                <li>🔍 Admin review: 48-72 hours</li>
                <li>📧 Email notification on decision</li>
                <li>📱 Track status in your dashboard</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-application" 
                 style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Track Application
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// Application Approved
const applicationApprovedEmail = (name, category) => {
  return {
    subject: '✅ Application Approved! - Hope Circle Foundation',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="font-size: 36px; margin: 0;">🎉 Congratulations!</h1>
            <p style="font-size: 22px; margin-top: 10px;">Your Application Has Been Approved</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; margin-top: 20px; border-radius: 10px;">
            <h2>Hi ${name}!</h2>
            <p style="font-size: 18px; color: #059669;">
              <strong>Great news!</strong> Your application for assistance has been approved by our admin team.
            </p>
            
            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">✅ Approval Confirmed</h3>
              <p style="color: #065f46; margin: 5px 0;"><strong>Category:</strong> ${category.replace('_', ' ').toUpperCase()}</p>
              <p style="color: #065f46; margin: 5px 0;"><strong>Status:</strong> APPROVED</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #10b981; margin-top: 0;">What's Next?</h3>
              <ol style="padding-left: 20px; line-height: 1.8; color: #374151;">
                <li>You're now eligible to receive aid when funds are distributed</li>
                <li>Admin will contact you when distribution happens</li>
                <li>Funds will be transferred to your registered bank account</li>
                <li>Track your status in the dashboard</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-application" 
                 style="background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                View Application
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280; text-align: center;">
              Thank you for your patience. We're here to support you! 💚
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// Application Rejected
const applicationRejectedEmail = (name, reason) => {
  return {
    subject: '❌ Application Update - Hope Circle Foundation',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1>Application Update</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; margin-top: 20px; border-radius: 10px;">
            <h2>Hi ${name},</h2>
            <p style="font-size: 16px;">
              Thank you for your application to Hope Circle Foundation. After careful review, we regret to inform you that your application could not be approved at this time.
            </p>
            
            ${reason ? `
              <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <h3 style="color: #dc2626; margin-top: 0;">Reason for Rejection:</h3>
                <p style="color: #991b1b; line-height: 1.6;">${reason}</p>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">What You Can Do:</h3>
              <ul style="padding-left: 20px; line-height: 1.8; color: #6b7280;">
                <li>Contact us for more details: <strong>support@hopecircle.org</strong></li>
                <li>Address the concerns mentioned and reapply</li>
                <li>Provide additional documents if needed</li>
                <li>Explore other assistance programs in your area</li>
              </ul>
            </div>
            
            <p style="background: #fef3c7; padding: 15px; border-radius: 8px; text-align: center; color: #92400e;">
              We appreciate your understanding and wish you the best. If you believe this decision was made in error, please contact our support team.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// 1. Welcome Email - Regular Donor Registration
const regularDonorWelcomeEmail = (name, monthlyAmount, donationDay) => {
  const getDayLabel = (day) => {
    if (day === '30') return 'Last day';
    if (day === '1') return '1st';
    if (day === '15') return '15th';
    return `${day}th`;
  };

  const getNextDate = (day) => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    if (day === '30') {
      next.setMonth(next.getMonth() + 1);
      next.setDate(0);
    } else {
      next.setDate(parseInt(day));
    }
    return next.toLocaleDateString('en-IN', { dateStyle: 'long' });
  };

  const getImpactMessage = (amount) => {
    if (amount >= 5000) {
      return '<li>🏠 Provide shelter for 2 families for a month</li><li>📚 Fund education for 10 children</li><li>🍲 Serve 300+ meals</li>';
    } else if (amount >= 2000) {
      return '<li>📚 Fund education for 4 children</li><li>🍲 Serve 120+ meals</li><li>💊 Provide medical aid to 5 families</li>';
    } else if (amount >= 1000) {
      return '<li>🍲 Serve 60+ nutritious meals</li><li>📚 Support 2 children\'s education</li><li>💊 Help 2 families with medical needs</li>';
    } else {
      return '<li>🍲 Serve 30+ meals to hungry children</li><li>📚 Provide school supplies to 1 child</li><li>💧 Ensure clean water for families</li>';
    }
  };

  return {
    subject: '🎉 Welcome to Hope Circle Foundation - Monthly Donor Family!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; 
          }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .highlight-box { 
            background: white; padding: 20px; border-radius: 8px; 
            margin: 20px 0; border-left: 4px solid #667eea; 
          }
          .footer { 
            background: #374151; color: white; padding: 20px; 
            text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; 
          }
          .btn { 
            display: inline-block; padding: 15px 30px; background: #667eea; 
            color: white; text-decoration: none; border-radius: 8px; 
            font-weight: bold; margin: 20px 0; 
          }
          .amount-box {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white; padding: 20px; border-radius: 10px;
            text-align: center; margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">🤝 Welcome to Our Family!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">
              Thank You for Becoming a Monthly Donor
            </p>
          </div>
          
          <div class="content">
            <h2 style="color: #667eea;">Dear ${name},</h2>
            
            <p style="font-size: 16px;">
              Welcome to <strong>Hope Circle Foundation</strong>! 🎊
            </p>
            
            <p style="font-size: 16px; color: #6b7280;">
              Your decision to become a monthly donor is truly inspiring. With your 
              consistent support, we can create lasting change in the lives of those 
              who need it most.
            </p>
            
            <div class="amount-box">
              <h3 style="margin: 0 0 10px 0; font-size: 18px;">Your Monthly Impact</h3>
              <div style="font-size: 48px; font-weight: bold; margin: 10px 0;">
                ₹${monthlyAmount}
              </div>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">
                Every ${getDayLabel(donationDay)} of the month
              </p>
            </div>
            
            <div class="highlight-box">
              <h3 style="color: #667eea; margin-top: 0;">📋 Your Donation Details:</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Monthly Amount:</strong></td>
                  <td style="padding: 8px 0;">₹${monthlyAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Donation Day:</strong></td>
                  <td style="padding: 8px 0;">${getDayLabel(donationDay)} of every month</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Next Donation:</strong></td>
                  <td style="padding: 8px 0;">${getNextDate(donationDay)}</td>
                </tr>
              </table>
            </div>
            
            <h3 style="color: #374151;">💡 What Your ₹${monthlyAmount}/month Can Do:</h3>
            <ul style="line-height: 1.8; color: #6b7280;">
              ${getImpactMessage(monthlyAmount)}
            </ul>
            
            <h3 style="color: #374151;">🎁 Monthly Donor Benefits:</h3>
            <ul style="line-height: 1.8; color: #6b7280;">
              <li>✅ Exclusive monthly impact reports</li>
              <li>✅ Recognition badges and certificates</li>
              <li>✅ Priority invitations to events</li>
              <li>✅ Tax benefits under Section 80G</li>
              <li>✅ Personal dashboard to track your impact</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/donor-dashboard" 
                 class="btn">
                View Your Dashboard
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
              <p style="margin: 0; color: #78350f;">
                <strong>📅 Important:</strong> You'll receive a payment reminder on your 
                donation day. You can manage your preferences anytime from your dashboard.
              </p>
            </div>
            
            <p style="margin-top: 30px; font-size: 16px;">
              Thank you for being part of our mission to create a better tomorrow! 🌟
            </p>
            
            <p style="font-size: 16px; color: #6b7280;">
              With gratitude,<br>
              <strong style="color: #374151;">Hope Circle Foundation Team</strong>
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 5px 0;">Hope Circle Foundation | Transforming Lives Together</p>
            <p style="margin: 5px 0;">Srinagar, Jammu & Kashmir</p>
            <p style="margin: 15px 0 5px 0;">
              Questions? Contact us at support@hopecircle.org
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// 2. Payment Success Email
const donationSuccessEmail = (name, amount, transactionId, streak) => {
  const getMonthlyImpact = (amt) => {
    if (amt >= 5000) {
      return `Your ₹${amt} donation this month has helped provide comprehensive support including shelter, education, and meals to multiple families in need. Your generosity is transforming entire communities!`;
    } else if (amt >= 2000) {
      return `Your ₹${amt} contribution has enabled us to provide education support and essential meals to children who need it most. You're building a brighter future!`;
    } else if (amt >= 1000) {
      return `Your ₹${amt} donation has directly fed dozens of hungry children and supported their educational needs. Every rupee makes a real difference!`;
    } else {
      return `Your ₹${amt} monthly gift has provided meals and basic necessities to children in need. Small consistent gifts create big lasting change!`;
    }
  };

  return {
    subject: '✅ Thank You! Your Donation Has Been Received',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; 
          }
          .success-icon { font-size: 60px; margin-bottom: 10px; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .receipt-box { 
            background: white; border: 2px solid #10b981; padding: 20px; 
            margin: 20px 0; border-radius: 8px; 
          }
          .amount { 
            font-size: 48px; color: #10b981; font-weight: bold; 
            text-align: center; margin: 20px 0; 
          }
          .streak-badge { 
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
            color: white; padding: 20px; border-radius: 10px; 
            text-align: center; margin: 20px 0; 
          }
          .footer { 
            background: #374151; color: white; padding: 20px; 
            text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; 
          }
          .btn { 
            display: inline-block; padding: 12px 25px; 
            color: white; text-decoration: none; border-radius: 8px; 
            font-weight: bold; margin: 5px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1 style="margin: 0; font-size: 32px;">Payment Successful!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">
              Your Generous Contribution Has Been Received
            </p>
          </div>
          
          <div class="content">
            <h2 style="color: #10b981;">Dear ${name},</h2>
            
            <p style="font-size: 16px;">
              Thank you for your continued support! Your donation has been successfully processed.
            </p>
            
            <div class="amount">₹${amount}</div>
            
            <div class="receipt-box">
              <h3 style="margin-top: 0; color: #374151;">📄 Payment Receipt</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Transaction ID:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Date & Time:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Amount:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">₹${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>Payment Method:</strong></td>
                  <td style="padding: 10px;">Razorpay</td>
                </tr>
              </table>
            </div>
            
            ${streak > 0 ? `
            <div class="streak-badge">
              <h3 style="margin: 0 0 10px 0; font-size: 24px;">
                🔥 Donation Streak: ${streak} Month${streak > 1 ? 's' : ''}!
              </h3>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">
                You're making consistent impact. Keep it up!
              </p>
            </div>
            ` : ''}
            
            <h3 style="color: #374151;">💚 Your Impact This Month:</h3>
            <p style="font-size: 16px; color: #6b7280; line-height: 1.8;">
              ${getMonthlyImpact(amount)}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/donor-dashboard/donations" 
                 class="btn" style="background: #10b981;">
                View All Donations
              </a>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/donations/${transactionId}/receipt" 
                 class="btn" style="background: #667eea;">
                Download Receipt
              </a>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-top: 20px;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>💼 Tax Benefit:</strong> This donation is eligible for 50% tax 
                deduction under Section 80G of the Income Tax Act.
              </p>
            </div>
            
            <p style="margin-top: 30px; font-size: 16px; color: #6b7280;">
              With heartfelt gratitude,<br>
              <strong style="color: #374151;">Hope Circle Foundation Team</strong>
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 5px 0;">Hope Circle Foundation | Transforming Lives Together</p>
            <p style="margin: 5px 0;">Need help? Contact us at support@hopecircle.org</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};


module.exports = {
  beneficiaryRegistrationEmail,
  adminNewBeneficiaryEmail,
  applicationSubmittedEmail,
  applicationApprovedEmail,
  applicationRejectedEmail,
  regularDonorWelcomeEmail,
  donationSuccessEmail,
};