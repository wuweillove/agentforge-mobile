# AgentForge Mobile

**Visual workflow builder for autonomous agents with OpenClaw integration + Complete Monetization System**

AgentForge is a comprehensive React Native mobile application that enables users to create, manage, and monitor AI agent workflows with an intuitive drag-and-drop interface. Built with OpenClaw integration for powerful agent orchestration and a complete monetization system including subscriptions, credits, and secure payment processing.

## 🚀 Features

### 🎨 Visual Workflow Builder
- Drag-and-drop node-based interface
- Real-time workflow validation
- Multiple node types: Input, Process, Decision, Output, API Call, AI Agent
- Connection management with automatic routing
- Zoom and pan canvas controls
- Node configuration and customization

### 📋 Template System
- Pre-built workflow templates
- Custom template creation
- Template categories (Data Processing, Communication, Analysis, Automation)
- One-tap template deployment
- Template sharing and importing

### 📊 Real-time Monitoring
- Live agent execution dashboard
- Performance metrics and analytics
- Error tracking and logging
- Execution history
- Resource usage tracking

### 🔧 OpenClaw Integration
- Direct API integration with OpenClaw platform
- Agent deployment and management
- Real-time status updates
- Configuration synchronization
- Workflow version control

### 💰 Monetization System

#### Subscription Plans
- **Free**: 3 workflows, 10 nodes/workflow, 100 API calls/month
- **Premium ($9.99/mo)**: Unlimited workflows, 50 nodes/workflow, 10K API calls/month
- **Enterprise ($49.99/mo)**: Unlimited everything + team collaboration

#### Credit System
- Purchase credit packages (100 - 5,000 credits)
- Pay-as-you-go for usage beyond subscription limits
- Bonus credits on larger packages
- Never-expiring credits
- Real-time usage tracking

#### API Key Management
- Secure encrypted storage for AI provider keys
- Support for OpenAI, Anthropic, Google AI, OpenClaw
- Biometric authentication protection
- Key validation and format checking
- Easy provider switching

#### Payment Processing
- Stripe integration for all transactions
- Credit/debit card support
- Apple Pay & Google Pay ready
- Secure payment method storage
- Invoice generation and history
- Automatic subscription renewal

#### Admin Dashboard
- Revenue analytics and reporting
- User management and insights
- Transaction monitoring
- Subscription metrics (MRR, churn, etc.)
- Credit usage analytics

## 🛠 Tech Stack

### Mobile App
- **Framework**: React Native (Expo ~50.0.0)
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **UI Components**: React Native Paper
- **Storage**: AsyncStorage + Expo SecureStore
- **API Client**: Axios
- **Graphics**: React Native SVG
- **Payments**: Stripe React Native SDK
- **Authentication**: Expo Local Authentication (Biometric)
- **Security**: Crypto-JS for encryption

