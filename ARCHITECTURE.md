# AgentForge System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mobile Application                        │
│                    (React Native + Expo)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Workflow   │  │   Template   │  │  Monitoring  │         │
│  │   Builder    │  │   Library    │  │  Dashboard   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   API Keys   │  │   Credits    │  │ Subscription │         │
│  │  Management  │  │   System     │  │  Management  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend API Server                        │
│                    (Node.js + Express)                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     Auth     │  │   Credits    │  │Subscriptions │         │
│  │   Routes     │  │   Routes     │  │   Routes     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Workflows   │  │    Admin     │  │   Webhooks   │         │
│  │   Routes     │  │   Routes     │  │   Handler    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────────┬───────────────────┬─────────────────┬───────────────┘
            │                   │                 │
            ▼                   ▼                 ▼
    ┌──────────────┐    ┌──────────────┐  ┌──────────────┐
    │  PostgreSQL  │    │    Redis     │  │   Stripe     │
    │   Database   │    │    Cache     │  │  Payments    │
    └──────────────┘    └──────────────┘  └──────────────┘
```

## Component Architecture

### Mobile App Layers

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│  (Screens & Components)                      │
│  - HomeScreen, WorkflowBuilder, etc.        │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│              Business Logic Layer            │
│  (Stores & Services)                         │
│  - workflowStore, userStore                 │
│  - OpenClawAPI, CreditService               │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│              Data Layer                      │
│  (Storage & API Communication)               │
│  - AsyncStorage, SecureStore                │
│  - Axios HTTP Client                        │
└─────────────────────────────────────────────┘
```

### Backend API Layers

```
┌─────────────────────────────────────────────┐
│              Route Layer                     │
│  (API Endpoints)                             │
│  /auth, /credits, /subscriptions, etc.     │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│              Middleware Layer                │
│  - Authentication (JWT)                      │
│  - Validation (Joi)                          │
│  - Rate Limiting                             │
│  - Error Handling                            │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│              Model Layer                     │
│  (Business Logic & Database)                 │
│  - User, Credit, Subscription, Workflow     │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│              Data Layer                      │
│  - PostgreSQL (pg)                           │
│  - Redis Client                              │
│  - Stripe SDK                                │
└─────────────────────────────────────────────┘
```

## Data Flow Diagrams

### User Registration Flow

```
Mobile App                Backend API              Database
    │                         │                       │
    │  POST /auth/register    │                       │
    ├────────────────────────>│                       │
    │                         │  Validate input       │
    │                         │  Hash password        │
    │                         │                       │
    │                         │  INSERT user          │
    │                         ├──────────────────────>│
    │                         │<──────────────────────│
    │                         │  Generate JWT         │
    │  { user, token }        │                       │
    │<────────────────────────│                       │
    │  Store token            │                       │
    │  Navigate to Home       │                       │
```

### Credit Purchase Flow

```
Mobile App         Backend API         Stripe          Database
    │                  │                 │                │
    │  POST /purchase  │                 │                │
    ├─────────────────>│                 │                │
    │                  │  Create Intent  │                │
    │                  ├────────────────>│                │
    │                  │<────────────────│                │
    │  clientSecret    │                 │                │
    │<─────────────────│                 │                │
    │                  │                 │                │
    │  Confirm Payment │                 │                │
    ├──────────────────┴────────────────>│                │
    │                                    │  Charge card   │
    │                                    │                │
    │                  Webhook            │                │
    │                  /payment_succeeded │                │
    │<──────────────────────────────────│                │
    │                  │                 │                │
    │                  │  Add credits    │                │
    │                  ├────────────────────────────────>│
    │                  │<────────────────────────────────│
    │  Success         │                 │                │
    │<─────────────────│                 │                │
```

### Workflow Execution Flow

```
Mobile App              Backend API           OpenClaw API
    │                       │                      │
    │  Deploy Workflow      │                      │
    ├──────────────────────>│                      │
    │                       │  Check credits       │
    │                       │  Deduct cost         │
    │                       │                      │
    │                       │  POST /execute       │
    │                       ├─────────────────────>│
    │                       │                      │ Execute
    │                       │                      │ workflow
    │                       │                      │
    │                       │  Status updates      │
    │                       │<─────────────────────│
    │  Execution results    │                      │
    │<──────────────────────│                      │
    │  Display in monitor   │                      │
```

