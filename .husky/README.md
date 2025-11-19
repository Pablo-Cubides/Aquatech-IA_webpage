# Git Secrets Prevention

This directory contains Git hooks to prevent committing sensitive information.

## Pre-commit Hook

The `pre-commit` hook scans staged files for:

- Database connection strings (PostgreSQL, MySQL)
- API keys and tokens
- Passwords and secrets
- Private keys

## Setup (One-time)

```bash
# Install husky
pnpm add -D husky

# Initialize husky
npx husky install

# Make hooks executable (Git Bash/WSL)
chmod +x .husky/pre-commit

# Or on Windows PowerShell
icacls .husky\pre-commit /grant Everyone:RX
```

## Usage

The hook runs automatically on `git commit`. If secrets are detected, the commit will be blocked.

**Example blocked commit:**

```
❌ ERROR: Potential secret detected in apps/web/src/app/api/notes/route.ts
   Pattern: postgresql://[a-zA-Z0-9._-]+:[^@\s]+@

Please remove the secret and use environment variables instead.
Add the value to .env file and reference it with process.env.VARIABLE_NAME
```

## Bypassing (Emergency Only)

If you need to bypass the check (NOT recommended):

```bash
git commit --no-verify -m "message"
```

## Patterns Detected

1. **Database URIs**: `postgresql://user:pass@host`
2. **API Keys**: `api_key="xxx..."`
3. **Secrets**: `secret="xxx..."`
4. **Private Keys**: `-----BEGIN PRIVATE KEY-----`

## Adding to Existing Repository

Already committed secrets? See `SECURITY.md` for remediation steps.
