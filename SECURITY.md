# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to security@agentforge.io.

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Measures

### Frontend (Mobile App)

#### Data Storage
- API keys encrypted with AES-256
- Sensitive data stored in Expo SecureStore (Keychain/Keystore)
- AsyncStorage used only for non-sensitive data
- No credentials in source code or logs

#### Authentication
- JWT tokens with expiration
- Biometric authentication (Face ID/Touch ID)
- Secure token refresh flow
- Automatic session timeout

#### Network Security
- HTTPS-only API communication
- Certificate pinning for critical endpoints
- Request/response validation
- No sensitive data in URLs

### Backend (API)

#### Authentication & Authorization
- JWT-based authentication
- bcrypt password hashing (10 rounds)
- Refresh token rotation
- Role-based access control
- Session management

#### Database Security
- Parameterized queries (Prisma ORM)
- SQL injection prevention
- Connection encryption
- Regular backups
- Access control

#### API Security
- Rate limiting (100 requests/15min)
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- XSS prevention
- CSRF protection

#### Payment Security
- PCI DSS compliance via Stripe
- No card data stored
- Webhook signature verification
- Secure payment intents
- 3D Secure support

#### Infrastructure Security
- HTTPS/TLS 1.3 enforced
- Environment variable management
- Secret rotation
- Container security scanning
- Dependency vulnerability scanning

## Security Best Practices

### For Developers

1. **Never commit secrets**
   - Use `.env` files (gitignored)
   - Use environment variables
   - Use secret management tools

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Validate all inputs**
   - Use validation libraries (Joi, express-validator)
   - Sanitize user input
   - Validate file uploads

4. **Use HTTPS everywhere**
   - Enforce HTTPS in production
   - Use secure cookies
   - Enable HSTS headers

5. **Implement proper error handling**
   - Don't expose sensitive info in errors
   - Log errors securely
   - Use generic error messages for users

### For Users

1. **Use strong passwords**
   - Minimum 8 characters
   - Mix of letters, numbers, symbols
   - Use password manager

2. **Enable biometric authentication**
   - Face ID or Touch ID
   - Extra layer of security

3. **Keep app updated**
   - Install updates promptly
   - Security patches included

4. **Protect API keys**
   - Don't share your keys
   - Rotate keys regularly
   - Use separate keys for dev/prod

5. **Monitor account activity**
   - Review credit transactions
   - Check workflow executions
   - Report suspicious activity

## Vulnerability Disclosure Timeline

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Initial response and triage
3. **Day 3-7**: Investigation and patch development
4. **Day 7-14**: Testing and validation
5. **Day 14-21**: Release and deployment
6. **Day 21+**: Public disclosure (if appropriate)

## Security Updates

Security updates are released as soon as possible after a vulnerability is confirmed. Users will be notified through:

- In-app notifications
- Email alerts
- GitHub security advisories
- Release notes

## Bug Bounty Program

We currently do not have a formal bug bounty program, but we recognize and appreciate security researchers who responsibly disclose vulnerabilities.

Qualifying vulnerabilities will be:
- Acknowledged in security advisories
- Credited in release notes
- Considered for monetary rewards (case-by-case)

## Compliance

### GDPR
- User data export available
- Right to deletion implemented
- Data processing transparency
- Cookie consent management

### PCI DSS
- Level 1 compliance via Stripe
- No card data stored
- Secure payment processing

### SOC 2
- Security controls documented
- Regular security audits
- Incident response procedures

## Contact

For security concerns:
- Email: security@agentforge.io
- PGP Key: [Public Key](https://agentforge.io/pgp-key.txt)

For general inquiries:
- Email: support@agentforge.io
- Discord: https://discord.gg/agentforge

## Acknowledgments

We thank the security researchers who have responsibly disclosed vulnerabilities:

<!-- List will be updated as researchers contribute -->

---

Last updated: February 2026
