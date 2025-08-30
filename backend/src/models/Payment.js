const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Payment details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'MONAD',
    enum: ['MONAD', 'ETH', 'USD']
  },
  
  // Transaction details
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: {
    type: Number
  },
  gasUsed: {
    type: Number
  },
  gasPrice: {
    type: String
  },
  
  // Network information
  network: {
    type: String,
    required: true,
    enum: ['localhost', 'monad_testnet', 'monad_mainnet']
  },
  chainId: {
    type: Number,
    required: true
  },
  
  // Payment type and status
  type: {
    type: String,
    required: true,
    enum: ['profile_creation', 'premium_subscription', 'boost', 'verification', 'other']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Smart contract interaction
  contractAddress: {
    type: String
  },
  method: {
    type: String
  },
  inputData: {
    type: String
  },
  
  // Metadata
  description: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Timestamps
  confirmedAt: {
    type: Date
  },
  failedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionHash: 1 });
paymentSchema.index({ network: 1, chainId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Methods
paymentSchema.methods.confirm = function(blockNumber, gasUsed, gasPrice) {
  this.status = 'confirmed';
  this.blockNumber = blockNumber;
  this.gasUsed = gasUsed;
  this.gasPrice = gasPrice;
  this.confirmedAt = new Date();
  return this.save();
};

paymentSchema.methods.fail = function() {
  this.status = 'failed';
  this.failedAt = new Date();
  return this.save();
};

paymentSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Static methods
paymentSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.status) query.status = options.status;
  if (options.network) query.network = options.network;
  if (options.type) query.type = options.type;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50);
};

paymentSchema.statics.getPaymentStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), status: 'confirmed' } },
    { $group: {
      _id: null,
      totalAmount: { $sum: '$amount' },
      totalPayments: { $sum: 1 },
      byType: { $push: { type: '$type', amount: '$amount' } }
    }}
  ]);
};

// Virtual for USD equivalent (if needed)
paymentSchema.virtual('usdEquivalent').get(function() {
  // This would need to be updated with current exchange rates
  if (this.currency === 'MONAD') {
    return this.amount * 0.1; // Placeholder rate
  }
  return this.amount;
});

module.exports = mongoose.model('Payment', paymentSchema);
