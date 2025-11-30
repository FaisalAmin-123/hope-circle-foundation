const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send SMS
const sendSMS = async (to, message) => {
  try {
    // Format phone number (add +91 for India if not present)
    let formattedNumber = to;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = `+91${formattedNumber}`;
    }

    console.log(`Sending SMS to ${formattedNumber}: ${message}`);

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

    console.log(`SMS sent successfully. SID: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
};

// SMS Templates

// Application approved
const sendApplicationApprovedSMS = async (beneficiary) => {
  const message = `Dear ${beneficiary.name},

Congratulations! Your application to Hope Circle Foundation has been APPROVED.

You are now eligible for assistance. Our team will contact you soon.

- Hope Circle Foundation Team`;

  return await sendSMS(beneficiary.phone, message);
};

// Application rejected
const sendApplicationRejectedSMS = async (beneficiary, reason) => {
  const message = `Dear ${beneficiary.name},

Your application to Hope Circle Foundation has been reviewed.

Status: Not Approved
Reason: ${reason}

You may reapply with additional documents if needed.

- Hope Circle Foundation Team`;

  return await sendSMS(beneficiary.phone, message);
};

// ✅ UPDATED: Aid distributed - with transaction reference
const sendAidDistributedSMS = async (beneficiary, amount, transactionReference, accountNumber) => {
  // Mask account number (show last 4 digits only)
  const maskedAccount = accountNumber 
    ? `***${accountNumber.slice(-4)}` 
    : '****';

  const message = `Dear ${beneficiary.name},

Financial assistance of Rs.${amount.toLocaleString()} has been transferred to your account ${maskedAccount}.

Transaction Ref: ${transactionReference}

Please check your bank account. This may take 1-2 business days to reflect.

- Hope Circle Foundation Team`;

  return await sendSMS(beneficiary.phone, message);
};

// Donation received (to donor)
const sendDonationReceivedSMS = async (donor, amount) => {
  const message = `Dear ${donor.name},

Thank you for your generous donation of Rs.${amount.toLocaleString()} to Hope Circle Foundation!

Your contribution will help those in need. Receipt has been sent to your email.

- Hope Circle Foundation Team`;

  return await sendSMS(donor.phone, message);
};

module.exports = {
  sendSMS,
  sendApplicationApprovedSMS,
  sendApplicationRejectedSMS,
  sendAidDistributedSMS,
  sendDonationReceivedSMS,
};