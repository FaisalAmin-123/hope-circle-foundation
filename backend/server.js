

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const workUpdatesRoutes = require('./routes/workUpdates');
// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const cors = require('cors');

app.use(cors({
  origin: [
    'https://hope-circle-frontend.onrender.com',
    'http://localhost:3000'  // For local development
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/ai-verification', require('./routes/aiVerificationRoutes')); 
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/distributions', require('./routes/distributionRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/guest-donations', require('./routes/guestDonationRoutes')); 
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api', workUpdatesRoutes);

app.use('/api/admin', require('./routes/adminRoutes'));
require('./cron/monthlyReminders');
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Hope Circle Foundation API is running...' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`✅ Cron jobs active for monthly reminders`);
});