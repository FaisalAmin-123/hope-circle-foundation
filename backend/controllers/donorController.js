const Transaction = require('../models/Transaction');
const Application = require('../models/Application');
const User = require('../models/User');
// helper to get bounds for current month (local time)
function getMonthBoundsLocal() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  return { start, end };
}
// @desc    Get donor's impact details
// @route   GET /api/donors/my-impact
// @access  Private/Donor
exports.getDonorImpact = async (req, res) => {
  try {
    const donorId = req.user.id;

    // Get all donations by this donor
    const donations = await Transaction.find({
      $or: [
        { donor: donorId },
        { 'guestDonor.email': req.user.email },
        { 'guestDonor.phone': req.user.phone },
      ],
      type: 'donation',
      status: 'completed',
    }).sort({ createdAt: -1 });

    // Calculate total donated
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

    // Get all distributions (to match with donor contributions)
    const distributions = await Transaction.find({
      type: 'distribution',
      status: 'completed',
    })
      .populate('beneficiary', 'name beneficiaryCategory')
      .sort({ createdAt: 1 });

    // Calculate impact distribution (proportional allocation)
    const totalDonations = await Transaction.aggregate([
      { $match: { type: 'donation', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const allDonationsTotal = totalDonations[0]?.total || 1;
    const donorContributionRatio = totalDonated / allDonationsTotal;

    // Map beneficiaries helped (proportional to donor's contribution)
    const beneficiariesHelped = [];
    const categoryImpact = {
      poor: 0,
      orphan: 0,
      physically_challenged: 0,
    };

    for (const dist of distributions) {
      const donorShare = Math.round(dist.amount * donorContributionRatio);
      
      if (donorShare > 0 && dist.beneficiary) {
        beneficiariesHelped.push({
          beneficiaryId: dist.beneficiary._id,
          amount: donorShare,
          category: dist.beneficiary.beneficiaryCategory || 'poor',
          date: dist.createdAt,
          anonymizedName: `Beneficiary #${dist.beneficiary._id.toString().slice(-4)}`,
        });

        // Add to category impact
        const category = dist.beneficiary.beneficiaryCategory || 'poor';
        categoryImpact[category] += donorShare;
      }
    }

    // Calculate badge level
    let badgeLevel = 'none';
    let badgeColor = 'gray';
    let badgeIcon = '🌱';
    let nextBadge = 'Bronze';
    let nextBadgeAmount = 1000;

    if (totalDonated >= 100000) {
      badgeLevel = 'platinum';
      badgeColor = '#E5E4E2';
      badgeIcon = '👑';
      nextBadge = 'Platinum';
      nextBadgeAmount = 0;
    } else if (totalDonated >= 50000) {
      badgeLevel = 'diamond';
      badgeColor = '#B9F2FF';
      badgeIcon = '💎';
      nextBadge = 'Platinum';
      nextBadgeAmount = 100000;
    } else if (totalDonated >= 10000) {
      badgeLevel = 'gold';
      badgeColor = '#FFD700';
      badgeIcon = '🥇';
      nextBadge = 'Diamond';
      nextBadgeAmount = 50000;
    } else if (totalDonated >= 5000) {
      badgeLevel = 'silver';
      badgeColor = '#C0C0C0';
      badgeIcon = '🥈';
      nextBadge = 'Gold';
      nextBadgeAmount = 10000;
    } else if (totalDonated >= 1000) {
      badgeLevel = 'bronze';
      badgeColor = '#CD7F32';
      badgeIcon = '🥉';
      nextBadge = 'Silver';
      nextBadgeAmount = 5000;
    }

    // Calculate achievements
    const achievements = [];
    if (donations.length >= 1) achievements.push({ 
      name: 'First Donation', 
      icon: '⭐', 
      unlocked: true,
      description: 'Made your first donation'
    });
    if (donations.length >= 5) achievements.push({ 
      name: '5 Donations', 
      icon: '🔥', 
      unlocked: true,
      description: 'Donated 5 times'
    });
    if (donations.length >= 10) achievements.push({ 
      name: '10 Donations', 
      icon: '💪', 
      unlocked: true,
      description: 'Donated 10 times'
    });
    if (beneficiariesHelped.length >= 5) achievements.push({ 
      name: 'Changed 5 Lives', 
      icon: '❤️', 
      unlocked: true,
      description: 'Helped 5 beneficiaries'
    });
    if (beneficiariesHelped.length >= 10) achievements.push({ 
      name: 'Changed 10 Lives', 
      icon: '🌟', 
      unlocked: true,
      description: 'Helped 10 beneficiaries'
    });
    if (totalDonated >= 10000) achievements.push({ 
      name: 'Big Heart', 
      icon: '💖', 
      unlocked: true,
      description: 'Donated ₹10,000+'
    });

    // Monthly donation trend
    const monthlyTrend = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { donor: donorId },
            { 'guestDonor.email': req.user.email },
          ],
          type: 'donation',
          status: 'completed',
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
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDonated,
        totalDonations: donations.length,
        livesImpacted: beneficiariesHelped.length,
        beneficiariesHelped: beneficiariesHelped.slice(0, 10), // Last 10
        categoryImpact,
        badge: {
          level: badgeLevel,
          color: badgeColor,
          icon: badgeIcon,
          nextBadge,
          nextBadgeAmount,
          progressPercentage: nextBadgeAmount > 0 
            ? Math.min(100, (totalDonated / nextBadgeAmount) * 100)
            : 100,
        },
        achievements,
        monthlyTrend,
        impactScore: Math.round((totalDonated / 1000) + (beneficiariesHelped.length * 10)),
      },
    });
  } catch (error) {
    console.error('Error fetching donor impact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch impact data',
      error: error.message,
    });
  }
};

