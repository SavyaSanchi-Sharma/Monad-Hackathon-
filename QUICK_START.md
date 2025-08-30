# 🚀 Quick Start - Monad Dating App Deployment

## 🎯 What You Have

A complete **decentralized dating application** with smart contracts ready for Monad testnet deployment:

- ✅ **CrushCredits**: ERC20 token for rewards
- ✅ **UserRegistry**: Profile management
- ✅ **Matchmaker**: Basic matching
- ✅ **ProfileMatcher**: Advanced scoring system
- ✅ **Frontend**: React app ready for integration

## 🚀 Deploy in 3 Steps

### Step 1: Setup Environment
```bash
# Copy environment template
cp env.example .env

# Edit .env and add your private key (remove 0x prefix)
PRIVATE_KEY=your_actual_private_key_here
```

### Step 2: Test Locally
```bash
# Compile contracts
npx hardhat compile

# Test deployment locally
npx hardhat run scripts/test-deployment.js --network localhost
```

### Step 3: Deploy to Monad Testnet
```bash
# Deploy all contracts
npx hardhat run scripts/deploy.js --network monad_testnet
```

## 🔧 Prerequisites

- **Node.js 16+** and npm
- **Wallet** with private key
- **Testnet MONAD tokens** for gas fees
- **MetaMask** with Monad testnet added

## 🌐 Monad Testnet Config

**Network Name**: Monad Testnet  
**RPC URL**: `https://rpc.testnet.monad.xyz`  
**Chain ID**: `1337`  
**Currency**: `MONAD`

## 📱 What Happens After Deployment

1. **Smart contracts** deployed and verified
2. **Frontend** can connect to contracts
3. **Users** can register profiles
4. **Matching system** becomes active
5. **CRUSH tokens** distributed for rewards

## 🆘 Need Help?

- **Setup issues**: Check `SETUP.md`
- **Deployment problems**: See `DEPLOYMENT.md`
- **Contract errors**: Run `npx hardhat compile`
- **Network issues**: Verify RPC URL and chain ID

## 🎉 Success Indicators

- ✅ Contracts compile without errors
- ✅ Local deployment works
- ✅ Testnet connection established
- ✅ All contracts deployed successfully
- ✅ Contract addresses displayed

---

**Ready to revolutionize dating on Monad? Let's deploy! 🚀💕**
