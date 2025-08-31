# Monad Dating App - Smart Contracts

A decentralized dating application built on Monad blockchain with smart contracts for user matching, profile management, and token economics.

## 🏗️ Smart Contracts

- **CrushCredits (CRUSH)**: ERC20 token for platform rewards and incentives
- **UserRegistry**: Manages user profiles with age, gender, and tags
- **Matchmaker**: Basic matching functionality with encrypted decisions
- **ProfileMatcher**: Advanced matching system with scoring and timestamps

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- A wallet with some testnet MONAD tokens
- Private key for deployment

### Installation
```bash
npm install
```

### Environment Setup
1. Copy `env.example` to `.env`
2. Add your private key (without 0x prefix):
```bash
PRIVATE_KEY=your_private_key_here
```

### Compile Contracts
```bash
npx hardhat compile
```

### Deploy to Monad Testnet
```bash
npx hardhat run scripts/deploy.js --network monad_testnet
```

## 🌐 Networks

- **Monad Testnet**: `https://rpc.testnet.monad.xyz` (Chain ID: 10143)
- **Localhost**: `http://127.0.0.1:9545`

## 📱 Frontend

The React frontend is located in the `frontend/` directory and includes:
- User profile management
- Matching interface
- Wallet connection
- Match results display

## 🧪 Testing

```bash
npx hardhat test
```

## 🔧 Development

```bash
# Start local node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

## 📊 Contract Architecture

```
UserRegistry ← ProfileMatcher
     ↓              ↓
Matchmaker    CrushCredits
```

## 🎯 Features

- **User Registration**: Age, gender, and tag-based profiles
- **Smart Matching**: AI-powered compatibility scoring
- **Token Rewards**: CRUSH tokens for successful matches
- **Privacy**: Encrypted decision storage
- **Ownership**: Admin-controlled contract management

## 🔐 Security

- OpenZeppelin contracts for security best practices
- Owner-only functions for critical operations
- Input validation and access control

## 📝 License

MIT License
