# AgentForge Monetization Guide

## Overview

AgentForge implements a comprehensive monetization system with three revenue streams:

1. **Subscription Plans** - Recurring monthly revenue
2. **Credit Purchases** - One-time purchases for usage
3. **API Key Management** - User-owned API keys for AI providers

## Subscription Tiers

### Free Tier
- **Price**: $0/month
- **Features**:
  - 3 workflows maximum
  - 10 nodes per workflow
  - 100 API calls per month
  - 100MB storage
  - Community support
  - No analytics
  - No collaboration

### Premium Tier
- **Price**: $9.99/month
- **Features**:
  - Unlimited workflows
  - 50 nodes per workflow
  - 10,000 API calls per month
  - 10GB storage
  - Email support
  - Advanced analytics
  - No collaboration

### Enterprise Tier
- **Price**: $49.99/month
- **Features**:
  - Unlimited workflows
  - Unlimited nodes
  - Unlimited API calls
  - 100GB storage
  - Priority support
  - Advanced analytics
  - Team collaboration

## Credit System

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

### Credit Usage Tracking

Credits are automatically deducted when:
- Executing workflows
- Making AI API calls
- Storing data
- Processing operations

## API Key Management

### Supported Providers

1. **OpenAI**
   - Models: GPT-4, GPT-3.5, DALL-E
   - Key Format: `sk-...`
   - [Get API Key](https://platform.openai.com/signup)

2. **Anthropic**
   - Models: Claude 3, Claude 2
   - Key Format: `sk-ant-...`
   - [Get API Key](https://console.anthropic.com/)

3. **Google AI**
   - Models: Gemini Pro, PaLM
   - Key Format: `AIza...`
   - [Get API Key](https://makersuite.google.com/)

4. **OpenClaw**
   - AgentForge Platform API
   - Key Format: `oc-...`
   - [Get API Key](https://openclaw.io/signup)

### Security

- All API keys are encrypted using AES-256
- Keys are stored in device secure storage (Keychain/Keystore)
- Keys never leave the device unencrypted
- Biometric authentication option available

## Payment Processing

### Stripe Integration

AgentForge uses Stripe for:
- Subscription management
- Credit purchases
- Payment method storage
- Invoice generation

### Payment Methods

- Credit/Debit Cards (Visa, Mastercard, Amex)
- Apple Pay (iOS)
- Google Pay (Android)

### Billing

- Subscriptions billed monthly on signup date
- Failed payments retry automatically
- Grace period: 3 days
- Cancellation: Immediate, access until period end

## Implementation Guide

### Backend Setup

#### Required Environment Variables

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

#### API Endpoints

**Authentication**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
PUT /api/auth/profile
```

**Subscriptions**
```
GET /api/subscriptions/current
POST /api/subscriptions/create
PUT /api/subscriptions/update
POST /api/subscriptions/cancel
```

**Credits**
```
GET /api/credits/balance
GET /api/credits/history
POST /api/credits/purchase
POST /api/usage/track
```

**Payment Methods**
```
GET /api/payment-methods
POST /api/payment-methods/add
PUT /api/payment-methods/default
DELETE /api/payment-methods/:id
```

**Invoices**
```
GET /api/invoices
GET /api/invoices/:id/pdf
```

### Frontend Implementation

#### Initialize Stripe

```javascript
import { StripeProvider } from '@stripe/stripe-react-native';

const STRIPE_PUBLISHABLE_KEY = 'pk_live_...';

<StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
  <App />
</StripeProvider>
```

#### Purchase Credits

```javascript
import CreditService from './services/CreditService';
import { useStripe } from '@stripe/stripe-react-native';

const { confirmPayment } = useStripe();

const handlePurchase = async (packageId) => {
  try {
    // Create payment intent
    const { clientSecret } = await CreditService.createPaymentIntent(packageId);
    
    // Confirm payment
    const { error } = await confirmPayment(clientSecret);
    
    if (!error) {
      // Update credits
      await CreditService.addCredits(package.credits);
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

#### Create Subscription

```javascript
const handleSubscribe = async (tier) => {
  try {
    const subscription = await StripePayments.createSubscription(
      tier.priceId,
      paymentMethodId
    );
    
    // Update user subscription
    await updateSubscription(subscription);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_subscription_id VARCHAR(255),
  tier VARCHAR(50),
  status VARCHAR(50),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE
);

-- Credits Table
CREATE TABLE credits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Credit Transactions Table
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20), -- 'credit' or 'debit'
  amount INTEGER,
  reason VARCHAR(255),
  balance_after INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking Table
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  workflow_id UUID,
  resource_type VARCHAR(50),
  amount DECIMAL(10, 2),
  credits_charged DECIMAL(10, 2),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## Analytics & Reporting

### Key Metrics

1. **Revenue Metrics**
   - Monthly Recurring Revenue (MRR)
   - Annual Recurring Revenue (ARR)
   - Average Revenue Per User (ARPU)
   - Customer Lifetime Value (LTV)

2. **User Metrics**
   - Total users
   - Active users (DAU/MAU)
   - Conversion rate (free → paid)
   - Churn rate

3. **Product Metrics**
   - Workflow executions
   - API calls per user
   - Feature usage
   - Error rates

### Admin Dashboard

Access the admin dashboard:

```javascript
import AdminDashboardScreen from './screens/AdminDashboardScreen';

// Add to navigation (protected route)
<Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
```

## Testing

### Stripe Test Mode

Use test card numbers:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Requires Authentication: `4000 0025 0000 3155`

### Test API Keys

```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Compliance

### GDPR
- User data export available
- Account deletion removes all data
- Privacy policy required

### PCI DSS
- No card data stored on device
- All payments processed through Stripe
- Secure API communication (HTTPS only)

### App Store Guidelines
- In-app purchases use native APIs
- Clear pricing displayed
- Terms of service required
- Refund policy documented

## Support

### Cancellation Flow

1. User navigates to Subscription screen
2. Taps "Cancel Subscription"
3. Confirms cancellation
4. Subscription cancels at period end
5. User retains access until billing date

### Refund Policy

- Subscriptions: Pro-rated refund within 7 days
- Credits: No refunds (unused credits never expire)
- Contact: support@agentforge.io

## Future Enhancements

- [ ] Annual subscription discount (2 months free)
- [ ] Team plans with user seats
- [ ] Credit rollover/expiration
- [ ] Referral rewards program
- [ ] Usage-based pricing tiers
- [ ] White-label enterprise solution
