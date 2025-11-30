const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Clear existing transactions
    await Transaction.deleteMany();

    console.log('Cleared existing transactions...');

    // Get admin user (create if doesn't exist)
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin created');
    }

    // Get or create a donor
    let donor = await User.findOne({ role: 'donor' });
    if (!donor) {
      donor = await User.create({
        name: 'Test Donor',
        email: 'donor@test.com',
        password: 'donor123',
        role: 'donor',
      });
      console.log('Donor created');
    }

    // Get or create a beneficiary
    let beneficiary = await User.findOne({ role: 'beneficiary' });
    if (!beneficiary) {
      beneficiary = await User.create({
        name: 'Test Beneficiary',
        email: 'beneficiary@test.com',
        password: 'beneficiary123',
        role: 'beneficiary',
        beneficiaryCategory: 'poor',
        verificationStatus: 'approved',
      });
      console.log('Beneficiary created');
    }

    // Create sample donations
    const donations = [
      { amount: 5000, month: 1 },
      { amount: 7000, month: 2 },
      { amount: 6000, month: 3 },
      { amount: 8000, month: 4 },
      { amount: 10000, month: 5 },
      { amount: 9000, month: 6 },
      { amount: 11000, month: 7 },
      { amount: 8500, month: 8 },
      { amount: 9500, month: 9 },
      { amount: 10500, month: 10 },
      { amount: 12000, month: 11 },
    ];

    for (const donation of donations) {
      const date = new Date(2025, donation.month - 1, 15);
      await Transaction.create({
        type: 'donation',
        amount: donation.amount,
        donor: donor._id,
        description: `Donation for month ${donation.month}`,
        paymentMethod: 'upi',
        status: 'completed',
        createdAt: date,
      });
    }

    console.log('Donations created');

    // Create sample distributions
    const distributions = [
      { amount: 3000, month: 2 },
      { amount: 4000, month: 3 },
      { amount: 3500, month: 4 },
      { amount: 5000, month: 5 },
      { amount: 4500, month: 6 },
      { amount: 6000, month: 7 },
      { amount: 5500, month: 8 },
      { amount: 4000, month: 9 },
      { amount: 5000, month: 10 },
      { amount: 6500, month: 11 },
    ];

    for (const distribution of distributions) {
      const date = new Date(2025, distribution.month - 1, 20);
      await Transaction.create({
        type: 'distribution',
        amount: distribution.amount,
        beneficiary: beneficiary._id,
        approvedBy: admin._id,
        description: `Aid distribution for month ${distribution.month}`,
        status: 'completed',
        createdAt: date,
      });
    }

    console.log('Distributions created');
    console.log('✅ Seed data created successfully!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();