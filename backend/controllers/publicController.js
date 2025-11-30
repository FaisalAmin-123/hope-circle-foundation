const Transaction = require('../models/Transaction');
const Application = require('../models/Application');

// @desc    Get public statistics (anonymized)
// @route   GET /api/public/statistics
// @access  Public (No authentication required)
exports.getPublicStatistics = async (req, res) => {
  try {
    // Get all donations
    const donations = await Transaction.find({ type: 'donation' });
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

    // Get all distributions
    const distributions = await Transaction.find({ type: 'distribution' });
    const totalDistributions = distributions.reduce((sum, d) => sum + d.amount, 0);

    // Current balance
    const currentBalance = totalDonations - totalDistributions;

    // Total beneficiaries helped (approved applications)
    const totalBeneficiaries = await Application.countDocuments({
      status: 'approved',
    });

    // Category-wise breakdown
    const categoryStats = await Application.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format category stats
    const categoryBreakdown = {
      poor: 0,
      orphan: 0,
      physically_challenged: 0,
    };

    categoryStats.forEach((cat) => {
      categoryBreakdown[cat._id] = cat.count;
    });

    // Monthly statistics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyDonations = await Transaction.aggregate([
      {
        $match: {
          type: 'donation',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthlyDistributions = await Transaction.aggregate([
      {
        $match: {
          type: 'distribution',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly data
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const donationData = monthlyDonations.find(
        (d) => d._id.year === year && d._id.month === month
      );
      const distributionData = monthlyDistributions.find(
        (d) => d._id.year === year && d._id.month === month
      );

      monthlyData.push({
        month: monthNames[month - 1],
        donations: donationData ? donationData.total : 0,
        distributions: distributionData ? distributionData.total : 0,
      });
    }

    // Total donors (unique)
    const totalDonors = await Transaction.distinct('donor', {
      type: 'donation',
    });

    // Average donation
    const avgDonation = donations.length > 0 ? totalDonations / donations.length : 0;

    // Average distribution
    const avgDistribution =
      distributions.length > 0 ? totalDistributions / distributions.length : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDonations: Math.round(totalDonations),
          totalDistributions: Math.round(totalDistributions),
          currentBalance: Math.round(currentBalance),
          totalBeneficiaries,
          totalDonors: totalDonors.length,
          totalDonationsCount: donations.length,
          totalDistributionsCount: distributions.length,
        },
        categoryBreakdown,
        monthlyData,
        averages: {
          avgDonation: Math.round(avgDonation),
          avgDistribution: Math.round(avgDistribution),
        },
        impactMetrics: {
          livesImpacted: totalBeneficiaries,
          fundsUtilized: Math.round((totalDistributions / totalDonations) * 100) || 0,
          transparencyScore: 100, // Since everything is public
        },
      },
    });
  } catch (error) {
    console.error('Error fetching public statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

// @desc    Get recent activities (anonymized)
// @route   GET /api/public/recent-activities
// @access  Public
exports.getRecentActivities = async (req, res) => {
  try {
    // Get recent donations (anonymized)
    const recentDonations = await Transaction.find({ type: 'donation' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('amount createdAt');

    // Get recent distributions (anonymized)
    const recentDistributions = await Transaction.find({ type: 'distribution' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('amount createdAt');

    // Format activities
    const activities = [];

    recentDonations.forEach((donation) => {
      activities.push({
        type: 'donation',
        amount: donation.amount,
        date: donation.createdAt,
        message: `Anonymous donor contributed ₹${donation.amount.toLocaleString()}`,
      });
    });

    recentDistributions.forEach((distribution) => {
      activities.push({
        type: 'distribution',
        amount: distribution.amount,
        date: distribution.createdAt,
        message: `₹${distribution.amount.toLocaleString()} distributed to beneficiary`,
      });
    });

    // Sort by date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      data: activities.slice(0, 10), // Return top 10
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message,
    });
  }
};