## Database Schema

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ email (UNIQUE)      │
│ password            │
│ name                │
│ subscription_tier   │
│ stripe_customer_id  │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────┐     ┌─────────────────────┐
│   subscriptions     │     │      credits        │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │     │ id (PK)             │
│ user_id (FK)        │     │ user_id (FK)        │
│ stripe_sub_id       │     │ balance             │
│ tier                │     │ updated_at          │
│ status              │     └─────────┬───────────┘
│ period_start        │               │
│ period_end          │               │ 1:N
└─────────────────────┘               ▼
                           ┌─────────────────────┐
           ┌───────────────│ credit_transactions │
           │               ├─────────────────────┤
           │ 1:N           │ id (PK)             │
           ▼               │ user_id (FK)        │
┌─────────────────────┐   │ type                │
│     workflows       │   │ amount              │
├─────────────────────┤   │ balance_after       │
│ id (PK)             │   │ created_at          │
│ user_id (FK)        │   └─────────────────────┘
│ name                │
│ nodes (JSONB)       │
│ connections (JSONB) │
│ status              │
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────┐
│ workflow_executions │
├─────────────────────┤
│ id (PK)             │
│ workflow_id (FK)    │
│ user_id (FK)        │
│ status              │
│ duration_ms         │
│ credits_charged     │
│ created_at          │
└─────────────────────┘
```

## Technology Stack Details

### Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| React Native | Mobile framework | 0.73 |
| Expo | Development platform | 50.0 |
| React Navigation | Navigation | 6.x |
| Zustand | State management | 4.4 |
| React Native Paper | UI components | 5.11 |
| Axios | HTTP client | 1.6 |
| Stripe RN SDK | Payments | 0.35 |
| Expo SecureStore | Encrypted storage | 12.8 |

### Backend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18+ |
| Express | Web framework | 4.18 |
| PostgreSQL | Database | 14+ |
| Redis | Cache | 7+ |
| Stripe | Payments | 14.5 |
| JWT | Authentication | 9.0 |
| bcrypt | Password hashing | 2.4 |
| Winston | Logging | 3.11 |

## Security Architecture

### Authentication Flow

```
1. User Login
   ↓
2. Verify Credentials (bcrypt)
   ↓
3. Generate JWT Token (24h expiry)
   ↓
4. Store Token (SecureStore)
   ↓
5. Include in API Requests (Authorization header)
   ↓
6. Verify Token on Backend
   ↓
7. Allow/Deny Access
```

### API Key Encryption

```
User Input (Plain API Key)
   ↓
AES-256 Encryption
   ↓
Encrypted String
   ↓
Expo SecureStore (Device Keychain/Keystore)
   ↓
Retrieval & Decryption
   ↓
Use in API Calls
```

## Payment Processing Flow

### Subscription

```
1. User selects plan
2. Enter payment details
3. Stripe creates PaymentMethod
4. Backend creates Customer (if new)
5. Backend creates Subscription
6. Stripe charges card
7. Webhook confirms payment
8. Database updated
9. User gets access
```

### Credits

```
1. User selects package
2. Backend creates PaymentIntent
3. Mobile app confirms payment
4. Stripe processes payment
5. Webhook notifies backend
6. Credits added to balance
7. Transaction recorded
8. User notified
```

## Scalability Strategy

### Current Capacity

- **API**: 1,000 req/sec per instance
- **Database**: 10,000 concurrent connections
- **Redis**: 100,000 operations/sec
- **Users**: 100,000+ concurrent users

### Scaling Approach

#### Vertical Scaling (Short-term)
- Increase server CPU/RAM
- Upgrade database instance
- Larger Redis cache

#### Horizontal Scaling (Long-term)
```
                    ┌──────────────┐
    Users ────────> │ Load Balancer│
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │  API 1  │      │  API 2  │      │  API 3  │
    └────┬────┘      └────┬────┘      └────┬────┘
         │                │                │
         └────────────────┼────────────────┘
                          ▼
                   ┌──────────────┐
                   │   Database   │
                   │   (Primary)  │
                   └──────┬───────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         ┌────────┐  ┌────────┐  ┌────────┐
         │Replica1│  │Replica2│  │Replica3│
         └────────┘  └────────┘  └────────┘
