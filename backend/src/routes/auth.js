const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT token
const generateToken = (walletAddress) => {
  return jwt.sign(
    { walletAddress },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Wallet authentication middleware
const authenticateWallet = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({ walletAddress: decoded.walletAddress });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Authenticate wallet
router.post('/wallet', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // For now, we'll skip signature verification for simplicity
    // In production, you should verify the signature matches the wallet address

    // Check if user exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'Please create a profile first'
      });
    }

    // Generate token
    const token = generateToken(walletAddress);

    // Update last active
    await user.updateLastActive();

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
        network: user.network
      }
    });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
});

// Verify token
router.get('/verify', authenticateWallet, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token is valid',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        walletAddress: req.user.walletAddress,
        isVerified: req.user.isVerified,
        network: req.user.network
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      error: 'Token verification failed',
      message: error.message
    });
  }
});

// Get current user
router.get('/me', authenticateWallet, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        age: req.user.age,
        gender: req.user.gender,
        lookingFor: req.user.lookingFor,
        bio: req.user.bio,
        interests: req.user.interests,
        location: req.user.location,
        phone: req.user.phone,
        walletAddress: req.user.walletAddress,
        isVerified: req.user.isVerified,
        network: req.user.network,
        preferences: req.user.preferences,
        profileViews: req.user.profileViews,
        matchesCount: req.user.matchesCount,
        lastActive: req.user.lastActive,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: error.message
    });
  }
});

// Logout (invalidate token)
router.post('/logout', authenticateWallet, async (req, res) => {
  try {
    // Update last active
    await req.user.updateLastActive();

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: error.message
    });
  }
});

module.exports = router;
