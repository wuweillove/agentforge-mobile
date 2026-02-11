# AgentForge Deployment Guide

Complete step-by-step guide for deploying AgentForge to production.

## Prerequisites

- [ ] Domain name configured
- [ ] SSL certificate ready
- [ ] Stripe account with API keys
- [ ] Database hosting (PostgreSQL)
- [ ] Redis hosting
- [ ] Apple Developer account (for iOS)
- [ ] Google Play Developer account (for Android)

## Backend Deployment

### Option 1: Docker Compose (Recommended for VPS)

#### Requirements
- VPS with Docker installed (DigitalOcean, Linode, etc.)
- 2GB RAM minimum
- 20GB storage

#### Steps

1. **Setup server**
   ```bash
   # SSH into your server
   ssh user@your-server-ip
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo apt-get install docker-compose
   ```

2. **Clone repository**
   ```bash
   git clone https://github.com/wuweillove/agentforge-mobile.git
   cd agentforge-mobile/backend
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env
   # Update all environment variables
   ```

4. **Start services**
   ```bash
   docker-compose up -d
   ```

5. **Run migrations**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   docker-compose exec app npm run seed
   ```

6. **Setup SSL with Nginx**
   ```bash
   # Install Certbot
   sudo apt-get install certbot python3-certbot-nginx
   
   # Get certificate
   sudo certbot --nginx -d api.yourdomain.com
   ```

7. **Configure Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name api.yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
       
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

### Option 2: Railway.app (Easiest)

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and initialize**
   ```bash
   railway login
   cd backend
   railway init
   ```

3. **Add services**
   ```bash
   railway add --database postgresql
   railway add --database redis
   ```

4. **Set environment variables**
   ```bash
   railway variables set JWT_SECRET="your-secret"
   railway variables set STRIPE_SECRET_KEY="sk_live_..."
   # Set all other variables from .env.example
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Run migrations**
   ```bash
   railway run npx prisma migrate deploy
   ```

### Option 3: Vercel (Serverless)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure database**
   - Use managed PostgreSQL (Neon, Supabase, etc.)
   - Use managed Redis (Upstash, Redis Cloud)

3. **Deploy**
   ```bash
   cd backend
   vercel --prod
   ```

4. **Set environment variables**
   - Go to Vercel dashboard
   - Add all variables from `.env.example`

### Option 4: AWS (Kubernetes)

1. **Setup EKS cluster**
   ```bash
   eksctl create cluster --name agentforge --region us-east-1
   ```

2. **Apply Terraform**
   ```bash
   cd backend/terraform
   terraform init
   terraform plan
   terraform apply
   ```

3. **Create secrets**
   ```bash
   kubectl create secret generic agentforge-secrets \
     --from-env-file=.env.production
   ```

4. **Deploy application**
   ```bash
   kubectl apply -f k8s/
   ```

5. **Check status**
   ```bash
   kubectl get pods
   kubectl get services
   ```

## Mobile App Deployment

### iOS Deployment

#### Prerequisites
- Apple Developer account ($99/year)
- Mac with Xcode installed
- Valid certificates and provisioning profiles

#### Steps

1. **Configure app**
   ```bash
   # Update app.json
   nano app.json
   # Set bundleIdentifier, version, etc.
   ```

2. **Setup EAS**
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

3. **Build for production**
   ```bash
   eas build --platform ios --profile production
   ```

4. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

5. **App Store Connect**
   - Go to App Store Connect
   - Fill in app information
   - Add screenshots
   - Submit for review

### Android Deployment

#### Prerequisites
- Google Play Developer account ($25 one-time)
- Signing keystore

#### Steps

1. **Generate keystore**
   ```bash
   keytool -genkeypair -v -keystore agentforge.keystore \
     -alias agentforge -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure credentials**
   ```bash
   # Add to eas.json
   {
     "build": {
       "production": {
         "android": {
           "credentialsSource": "local"
         }
       }
     }
   }
   ```

3. **Build for production**
   ```bash
   eas build --platform android --profile production
   ```

4. **Submit to Google Play**
   ```bash
   eas submit --platform android
   ```

5. **Google Play Console**
   - Create app listing
   - Add screenshots and description
   - Set up pricing and distribution
   - Submit for review

## Stripe Configuration

### Setup Webhooks

1. **Login to Stripe Dashboard**
   - Go to Developers > Webhooks

2. **Add endpoint**
   - URL: `https://api.yourdomain.com/api/webhooks/stripe`
   - Events to listen:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Get webhook secret**
   - Copy signing secret
   - Add to `STRIPE_WEBHOOK_SECRET` env var

