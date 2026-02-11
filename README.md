# AgentForge - Complete Production-Ready Platform

**Visual workflow builder for autonomous AI agents with integrated monetization system**

A comprehensive React Native mobile app with Node.js/TypeScript backend, featuring workflow creation, AI agent management, real-time monitoring, and complete payment processing.

## 🚀 Complete System Overview

### Frontend (React Native Mobile App)
- ✅ **Visual Workflow Builder** - Drag-and-drop node-based interface
- ✅ **Template System** - Pre-built workflows and custom templates
- ✅ **Real-time Monitoring** - Live agent execution tracking
- ✅ **API Key Management** - Secure encrypted storage
- ✅ **Credit System** - Purchase and track credits
- ✅ **Subscription Management** - 3-tier pricing (Free/Premium/Enterprise)
- ✅ **Payment Processing** - Stripe integration
- ✅ **Admin Dashboard** - Analytics and user management

### Backend (Node.js/TypeScript API)
- ✅ **RESTful API** - Complete Express.js server
- ✅ **PostgreSQL Database** - Prisma ORM with migrations
- ✅ **Redis Caching** - Performance optimization
- ✅ **JWT Authentication** - Secure user sessions
- ✅ **Stripe Integration** - Payments and webhooks
- ✅ **Rate Limiting** - DDoS protection
- ✅ **Logging & Monitoring** - Winston logger
- ✅ **Docker Support** - Easy deployment

## 📦 Repository Structure

```
agentforge-mobile/
├── mobile/                          # React Native mobile app
│   ├── src/
│   │   ├── components/              # UI components
│   │   ├── screens/                 # App screens (10 screens)
│   │   ├── navigation/              # React Navigation
│   │   ├── services/                # API clients
│   │   ├── store/                   # Zustand state management
│   │   └── utils/                   # Helper functions
│   ├── App.js                       # App entry point
│   ├── app.json                     # Expo configuration
│   └── package.json                 # Dependencies
│
├── backend/                         # Node.js/TypeScript API
│   ├── src/
│   │   ├── config/                  # Configuration
│   │   ├── controllers/             # Request handlers
│   │   ├── middleware/              # Auth, validation, etc.
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   ├── utils/                   # Utilities
│   │   └── server.ts                # Express setup
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── seed.ts                  # Database seeding
│   ├── Dockerfile                   # Docker configuration
│   ├── docker-compose.yml           # Docker Compose setup
│   └── package.json                 # Dependencies
│
├── docs/
│   ├── BACKEND_COMPLETE.md          # Backend documentation
│   ├── MONETIZATION.md              # Revenue guide
│   └── API.md                       # API documentation
│
└── README.md                        # This file
```

## 🎯 Features

### Mobile App Features

#### 1. Workflow Builder
- **6 Node Types**: Input, Process, Decision, API Call, AI Agent, Output
- **Drag & Drop**: Intuitive canvas interface
- **Real-time Validation**: Instant feedback
- **Auto-save**: Never lose your work
- **Templates**: Start from pre-built workflows

#### 2. AI Integration
- **OpenAI**: GPT-4, GPT-3.5, DALL-E
- **Anthropic**: Claude 3, Claude 2
- **Google AI**: Gemini Pro, PaLM
- **OpenClaw**: Platform integration

#### 3. Monitoring Dashboard
- **Live Tracking**: Real-time execution status
- **Performance Metrics**: Response times, success rates
- **Error Logging**: Detailed error reports
- **Cost Tracking**: Credit usage per workflow

#### 4. Monetization
- **Subscriptions**: $0 (Free), $9.99 (Premium), $49.99 (Enterprise)
- **Credits**: Pay-as-you-go from $9.99 to $299.99
- **Payment Methods**: Cards, Apple Pay, Google Pay
- **Invoicing**: Automated invoice generation

### Backend API Features

#### 1. Authentication & Security
- JWT-based authentication
- Refresh token rotation
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- SQL injection prevention

