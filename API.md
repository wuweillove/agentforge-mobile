# AgentForge API Documentation

Complete REST API reference for AgentForge backend.

## Base URL

```
Production: https://api.agentforge.io
Staging: https://api-staging.agentforge.io
Development: http://localhost:3000
```

## Authentication

All API requests (except auth endpoints) require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "details": { ... }
}
```

## Rate Limiting

- **Global**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **API endpoints**: 60 requests per minute

Headers returned:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1644537600
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "subscriptionTier": "FREE"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

**Errors:**
- `400` - Validation error
- `409` - User already exists

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

**Errors:**
- `401` - Invalid credentials

#### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "subscriptionTier": "PREMIUM",
    "subscription": { ... },
    "credits": { ... }
  }
}
```

### Credits

#### Get Balance
```http
GET /api/credits/balance
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balance": 1500,
    "lastUpdated": "2026-02-10T10:00:00Z"
  }
}
```

#### Purchase Credits
```http
POST /api/credits/purchase
```

**Request Body:**
```json
{
  "amount": 39.99,
  "paymentMethodId": "pm_1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "succeeded",
    "credits": 550,
    "transactionId": "pi_1234567890",
    "balance": 2050
  }
}
```

**Errors:**
- `400` - Invalid package or payment method
- `402` - Payment failed

#### Track Usage
```http
POST /api/credits/usage/track
```

**Request Body:**
```json
{
  "workflowId": "workflow-uuid",
  "resourceType": "workflow_execution",
  "amount": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "creditsCharged": 1.5,
    "remainingBalance": 1498.5
  }
}
```

**Errors:**
- `402` - Insufficient credits

### Subscriptions

#### Get Current Subscription
```http
GET /api/subscriptions/current
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tier": "PREMIUM",
    "status": "ACTIVE",
    "currentPeriodStart": "2026-01-10T00:00:00Z",
    "currentPeriodEnd": "2026-02-10T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "limits": {
      "maxWorkflows": -1,
      "maxNodes": 50,
      "apiCallsPerMonth": 10000,
      "storageMB": 10240
    }
  }
}
```

#### Create Subscription
```http
POST /api/subscriptions/create
```

**Request Body:**
```json
{
  "priceId": "price_premium_monthly",
  "paymentMethodId": "pm_1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "subscription": { ... },
    "clientSecret": "seti_...secret..."
  }
}
```

### Workflows

#### List Workflows
```http
GET /api/workflows?limit=50&offset=0
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "workflows": [
      {
        "id": "uuid",
        "name": "My Workflow",
        "description": "Description",
        "status": "ACTIVE",
        "nodes": [ ... ],
        "connections": [ ... ],
        "createdAt": "2026-02-01T10:00:00Z",
        "updatedAt": "2026-02-10T15:30:00Z"
      }
    ],
    "pagination": {
      "total": 15,
      "limit": 50,
      "offset": 0
    }
  }
}
```

#### Create Workflow
```http
POST /api/workflows
```

**Request Body:**
```json
{
  "name": "Data Pipeline",
  "description": "ETL workflow",
  "nodes": [
    {
      "id": "node-1",
      "type": "input",
      "label": "Data Source",
      "position": { "x": 100, "y": 100 },
      "config": {}
    }
  ],
  "connections": [
    { "id": "conn-1", "from": "node-1", "to": "node-2" }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "workflow": { ... }
  }
}
```

**Errors:**
- `403` - Workflow limit reached for subscription tier
- `400` - Validation error

### Admin

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1247,
      "active": 892,
      "newThisMonth": 156
    },
    "revenue": {
      "total": 48750.50,
      "mrr": 18950.00,
      "thisMonth": 12450.00
    },
    "subscriptions": {
      "free": 654,
      "premium": 425,
      "enterprise": 168
    }
  }
}
```

**Errors:**
- `403` - Admin access required

## Webhooks

### Stripe Webhook
```http
POST /api/webhooks/stripe
```

**Headers:**
```
Stripe-Signature: t=...,v1=...
```

**Events Handled:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Error Codes

| Code | Meaning |
|------|--------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 402 | Payment Required |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Examples

### cURL Examples

**Register:**
```bash
curl -X POST https://api.agentforge.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!","name":"John"}'
```

**Login:**
```bash
curl -X POST https://api.agentforge.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!"}'
```

**Get Workflows:**
```bash
curl -X GET https://api.agentforge.io/api/workflows \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript Examples

**Using Axios:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.agentforge.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  return response.data.data;
};

// Create workflow
const createWorkflow = async (workflow) => {
  const response = await api.post('/api/workflows', workflow);
  return response.data.data.workflow;
};
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for API version history and breaking changes.

## Support

API support:
- Email: api@agentforge.io
- Status page: https://status.agentforge.io
- Documentation: https://docs.agentforge.io
