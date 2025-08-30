# 🛠️ Project Setup Guide

## 📁 Project Overview

This is a **Monad Dating App** project with smart contracts for:
- User profile management
- Matching algorithms
- Token rewards (CRUSH)
- Privacy-preserving decisions

## 🔧 Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
You need to create a `.env` file in the root directory:

```bash
# Copy the template
cp env.example .env

# Edit .env file and add your private key
# IMPORTANT: Remove the 0x prefix from your private key
PRIVATE_KEY=your_actual_private_key_here
```

**⚠️ Security Warning**: Never commit your `.env` file to version control!

### 3. Verify Installation
```bash
# Compile contracts
npx hardhat compile

# Test locally
npx hardhat run scripts/test-deployment.js --network localhost
```

## 🌐 Network Configuration

### Current Networks Available:
- **Localhost**: `http://127.0.0.1:9545` (for testing)
- **Monad Testnet**: `https://rpc.testnet.monad.xyz` (Chain ID: 1337)

### To Add Monad Testnet to MetaMask:
1. Open MetaMask
2. Click "Add Network"
3. Add these details:
   - **Network Name**: Monad Testnet
   - **RPC URL**: `https://rpc.testnet.monad.xyz`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `MONAD`

## 🧪 Testing Your Setup

### 1. Local Testing
```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Test deployment
npx hardhat run scripts/test-deployment.js --network localhost
```

### 2. Testnet Connection Test
```bash
# Check if you can connect to Monad testnet
npx hardhat run scripts/check-monad.js --network monad_testnet
```

## 🚀 Deployment Preparation

### Before Deploying to Testnet:

1. **✅ Contracts compiled successfully**
2. **✅ Local testing passed**
3. **✅ .env file configured with private key**
4. **✅ Wallet has testnet MONAD tokens**
5. **✅ Network configuration verified**

### Getting Testnet MONAD:
- Check Monad's official channels for testnet faucet
- Join Monad Discord/Telegram for testnet access
- Request test tokens for your wallet address

## 📱 Frontend Integration

The React frontend is in the `frontend/` directory. After deployment:

1. **Update contract addresses** in frontend config
2. **Set network to Monad testnet**
3. **Test wallet connection**
4. **Verify contract interactions**

## 🔍 Troubleshooting

### Common Issues:

1. **"Private key not found"**
   - Check `.env` file exists and contains `PRIVATE_KEY`
   - Remove `0x` prefix from private key

2. **"Compilation failed"**
   - Run `npx hardhat compile` for specific errors
   - Check Solidity version compatibility

3. **"Network connection failed"**
   - Verify RPC URL in `hardhat.config.js`
   - Check if Monad testnet is accessible

4. **"Insufficient funds"**
   - Get testnet MONAD from faucet
   - Check wallet balance

## 📚 Next Steps

1. **Complete the setup** following this guide
2. **Test locally** to ensure everything works
3. **Get testnet tokens** for deployment
4. **Deploy to Monad testnet** using the deployment guide
5. **Integrate with frontend** and test end-to-end

## 📞 Need Help?

- Check the `DEPLOYMENT.md` file for detailed deployment steps
- Review error messages carefully
- Ensure all prerequisites are met
- Test locally before testnet deployment

---

**Ready to build the future of dating on Monad! 🚀💕**