### Create Products and Prices

1. **Premium Subscription**
   - Name: "AgentForge Premium"
   - Price: $9.99/month
   - Recurring: Monthly
   - Copy Price ID to `STRIPE_PRICE_PREMIUM`

2. **Enterprise Subscription**
   - Name: "AgentForge Enterprise"
   - Price: $49.99/month
   - Recurring: Monthly
   - Copy Price ID to `STRIPE_PRICE_ENTERPRISE`

## Database Setup

### Initial Setup

```bash
# Run migrations
npx prisma migrate deploy

# Seed initial data
npm run seed

# Create admin user (will prompt for password)
node scripts/create-admin.js
```

### Backup Strategy

```bash
# Automated daily backups
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Retention: Keep 30 days
find /backups -name "db_*.sql.gz" -mtime +30 -delete
```

### Restore from Backup

```bash
# Decompress backup
gunzip db_20260210.sql.gz

# Restore
psql $DATABASE_URL < db_20260210.sql
```

## Monitoring Setup

### Sentry (Error Tracking)

1. **Create Sentry project**
   - Go to sentry.io
   - Create new project

2. **Add to mobile app**
   ```bash
   npm install @sentry/react-native
   ```

3. **Initialize in App.js**
   ```javascript
   import * as Sentry from '@sentry/react-native';
   
   Sentry.init({
     dsn: 'your-sentry-dsn',
     environment: 'production',
   });
   ```

4. **Add to backend**
   ```bash
   npm install @sentry/node
   ```

### Analytics (Mixpanel)

1. **Create project**
2. **Install SDK**
   ```bash
   npm install mixpanel-react-native
   ```

3. **Track events**
   ```javascript
   import { Mixpanel } from 'mixpanel-react-native';
   
   Mixpanel.track('Workflow Created', {
     nodeCount: 5,
     type: 'custom',
   });
   ```

## Post-Deployment Checklist

### Backend
- [ ] API responding to health checks
- [ ] Database migrations applied
- [ ] Admin user created
- [ ] Stripe webhooks configured
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Logs being collected
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Rate limiting active

### Mobile App
- [ ] App builds successfully
- [ ] API connection working
- [ ] Payments functional (test mode first)
- [ ] Push notifications configured
- [ ] Analytics tracking events
- [ ] App icons and splash screens set
- [ ] Store listings complete
- [ ] Privacy policy linked
- [ ] Terms of service linked

### DNS Configuration

```
# A Records
api.agentforge.io    -> Your server IP
www.agentforge.io    -> Your server IP

# CNAME Records
agentforge.io        -> www.agentforge.io
```

## Rollback Procedure

### Backend Rollback

```bash
# Docker
docker-compose down
docker-compose pull agentforge-api:previous-version
docker-compose up -d

# Kubernetes
kubectl rollout undo deployment/agentforge-api

# Railway
railway rollback
```

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backups/db_backup_before_deployment.sql

# Or use Prisma
npx prisma migrate resolve --rolled-back migration_name
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (Nginx, AWS ALB)
- Run multiple API instances
- Session state in Redis (stateless API)
- Database read replicas

### Vertical Scaling

- Upgrade server resources
- Increase database instance size
- Optimize queries and indexes
- Implement caching strategy

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_workflows_user_status ON workflows(user_id, status);
CREATE INDEX idx_executions_workflow_status ON workflow_executions(workflow_id, status);
CREATE INDEX idx_usage_user_date ON usage_logs(user_id, timestamp);

-- Analyze and vacuum
ANALYZE;
VACUUM ANALYZE;
```

## Monitoring & Alerts

### Setup Uptime Monitoring

**UptimeRobot:**
- Monitor: `https://api.agentforge.io/health`
- Interval: 5 minutes
- Alert: Email + SMS

### Setup Performance Monitoring

**New Relic:**
```bash
npm install newrelic
```

Add to server.ts:
```javascript
require('newrelic');
```

### Setup Log Aggregation

**Papertrail:**
```bash
# Forward Docker logs
docker-compose logs -f | nc logs.papertrailapp.com 12345
```

## Troubleshooting

### API Not Responding

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs app

# Restart service
docker-compose restart app
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check connections
SELECT count(*) FROM pg_stat_activity;

# Kill idle connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' AND state_change < now() - interval '30 minutes';
```

### High Memory Usage

```bash
# Check container stats
docker stats

# Increase memory limit in docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
```

## Support

For deployment assistance:
- Email: devops@agentforge.io
- Discord: #deployment-help
- Emergency: +1-XXX-XXX-XXXX
