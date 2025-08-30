# 🚀 Monad Dating App - Backend API

A comprehensive backend API for the Monad Dating App with database integration, Monad testnet payment processing, and user management.

## ✨ Features

- **🔐 Wallet Authentication** - JWT-based authentication using wallet addresses
- **👤 User Profile Management** - Complete CRUD operations for user profiles
- **💕 Smart Matching** - AI-powered matching algorithm with scoring
- **💳 Monad Testnet Payments** - Blockchain payment processing for profile creation and subscriptions
- **🌐 Multi-Network Support** - Localhost and Monad testnet (Chain ID: 10143)
- **📊 Database Integration** - MongoDB with Mongoose ODM
- **🔒 Security** - Input validation, rate limiting, and CORS protection

## 🏗️ Architecture

```
Backend/
├── src/
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── index.js         # Main server file
├── package.json
└── env.example
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or cloud)
- Monad testnet access

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/wallet` - Authenticate with wallet
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Profiles
- `POST /api/profile/create` - Create/update user profile
- `GET /api/profile/:walletAddress` - Get user profile
- `PUT /api/profile/:walletAddress` - Update user profile
- `GET /api/profile/:walletAddress/preferences` - Get user preferences
- `PUT /api/profile/:walletAddress/preferences` - Update user preferences
- `GET /api/profile/:walletAddress/stats` - Get profile statistics

### Matching
- `GET /api/match/potential/:walletAddress` - Get potential matches
- `GET /api/match/by-interests/:walletAddress` - Find matches by interests
- `GET /api/match/by-location/:walletAddress` - Find matches by location
- `GET /api/match/history/:walletAddress` - Get match history
- `GET /api/match/stats/:walletAddress` - Get match statistics
- `POST /api/match/search/:walletAddress` - Advanced match search

### Payments
- `GET /api/payment/networks/status` - Get all network statuses
- `GET /api/payment/networks/:network/status` - Get specific network status
- `POST /api/payment/estimate/profile-creation` - Estimate gas for profile creation
- `POST /api/payment/profile-creation` - Process profile creation payment
- `POST /api/payment/premium-subscription` - Process premium subscription
- `GET /api/payment/user/:walletAddress` - Get user payment history
- `GET /api/payment/user/:walletAddress/stats` - Get payment statistics
- `GET /api/payment/transaction/:txHash` - Verify transaction status
- `GET /api/payment/methods` - Get payment methods and pricing

## 💰 Payment System

### Supported Networks
- **Localhost** (Chain ID: 1337) - Development and testing
- **Monad Testnet** (Chain ID: 10143) - Testnet deployment

### Payment Types
- **Profile Creation** - 0.01 MONAD (testnet) / 0.001 ETH (localhost)
- **Premium Subscription** - 0.1 MONAD (testnet) / 0.01 ETH (localhost)
- **Profile Boost** - 0.05 MONAD (testnet) / 0.005 ETH (localhost)

### Payment Flow
1. User initiates payment on frontend
2. Frontend sends transaction hash to backend
3. Backend verifies transaction on blockchain
4. Payment record created in database
5. User profile updated (verified status, etc.)

## 🗄️ Database Models

### User Model
- Basic info (name, email, phone)
- Profile details (age, gender, bio, interests, location)
- Wallet information (address, network)
- Preferences and settings
- Statistics (profile views, matches)

### Payment Model
- Transaction details (hash, block number, gas)
- Network information (chain ID, network name)
- Payment type and status
- Smart contract interaction data

## 🔧 Configuration

### Environment Variables
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/monad-dating

# JWT
JWT_SECRET=your-secret-key

# Monad Networks
MONAD_TESTNET_RPC=https://testnet-rpc.monad.xyz
MONAD_TESTNET_CHAIN_ID=10143

# Payment Fees
PROFILE_CREATION_FEE=0.01
PREMIUM_SUBSCRIPTION_FEE=0.1
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📊 Monitoring

### Health Check
- `GET /health` - Server status and version info

### Logging
- Request logging with Morgan
- Error logging and monitoring
- Performance metrics

## 🔒 Security Features

- **Input Validation** - Express-validator for all inputs
- **Rate Limiting** - Configurable request limits
- **CORS Protection** - Configurable origin restrictions
- **Helmet** - Security headers
- **JWT Authentication** - Secure wallet-based auth
- **Data Sanitization** - MongoDB injection protection

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB
3. Set secure JWT secret
4. Configure CORS origins
5. Set up monitoring and logging

### Docker (Optional)
```bash
# Build image
docker build -t monad-dating-backend .

# Run container
docker run -p 5000:5000 monad-dating-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- Check API documentation
- Review error logs
- Test network connectivity
- Verify database connection

---

**Built with ❤️ for the Monad ecosystem**
