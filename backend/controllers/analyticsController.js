const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Calculate total donations
    const totalDonations = await Transaction.aggregate([
      { $match: { type: 'donation', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Calculate total distributions
    const totalDistributions = await Transaction.aggregate([
      { $match: { type: 'distribution', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Calculate current balance
    const donations = totalDonations[0]?.total || 0;
    const distributions = totalDistributions[0]?.total || 0;
    const balance = donations - distributions;

    // Count users by role
    const donorCount = await User.countDocuments({ role: 'donor' });
    const beneficiaryCount = await User.countDocuments({ role: 'beneficiary' });
    const pendingBeneficiaries = await User.countDocuments({
      role: 'beneficiary',
      verificationStatus: 'pending',
    });
    const approvedBeneficiaries = await User.countDocuments({
      role: 'beneficiary',
      verificationStatus: 'approved',
    });

    // Recent transactions (last 10)
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('donor', 'name email')
      .populate('beneficiary', 'name email');

    // Send response
    res.status(200).json({
      success: true,
      data: {
        financial: {
          totalDonations: donations,
          totalDistributions: distributions,
          currentBalance: balance,
        },
        users: {
          totalDonors: donorCount,
          totalBeneficiaries: beneficiaryCount,
          pendingBeneficiaries,
          approvedBeneficiaries,
        },
        recentTransactions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get monthly statistics for charts
// @route   GET /api/analytics/monthly
// @access  Private/Admin
exports.getMonthlyStats = async (req, res) => {
  try {
    // Get current year
    const currentYear = new Date().getFullYear();

    // Aggregate donations by month
    const monthlyDonations = await Transaction.aggregate([
      {
        $match: {
          type: 'donation',
          status: 'completed',
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Aggregate distributions by month
    const monthlyDistributions = await Transaction.aggregate([
      {
        $match: {
          type: 'distribution',
          status: 'completed',
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format data for charts (all 12 months)
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const chartData = months.map((month, index) => {
      const monthNum = index + 1;

      const donation = monthlyDonations.find((d) => d._id === monthNum);
      const distribution = monthlyDistributions.find((d) => d._id === monthNum);

      return {
        month,
        donations: donation?.total || 0,
        distributions: distribution?.total || 0,
        donationCount: donation?.count || 0,
        distributionCount: distribution?.count || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get beneficiary statistics by category
// @route   GET /api/analytics/beneficiaries
// @access  Private/Admin
exports.getBeneficiaryStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: 'beneficiary', verificationStatus: 'approved' } },
      { $group: { _id: '$beneficiaryCategory', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};