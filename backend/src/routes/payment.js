const express = require('express');
const { body, validationResult } = require('express-validator');
const monadPayment = require('../services/monadPayment');
const Payment = require('../models/Payment');
const User = require('../models/User');

const router = express.Router();

// Get network status
router.get('/networks/status', async (req, res) => {
  try {
    const statuses = await monadPayment.getAllNetworkStatuses();
    res.json({
      success: true,
      networks: statuses
    });
  } catch (error) {
    console.error('Network status error:', error);
    res.status(500).json({
      error: 'Failed to get network status',
      message: error.message
    });
  }
});

// Get specific network status
router.get('/networks/:network/status', async (req, res) => {
  try {
    const { network } = req.params;
    const status = await monadPayment.checkNetworkStatus(network);
    res.json({
      success: true,
      network: status
    });
  } catch (error) {
    console.error('Network status error:', error);
    res.status(500).json({
      error: 'Failed to get network status',
      message: error.message
    });
  }
});

// Estimate gas for profile creation
router.post('/estimate/profile-creation', [
  body('network').isIn(['localhost', 'monad_testnet']).withMessage('Valid network is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { network } = req.body;
    const gasEstimate = await monadPayment.estimateProfileCreationGas(network);

    res.json({
      success: true,
      gasEstimate
    });
  } catch (error) {
    console.error('Gas estimation error:', error);
    res.status(500).json({
      error: 'Failed to estimate gas',
      message: error.message
    });
  }
});

// Process profile creation payment
router.post('/profile-creation', [
  body('walletAddress').isEthereumAddress().withMessage('Valid wallet address is required'),
  body('network').isIn(['localhost', 'monad_testnet']).withMessage('Valid network is required'),
  body('transactionHash').isHexString().withMessage('Valid transaction hash is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { walletAddress, network, transactionHash } = req.body;

    // Find user by wallet address
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Process the payment
    const result = await monadPayment.processProfileCreation(
      user._id,
      walletAddress,
      network,
      transactionHash
    );

    res.json({
      success: true,
      message: result.message,
      payment: result.payment
    });

  } catch (error) {
    console.error('Profile creation payment error:', error);
    res.status(500).json({
      error: 'Failed to process profile creation payment',
      message: error.message
    });
  }
});

// Process premium subscription payment
router.post('/premium-subscription', [
  body('walletAddress').isEthereumAddress().withMessage('Valid wallet address is required'),
  body('network').isIn(['localhost', 'monad_testnet']).withMessage('Valid network is required'),
  body('transactionHash').isHexString().withMessage('Valid transaction hash is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { walletAddress, network, transactionHash, amount } = req.body;

    // Find user by wallet address
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Process the payment
    const result = await monadPayment.processPremiumSubscription(
      user._id,
      walletAddress,
      network,
      transactionHash,
      amount
    );

    res.json({
      success: true,
      message: result.message,
      payment: result.payment
    });

  } catch (error) {
    console.error('Premium subscription payment error:', error);
    res.status(500).json({
      error: 'Failed to process premium subscription payment',
      message: error.message
    });
  }
});

// Get user payment history
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { status, network, type, limit } = req.query;

    // Find user by wallet address
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const options = {};
    if (status) options.status = status;
    if (network) options.network = network;
    if (type) options.type = type;
    if (limit) options.limit = parseInt(limit);

    const payments = await monadPayment.getUserPayments(user._id, options);

    res.json({
      success: true,
      payments
    });

  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      error: 'Failed to get payment history',
      message: error.message
    });
  }
});

// Get user payment statistics
router.get('/user/:walletAddress/stats', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Find user by wallet address
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await monadPayment.getPaymentStats(user._id);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Payment stats error:', error);
    res.status(500).json({
      error: 'Failed to get payment statistics',
      message: error.message
    });
  }
});

// Verify transaction status
router.get('/transaction/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    const { network } = req.query;

    if (!network) {
      return res.status(400).json({ error: 'Network parameter is required' });
    }

    const txInfo = await monadPayment.verifyTransaction(txHash, network);

    res.json({
      success: true,
      transaction: {
        hash: txHash,
        network,
        ...txInfo
      }
    });

  } catch (error) {
    console.error('Transaction verification error:', error);
    res.status(500).json({
      error: 'Failed to verify transaction',
      message: error.message
    });
  }
});

// Get payment methods and pricing
router.get('/methods', async (req, res) => {
  try {
    const paymentMethods = {
      profile_creation: {
        localhost: {
          amount: 0.001,
          currency: 'ETH',
          description: 'Profile creation fee on localhost'
        },
        monad_testnet: {
          amount: 0.01,
          currency: 'MONAD',
          description: 'Profile creation fee on Monad testnet'
        }
      },
      premium_subscription: {
        localhost: {
          amount: 0.01,
          currency: 'ETH',
          description: 'Monthly premium subscription on localhost'
        },
        monad_testnet: {
          amount: 0.1,
          currency: 'MONAD',
          description: 'Monthly premium subscription on Monad testnet'
        }
      },
      boost: {
        localhost: {
          amount: 0.005,
          currency: 'ETH',
          description: 'Profile boost on localhost'
        },
        monad_testnet: {
          amount: 0.05,
          currency: 'MONAD',
          description: 'Profile boost on Monad testnet'
        }
      }
    };

    res.json({
      success: true,
      paymentMethods
    });

  } catch (error) {
    console.error('Payment methods error:', error);
    res.status(500).json({
      error: 'Failed to get payment methods',
      message: error.message
    });
  }
});

// Webhook for blockchain events (for future use)
router.post('/webhook', async (req, res) => {
  try {
    const { event, data } = req.body;

    // Handle different blockchain events
    switch (event) {
      case 'transaction_confirmed':
        // Update payment status
        await Payment.findOneAndUpdate(
          { transactionHash: data.transactionHash },
          { 
            status: 'confirmed',
            blockNumber: data.blockNumber,
            confirmedAt: new Date()
          }
        );
        break;

      case 'transaction_failed':
        // Update payment status
        await Payment.findOneAndUpdate(
          { transactionHash: data.transactionHash },
          { 
            status: 'failed',
            failedAt: new Date()
          }
        );
        break;

      default:
        console.log('Unknown webhook event:', event);
    }

    res.json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      message: error.message
    });
  }
});

module.exports = router;
