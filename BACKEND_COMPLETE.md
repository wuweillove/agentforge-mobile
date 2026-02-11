# AgentForge Backend - Complete Implementation Guide

## 🚀 Quick Start

### Local Development

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Start PostgreSQL and Redis with Docker
docker-compose up -d db redis

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database
npm run seed

# Start development server
npm run dev
```

Server will be running at `http://localhost:3000`

### Production Deployment

```bash
# Build Docker image
docker build -t agentforge-api .

# Run with docker-compose
docker-compose up -d

# Run migrations in production
docker-compose exec app npx prisma migrate deploy
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuration management
│   ├── controllers/
│   │   ├── auth.controller.ts    # Authentication logic
│   │   ├── credit.controller.ts  # Credit management
│   │   ├── subscription.controller.ts
│   │   ├── workflow.controller.ts
│   │   ├── execution.controller.ts
│   │   └── admin.controller.ts
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── rateLimiter.ts       # Rate limiting
│   │   └── validator.ts         # Request validation
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── credit.routes.ts
│   │   ├── subscription.routes.ts
│   │   ├── workflow.routes.ts
│   │   ├── execution.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── webhook.routes.ts
│   │   └── health.routes.ts
│   ├── services/
│   │   ├── stripe.service.ts    # Stripe integration
│   │   ├── openclaw.service.ts  # OpenClaw API
│   │   ├── email.service.ts     # Email notifications
│   │   └── storage.service.ts   # File storage (S3)
│   ├── utils/
│   │   ├── logger.ts            # Winston logger
│   │   ├── prisma.ts            # Prisma client
│   │   ├── jwt.ts               # JWT utilities
│   │   ├── encryption.ts        # Encryption utilities
│   │   └── errors.ts            # Custom error classes
│   └── server.ts                # Express app setup
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seeding
│   └── migrations/             # Migration files
├── Dockerfile                  # Docker configuration
├── docker-compose.yml         # Docker Compose setup
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── .env.example              # Environment template
```

## 🔧 Environment Variables

Required environment variables (see `.env.example`):

### Server
- `NODE_ENV`: development | production
- `PORT`: API server port (default: 3000)
- `API_URL`: Public API URL

### Database
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string

### Authentication
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: Refresh token secret
- `JWT_EXPIRES_IN`: Access token expiry (e.g., 24h)
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiry (e.g., 7d)

### Stripe
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `STRIPE_PRICE_PREMIUM`: Premium plan price ID
- `STRIPE_PRICE_ENTERPRISE`: Enterprise plan price ID

### OpenClaw
- `OPENCLAW_API_URL`: OpenClaw API base URL
- `OPENCLAW_API_KEY`: OpenClaw API key

### AWS S3
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region
- `AWS_S3_BUCKET`: S3 bucket name

### Email (SendGrid)
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASSWORD`: SMTP password/API key
- `EMAIL_FROM`: Sender email address

### Security
- `ENCRYPTION_KEY`: 32-character encryption key
- `CORS_ORIGIN`: Allowed CORS origins (comma-separated)

## 📊 Database Schema

### Core Tables

#### Users
- Basic authentication and profile
- Subscription tier tracking
- Stripe customer ID

#### Subscriptions
- Subscription status and tier
- Billing period tracking
- Cancellation handling

#### Credits
- User credit balance
- Real-time tracking

#### Credit Transactions
- Complete transaction history
- Purchase and usage records
- Stripe payment IDs

#### Workflows
- Workflow definitions
- Node and connection data
- Version control
- Template support

#### Executions
- Workflow execution tracking
- Input/output storage
- Performance metrics
- Error logging

#### API Keys
- Encrypted storage
- Provider management
- Usage tracking

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/refresh         - Refresh access token
GET    /api/auth/me              - Get current user
PUT    /api/auth/profile         - Update profile
POST   /api/auth/change-password - Change password
POST   /api/auth/reset-password  - Request password reset
```

### Credits
```
GET    /api/credits/balance      - Get credit balance
GET    /api/credits/history      - Get transaction history
POST   /api/credits/purchase     - Purchase credits
POST   /api/credits/usage/track  - Track usage
GET    /api/credits/usage/stats  - Get usage statistics
```

### Subscriptions
```
GET    /api/subscriptions/current - Get current subscription
POST   /api/subscriptions/create  - Create subscription
PUT    /api/subscriptions/update  - Update subscription
POST   /api/subscriptions/cancel  - Cancel subscription
```

### Workflows
```
GET    /api/workflows            - List workflows
POST   /api/workflows            - Create workflow
GET    /api/workflows/:id        - Get workflow
PUT    /api/workflows/:id        - Update workflow
DELETE /api/workflows/:id        - Delete workflow
POST   /api/workflows/:id/deploy - Deploy workflow
```

### Executions
```
GET    /api/executions           - List executions
POST   /api/executions           - Start execution
GET    /api/executions/:id       - Get execution status
POST   /api/executions/:id/stop  - Stop execution
GET    /api/executions/:id/logs  - Get execution logs
```

### Admin
```
GET    /api/admin/dashboard      - Dashboard metrics
GET    /api/admin/users          - List users
GET    /api/admin/revenue        - Revenue analytics
GET    /api/admin/usage          - Usage analytics
```

### Webhooks
```
POST   /api/webhooks/stripe      - Stripe webhook handler
```

### Health
```
GET    /health                   - Health check
GET    /health/ready             - Readiness probe
GET    /health/live              - Liveness probe
```

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Refresh token rotation
- Password hashing with bcrypt
- Role-based access control

### API Security
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting (100 requests/15min)
- Request validation
- SQL injection prevention

### Data Security
- AES-256 encryption for sensitive data
- Secure password storage
- Environment variable management
- HTTPS enforcement in production

## 📈 Monitoring & Logging

### Winston Logger
- Structured JSON logging
- Log levels: error, warn, info, debug
- File rotation (5MB max, 5 files)
- Console output in development

### Health Checks
- `/health` - Overall health status
- `/health/ready` - Kubernetes readiness
- `/health/live` - Kubernetes liveness

### Metrics
- Request logging with Morgan
- Database query logging
- Error tracking
- Performance monitoring

## 🚢 Deployment

### Docker Deployment

```bash
# Build image
docker build -t agentforge-api:latest .

# Run container
docker run -p 3000:3000 --env-file .env agentforge-api:latest

# Or use docker-compose
docker-compose up -d
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Railway Deployment

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Heroku Deployment

```bash
# Create app
heroku create agentforge-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Add Redis
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📝 Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test locally**
   ```bash
   npm run dev
   npm test
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

5. **Create pull request**

## 🔧 Common Tasks

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Prisma Studio

```bash
# Open database GUI
npx prisma studio
```

### Stripe Webhooks (Local Testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 🐛 Troubleshooting

### Database Connection Issues
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify network connectivity

### Prisma Issues
```bash
# Regenerate client
npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npm install
```

### TypeScript Errors
```bash
# Clean build
rm -rf dist
npm run build
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Express.js Guide](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Support

For backend issues:
- Email: backend@agentforge.io
- GitHub Issues: [Report Issue](https://github.com/agentforge/backend-api/issues)
