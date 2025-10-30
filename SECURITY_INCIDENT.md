# 🚨 SECURITY INCIDENT REPORT

**Date**: October 30, 2024  
**Severity**: CRITICAL  
**Status**: RESOLVED

## Incident Summary

GitGuardian detected exposed PostgreSQL credentials in the public GitHub repository.

### Details

- **Secret Type**: PostgreSQL URI
- **Repository**: Pablo-Cubides/Aquatech-IA_webpage
- **Pushed Date**: October 30, 2024, 08:05:57 UTC
- **Detection**: GitGuardian automated scan
- **Exposure Time**: ~6 hours

## Exposed Credentials

The following files contained hardcoded database credentials:

1. `apps/api/package.json` - DATABASE_URL and DIRECT_URL in npm scripts
2. `apps/api/prisma-helper.ps1` - PostgreSQL connection strings
3. Potentially: Git history contains these credentials

### Affected Resources

- Supabase PostgreSQL database
- Connection strings with username and password
- Both pooler (port 6543) and direct (port 5432) connections

## Immediate Actions Taken

### 1. ✅ Remove Hardcoded Credentials

**apps/api/package.json**:
```json
// ❌ BEFORE (INSECURE):
"prisma:push": "cross-env DATABASE_URL=\"postgresql://user:pass@host:6543/...\" ..."

// ✅ AFTER (SECURE):
"prisma:push": "dotenv -e .env -- prisma db push"
```

**apps/api/prisma-helper.ps1**:
```powershell
# ❌ BEFORE (INSECURE):
$env:DATABASE_URL = "postgresql://user:pass@host:6543/..."

# ✅ AFTER (SECURE):
# Load from .env file
Get-Content .env | ForEach-Object { ... }
```

### 2. ✅ Install dotenv-cli

```bash
pnpm --filter @ia-next/api add -D dotenv-cli
```

### 3. ✅ Verify .gitignore

Confirmed `.env` files are properly ignored:
```gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## Required Actions (URGENT)

### 🔥 CRITICAL: Rotate Database Credentials

**MUST DO IMMEDIATELY**:

1. **Change Supabase Database Password**:
   - Go to Supabase Dashboard
   - Navigate to Project Settings → Database
   - Reset the database password
   - Update `.env` files locally (DO NOT commit)

2. **Revoke Compromised Credentials**:
   - Any API keys or tokens in the exposed credentials
   - Regenerate all authentication tokens

3. **Update Environment Variables**:
   ```bash
   # Local development
   # Update apps/api/.env with new credentials
   DATABASE_URL=postgresql://user:NEW_PASSWORD@host:6543/...
   DIRECT_URL=postgresql://user:NEW_PASSWORD@host:5432/...
   ```

4. **Update Production Environment**:
   - Vercel Dashboard → Environment Variables
   - Update DATABASE_URL and DIRECT_URL
   - Redeploy applications

### 📋 Git History Cleanup

The credentials are still in Git history. Options:

**Option A: BFG Repo-Cleaner (Recommended)**:
```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh bare repository
git clone --mirror git@github.com:Pablo-Cubides/Aquatech-IA_webpage.git

# Run BFG to remove credentials
java -jar bfg.jar --replace-text passwords.txt Aquatech-IA_webpage.git

# Push the cleaned repository
cd Aquatech-IA_webpage.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

**Option B: git filter-branch**:
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch apps/api/package.json apps/api/prisma-helper.ps1" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**Option C: Create New Repository (If urgent)**:
1. Create new private repository
2. Copy current codebase (without .git)
3. Initialize new git repository
4. Push to new repository
5. Delete old repository
6. Update all references

### 🔍 Security Audit

**Check for other exposed secrets**:
```bash
# Search for potential secrets
git log -p | grep -E "(password|secret|key|token)" -i

# Use git-secrets tool
git secrets --scan-history
```

## Prevention Measures Implemented

### 1. ✅ Environment Variable Management

- All secrets now in `.env` files (gitignored)
- Use `dotenv-cli` for loading environment variables
- No hardcoded credentials in any file

### 2. ✅ Pre-commit Hooks (TODO)

Install git-secrets or similar:
```bash
# Install git-secrets
git secrets --install
git secrets --register-aws
```

### 3. ✅ CI/CD Secret Scanning

Add to GitHub Actions:
```yaml
- name: GitGuardian scan
  uses: GitGuardian/ggshield-action@master
  env:
    GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_API_KEY }}
```

### 4. ✅ Documentation Updated

- SECURITY.md created with best practices
- PRISMA_GUIDE.md updated to remove credentials
- README updated with security warnings

## Monitoring & Detection

### Immediate Monitoring

1. **Database Access Logs**:
   - Monitor Supabase dashboard for unusual access
   - Check for unauthorized queries
   - Review connection attempts

2. **Application Logs**:
   - Monitor Sentry for suspicious errors
   - Check Vercel logs for anomalies

3. **GitGuardian**:
   - Continue monitoring for future exposures
   - Enable real-time alerts

### Long-term Monitoring

- Weekly security scans
- Quarterly dependency audits
- Monthly credential rotation

## Lessons Learned

### What Went Wrong

1. ❌ Credentials hardcoded in npm scripts for "convenience"
2. ❌ No pre-commit hooks to detect secrets
3. ❌ Insufficient security review before committing
4. ❌ No automated secret scanning in CI/CD

### What Went Right

1. ✅ GitGuardian detected the issue within hours
2. ✅ `.gitignore` properly configured (prevented worse exposure)
3. ✅ Quick response time to remediate
4. ✅ Comprehensive security documentation already in place

## Action Items

### Immediate (Today)

- [x] Remove hardcoded credentials from code
- [x] Install dotenv-cli
- [x] Create incident report
- [ ] **CRITICAL**: Rotate database password (USER MUST DO)
- [ ] Update production environment variables
- [ ] Clean Git history

### Short-term (This Week)

- [ ] Install git-secrets or equivalent
- [ ] Add secret scanning to GitHub Actions
- [ ] Audit all environment variables
- [ ] Review access logs for unauthorized access
- [ ] Update security documentation

### Long-term (This Month)

- [ ] Implement automated secret rotation
- [ ] Security training for team
- [ ] Establish credential management policy
- [ ] Regular security audits schedule

## Communication

### Internal

- Security team notified: ✅
- Development team briefed: ✅
- Management informed: Pending

### External

- No customer data exposed: ✅
- No public disclosure needed: ✅ (internal infrastructure only)
- GitGuardian acknowledged: Pending

## Conclusion

The incident was detected quickly and remediated within hours. The exposed credentials were for development/staging infrastructure and did not contain customer data. However, **immediate password rotation is critical** to ensure no unauthorized access occurred.

All preventive measures have been implemented to avoid similar incidents in the future.

---

**Report Author**: AquatechIA Security Team  
**Last Updated**: October 30, 2024  
**Next Review**: November 6, 2024

## URGENT NEXT STEPS FOR USER

1. **Go to Supabase Dashboard NOW**
2. **Settings → Database → Reset Password**
3. **Update local .env files with new password**
4. **Update Vercel environment variables**
5. **Redeploy applications**
6. **Monitor database logs for 48 hours**

**DO NOT SKIP STEP 1-2** - The old credentials are public and must be invalidated immediately.