### Backend Requirements
- **Runtime**: Node.js 18+
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Payments**: Stripe API
- **Authentication**: JWT

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for emulators)
- Expo Go app on physical device (optional)
- Stripe account for payment processing
- PostgreSQL and Redis for backend (see BACKEND.md)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/wuweillove/agentforge-mobile.git
cd agentforge-mobile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the root directory:
```env
# API Configuration
OPENCLAW_API_URL=https://api.openclaw.io
OPENCLAW_API_KEY=your_openclaw_api_key

# Backend API
API_BASE_URL=https://api.agentforge.io
# or for local development:
# API_BASE_URL=http://localhost:3000/api

# Stripe (use test keys for development)
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Start the development server
```bash
npm start
```

## 📱 Running the App

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Expo Go (Physical Device)
1. Install Expo Go from App Store or Google Play
2. Scan the QR code from the terminal

### Web Browser
```bash
npm run web
```

## 📁 Project Structure

```
agentforge-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── WorkflowCanvas.js     # Main workflow canvas
│   │   ├── NodePalette.js        # Node selection palette
│   │   ├── AgentNode.js          # Individual workflow node
│   │   ├── TemplateCard.js       # Template display card
│   │   └── DashboardMetrics.js   # Metrics dashboard
│   ├── screens/             # App screens
│   │   ├── HomeScreen.js              # Dashboard home
│   │   ├── WorkflowBuilderScreen.js  # Workflow editor
│   │   ├── TemplatesScreen.js         # Template library
│   │   ├── MonitorScreen.js           # Agent monitoring
│   │   ├── SettingsScreen.js          # App settings
│   │   ├── APIKeysScreen.js           # API key management
│   │   ├── CreditsScreen.js           # Credit purchase & history
│   │   ├── SubscriptionScreen.js      # Subscription management
│   │   ├── PaymentScreen.js           # Payment methods
│   │   └── AdminDashboardScreen.js    # Admin analytics
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js       # Main navigator
│   ├── services/            # API and data services
│   │   ├── OpenClawAPI.js        # OpenClaw API client
│   │   ├── StorageService.js     # Local storage
│   │   ├── SecureStorage.js      # Encrypted key storage
│   │   ├── StripePayments.js     # Payment processing
│   │   ├── AuthService.js        # Authentication
│   │   └── CreditService.js      # Credit management
│   ├── store/               # State management
│   │   ├── workflowStore.js      # Workflow state
│   │   └── userStore.js          # User & subscription state
│   └── utils/               # Utility functions
│       ├── constants.js          # App constants
│       └── helpers.js            # Helper functions
├── assets/                  # Images and icons
├── App.js                   # App entry point
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── MONETIZATION.md          # Monetization guide
└── BACKEND.md              # Backend API docs
```

## 🎯 Usage Guide

### Creating a Workflow

1. **Navigate to Workflow Builder**
   - Tap the "Workflow" tab or "New Workflow" button

2. **Add Nodes**
   - Tap the + button to open the node palette
   - Select a node type (Input, Process, Decision, API Call, AI Agent, Output)
   - Tap on the canvas to place the node
   - Configure node properties by selecting it

3. **Connect Nodes**
   - Tap the output connector on a node
   - Tap the input connector on the target node
   - Connections validate automatically

4. **Save and Deploy**
   - Tap "Save" to store locally
   - Tap "Deploy" to push to OpenClaw and activate

### Using Templates

1. Go to the "Templates" tab
2. Browse available templates by category
3. Tap a template to preview details
4. Tap "Use Template" to create a new workflow from it
5. Customize the workflow as needed

### Managing API Keys

1. Navigate to Settings → API Keys
2. Select an AI provider (OpenAI, Anthropic, Google, OpenClaw)
3. Tap "Add Key" and enter your API key
4. Keys are encrypted and stored securely on your device
5. Enable biometric authentication for extra security

### Purchasing Credits

1. Go to Settings → Credits
2. View your current balance
3. Select a credit package (100 - 5,000 credits)
4. Add a payment method or use an existing one
5. Confirm purchase
6. Credits are added instantly

### Managing Subscription

1. Navigate to Settings → Subscription
2. View current plan and features
3. Select a different tier to upgrade/downgrade
4. Confirm payment details
5. Changes take effect immediately

### Monitoring Agents

1. Navigate to "Monitor" tab
2. View active agents and their status
3. Tap an agent for detailed metrics
4. Check execution logs and error reports
5. Track resource usage and costs

## 💳 Monetization Details

### Subscription Pricing

| Tier | Price | Workflows | Nodes | API Calls | Storage | Support |
|------|-------|-----------|-------|-----------|---------|---------|
| Free | $0 | 3 | 10/workflow | 100/mo | 100MB | Community |
| Premium | $9.99/mo | Unlimited | 50/workflow | 10K/mo | 10GB | Email |
| Enterprise | $49.99/mo | Unlimited | Unlimited | Unlimited | 100GB | Priority |

### Credit Packages

| Package | Credits | Bonus | Price | Total |
|---------|---------|-------|-------|-------|
| Starter | 100 | 0 | $9.99 | 100 |
| Growth | 500 | 50 | $39.99 | 550 |
| Pro | 1,000 | 150 | $69.99 | 1,150 |
| Enterprise | 5,000 | 1,000 | $299.99 | 6,000 |

### Credit Costs

- Workflow Execution: 1 credit
- Node Execution: 0.1 credit  
- OpenAI API Call: 2 credits
- Anthropic API Call: 3 credits
- Google AI API Call: 2 credits
- Storage (per MB): 0.01 credit

## 🔒 Security Features

### Encryption
- AES-256 encryption for API keys
- Encrypted local storage for sensitive data
- Secure HTTPS communication only

### Authentication
- JWT-based authentication
- Biometric authentication (Face ID/Touch ID)
- Automatic token refresh
- Secure session management

### Payment Security
- PCI DSS compliant (via Stripe)
- No card data stored on device
- 3D Secure support
- Fraud detection

### Privacy
- GDPR compliant
- Data export available
- Account deletion removes all data
- Privacy policy included

## 🚀 Backend Setup

See [BACKEND.md](./BACKEND.md) for complete backend API documentation including:
- API endpoints
- Database schema
- Stripe integration
- Webhook handlers
- Deployment guides

Quick start:
```bash
# Clone backend starter
git clone https://github.com/agentforge/backend-api
cd backend-api

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Run migrations
npm run migrate