// @desc    Setup recurring donation
// @route   POST /api/donors/recurring-donation
// @access  Private/Donor
exports.setupRecurringDonation = async (req, res) => {
  try {
    const { amount, frequency, startDate } = req.body;

    // Validate
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum recurring donation amount is ₹100',
      });
    }

    if (!['monthly', 'quarterly', 'yearly'].includes(frequency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid frequency',
      });
    }

    // Update user with recurring donation settings
    await User.findByIdAndUpdate(req.user.id, {
      recurringDonation: {
        active: true,
        amount,
        frequency,
        startDate: startDate || new Date(),
        nextDonationDate: startDate || new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Recurring donation setup successfully',
    });
  } catch (error) {
    console.error('Error setting up recurring donation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup recurring donation',
      error: error.message,
    });
  }
};

// @desc    Check if donor already donated this month
// @route   GET /api/donors/check-monthly-donation
// @access  Private/Donor
exports.checkMonthlyDonation = async (req, res) => {
  try {
    const donorId = req.user.id;
    const { start, end } = getMonthBoundsLocal();

    // look for any completed donation by this donor (or guest donor matching email/phone) in current month
    const donatedThisMonth = await Transaction.exists({
      $or: [
        { donor: donorId },
        { 'guestDonor.email': req.user.email },
        { 'guestDonor.phone': req.user.phone },
      ],
      type: 'donation',
      status: 'completed',
      createdAt: { $gte: start, $lt: end },
    });

    return res.status(200).json({ alreadyDonated: Boolean(donatedThisMonth) });
  } catch (error) {
    console.error('checkMonthlyDonation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error checking monthly donation',
      error: error.message,
    });
  }
};


// @desc    Cancel recurring donation
// @route   DELETE /api/donors/recurring-donation
// @access  Private/Donor
exports.cancelRecurringDonation = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      'recurringDonation.active': false,
    });

    res.status(200).json({
      success: true,
      message: 'Recurring donation cancelled',
    });
  } catch (error) {
    console.error('Error cancelling recurring donation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel recurring donation',
      error: error.message,
    });
  }
};