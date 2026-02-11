# Production Deployment Checklist

## Pre-Launch

### Security
- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Enable Helmet.js security headers
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Enable SQL injection protection
- [ ] Validate all inputs
- [ ] Sanitize error messages
- [ ] Setup WAF (Web Application Firewall)

### Database
- [ ] Run all migrations
- [ ] Create database indexes
- [ ] Setup automated backups
- [ ] Configure connection pooling
- [ ] Enable query logging (temporarily)
- [ ] Test database restore procedure
- [ ] Setup database monitoring
- [ ] Configure replica (if needed)

### Stripe
- [ ] Switch to live API keys
- [ ] Create production products
- [ ] Setup webhook endpoints
- [ ] Test payment flow end-to-end
- [ ] Configure tax settings
- [ ] Setup billing portal
- [ ] Enable radar for fraud
- [ ] Configure email receipts

### Infrastructure
- [ ] Setup CI/CD pipeline
- [ ] Configure auto-scaling
- [ ] Setup load balancer
- [ ] Configure CDN
- [ ] Setup monitoring
- [ ] Configure logging
- [ ] Setup alerts
- [ ] Document runbooks
- [ ] Test disaster recovery

### Performance
- [ ] Enable Redis caching
- [ ] Optimize database queries
- [ ] Enable gzip compression
- [ ] Minimize API payload sizes
- [ ] Implement pagination
- [ ] Add database indexes
- [ ] Load test API endpoints
- [ ] Profile slow endpoints

### Legal & Compliance
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] GDPR compliance verified
- [ ] Cookie consent implemented
- [ ] Data retention policy defined
- [ ] User data export available
- [ ] Account deletion implemented

### Mobile App
- [ ] Update API URLs
- [ ] Use production Stripe key
- [ ] Enable analytics
- [ ] Setup crash reporting
- [ ] Test on physical devices
- [ ] Optimize bundle size
- [ ] Enable code push
- [ ] Setup deep linking
- [ ] Configure app store metadata

## Launch Day

### Morning Of
- [ ] Final database backup
- [ ] Verify all services healthy
- [ ] Check monitoring dashboards
- [ ] Test critical user flows
- [ ] Verify payment processing
- [ ] Check webhook delivery

### During Launch
- [ ] Monitor error rates
- [ ] Watch server metrics
- [ ] Check database performance
- [ ] Monitor Stripe dashboard
- [ ] Track user signups
- [ ] Watch for anomalies

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Review error logs
- [ ] Analyze user behavior
- [ ] Check payment success rates
- [ ] Gather user feedback
- [ ] Document any issues

## Ongoing Maintenance

### Daily
- [ ] Check error logs
- [ ] Review monitoring dashboards
- [ ] Check failed payments
- [ ] Monitor API response times

### Weekly
- [ ] Review database performance
- [ ] Check disk space
- [ ] Update dependencies (security patches)
- [ ] Review user feedback
- [ ] Analyze metrics

### Monthly
- [ ] Database backup verification
- [ ] Security audit
- [ ] Cost optimization review
- [ ] Performance analysis
- [ ] Update documentation
- [ ] Review and rotate API keys

## Emergency Procedures

### Database Crash

1. Check database logs
2. Attempt restart
3. Restore from latest backup if needed
4. Notify users of downtime
5. Document incident

### API Outage

1. Check health endpoints
2. Review error logs
3. Restart services
4. Scale up resources if needed
5. Enable maintenance mode
6. Communicate with users

### Payment Issues

1. Check Stripe dashboard
2. Verify webhook delivery
3. Review error logs
4. Contact Stripe support if needed
5. Manually reconcile if necessary

### Security Breach

1. Immediately revoke compromised credentials
2. Review access logs
3. Notify affected users
4. Change all secrets
5. Deploy security patches
6. Document incident
7. Report to authorities if required

## Contacts

### Emergency Contacts
- DevOps Lead: devops@agentforge.io
- Security: security@agentforge.io
- Stripe Support: support.stripe.com

### Service Providers
- Hosting: [Platform support]
- Database: [Provider support]
- Monitoring: [Service support]

## Success Metrics

### Technical
- API uptime: > 99.9%
- Response time: < 200ms (p95)
- Error rate: < 0.1%
- Payment success rate: > 98%

### Business
- User signups: Track daily
- Subscription conversion: > 5%
- Churn rate: < 5%/month
- MRR growth: Track monthly

## Resources

- [API Documentation](./README.md)
- [Monetization Guide](../MONETIZATION.md)
- [Backend Architecture](./BACKEND.md)
- [Security Best Practices](./SECURITY.md)
