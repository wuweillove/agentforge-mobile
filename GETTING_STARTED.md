# Getting Started with AgentForge

**Quick start guide to get AgentForge running in 10 minutes**

---

## 🚀 Quick Start (Development)

### Prerequisites

Install these tools:
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`

### Step 1: Clone Repository

```bash
git clone https://github.com/wuweillove/agentforge-mobile.git
cd agentforge-mobile
```

### Step 2: Start Backend Services

```bash
cd backend

# Copy environment file
cp .env.example .env

# Start PostgreSQL, Redis, and API server
docker-compose up -d

# Wait for services to start (30 seconds)
sleep 30

# Run database migrations
npm run migrate

# Seed demo data
npm run seed
```

Backend API now running at `http://localhost:3000`

Test it:
```bash
curl http://localhost:3000/health
```

### Step 3: Start Mobile App

```bash
# Open new terminal
cd ..  # Return to root directory

# Install dependencies
npm install

# Start Expo
npm start
```

### Step 4: Run the App

Choose one:
- **iOS**: Press `i` to open iOS simulator
- **Android**: Press `a` to open Android emulator
- **Web**: Press `w` to open in browser
- **Device**: Scan QR code with Expo Go app

---

## 🎯 First Time Setup

### 1. Create Account

1. Launch the app
2. Tap \"Settings\" → \"Sign Up\"
3. Enter email, password, name
4. Tap \"Create Account\"

**Demo Credentials:**
- Email: `user1@example.com`
- Password: `DemoPass123!`

### 2. Add API Key (Optional)

1. Go to Settings → API Keys
2. Select a provider (e.g., OpenAI)
3. Tap \"Add Key\"
4. Enter your API key
5. Tap \"Save\"

Get API keys:
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- Google: https://makersuite.google.com/

### 3. Create Your First Workflow

1. Tap \"Home\" → \"New Workflow\"
2. Tap the + button to add nodes
3. Select \"Input\" node
4. Tap canvas to place it
5. Add more nodes (Process, Output)
6. Connect nodes by tapping connectors
7. Tap \"Save\"
8. Enter workflow name
9. Tap \"Deploy\" to activate

### 4. Try a Template

1. Go to \"Templates\" tab
2. Browse templates
3. Tap \"Data Processing Pipeline\"
4. Tap \"Use Template\"
5. Customize as needed
6. Save and deploy

---

## 💳 Testing Payments

### Use Stripe Test Cards

**Successful Payment:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/26)
CVV: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**Declined Payment:**
```
Card Number: 4000 0000 0000 0002
```

### Purchase Credits

1. Go to Settings → Credits
2. Tap \"Add Credits\"
3. Select a package
4. Enter test card details
5. Tap \"Confirm Purchase\"

### Upgrade Subscription

1. Go to Settings → Subscription
2. Select \"Premium\" or \"Enterprise\"
3. Enter test card details
4. Tap \"Confirm\"

---

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Required
DATABASE_URL=postgresql://user:pass@localhost:5432/agentforge
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_...

# Optional
REDIS_URL=redis://localhost:6379
ADMIN_EMAIL=admin@agentforge.io
```

### Mobile App Configuration

Edit `.env` in root:

```env
API_BASE_URL=http://localhost:3000/api
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

For iOS simulator, use:
```env
API_BASE_URL=http://127.0.0.1:3000/api
```

For Android emulator, use:
```env
API_BASE_URL=http://10.0.2.2:3000/api
```

---

## 📱 Common Tasks

### Create a Workflow

```
1. Home → New Workflow
2. Add nodes from palette
3. Connect nodes
4. Configure each node
5. Save workflow
6. Deploy to activate
```

### Monitor Execution

```
1. Monitor tab
2. View active agents
3. Tap agent for details
4. Check logs and metrics
5. Review execution history
```

### Manage Subscription

```
1. Settings → Subscription
2. View current plan
3. Select new tier
4. Confirm payment
5. Access new features
```

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check Docker containers
docker-compose ps

# View logs
docker-compose logs api

# Restart services
docker-compose restart

# Reset everything
docker-compose down -v
docker-compose up -d
```

### Mobile app errors

```bash
# Clear cache
npm start -- --reset-cache

# Reinstall dependencies
rm -rf node_modules
npm install

# Clear Expo cache
expo start -c
```

### Database connection failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U agentforge -c \"SELECT 1\"

# View database logs
docker-compose logs postgres
```

### API key not saving

1. Check device biometric settings
2. Verify SecureStore permissions
3. Try reinstalling the app
4. Check backend logs for errors

---

## 📖 Learn More

### Mobile App Development
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

### Backend Development
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)
- [Stripe Documentation](https://stripe.com/docs)

### AgentForge Resources
- **Main README**: [README.md](./README.md)
- **API Docs**: [BACKEND.md](./BACKEND.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Monetization**: [MONETIZATION.md](./MONETIZATION.md)

---

## 🎓 Video Tutorials (Coming Soon)

1. **Setup & Installation** (5 min)
2. **Creating Your First Workflow** (10 min)
3. **Using Templates** (5 min)
4. **API Key Management** (7 min)
5. **Monitoring & Analytics** (8 min)
6. **Deploying to Production** (15 min)

---

## 💬 Get Help

### Community
- Discord: discord.gg/agentforge
- GitHub Discussions: github.com/wuweillove/agentforge-mobile/discussions
- Twitter: @AgentForgeApp

### Support
- Email: support@agentforge.io
- Docs: docs.agentforge.io
- FAQ: agentforge.io/faq

### Enterprise
- Email: enterprise@agentforge.io
- Schedule Demo: calendly.com/agentforge

---

## ✅ Quick Checklist

Before you start developing:

- [ ] Node.js 18+ installed
- [ ] Docker Desktop running
- [ ] Repository cloned
- [ ] Backend services started
- [ ] Migrations completed
- [ ] Mobile app running
- [ ] Can access API health endpoint
- [ ] Can create test workflow

You're ready to build! 🎉

---

**Next Steps:**
1. Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for architecture
2. Explore [MONETIZATION.md](./MONETIZATION.md) for pricing details
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

---

**Built by Sebastian Llovera Studio**
