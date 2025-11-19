# Security Policy

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing **pacubidesg@unal.edu.co**.

**DO NOT** create a public GitHub issue for security vulnerabilities.

We take all security reports seriously and will respond as quickly as possible.

---

## ⚠️ Security Best Practices

### Environment Variables

**NEVER commit sensitive credentials to the repository.**

All sensitive configuration must be stored in `.env` files which are excluded from version control via `.gitignore`.

### Required Environment Variables

See `.env.example` files for the complete list of required environment variables:

- **Root**: `/.env.example`
- **API App**: `/apps/api/.env.example`
- **Web App**: `/apps/web/.env.example`

### Production Deployment

1. **Database Credentials**: Use connection pooling (PgBouncer) and secure SSL connections
2. **API Keys**: Rotate regularly and use environment-specific keys
3. **Secrets**: Use strong, randomly generated secrets for:
   - `NEXTAUTH_SECRET` (32+ characters)
   - `MP_WEBHOOK_SECRET` (MercadoPago webhook validation)
   - Firebase service account credentials

### Implemented Security Measures

✅ **Authentication & Authorization**

- NextAuth.js with database-backed sessions
- Role-based access control (USER, ADMIN, MODERATOR)
- Google OAuth integration
- Session validation on protected routes

✅ **Rate Limiting**

- Upstash Redis-based rate limiting
- Fail-closed strategy for sensitive endpoints
- Configurable limits per endpoint type

✅ **Input Validation**

- Zod schema validation for all API inputs
- File upload restrictions (size, type)
- SQL injection prevention via Prisma ORM

✅ **CORS Policy**

- Restricted origins (localhost only in development)
- Proper headers for cross-origin requests

✅ **Security Headers**

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)

✅ **Monitoring & Logging**

- Sentry error tracking
- Audit logs for admin operations
- System logs with severity levels
- Credit transaction logs

---

## 🚨 Known Security Incidents

### November 2024 - Hardcoded Credentials (RESOLVED)

**Issue**: PostgreSQL credentials were accidentally committed to the repository in:

- `apps/web/src/app/api/notes/route.ts`
- Historical commits detected by GitGuardian

**Actions Taken**:

1. ✅ Removed hardcoded credentials from codebase
2. ✅ Rotated database passwords
3. ✅ Updated connection strings in environment variables
4. ✅ Added validation to ensure DATABASE_URL is loaded from environment
5. ✅ Created this security policy document

**Prevention**:

- All developers must use `.env` files for credentials
- Pre-commit hooks to detect secrets (recommended)
- Regular security audits with GitGuardian

---

## 🔐 Credential Rotation Schedule

Rotate the following credentials regularly:

| Credential               | Frequency        | Last Rotated |
| ------------------------ | ---------------- | ------------ |
| Database Password        | Every 90 days    | 2024-11-18   |
| NEXTAUTH_SECRET          | Every 180 days   | 2024-11-18   |
| MERCADOPAGO_ACCESS_TOKEN | When compromised | -            |
| BREVO_API_KEY            | When compromised | -            |
| Firebase Service Account | Every 180 days   | -            |
| Upstash Redis Token      | Every 180 days   | -            |

---

## 📋 Security Checklist for Developers

Before committing code, verify:

- [ ] No hardcoded credentials (database URLs, API keys, secrets)
- [ ] No `.env` files committed
- [ ] No sensitive data in console.log statements
- [ ] Input validation for all user-facing endpoints
- [ ] Rate limiting on public endpoints
- [ ] Authentication checks on protected routes
- [ ] HTTPS enforced in production
- [ ] Error messages don't expose system details

---

## 🛡️ Dependencies

We use automated tools to detect vulnerable dependencies:

- **Dependabot**: Automatic PR creation for security updates
- **npm audit**: Run `pnpm audit` regularly
- **Snyk**: Optional additional scanning

To check for vulnerabilities:

```bash
pnpm audit
pnpm audit fix  # Apply fixes automatically
```

---

## 📞 Contact

For security concerns, contact:

- **Email**: pacubidesg@unal.edu.co
- **GitHub**: @Pablo-Cubides

---

**Last Updated**: November 18, 2025
