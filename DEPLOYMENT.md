# 🚀 Monad Testnet Deployment Guide

This guide will walk you through deploying your dating app smart contracts to the Monad testnet.

## 📋 Prerequisites

1. **Node.js 16+ and npm** installed
2. **A wallet** (MetaMask, etc.) with a private key
3. **Testnet MONAD tokens** for gas fees
4. **Git** for cloning the repository

## 🔧 Setup Steps

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd Monad-Hackathon
npm install
```

### 2. Environment Configuration
```bash
# Copy the environment template
cp env.example .env

# Edit .env file with your private key
# IMPORTANT: Remove the 0x prefix from your private key
PRIVATE_KEY=your_private_key_here_without_0x
```

### 3. Verify Configuration
```bash
# Check if Monad testnet is accessible
npx hardhat run scripts/check-monad.js --network monad_testnet
```

## 🧪 Test Locally First

Before deploying to testnet, test everything locally:

```bash
# Start local Hardhat node
npx hardhat node

# In another terminal, test deployment
npx hardhat run scripts/test-deployment.js --network localhost
```

## 🌐 Deploy to Monad Testnet

### 1. Compile Contracts
```bash
npx hardhat compile
```

### 2. Deploy Contracts
```bash
npx hardhat run scripts/deploy.js --network monad_testnet
```

### 3. Verify Deployment
The deployment script will output all contract addresses. Save these for future use.

## 📊 Expected Output

```
🎉 All contracts deployed successfully!
=====================================
CrushCredits: 0x...
UserRegistry: 0x...
Matchmaker: 0x...
ProfileMatcher: 0x...
=====================================
```

## 🔍 Post-Deployment Verification

### 1. Check Contract Status
```bash
# Verify contracts are deployed and accessible
npx hardhat run scripts/check-monad.js --network monad_testnet
```

### 2. Test Basic Functions
You can interact with your contracts using Hardhat console or write additional test scripts.

## 🚨 Troubleshooting

### Common Issues

1. **"Insufficient funds"**
   - Get testnet MONAD from the faucet
   - Check your wallet balance

2. **"Network connection failed"**
   - Verify RPC URL in hardhat.config.js
   - Check if Monad testnet is accessible

3. **"Compilation failed"**
   - Run `npx hardhat compile` to see specific errors
   - Check Solidity version compatibility

4. **"Private key not found"**
   - Ensure .env file exists and contains PRIVATE_KEY
   - Remove 0x prefix from private key

### Getting Testnet MONAD

1. Visit the Monad testnet faucet
2. Connect your wallet
3. Request test tokens
4. Wait for confirmation

## 📱 Frontend Integration

After deployment, update your frontend configuration:

1. **Update contract addresses** in your frontend config
2. **Set network to Monad testnet** (Chain ID: 1337)
3. **Test wallet connection** and contract interactions

## 🔐 Security Notes

- **Never commit your .env file** to version control
- **Use testnet private keys** only (not mainnet)
- **Verify contract addresses** before using them
- **Test thoroughly** before mainnet deployment

## 📞 Support

If you encounter issues:
1. Check the Monad Discord/Telegram for testnet status
2. Verify your configuration matches this guide
3. Check Hardhat and Solidity versions compatibility

## 🎯 Next Steps

After successful deployment:
1. **Test all contract functions** on testnet
2. **Integrate with your frontend**
3. **Run user acceptance testing**
4. **Prepare for mainnet deployment**

---

**Happy Deploying! 🚀**