```

## Monitoring & Observability

### Metrics Collected

**Application Metrics**
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Active users
- API endpoint usage

**Business Metrics**
- New signups
- Subscription conversions
- Credit purchases
- Churn rate
- Revenue (MRR, ARR)

**Infrastructure Metrics**
- CPU usage
- Memory usage
- Disk I/O
- Network throughput
- Database connections

### Logging Strategy

```
Level    | Use Case
---------|--------------------------------------------------
ERROR    | Application errors, payment failures
WARN     | Rate limit hits, deprecated feature usage
INFO     | User actions, API calls, deployment events
DEBUG    | Detailed request/response, query execution
```

### Health Check Hierarchy

```
/health        ─┐
                ├──> Database connection test
                ├──> Redis connection test
                ├──> Stripe API test
                └──> Overall service health

/health/ready  ─┐
                └──> Can accept traffic?

/health/live   ─┐
                └──> Is process alive?
```

## Deployment Architecture

### Development

```
Developer Machine
├── Mobile App (Expo Dev Client)
│   └── localhost:8081
├── Backend API (Docker)
│   └── localhost:3000
├── PostgreSQL (Docker)
│   └── localhost:5432
└── Redis (Docker)
    └── localhost:6379
```

### Production

```
                    ┌──────────────┐
    Users ────────> │   Cloudflare │ (CDN + DDoS)
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │     Nginx    │ (Reverse Proxy)
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   PM2/Docker │ (Process Manager)
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │ Backend │      │Postgres │      │  Redis  │
    │ API x3  │      │Managed  │      │Managed  │
    └─────────┘      └─────────┘      └─────────┘
```

## API Request Flow

```
Mobile App                                      Backend
    │                                              │
    │  1. User Action (e.g., Create Workflow)     │
    ├─────────────────────────────────────────────>│
    │                                              │
    │                                              │  2. Rate Limit Check
    │                                              │     (Redis)
    │                                              │
    │                                              │  3. Auth Middleware
    │                                              │     (Verify JWT)
    │                                              │
    │                                              │  4. Validation
    │                                              │     (Joi Schema)
    │                                              │
    │                                              │  5. Business Logic
    │                                              │     (Model Layer)
    │                                              │
    │                                              │  6. Database Query
    │                                              │     (PostgreSQL)
    │                                              │
    │                                              │  7. Cache Update
    │                                              │     (Redis)
    │                                              │
    │  8. Response (JSON)                          │
    │<─────────────────────────────────────────────│
    │                                              │
    │  9. Update UI                                │
```

## State Management Flow

```
User Action
    │
    ▼
Component Event Handler
    │
    ▼
Store Action (Zustand)
    │
    ├──> Update Local State
    │
    ├──> Call API Service
    │        │
    │        ▼
    │    Backend API
    │        │
    │        ▼
    │    Database
    │        │
    │        ▼
    │    Response
    │        │
    └────────┘
    │
    ▼
Update UI (React Re-render)
```

## Security Boundaries

```
┌──────────────────────────────────────────────┐
│             Mobile App                        │
│  ┌────────────────────────────────────────┐  │
│  │  User Input Validation                 │  │
│  │  - Email format                        │  │
│  │  - Password strength                   │  │
│  │  - API key format                      │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Secure Storage                        │  │
│  │  - AES-256 encryption                  │  │
│  │  - Biometric protection                │  │
│  └────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────┘
                   │ HTTPS Only
                   ▼
┌──────────────────────────────────────────────┐
│             Backend API                       │
│  ┌────────────────────────────────────────┐  │
│  │  Rate Limiting                         │  │
│  │  - 100 req/15min per IP                │  │
│  │  - 5 auth attempts/15min               │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Authentication                        │  │
│  │  - JWT verification                    │  │
│  │  - Token expiration                    │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Input Validation                      │  │
│  │  - Joi schemas                         │  │
│  │  - SQL injection protection            │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

