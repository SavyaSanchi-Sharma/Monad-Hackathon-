const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get potential matches for a user
router.get('/potential/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Find the user
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build match query
    const matchQuery = {
      _id: { $ne: user._id },
      isActive: true,
      isVerified: true
    };

    // Add gender preference
    if (user.lookingFor !== 'both') {
      matchQuery.gender = user.lookingFor;
    }

    // Add age range preference
    const userAge = user.age;
    const ageRange = user.preferences?.ageRange || { min: 18, max: 100 };
    matchQuery.age = {
      $gte: Math.max(18, userAge - 10),
      $lte: Math.min(100, userAge + 10)
    };

    // Find potential matches
    const potentialMatches = await User.find(matchQuery)
      .select('name age gender bio interests location profileViews matchesCount lastActive createdAt')
      .sort({ lastActive: -1, profileViews: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Calculate match scores
    const matchesWithScores = potentialMatches.map(match => {
      let score = 50; // Base score

      // Age compatibility
      const ageDiff = Math.abs(user.age - match.age);
      if (ageDiff <= 2) score += 20;
      else if (ageDiff <= 5) score += 15;
      else if (ageDiff <= 10) score += 10;

      // Interest overlap
      if (user.interests && match.interests) {
        const commonInterests = user.interests.filter(interest => 
          match.interests.includes(interest)
        );
        score += commonInterests.length * 5;
      }

      // Location bonus (if same location)
      if (user.location && match.location && 
          user.location.toLowerCase() === match.location.toLowerCase()) {
        score += 15;
      }

      // Activity bonus
      const daysSinceActive = Math.floor((Date.now() - match.lastActive) / (1000 * 60 * 60 * 24));
      if (daysSinceActive <= 1) score += 10;
      else if (daysSinceActive <= 7) score += 5;

      // Cap score at 100
      score = Math.min(100, score);

      return {
        ...match.toObject(),
        matchScore: score
      };
    });

    // Sort by match score
    matchesWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      matches: matchesWithScores,
      total: matchesWithScores.length,
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        lookingFor: user.lookingFor
      }
    });

  } catch (error) {
    console.error('Get potential matches error:', error);
    res.status(500).json({
      error: 'Failed to get potential matches',
      message: error.message
    });
  }
});

// Get matches by interests
router.get('/by-interests/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { interests, limit = 20 } = req.query;

    if (!interests) {
      return res.status(400).json({ error: 'Interests parameter is required' });
    }

    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const interestArray = interests.split(',').map(i => i.trim());
    
    const matches = await User.find({
      _id: { $ne: user._id },
      isActive: true,
      isVerified: true,
      interests: { $in: interestArray }
    })
    .select('name age gender bio interests location profileViews lastActive')
    .sort({ lastActive: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      matches,
      total: matches.length,
      searchedInterests: interestArray
    });

  } catch (error) {
    console.error('Get matches by interests error:', error);
    res.status(500).json({
      error: 'Failed to get matches by interests',
      message: error.message
    });
  }
});

// Get matches by location
router.get('/by-location/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { location, limit = 20 } = req.query;

    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matches = await User.find({
      _id: { $ne: user._id },
      isActive: true,
      isVerified: true,
      location: { $regex: location, $options: 'i' }
    })
    .select('name age gender bio interests location profileViews lastActive')
    .sort({ lastActive: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      matches,
      total: matches.length,
      searchedLocation: location
    });

  } catch (error) {
    console.error('Get matches by location error:', error);
    res.status(500).json({
      error: 'Failed to get matches by location',
      message: error.message
    });
  }
});

// Get user's match history
router.get('/history/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { limit = 50 } = req.query;

    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // This would typically come from a separate Match model
    // For now, we'll return recent profile views
    const recentViews = await User.find({
      _id: { $ne: user._id },
      isActive: true,
      isVerified: true
    })
    .select('name age gender bio interests location lastActive')
    .sort({ lastActive: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      matchHistory: recentViews,
      total: recentViews.length
    });

  } catch (error) {
    console.error('Get match history error:', error);
    res.status(500).json({
      error: 'Failed to get match history',
      message: error.message
    });
  }
});

// Get match statistics
router.get('/stats/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get total potential matches
    const totalPotentialMatches = await User.countDocuments({
      _id: { $ne: user._id },
      isActive: true,
      isVerified: true
    });

    // Get matches by age group
    const ageGroups = await User.aggregate([
      {
        $match: {
          _id: { $ne: user._id },
          isActive: true,
          isVerified: true
        }
      },
      {
        $group: {
          _id: '$ageGroup',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get matches by gender
    const genderDistribution = await User.aggregate([
      {
        $match: {
          _id: { $ne: user._id },
          isActive: true,
          isVerified: true
        }
      },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalPotentialMatches,
        ageGroups,
        genderDistribution,
        userProfileViews: user.profileViews,
        userMatchesCount: user.matchesCount
      }
    });

  } catch (error) {
    console.error('Get match stats error:', error);
    res.status(500).json({
      error: 'Failed to get match statistics',
      message: error.message
    });
  }
});

// Search matches with filters
router.post('/search/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { 
      ageRange, 
      gender, 
      interests, 
      location, 
      limit = 20, 
      offset = 0 
    } = req.body;

    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build search query
    const searchQuery = {
      _id: { $ne: user._id },
      isActive: true,
      isVerified: true
    };

    if (ageRange) {
      searchQuery.age = {
        $gte: ageRange.min || 18,
        $lte: ageRange.max || 100
      };
    }

    if (gender && gender !== 'both') {
      searchQuery.gender = gender;
    }

    if (interests && interests.length > 0) {
      searchQuery.interests = { $in: interests };
    }

    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }

    const matches = await User.find(searchQuery)
      .select('name age gender bio interests location profileViews lastActive createdAt')
      .sort({ lastActive: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json({
      success: true,
      matches,
      total: matches.length,
      filters: {
        ageRange,
        gender,
        interests,
        location
      }
    });

  } catch (error) {
    console.error('Search matches error:', error);
    res.status(500).json({
      error: 'Failed to search matches',
      message: error.message
    });
  }
});

module.exports = router;
