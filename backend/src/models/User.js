const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic info
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Profile details
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'non-binary', 'other']
  },
  lookingFor: {
    type: String,
    required: true,
    enum: ['male', 'female', 'both']
  },
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  interests: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  
  // Wallet and blockchain
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  network: {
    type: String,
    default: 'localhost',
    enum: ['localhost', 'monad_testnet', 'monad_mainnet']
  },
  
  // Account status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Preferences
  preferences: {
    maxDistance: {
      type: Number,
      default: 50
    },
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 100 }
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  
  // Stats
  profileViews: {
    type: Number,
    default: 0
  },
  matchesCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ walletAddress: 1 });
userSchema.index({ location: 1 });
userSchema.index({ age: 1, gender: 1 });
userSchema.index({ interests: 1 });
userSchema.index({ isActive: 1, isVerified: 1 });

// Virtual for age calculation
userSchema.virtual('ageGroup').get(function() {
  if (this.age < 25) return '18-24';
  if (this.age < 35) return '25-34';
  if (this.age < 45) return '35-44';
  if (this.age < 55) return '45-54';
  return '55+';
});

// Methods
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

userSchema.methods.incrementProfileViews = function() {
  this.profileViews += 1;
  return this.save();
};

userSchema.methods.incrementMatches = function() {
  this.matchesCount += 1;
  return this.save();
};

// Static methods for queries
userSchema.statics.findByPreferences = function(userId, preferences) {
  return this.find({
    _id: { $ne: userId },
    isActive: true,
    isVerified: true,
    age: { $gte: preferences.ageRange.min, $lte: preferences.ageRange.max },
    gender: preferences.lookingFor === 'both' ? { $in: ['male', 'female'] } : preferences.lookingFor
  });
};

userSchema.statics.findByInterests = function(userId, interests) {
  return this.find({
    _id: { $ne: userId },
    isActive: true,
    isVerified: true,
    interests: { $in: interests }
  });
};

module.exports = mongoose.model('User', userSchema);
