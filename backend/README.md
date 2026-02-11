# AgentForge Backend API

Complete Node.js/Express backend with PostgreSQL, Redis, and Stripe integration.

## Features

- ✅ User authentication with JWT
- ✅ Credit system with Stripe payments
- ✅ Subscription management (Free/Premium/Enterprise)
- ✅ Workflow CRUD operations
- ✅ Admin dashboard endpoints
- ✅ Stripe webhook handlers
- ✅ Redis caching
- ✅ Rate limiting
- ✅ Error handling & logging
- ✅ Health checks
- ✅ Docker support

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Stripe account

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your credentials:
- Database URL
- Redis URL
- Stripe keys
- JWT secret
- Admin credentials

### Database Setup

```bash
# Run migrations
npm run migrate

# Seed demo data
npm run seed
```

### Development

```bash
npm run dev
```

API will be available at `http://localhost:3000`

### Production

```bash
npm start
```

## Docker Deployment

### Local Development

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- API on port 3000

### Production Build

```bash
docker build -t agentforge-api .
docker run -p 3000:3000 --env-file .env agentforge-api
```

## Deployment Platforms

### Vercel

```bash
vercel
```

### Railway

```bash
railway up
```

### Heroku

```bash
heroku create agentforge-api
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
git push heroku main
```

### AWS/GCP/Azure

Use `deploy.sh` script:

```bash
chmod +x deploy.sh
./deploy.sh production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/refresh` - Refresh token

### Credits
- `GET /api/credits/balance` - Get credit balance
- `GET /api/credits/history` - Get transaction history
- `POST /api/credits/purchase` - Purchase credits
- `POST /api/credits/usage/track` - Track usage

### Subscriptions
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/create` - Create subscription
- `PUT /api/subscriptions/update` - Update subscription
- `POST /api/subscriptions/cancel` - Cancel subscription

### Workflows
- `GET /api/workflows` - List workflows
- `GET /api/workflows/:id` - Get workflow
- `POST /api/workflows` - Create workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id` - Get user details
- `GET /api/admin/transactions` - List transactions
- `GET /api/admin/analytics` - Get analytics

### Webhooks
- `POST /webhooks/stripe` - Stripe webhook handler

### Health
- `GET /health` - Health check
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

## Environment Variables

See `.env.example` for all required variables.

## Database Schema

Tables:
- `users` - User accounts
- `subscriptions` - Subscription data
- `credits` - Credit balances
- `credit_transactions` - Transaction history
- `workflows` - User workflows
- `workflow_executions` - Execution logs
- `usage_logs` - Usage tracking

## Testing

```bash
npm test
```

## Monitoring

### Logs

Logs are written to:
- `logs/app.log` - All logs
- `logs/error.log` - Error logs only

### Health Checks

Monitor:
- `/health` - Overall health
- `/health/ready` - Ready for traffic
- `/health/live` - Process alive

## Security

- JWT authentication
- bcrypt password hashing (10 rounds)
- Helmet.js security headers
- Rate limiting (100 req/15min)
- CORS configuration
- Input validation with Joi
- SQL injection protection
- Stripe webhook signature verification

## Performance

- Redis caching
- Database connection pooling
- Gzip compression
- Efficient database indexes

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check logs
tail -f logs/app.log
```

### Stripe Webhooks

```bash
# Test locally with Stripe CLI
stripe listen --forward-to localhost:3000/webhooks/stripe
```

### Redis Issues

```bash
# Test connection
redis-cli -u $REDIS_URL ping
```

## License

MIT License - See LICENSE file

## Support

For issues and questions:
- GitHub Issues
- Email: support@agentforge.io
