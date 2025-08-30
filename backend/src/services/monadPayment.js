const { ethers } = require('ethers');
const User = require('../models/User');
const Payment = require('../models/Payment');

class MonadPaymentService {
  constructor() {
    this.providers = {
      localhost: new ethers.JsonRpcProvider('http://127.0.0.1:8545'),
      monad_testnet: new ethers.JsonRpcProvider('https://testnet-rpc.monad.xyz')
    };
    
    this.networks = {
      localhost: { chainId: 1337, name: 'Localhost' },
      monad_testnet: { chainId: 10135, name: 'Monad Testnet' }
    };
    
    // Contract ABIs will be loaded when needed
    this.contractABIs = {};
  }

  // Get provider for specific network
  getProvider(network) {
    return this.providers[network] || this.providers.localhost;
  }

  // Get network info
  getNetworkInfo(network) {
    return this.networks[network] || this.networks.localhost;
  }

  // Verify transaction on blockchain
  async verifyTransaction(txHash, network) {
    try {
      const provider = this.getProvider(network);
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        throw new Error('Transaction not found');
      }
      
      return {
        success: receipt.status === 1,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: receipt.gasPrice.toString(),
        contractAddress: receipt.to,
        logs: receipt.logs
      };
    } catch (error) {
      console.error('Transaction verification failed:', error);
      throw error;
    }
  }

  // Process profile creation payment
  async processProfileCreation(userId, walletAddress, network, txHash) {
    try {
      // Verify transaction on blockchain
      const txInfo = await this.verifyTransaction(txHash, network);
      
      if (!txInfo.success) {
        throw new Error('Transaction failed on blockchain');
      }

      // Create payment record
      const payment = new Payment({
        userId,
        amount: 0.01, // Profile creation fee
        currency: network === 'monad_testnet' ? 'MONAD' : 'ETH',
        transactionHash: txHash,
        blockNumber: txInfo.blockNumber,
        gasUsed: txInfo.gasUsed,
        gasPrice: txInfo.gasPrice,
        network,
        chainId: this.getNetworkInfo(network).chainId,
        type: 'profile_creation',
        status: 'confirmed',
        description: 'Profile creation fee',
        confirmedAt: new Date()
      });

      await payment.save();

      // Update user verification status
      await User.findByIdAndUpdate(userId, {
        isVerified: true,
        network: network
      });

      return {
        success: true,
        payment,
        message: 'Profile creation payment confirmed'
      };
    } catch (error) {
      console.error('Profile creation payment failed:', error);
      throw error;
    }
  }

  // Process premium subscription payment
  async processPremiumSubscription(userId, walletAddress, network, txHash, amount) {
    try {
      const txInfo = await this.verifyTransaction(txHash, network);
      
      if (!txInfo.success) {
        throw new Error('Transaction failed on blockchain');
      }

      const payment = new Payment({
        userId,
        amount,
        currency: network === 'monad_testnet' ? 'MONAD' : 'ETH',
        transactionHash: txHash,
        blockNumber: txInfo.blockNumber,
        gasUsed: txInfo.gasUsed,
        gasPrice: txInfo.gasPrice,
        network,
        chainId: this.getNetworkInfo(network).chainId,
        type: 'premium_subscription',
        status: 'confirmed',
        description: 'Premium subscription payment',
        confirmedAt: new Date()
      });

      await payment.save();

      return {
        success: true,
        payment,
        message: 'Premium subscription payment confirmed'
      };
    } catch (error) {
      console.error('Premium subscription payment failed:', error);
      throw error;
    }
  }

  // Get user payment history
  async getUserPayments(userId, options = {}) {
    try {
      return await Payment.findByUser(userId, options);
    } catch (error) {
      console.error('Failed to get user payments:', error);
      throw error;
    }
  }

  // Get payment statistics
  async getPaymentStats(userId) {
    try {
      const stats = await Payment.getPaymentStats(userId);
      return stats[0] || { totalAmount: 0, totalPayments: 0, byType: [] };
    } catch (error) {
      console.error('Failed to get payment stats:', error);
      throw error;
    }
  }

  // Estimate gas for profile creation
  async estimateProfileCreationGas(network) {
    try {
      const provider = this.getProvider(network);
      const networkInfo = this.getNetworkInfo(network);
      
      // This would interact with actual smart contracts
      // For now, return estimated values
      return {
        gasLimit: 200000,
        gasPrice: await provider.getFeeData().then(fee => fee.gasPrice),
        estimatedCost: network === 'monad_testnet' ? '0.01 MONAD' : '0.001 ETH'
      };
    } catch (error) {
      console.error('Gas estimation failed:', error);
      throw error;
    }
  }

  // Check network status
  async checkNetworkStatus(network) {
    try {
      const provider = this.getProvider(network);
      const blockNumber = await provider.getBlockNumber();
      const feeData = await provider.getFeeData();
      
      return {
        network: this.getNetworkInfo(network).name,
        chainId: this.getNetworkInfo(network).chainId,
        blockNumber,
        gasPrice: feeData.gasPrice?.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
        status: 'connected'
      };
    } catch (error) {
      return {
        network: this.getNetworkInfo(network).name,
        chainId: this.getNetworkInfo(network).chainId,
        status: 'disconnected',
        error: error.message
      };
    }
  }

  // Get all network statuses
  async getAllNetworkStatuses() {
    const statuses = {};
    
    for (const network of Object.keys(this.networks)) {
      statuses[network] = await this.checkNetworkStatus(network);
    }
    
    return statuses;
  }
}

module.exports = new MonadPaymentService();
