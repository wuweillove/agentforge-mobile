# Changelog

All notable changes to AgentForge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup

## [1.0.0] - 2026-02-10

### Added

#### Mobile App
- Visual workflow builder with drag-and-drop interface
- 6 node types (Input, Process, Decision, API Call, AI Agent, Output)
- Template library with 4 pre-built workflows
- Real-time monitoring dashboard
- API key management for OpenAI, Anthropic, Google AI
- Credit purchase system
- Subscription management (Free, Premium, Enterprise tiers)
- Stripe payment integration
- Biometric authentication support
- Dark theme UI with React Native Paper
- State management with Zustand
- Secure storage with Expo SecureStore

#### Backend API
- RESTful API with TypeScript and Express
- PostgreSQL database with Prisma ORM
- Redis caching layer
- JWT authentication with refresh tokens
- User registration and login
- Credit system with transaction tracking
- Subscription management
- Stripe webhook integration
- Workflow CRUD operations
- Admin dashboard endpoints
- Health check endpoints
- Rate limiting middleware
- Error handling and logging with Winston
- Docker and docker-compose support

#### Infrastructure
- CI/CD pipelines with GitHub Actions
- Automated testing (unit and integration)
- Security scanning (CodeQL, Snyk)
- EAS build configuration
- Kubernetes deployment manifests
- Terraform AWS infrastructure
- Multi-stage Docker builds

#### Documentation
- Comprehensive README
- API documentation
- Backend deployment guide
- Monetization strategy
- Contributing guidelines
- Security policy
- License (MIT)

### Security
- AES-256 encryption for API keys
- bcrypt password hashing
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Secure headers (Helmet.js)
- HTTPS enforcement

### Performance
- Database connection pooling
- Redis caching
- Gzip compression
- Optimized database indexes
- Code splitting
- Lazy loading

## Release Notes

### v1.0.0 - Initial Release

This is the first production release of AgentForge, featuring a complete visual workflow builder for AI agents with integrated monetization.

**Highlights:**
- 🎨 Intuitive drag-and-drop workflow builder
- 🤖 Support for multiple AI providers
- 📊 Real-time monitoring and analytics
- 💳 Complete payment system with Stripe
- 🔒 Enterprise-grade security
- 🚀 Production-ready backend infrastructure

**Known Issues:**
- WebSocket real-time updates pending implementation
- Offline mode in development
- Team collaboration features coming soon

**Migration Notes:**
- First release, no migrations needed

## Upgrade Guide

### From Development to v1.0.0

1. Pull latest changes
2. Update dependencies: `npm install`
3. Run backend migrations: `npx prisma migrate deploy`
4. Update environment variables (see `.env.example`)
5. Restart services

## Support

For questions about releases:
- GitHub Discussions
- Discord: https://discord.gg/agentforge
- Email: support@agentforge.io
