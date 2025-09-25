const User = require('../models/User');

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get top users by reduction score
    const leaderboard = await User.find()
      .select('name reductionScore createdAt')
      .sort({ reductionScore: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total user count
    const totalUsers = await User.countDocuments();

    // If user is authenticated, get their rank
    let userRank = null;
    if (req.user) {
      const higherScoreCount = await User.countDocuments({
        reductionScore: { $gt: req.user.reductionScore }
      });
      userRank = {
        rank: higherScoreCount + 1,
        score: req.user.reductionScore,
        totalUsers
      };
    }

    res.status(200).json({
      success: true,
      leaderboard,
      userRank,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard
};