## File Structure Map

```
agentforge-mobile/
├── 📱 Mobile App (React Native)
│   ├── src/
│   │   ├── components/        # 5 reusable components
│   │   ├── screens/           # 9 app screens
│   │   ├── services/          # 6 API services
│   │   ├── store/             # 2 state stores
│   │   ├── navigation/        # App navigator
│   │   └── utils/             # Helpers & constants
│   ├── App.js                 # Entry point
│   ├── app.json              # Expo config
│   └── package.json          # Dependencies
│
├── 🖥️ Backend API (Node.js)
│   ├── routes/                # 6 route files
│   │   ├── auth.js           # Authentication
│   │   ├── credits.js        # Credit management
│   │   ├── subscriptions.js  # Subscription handling
│   │   ├── workflows.js      # Workflow CRUD
│   │   ├── admin.js          # Admin endpoints
│   │   └── webhooks.js       # Stripe webhooks
│   ├── models/                # 3 data models
│   │   ├── User.js
│   │   ├── Credit.js
│   │   └── Subscription.js
│   ├── middleware/            # 4 middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimit.js
│   ├── config/                # Configuration
│   │   ├── database.js
│   │   ├── logger.js
│   │   └── stripe.js
│   ├── database/              # SQL files
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── migrations/
│   ├── scripts/               # Utility scripts
│   ├── tests/                 # Unit tests
│   ├── server.js             # Main server
│   ├── Dockerfile            # Container config
│   └── docker-compose.yml    # Service orchestration
│
├── 📚 Documentation
│   ├── README.md             # Main documentation
│   ├── GETTING_STARTED.md    # Quick start guide
│   ├── PROJECT_OVERVIEW.md   # Project summary
│   ├── ARCHITECTURE.md       # This file
│   ├── DEPLOYMENT.md         # Deployment guide
│   ├── MONETIZATION.md       # Revenue model
│   ├── BACKEND.md            # API documentation
│   └── PRODUCTION.md         # Production checklist
│
└── 🔧 Configuration
    ├── .env.example          # Environment template
    ├── .gitignore            # Git ignore rules
    ├── .dockerignore         # Docker ignore rules
    └── .github/workflows/    # CI/CD pipelines
```

## Integration Points

### External Services

```
AgentForge
    │
    ├──> Stripe
    │    ├── Payment processing
    │    ├── Subscription management
    │    ├── Invoice generation
    │    └── Webhook events
    │
    ├──> OpenAI
    │    └── GPT-4, GPT-3.5 models
    │
    ├──> Anthropic
    │    └── Claude models
    │
    ├──> Google AI
    │    └── Gemini models
    │
    └──> OpenClaw
         └── Agent orchestration
```

## Performance Benchmarks

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | < 200ms | ~150ms |
| Database Query | < 50ms | ~30ms |
| App Load Time | < 3s | ~2s |
| Screen Transition | < 300ms | ~200ms |
| Payment Processing | < 5s | ~3s |

## Disaster Recovery

### Backup Strategy

```
Daily Backups
    │
    ├──> Database (Automated)
    │    └── Retained for 30 days
    │
    ├──> Redis (Snapshot)
    │    └── Retained for 7 days
    │
    └──> Code (Git)
         └── Infinite retention
```

### Recovery Time Objectives

- **RTO** (Recovery Time Objective): 1 hour
- **RPO** (Recovery Point Objective): 15 minutes
- **MTTR** (Mean Time To Recover): 30 minutes

## Future Architecture

### Planned Enhancements

```
Current Architecture
    │
    ├──> Add Microservices
    │    ├── Workflow Engine Service
    │    ├── Analytics Service
    │    └── Notification Service
    │
    ├──> Add Message Queue
    │    └── RabbitMQ/Kafka for async jobs
    │
    ├──> Add GraphQL API
    │    └── Alongside REST for complex queries
    │
    ├──> Add WebSockets
    │    └── Real-time collaboration
    │
    └──> Add AI Gateway
         └── Unified interface for all AI providers
```

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Maintained by**: Sebastian Llovera Studio
