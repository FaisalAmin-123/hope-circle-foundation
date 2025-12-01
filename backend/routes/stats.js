const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
const User = require("../models/User");

// GET LIVE STATS
router.get("/stats/live", async (req, res) => {
  try {
    console.log("🔍 Fetching live stats from DB...");

    // ⭐ Total Funds Distributed
    const fundsDistributed = await Transaction.aggregate([
      { $match: { type: "distribution", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // ⭐ Total People Helped (unique beneficiaries)
    const beneficiaries = await Transaction.distinct("beneficiary", {
      type: "distribution",
      status: "completed"
    });

    // ⭐ Total Donors (registered users who donated)
    const registeredDonorsCount = await User.countDocuments({
      role: "donor"
    });

    // ⭐ Guest Donors count (from transactions with guestDonor info)
    const guestDonorsCount = await Transaction.countDocuments({
      type: "donation",
      donor: null,                    // no registered donor
      "guestDonor.name": { $ne: null }
    });

    const totalDonors = registeredDonorsCount + guestDonorsCount;

    const result = {
      totalFundsDistributed:
        fundsDistributed[0]?.total || 0,

      totalPeopleHelped:
        beneficiaries.length,

      totalDonors,
      lastUpdated: new Date(),

      breakdown: {
        registered: registeredDonorsCount,
        guest: guestDonorsCount
      }
    };

    console.log("✅ Live stats response:", result);
    res.json(result);
  } catch (error) {
    console.error("❌ Error in /api/stats/live:", error);
    res.status(500).json({ error: "Failed to fetch live stats" });
  }
});

module.exports = router;