#### 2. Database Management
- PostgreSQL with Prisma ORM
- Type-safe queries
- Automated migrations
- Database seeding
- Connection pooling

#### 3. Payment Processing
- Stripe integration
- Subscription management
- Credit purchases
- Webhook handling
- Invoice generation

#### 4. Monitoring & Logging
- Winston structured logging
- Health check endpoints
- Error tracking
- Performance metrics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Stripe account
- Expo CLI

### Mobile App Setup

```bash
# Clone repository
git clone https://github.com/wuweillove/agentforge-mobile.git
cd agentforge-mobile

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with database and API credentials

# Start database with Docker
docker-compose up -d db redis

# Run migrations
npx prisma migrate dev

# Seed database
npm run seed

# Start development server
npm run dev
```

Server runs at `http://localhost:3000`

### Production Deployment

```bash
# Build backend Docker image
cd backend
docker build -t agentforge-api:latest .

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy
```

## 💳 Monetization System

### Subscription Tiers

| Feature | Free | Premium ($9.99/mo) | Enterprise ($49.99/mo) |
|---------|------|-------------------|----------------------|
| Workflows | 3 | Unlimited | Unlimited |
| Nodes/Workflow | 10 | 50 | Unlimited |
| API Calls/Month | 100 | 10,000 | Unlimited |
| Storage | 100MB | 10GB | 100GB |
| Support | Community | Email | Priority |
| Analytics | ❌ | ✅ | ✅ |
| Collaboration | ❌ | ❌ | ✅ |

### Credit Packages

| Package | Credits | Bonus | Price | Total Credits |
|---------|---------|-------|-------|---------------|
| Starter | 100 | 0 | $9.99 | 100 |
| Growth | 500 | 50 | $39.99 | 550 |
| Pro | 1,000 | 150 | $69.99 | 1,150 |
| Enterprise | 5,000 | 1,000 | $299.99 | 6,000 |

### Credit Costs

- **Workflow Execution**: 1 credit
- **Node Execution**: 0.1 credit
- **OpenAI API Call**: 2 credits
- **Anthropic API Call**: 3 credits
- **Google AI API Call**: 2 credits
- **Storage (per MB)**: 0.01 credit

## 🔌 API Documentation

### Authentication Endpoints

```http
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login
POST   /api/auth/refresh         # Refresh token
GET    /api/auth/me              # Get current user
PUT    /api/auth/profile         # Update profile
POST   /api/auth/change-password # Change password
```

### Credit Endpoints

```http
GET    /api/credits/balance      # Get balance
GET    /api/credits/history      # Transaction history
POST   /api/credits/purchase     # Purchase credits
POST   /api/credits/usage/track  # Track usage
GET    /api/credits/usage/stats  # Usage statistics
```

### Workflow Endpoints

```http
GET    /api/workflows            # List workflows
POST   /api/workflows            # Create workflow
GET    /api/workflows/:id        # Get workflow
PUT    /api/workflows/:id        # Update workflow
DELETE /api/workflows/:id        # Delete workflow
POST   /api/workflows/:id/deploy # Deploy workflow
```

Full API documentation: [API.md](./docs/API.md)

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts and authentication
- **subscriptions** - Subscription management
- **credits** - Credit balance tracking
- **credit_transactions** - Transaction history
- **workflows** - Workflow definitions
- **executions** - Execution tracking
- **api_keys** - Encrypted API key storage
- **payment_methods** - Saved payment methods
- **invoices** - Invoice records
- **usage_logs** - Usage analytics

See [Prisma Schema](./backend/prisma/schema.prisma) for complete details.

## 🔒 Security Features

### Frontend Security
- ✅ Secure storage (Expo SecureStore)
- ✅ AES-256 encryption for API keys
- ✅ Biometric authentication (Face ID/Touch ID)
- ✅ HTTPS-only communication
- ✅ No sensitive data in logs

### Backend Security
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (Prisma)
- ✅ Rate limiting (100 req/15min)
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation
- ✅ Environment variable management

