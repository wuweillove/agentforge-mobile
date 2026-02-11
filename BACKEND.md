# AgentForge Backend API Documentation

## Overview

This document describes the backend API required to support the AgentForge mobile app monetization features.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Payments**: Stripe
- **Authentication**: JWT

## Setup

### Installation

```bash
mkdir agentforge-api && cd agentforge-api
npm init -y
npm install express stripe pg redis jsonwebtoken bcryptjs dotenv cors
```

### Environment Variables

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/agentforge
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Response 201:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

### Subscriptions

#### Get Current Subscription
```http
GET /api/subscriptions/current
Authorization: Bearer {token}

Response 200:
{
  "tier": "premium",
  "status": "active",
  "currentPeriodStart": "2026-01-01T00:00:00Z",
  "currentPeriodEnd": "2026-02-01T00:00:00Z",
  "cancelAtPeriodEnd": false,
  "features": {
    "maxWorkflows": -1,
    "maxNodes": 50,
    "apiCallsPerMonth": 10000
  }
}
```

#### Create Subscription
```http
POST /api/subscriptions/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "priceId": "price_premium_monthly",
  "paymentMethodId": "pm_card_visa"
}

Response 201:
{
  "subscription": { ... },
  "clientSecret": "seti_..._secret_..."
}
```

#### Cancel Subscription
```http
POST /api/subscriptions/cancel
Authorization: Bearer {token}

Response 200:
{
  "subscription": {
    "status": "active",
    "cancelAtPeriodEnd": true
  }
}
```

### Credits

#### Get Balance
```http
GET /api/credits/balance
Authorization: Bearer {token}

Response 200:
{
  "balance": 1500,
  "lastUpdated": "2026-02-10T22:00:00Z"
}
```

#### Purchase Credits
```http
POST /api/credits/purchase
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 39.99,
  "paymentMethodId": "pm_card_visa"
}

Response 200:
{
  "status": "succeeded",
  "credits": 550,
  "transactionId": "txn_..."
}
```

#### Track Usage
```http
POST /api/usage/track
Authorization: Bearer {token}
Content-Type: application/json

{
  "workflowId": "workflow_123",
  "resourceType": "workflow_execution",
  "amount": 1,
  "timestamp": "2026-02-10T22:00:00Z"
}

Response 200:
{
  "success": true,
  "creditsCharged": 1.5,
  "remainingBalance": 1498.5
}
```

### Payment Methods

#### List Payment Methods
```http
GET /api/payment-methods
Authorization: Bearer {token}

Response 200:
{
  "paymentMethods": [
    {
      "id": "pm_...",
      "brand": "Visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2026,
      "isDefault": true
    }
  ]
}
```

#### Add Payment Method
```http
POST /api/payment-methods/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethodId": "pm_..."
}

Response 201:
{
  "paymentMethod": { ... }
}
```

## Implementation Examples

### Express Server Setup

```javascript
// server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redisClient = redis.createClient({ url: process.env.REDIS_URL });

app.use(express.json());
app.use(require('cors')());

// Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.listen(process.env.PORT || 3000);
```

### Subscription Creation

```javascript
app.post('/api/subscriptions/create', authenticate, async (req, res) => {
  const { priceId, paymentMethodId } = req.body;
  
  try {
    // Get or create Stripe customer
    const user = await pool.query(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [req.userId]
    );
    
    let customerId = user.rows[0].stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.rows[0].email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      
      customerId = customer.id;
      
      await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, req.userId]
      );
    }
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    
    // Save to database
    await pool.query(
      `INSERT INTO subscriptions (user_id, stripe_subscription_id, tier, status)
       VALUES ($1, $2, $3, $4)`,
      [req.userId, subscription.id, getTierFromPrice(priceId), subscription.status]
    );
    
    res.json({
      subscription,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Credit Purchase

```javascript
app.post('/api/credits/purchase', authenticate, async (req, res) => {
  const { amount, paymentMethodId } = req.body;
  
  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });
    
    if (paymentIntent.status === 'succeeded') {
      // Calculate credits based on package
      const credits = calculateCredits(amount);
      
      // Update credits balance
      await pool.query(
        `INSERT INTO credit_transactions (user_id, type, amount, reason, balance_after)
         VALUES ($1, 'credit', $2, 'purchase', 
                (SELECT balance + $2 FROM credits WHERE user_id = $1))`,
        [req.userId, credits]
      );
      
      await pool.query(
        'UPDATE credits SET balance = balance + $1 WHERE user_id = $2',
        [credits, req.userId]
      );
      
      res.json({
        status: 'succeeded',
        credits,
        transactionId: paymentIntent.id,
      });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Stripe Webhooks

```javascript
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

## Deployment

### Recommended Platform: Railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --database postgresql

# Add Redis
railway add --database redis

# Deploy
railway up
```

### Alternative: Heroku

```bash
heroku create agentforge-api
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
git push heroku main
```

## Security Checklist

- [ ] HTTPS enforced in production
- [ ] JWT tokens expire after 24 hours
- [ ] Rate limiting on auth endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] CORS configured for mobile app domain
- [ ] Stripe webhook signature verification
- [ ] Password hashing with bcrypt (10+ rounds)
- [ ] Environment variables never committed
- [ ] Database backups enabled
- [ ] Error messages don't expose sensitive data

## Monitoring

### Recommended Tools

- **Error Tracking**: Sentry
- **Performance**: New Relic / DataDog
- **Logs**: Papertrail / LogDNA
- **Uptime**: Pingdom / UptimeRobot

### Key Metrics to Track

- API response times
- Error rates
- Database query performance
- Stripe webhook delivery
- Active subscriptions
- Credit purchase volume

## Support

For backend issues:
- Email: backend@agentforge.io
- Slack: #backend-support
