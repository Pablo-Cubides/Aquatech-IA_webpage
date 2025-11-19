# 🚨 SECURITY ALERT - IMMEDIATE ACTION REQUIRED

## Critical: Database Credentials Exposed in Git History

**Status**: ⚠️ **ACTIVE SECURITY INCIDENT**

GitGuardian has detected PostgreSQL credentials in the repository history:

- Incidents: #22561675, #22561678, #22561676, #22561677
- Files affected: `apps/web/src/app/api/notes/route.ts`, `apps/api/prisma-helper.ps1`
- Date exposed: Oct 30 - Nov 11, 2024

### Exposed Credentials

```
Connection URI: postgresql://postgres.nzkxfrvejnicvgizlmza:ddSnabadRAHCAxw3@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
Username: postgres.nzkxfrvejnicvgizlmza
Password: ddSnabadRAHCAxw3  ⚠️ COMPROMISED
Host: aws-1-sa-east-1.pooler.supabase.com
Port: 5432/6543
Database: postgres
```

---

## ✅ Actions Completed

- [x] Removed credentials from current codebase (commit 3b27897)
- [x] Added environment variable validation
- [x] Created SECURITY.md documentation
- [x] Added pre-commit hooks to prevent future incidents

## ❌ Actions REQUIRED (Do Now)

### Step 1: Rotate Database Password (5 minutes)

1. **Go to Supabase:**

   ```
   https://supabase.com/dashboard/project/nzkxfrvejnicvgizlmza/settings/database
   ```

2. **Reset Password:**
   - Click "Database" tab
   - Find "Connection string" section
   - Click "Reset database password"
   - Generate new strong password
   - Save the new connection string

3. **Update Local Environment:**

   ```bash
   # Edit your .env file
   DATABASE_URL="postgresql://postgres.nzkxfrvejnicvgizlmza:NEW_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
   DIRECT_URL="postgresql://postgres.nzkxfrvejnicvgizlmza:NEW_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
   ```

4. **Update Vercel (if deployed):**
   - Go to: https://vercel.com/[your-team]/aquatech-ia/settings/environment-variables
   - Update `DATABASE_URL` and `DIRECT_URL`
   - Click "Save"
   - Redeploy the application

5. **Test Connection:**
   ```powershell
   cd d:\Empresas\AquatechIA\webpage\apps\api
   pnpm prisma db push
   ```

### Step 2: Clean Git History (30 minutes) - OPTIONAL BUT RECOMMENDED

The old password is still visible in commit history. Choose one option:

#### Option A: BFG Repo-Cleaner (Recommended - Easiest)

```powershell
# 1. Install BFG
choco install bfg

# Or download from: https://rtyley.github.io/bfg-repo-cleaner/

# 2. Backup your repo
cd d:\Empresas\AquatechIA
Copy-Item -Recurse webpage webpage-backup

# 3. Clone a fresh bare copy
git clone --mirror https://github.com/Pablo-Cubides/Aquatech-IA_webpage.git

# 4. Create password file
cd Aquatech-IA_webpage.git
echo "ddSnabadRAHCAxw3" > passwords.txt

# 5. Run BFG to remove password
java -jar bfg.jar --replace-text passwords.txt

# 6. Clean and push
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force

# 7. Update your local repo
cd ..\webpage
git fetch origin
git reset --hard origin/main
```

#### Option B: Do Nothing (Simpler but Less Secure)

If you don't clean history:

- Old commits will still show the password
- But the password won't work anymore (after Step 1)
- GitGuardian alerts will remain (mark as "Revoked")

### Step 3: Mark Incidents as Resolved in GitGuardian

1. Go to https://dashboard.gitguardian.com/
2. Login with your GitHub account
3. Find these incidents:
   - #22561675 (apps/web/src/app/api/notes/route.ts)
   - #22561678 (apps/web/src/app/api/notes/route.ts)
   - #22561676 (apps/api/package.json)
   - #22561677 (apps/api/prisma-helper.ps1)

4. For each incident:
   - Click "Actions" → "Mark as..."
   - Select **"Revoked"**
   - Add note:
     ```
     Password rotated on [TODAY'S DATE].
     Removed from codebase in commit 3b27897.
     Git history cleaned: [YES/NO]
     Old credentials no longer valid.
     ```

---

## 🛡️ Prevention Installed

### Pre-commit Hook

A Git hook now scans for secrets before each commit:

```bash
# Install (one-time setup)
cd d:\Empresas\AquatechIA\webpage
pnpm install  # This will run 'husky install' automatically

# Test it works
git add .
git commit -m "test"
# Should scan for secrets automatically
```

The hook will block commits containing:

- Database connection strings
- API keys
- Passwords and secrets
- Private keys

### What Gets Scanned

```
✅ postgresql://user:pass@host
✅ mysql://user:pass@host
✅ password="xxx..."
✅ api_key="xxx..."
✅ secret="xxx..."
✅ -----BEGIN PRIVATE KEY-----
```

---

## 📋 Verification Checklist

After completing all steps:

- [ ] Database password rotated in Supabase ✓
- [ ] Local .env updated with new password ✓
- [ ] Vercel environment variables updated ✓
- [ ] Application redeployed and tested ✓
- [ ] Git history cleaned (optional) ⚠️
- [ ] GitGuardian incidents marked as "Revoked" ✓
- [ ] Pre-commit hooks installed and tested ✓
- [ ] Old password confirmed non-functional ✓

---

## ❓ Need Help?

**Questions?**

- Contact: pacubidesg@unal.edu.co
- GitHub: @Pablo-Cubides

**References:**

- BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
- GitGuardian Docs: https://docs.gitguardian.com/
- Supabase Security: https://supabase.com/docs/guides/platform/going-into-prod

---

**Last Updated**: November 19, 2025  
**Next Review**: After password rotation is confirmed