## 📊 Monitoring & Analytics

### Health Checks
- `GET /health` - Overall health status
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Logging
- Structured JSON logging with Winston
- Log rotation (5MB files, 5 max)
- Error tracking and reporting
- Request/response logging

### Metrics
- User registration and login rates
- Subscription conversions
- Credit purchases and usage
- Workflow execution statistics
- API response times

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

### Frontend Tests

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## 📱 Mobile App Build

### iOS Build

```bash
# Development build
expo build:ios -t simulator

# Production build
eas build --platform ios
```

### Android Build

```bash
# Development build
expo build:android -t apk

# Production build
eas build --platform android
```

## 🚢 Deployment Options

### Backend Deployment

#### Docker (Recommended)
```bash
docker-compose up -d
```

#### Vercel
```bash
vercel --prod
```

#### Railway
```bash
railway up
```

#### Heroku
```bash
git push heroku main
```

### Mobile App Deployment

#### iOS (App Store)
1. Configure app signing in Xcode
2. Build with `eas build --platform ios`
3. Submit to App Store Connect
4. Wait for review approval

#### Android (Google Play)
1. Configure signing in `app.json`
2. Build with `eas build --platform android`
3. Upload to Google Play Console
4. Submit for review

## 🛠️ Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Write code
   - Add tests
   - Update docs

3. **Test Locally**
   ```bash
   npm run dev
   npm test
   ```

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

5. **Create Pull Request**

## 📚 Documentation

- [Backend Documentation](./BACKEND_COMPLETE.md)
- [Monetization Guide](./MONETIZATION.md)
- [API Documentation](./BACKEND.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📈 Roadmap

- [x] Visual workflow builder
- [x] Template system
- [x] Real-time monitoring
- [x] Subscription management
- [x] Credit system
- [x] Payment processing
- [x] API key management
- [x] Admin dashboard
- [x] Complete backend API
- [x] Docker deployment
- [ ] WebSocket real-time updates
- [ ] Team collaboration features
- [ ] Workflow marketplace
- [ ] Advanced analytics
- [ ] Mobile offline mode
- [ ] Voice commands
- [ ] AR visualization
- [ ] White-label solution

## 💰 Revenue Potential

### Projected Monthly Recurring Revenue (MRR)

| Users | 30% Premium | 10% Enterprise | Monthly MRR |
|-------|-------------|----------------|-------------|
| 1,000 | $2,997 | $499 | $3,496 |
| 5,000 | $14,985 | $2,495 | $17,480 |
| 10,000 | $29,970 | $4,990 | $34,960 |
| 50,000 | $149,850 | $24,950 | $174,800 |

Plus credit purchases (estimated 20-30% additional revenue)

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
```bash
# Check database connection
docker-compose ps

# View logs
docker-compose logs app

# Restart services
docker-compose restart
```

**Mobile app build fails**
```bash
# Clear cache
rm -rf node_modules
npm install

# Reset Metro bundler
npm start -- --reset-cache
```

**Database issues**
```bash
# Reset database (development only)
npx prisma migrate reset

# Regenerate Prisma client
npx prisma generate
```

## 📞 Support

- 📧 **Email**: support@agentforge.io
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/wuweillove/agentforge-mobile/issues)
- 📖 **Documentation**: [docs.agentforge.io](https://docs.agentforge.io)
- 💬 **Discord**: [Join Community](https://discord.gg/agentforge)
- 🐦 **Twitter**: [@AgentForgeApp](https://twitter.com/AgentForgeApp)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🙏 Acknowledgments

- React Native & Expo teams
- Prisma for excellent ORM
- Stripe for payment infrastructure
- OpenClaw platform
- All contributors and supporters

---

**Built with ❤️ by Sebastian Llovera Studio**

© 2026 AgentForge. All rights reserved.

## ⭐ Star Us!

If you find this project useful, please star it on GitHub! It helps others discover the project.

[⭐ Star on GitHub](https://github.com/wuweillove/agentforge-mobile)
