const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const monadPayment = require('../services/monadPayment');

const router = express.Router();

// Middleware to validate wallet signature (simplified for now)
const validateWallet = (req, res, next) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }
  req.walletAddress = walletAddress.toLowerCase();
  next();
};

// Create or update user profile
router.post('/create', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be 18-100'),
  body('gender').isIn(['male', 'female', 'non-binary', 'other']).withMessage('Valid gender is required'),
  body('lookingFor').isIn(['male', 'female', 'both']).withMessage('Valid preference is required'),
  body('bio').trim().isLength({ min: 10, max: 1000 }).withMessage('Bio must be 10-1000 characters'),
  body('location').optional().trim().isLength({ max: 200 }),
  body('phone').optional().trim().isLength({ max: 20 }),
  validateWallet
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const {
      name, email, age, gender, lookingFor, bio, interests, location, phone
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ walletAddress: req.walletAddress });
    
    if (user) {
      // Update existing profile
      user.name = name;
      user.email = email;
      user.age = age;
      user.gender = gender;
      user.lookingFor = lookingFor;
      user.bio = bio;
      user.interests = interests ? interests.split(',').map(i => i.trim()) : [];
      user.location = location;
      user.phone = phone;
      user.lastActive = new Date();
      
      await user.save();
      
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          lookingFor: user.lookingFor,
          bio: user.bio,
          interests: user.interests,
          location: user.location,
          phone: user.phone,
          isVerified: user.isVerified,
          network: user.network,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    }

    // Create new user profile
    user = new User({
      name,
      email,
      age,
      gender,
      lookingFor,
      bio,
      interests: interests ? interests.split(',').map(i => i.trim()) : [],
      location,
      phone,
      walletAddress: req.walletAddress,
      network: 'localhost', // Default to localhost
      isVerified: false
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        lookingFor: user.lookingFor,
        bio: user.bio,
        interests: user.interests,
        location: user.location,
        phone: user.phone,
        isVerified: user.isVerified,
        network: user.network,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create profile',
      message: error.message 
    });
  }
});

// Get user profile by wallet address
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Increment profile views
    await user.incrementProfileViews();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        interests: user.interests,
        location: user.location,
        isVerified: user.isVerified,
        profileViews: user.profileViews,
        matchesCount: user.matchesCount,
        lastActive: user.lastActive,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      message: error.message 
    });
  }
});

// Update user profile
router.put('/:walletAddress', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('age').optional().isInt({ min: 18, max: 100 }),
  body('bio').optional().trim().isLength({ min: 10, max: 1000 }),
  body('location').optional().trim().isLength({ max: 200 }),
  body('interests').optional().isArray(),
  validateWallet
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { walletAddress } = req.params;
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'age', 'bio', 'location', 'interests'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    user.lastActive = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        bio: user.bio,
        interests: user.interests,
        location: user.location,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: error.message 
    });
  }
});

// Get user preferences
router.get('/:walletAddress/preferences', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      success: true,
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Preferences fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch preferences',
      message: error.message 
    });
  }
});

// Update user preferences
router.put('/:walletAddress/preferences', [
  body('maxDistance').optional().isInt({ min: 1, max: 1000 }),
  body('ageRange.min').optional().isInt({ min: 18, max: 100 }),
  body('ageRange.max').optional().isInt({ min: 18, max: 100 }),
  body('notifications.email').optional().isBoolean(),
  body('notifications.push').optional().isBoolean(),
  validateWallet
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { walletAddress } = req.params;
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update preferences
    if (req.body.maxDistance !== undefined) {
      user.preferences.maxDistance = req.body.maxDistance;
    }
    if (req.body.ageRange) {
      if (req.body.ageRange.min !== undefined) {
        user.preferences.ageRange.min = req.body.ageRange.min;
      }
      if (req.body.ageRange.max !== undefined) {
        user.preferences.ageRange.max = req.body.ageRange.max;
      }
    }
    if (req.body.notifications) {
      if (req.body.notifications.email !== undefined) {
        user.preferences.notifications.email = req.body.notifications.email;
      }
      if (req.body.notifications.push !== undefined) {
        user.preferences.notifications.push = req.body.notifications.push;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ 
      error: 'Failed to update preferences',
      message: error.message 
    });
  }
});

// Get profile statistics
router.get('/:walletAddress/stats', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      success: true,
      stats: {
        profileViews: user.profileViews,
        matchesCount: user.matchesCount,
        lastActive: user.lastActive,
        daysSinceCreation: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24))
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stats',
      message: error.message 
    });
  }
});

module.exports = router;