# Start server
npm start
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

### Test Mode
All Stripe features work in test mode without real charges. Use test API keys:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📦 Building for Production

### Create production build
```bash
expo build:android
expo build:ios
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

### Environment Setup
1. Update `app.json` with production settings
2. Configure Stripe production keys
3. Set production API URLs
4. Enable analytics tracking

## 📊 Analytics & Monitoring

### Integrated Analytics
- User activity tracking
- Workflow execution metrics
- Error monitoring
- Revenue tracking
- Conversion funnels

### Admin Dashboard Access
Admin users can access comprehensive analytics:
- Monthly Recurring Revenue (MRR)
- User growth and churn
- Subscription distribution
- Credit purchase trends
- Transaction history

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow React Native best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure code is properly formatted

## 🗺 Roadmap

- [x] Visual workflow builder
- [x] Template system
- [x] Real-time monitoring
- [x] Subscription management
- [x] Credit system
- [x] Payment processing
- [x] API key management
- [x] Admin dashboard
- [ ] Multi-user collaboration
- [ ] Cloud workflow sync
- [ ] Advanced node types (ML models, webhooks)
- [ ] Workflow versioning
- [ ] Export/import workflows
- [ ] Dark/light theme toggle
- [ ] Offline mode with sync
- [ ] Widget support
- [ ] Voice commands
- [ ] AR workflow visualization
- [ ] Team plans with user seats
- [ ] White-label enterprise solution

## 🐛 Troubleshooting

### Common Issues

**Metro bundler not starting**
```bash
npm start -- --reset-cache
```

**iOS build fails**
```bash
cd ios && pod install && cd ..
```

**Android build fails**
```bash
cd android && ./gradlew clean && cd ..
```

**Stripe payment not working**
- Verify you're using correct publishable key
- Check Stripe dashboard for webhook configuration
- Ensure backend API is running
- Test with Stripe test cards first

**API keys not saving**
- Check device biometric settings
- Verify Expo SecureStore is properly installed
- Try reinstalling the app

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- OpenClaw platform for agent orchestration
- React Native community
- Expo team for excellent tooling
- Stripe for payment infrastructure
- All contributors and supporters

## 📞 Support

- 📧 Email: support@agentforge.io
- 🐛 Issues: [GitHub Issues](https://github.com/wuweillove/agentforge-mobile/issues)
- 📖 Docs: [Documentation](https://docs.agentforge.io)
- 💬 Discord: [Community Server](https://discord.gg/agentforge)
- 🐦 Twitter: [@AgentForgeApp](https://twitter.com/AgentForgeApp)

## 💼 Business

For enterprise inquiries:
- Email: enterprise@agentforge.io
- Schedule demo: [calendly.com/agentforge](https://calendly.com/agentforge)

---

**Built with ❤️ by Sebastian Llovera Studio**

© 2026 AgentForge. All rights reserved.
