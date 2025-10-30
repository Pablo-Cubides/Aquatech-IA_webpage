# Security Policy

## 🔒 Security Overview

AquatechIA takes security seriously. This document outlines our security measures and practices.

## 🛡️ Security Measures Implemented

### 1. **Security Headers**

All responses include comprehensive security headers:

- **X-Frame-Options**: `DENY` - Prevents clickjacking attacks
- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-XSS-Protection**: `1; mode=block` - Enables XSS filter in browsers
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains` - Enforces HTTPS
- **Content-Security-Policy**: Strict CSP to prevent XSS and data injection attacks
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information
- **Permissions-Policy**: Restricts browser features (camera, microphone, geolocation)

### 2. **Input Validation & Sanitization**

All user inputs are validated and sanitized:

- ✅ Email validation with regex
- ✅ URL validation
- ✅ Slug validation (alphanumeric + hyphens)
- ✅ ID validation (prevents NoSQL injection)
- ✅ SQL wildcard escaping
- ✅ XSS prevention (HTML tag removal)
- ✅ File upload validation (type + size)

**Location**: `src/lib/security/validation.ts`

### 3. **Rate Limiting**

API routes are protected with rate limiting using Upstash Redis:

- ✅ IP-based rate limiting
- ✅ User-based rate limiting
- ✅ Sliding window algorithm
- ✅ Configurable limits per endpoint
- ✅ Graceful degradation if Redis is unavailable

**Default limits**:
- 10 requests per minute per IP
- Configurable per endpoint

**Location**: `src/lib/security/rate-limit.ts`

### 4. **Authentication & Authorization**

- ✅ NextAuth.js with Google OAuth
- ✅ JWT-based sessions
- ✅ Secure session storage
- ✅ Protected routes with middleware
- ✅ No sensitive data in JWT payload

**Location**: `src/lib/auth.ts`

### 5. **CORS Protection**

- ✅ Whitelist of allowed origins
- ✅ Credentials only for trusted origins
- ✅ Preflight request handling
- ✅ Method restrictions

**Allowed origins**:
- Production: `https://aquatechia.com`
- Development: `http://localhost:3000`, `http://localhost:3001`

### 6. **Database Security**

- ✅ Prisma ORM (prevents SQL injection)
- ✅ Parameterized queries only
- ✅ Connection pooling with Supabase
- ✅ Environment variable protection
- ✅ No raw SQL queries

### 7. **Environment Variables**

All sensitive data stored in environment variables:

- ✅ `.env` files in `.gitignore`
- ✅ `.env.example` templates provided
- ✅ No secrets in client-side code
- ✅ Validation of required variables on startup

**Never committed**:
- Database credentials
- API keys
- OAuth secrets
- Encryption keys

### 8. **Image Security**

- ✅ Content Security Policy for images
- ✅ SVG uploads disabled (`dangerouslyAllowSVG: false`)
- ✅ Content-Disposition: attachment
- ✅ Whitelist of allowed image domains
- ✅ Image optimization with Next.js Image component

### 9. **HTTPS Enforcement**

- ✅ HSTS header enabled
- ✅ Automatic HTTPS redirects in production
- ✅ Secure cookies (`secure: true` in production)
- ✅ TLS 1.3 minimum

### 10. **Dependency Security**

- ✅ Regular dependency audits (`pnpm audit`)
- ✅ Automated security updates
- ✅ Pinned versions in `pnpm-lock.yaml`
- ✅ No packages with known vulnerabilities

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to: **security@aquatechia.com**
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within **48 hours** and work with you to resolve the issue.

## 🔐 Security Best Practices for Contributors

### Code Security

- ✅ Never commit secrets or API keys
- ✅ Always validate and sanitize user input
- ✅ Use parameterized queries (Prisma)
- ✅ Implement proper authentication checks
- ✅ Follow principle of least privilege

### API Routes

```typescript
// ✅ Good: Rate limiting + validation
export async function POST(request: Request) {
  // Rate limiting
  const ip = getClientIP(request.headers)
  const rateLimit = await rateLimitByIP(ip)
  
  if (!rateLimit.success) {
    return new Response('Too many requests', { status: 429 })
  }

  // Input validation
  const body = await request.json()
  const sanitized = sanitizeObject(body, ['name', 'email'])
  
  // Process request...
}
```

### Database Queries

```typescript
// ✅ Good: Parameterized query with Prisma
await prisma.user.findMany({
  where: { email: sanitizedEmail }
})

// ❌ Bad: Raw SQL (avoid unless absolutely necessary)
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`
```

### Authentication

```typescript
// ✅ Good: Check authentication before sensitive operations
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Process authenticated request...
}
```

## 🔍 Security Audits

Regular security audits performed:

- **Weekly**: Dependency vulnerability scans
- **Monthly**: Code security review
- **Quarterly**: Penetration testing (planned)
- **Annually**: Third-party security audit (planned)

## 📊 Security Monitoring

We monitor for:

- ✅ Failed authentication attempts
- ✅ Rate limit violations
- ✅ Unusual traffic patterns
- ✅ Database query anomalies
- ✅ Error rates and types

**Tools**:
- Sentry for error tracking
- Vercel Analytics for traffic monitoring
- Upstash Redis for rate limiting metrics

## 🔄 Incident Response Plan

In case of a security incident:

1. **Detection**: Automated alerts + manual monitoring
2. **Assessment**: Evaluate severity and impact
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove vulnerability
5. **Recovery**: Restore normal operations
6. **Post-Incident**: Review and improve

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Prisma Security Guidelines](https://www.prisma.io/docs/guides/security)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)

## ✅ Security Checklist

- [x] Security headers configured
- [x] Input validation implemented
- [x] Rate limiting active
- [x] HTTPS enforced
- [x] CORS configured
- [x] Authentication implemented
- [x] Database queries parameterized
- [x] Environment variables protected
- [x] Image security configured
- [x] Dependencies audited
- [x] Error handling secure
- [x] Logging implemented
- [ ] Regular security audits scheduled
- [ ] Penetration testing planned

## 📞 Security Team

For security concerns:
- Email: security@aquatechia.com
- Response Time: Within 48 hours
- Severity Levels: Critical (24h), High (48h), Medium (1 week), Low (2 weeks)

---

**Last Updated**: 2024-10-30
**Version**: 1.0.0
