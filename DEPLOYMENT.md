# AgentForge Deployment Guide

Complete deployment guide for both mobile app and backend infrastructure.

## Table of Contents

1. [Backend API Deployment](#backend-api-deployment)
2. [Mobile App Deployment](#mobile-app-deployment)
3. [Database Setup](#database-setup)
4. [Stripe Configuration](#stripe-configuration)
5. [Monitoring & Maintenance](#monitoring--maintenance)

## Backend API Deployment

### Option 1: Docker (Recommended for Development)

#### Prerequisites
- Docker and Docker Compose installed
- Stripe API keys

#### Steps

```bash
cd backend

# Copy environment file
cp .env.example .env

# Update .env with your credentials
vim .env

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f api

# Stop services
docker-compose down
```

API will be available at `http://localhost:3000`

### Option 2: Railway.app (Recommended for Production)

#### Prerequisites
- Railway account
- Railway CLI installed

#### Steps

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add --database postgresql

# Add Redis
railway add --database redis

# Set environment variables
railway variables set JWT_SECRET=your_secret_here
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set STRIPE_WEBHOOK_SECRET=whsec_...

# Deploy
cd backend
railway up

# Run migrations
railway run npm run migrate

# Seed database
railway run npm run seed
```

### Option 3: Vercel (Serverless)

#### Prerequisites
- Vercel account
- Vercel CLI installed

#### Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from backend directory
cd backend
vercel

# Set environment variables in Vercel dashboard
# Or use CLI:
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add JWT_SECRET
vercel env add STRIPE_SECRET_KEY

# Deploy to production
vercel --prod
```

**Note**: You'll need external PostgreSQL (Supabase, Neon) and Redis (Upstash) for Vercel.

### Option 4: Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create agentforge-api

# Add addons
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...

# Deploy
cd backend
git subtree push --prefix backend heroku main

# Run migrations
heroku run npm run migrate
heroku run npm run seed
```

### Option 5: Manual VPS (DigitalOcean, AWS EC2, etc.)

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Redis
sudo apt-get install redis-server

# Clone repository
git clone https://github.com/wuweillove/agentforge-mobile.git
cd agentforge-mobile/backend

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
vim .env

# Run migrations
npm run migrate
npm run seed

# Install PM2 for process management
sudo npm install -g pm2

# Start server
pm2 start server.js --name agentforge-api

# Setup PM2 to start on boot
pm2 startup
pm2 save

# Setup nginx reverse proxy
sudo apt-get install nginx
# Configure nginx (see nginx.conf example below)
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.agentforge.io;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Mobile App Deployment

### iOS App Store

#### Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- EAS CLI installed

#### Steps

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Google Play Store

#### Prerequisites
- Google Play Developer Account ($25 one-time)
- EAS CLI installed

#### Steps

```bash
# Build for Android
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

### Expo Updates (Over-the-Air)

```bash
# Publish update without rebuilding
eas update --branch production --message "Bug fixes"
```

## Database Setup

### PostgreSQL

#### Local Setup

```bash
# Install PostgreSQL
# macOS:
brew install postgresql@14
brew services start postgresql@14

# Ubuntu:
sudo apt-get install postgresql-14

# Create database
createdb agentforge

# Run migrations
cd backend
npm run migrate
npm run seed
```

#### Cloud PostgreSQL

**Supabase (Free tier available)**
1. Create account at supabase.com
2. Create new project
3. Copy connection string
4. Update DATABASE_URL in .env
5. Run migrations remotely

**Neon (Free tier available)**
1. Create account at neon.tech
2. Create new project
3. Copy connection string
4. Update DATABASE_URL

**Railway**
1. Add PostgreSQL plugin in Railway dashboard
2. Copy DATABASE_URL from variables
3. Run migrations

### Redis

#### Local Setup

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis
```

#### Cloud Redis

**Upstash (Free tier available)**
1. Create account at upstash.com
2. Create Redis database
3. Copy connection URL
4. Update REDIS_URL in .env

**Railway**
1. Add Redis plugin in Railway dashboard
2. Copy REDIS_URL from variables

## Stripe Configuration

### 1. Create Stripe Account

1. Sign up at stripe.com
2. Complete account verification
3. Get API keys from Dashboard → Developers → API keys

### 2. Create Products and Prices

```bash
cd backend
chmod +x scripts/stripe-setup.sh
./scripts/stripe-setup.sh
```

Or manually:

**Premium Plan**
```bash
stripe products create \
  --name="AgentForge Premium" \
  --description="Unlimited workflows, 50 nodes, 10K API calls/month"

stripe prices create \
  --product=prod_xxx \
  --unit-amount=999 \
  --currency=usd \
  --recurring-interval=month
```

**Enterprise Plan**
```bash
stripe products create \
  --name="AgentForge Enterprise" \
  --description="Unlimited everything + team collaboration"

stripe prices create \
  --product=prod_xxx \
  --unit-amount=4999 \
  --currency=usd \
  --recurring-interval=month
```

### 3. Configure Webhooks

**For Local Development:**
```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

**For Production:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://api.agentforge.io/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### 4. Update Mobile App

Update `src/services/StripePayments.js` with your API URL:
```javascript
const API_BASE_URL = 'https://api.agentforge.io';
```

## Complete Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Stripe products/prices created
- [ ] Webhook endpoints configured
- [ ] SSL certificate obtained (for production)
- [ ] Domain configured
- [ ] Monitoring tools setup

### Backend Deployment

- [ ] Deploy PostgreSQL database
- [ ] Deploy Redis cache
- [ ] Run database migrations
- [ ] Seed initial data (if needed)
- [ ] Deploy API server
- [ ] Configure environment variables
- [ ] Setup SSL/HTTPS
- [ ] Configure Stripe webhooks
- [ ] Test health endpoint
- [ ] Verify API functionality
- [ ] Setup monitoring
- [ ] Configure backups

### Mobile App Deployment

- [ ] Update API URLs to production
- [ ] Update Stripe publishable key
- [ ] Test on physical devices
- [ ] Create app store assets (icons, screenshots)
- [ ] Write app store descriptions
- [ ] Build production APK/IPA
- [ ] Submit to Play Store
- [ ] Submit to App Store
- [ ] Setup app analytics
- [ ] Configure push notifications (if applicable)

### Post-Deployment

- [ ] Monitor error logs
- [ ] Check health endpoints
- [ ] Verify payments working
- [ ] Test subscription flow
- [ ] Test credit purchases
- [ ] Monitor API performance
- [ ] Setup alerts
- [ ] Document deployment

## Environment-Specific Configuration

### Development

```env
NODE_ENV=development
API_BASE_URL=http://localhost:3000
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Staging

```env
NODE_ENV=staging
API_BASE_URL=https://staging-api.agentforge.io
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Production

```env
NODE_ENV=production
API_BASE_URL=https://api.agentforge.io
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## Monitoring & Maintenance

### Health Monitoring

```bash
# Check API health
curl https://api.agentforge.io/health

# Check database
curl https://api.agentforge.io/health/ready

# Check if server is alive
curl https://api.agentforge.io/health/live
```

### Logs

```bash
# Docker
docker-compose logs -f api

# PM2
pm2 logs agentforge-api

# Railway
railway logs

# Heroku
heroku logs --tail
```

### Database Backups

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Automated backups (cron job)
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/agentforge_$(date +\%Y\%m\%d).sql.gz
```

### Scaling

#### Horizontal Scaling

```bash
# Railway
railway scale --replicas 3

# Heroku
heroku ps:scale web=3

# Docker Swarm
docker service scale agentforge-api=3
```

#### Database Scaling

- Add read replicas for PostgreSQL
- Implement connection pooling (PgBouncer)
- Use Redis for session storage
- Add database indexes for slow queries

## Security Hardening

### SSL/HTTPS

```bash
# Using Let's Encrypt with Certbot
sudo apt-get install certbot
sudo certbot --nginx -d api.agentforge.io
```

### Firewall

```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### Environment Variables

- Never commit `.env` files
- Use secret management services:
  - AWS Secrets Manager
  - HashiCorp Vault
  - Railway/Vercel environment variables

### Database Security

```sql
-- Create read-only user for analytics
CREATE USER analytics WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE agentforge TO analytics;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics;
```

## Rollback Procedures

### Backend Rollback

```bash
# Docker
docker-compose down
docker-compose up -d --force-recreate

# Railway
railway rollback

# Heroku
heroku releases:rollback v123
```

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

### Mobile App Rollback

```bash
# Revert to previous Expo update
eas update --branch production --message "Rollback" --republish
```

## Performance Optimization

### API Optimization

1. Enable Redis caching
2. Add database indexes
3. Use connection pooling
4. Enable gzip compression
5. Implement CDN for static assets

### Database Optimization

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM workflows WHERE user_id = 'xxx';

-- Add indexes for slow queries
CREATE INDEX idx_workflows_user_status ON workflows(user_id, status);

-- Vacuum database
VACUUM ANALYZE;
```

### Mobile App Optimization

1. Enable Hermes engine
2. Optimize images
3. Lazy load screens
4. Implement pagination
5. Cache API responses

## Troubleshooting

### API Not Responding

```bash
# Check if server is running
curl http://localhost:3000/health

# Check logs
tail -f logs/error.log

# Restart server
pm2 restart agentforge-api
# or
docker-compose restart api
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity"
```

### Stripe Webhook Issues

```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/webhooks/stripe

# Trigger test event
stripe trigger customer.subscription.created

# Check webhook logs in Stripe dashboard
```

### Mobile App Build Issues

```bash
# Clear cache
expo start -c

# Clear metro cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Cost Estimates

### Development (Free Tier)

- Railway: Free tier (512MB RAM, $5 credit/month)
- Supabase: Free tier (500MB database)
- Upstash: Free tier (10K requests/day)
- Vercel: Free tier (serverless functions)
- **Total: $0/month**

### Production (Small Scale)

- Railway: Starter plan ($5/month + usage)
- PostgreSQL: Railway add-on ($5/month)
- Redis: Upstash Pay-as-you-go (~$5/month)
- Stripe: 2.9% + 30¢ per transaction
- **Total: ~$15-20/month + transaction fees**

### Production (Medium Scale)

- Railway: Pro plan or AWS EC2 ($20-50/month)
- PostgreSQL: Managed instance ($25/month)
- Redis: Managed instance ($15/month)
- CDN: Cloudflare (free) or AWS CloudFront ($5/month)
- Monitoring: Sentry ($26/month)
- **Total: ~$80-120/month + transaction fees**

## Monitoring Services

### Error Tracking

**Sentry**
```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

**New Relic**
```bash
npm install newrelic
```

**DataDog**
```bash
npm install dd-trace
```

### Uptime Monitoring

- UptimeRobot (free)
- Pingdom
- StatusCake

## Support

For deployment issues:
- Email: devops@agentforge.io
- Discord: #deployment channel
- Docs: docs.agentforge.io/deployment
