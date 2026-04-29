---
mode: agent
description: Run the full release preflight checklist before pushing to main
---

# /release.preflight — Run release preflight

## Pre-conditions
1. Read `specs/104-release-deploy-vercel/spec.md`.
2. Read `.specify/memory/constitution.md` §8.

## Your task
Run the full pre-push checklist for a release to main.

### Step 1: Run the preflight script
```bash
node .specify/scripts/release-preflight.mjs
```

Report the output. If any check fails, STOP and address it before proceeding.

### Step 2: Manual checklist (AI cannot run these — ask user to confirm)
- [ ] New env vars (if any) are set in Vercel dashboard (production + preview).
- [ ] DB migrations (if any) are tested in dev and migration file is committed.
- [ ] Cloudinary URLs for new blog images are live and resolving.
- [ ] Vercel preview deployment for this branch has been checked visually.

### Step 3: Post-deploy plan
After user confirms push and deploy:
- [ ] Check Vercel dashboard deployment status.
- [ ] Run smoke tests from `specs/104-release-deploy-vercel/spec.md §Post-Deploy Verification`.
- [ ] Check Sentry for new error spike (5 minutes post-deploy).

### Step 4: Rollback trigger
If a critical issue is found post-deploy:
```
Rollback: Vercel Dashboard → Deployments → [previous deploy] → Promote to Production
~30 seconds. Then open GitHub Issue.
```

## Output format
```
🚀 Release Preflight for push to main

Automated checks:
  TypeScript: ✓/✗
  Lint: ✓/✗
  Tests: ✓/✗
  Content lint: ✓/✗
  Spec lint: ✓/✗
  Image budget: ✓/✗
  Audit: ✓ (warning) / ✗

Manual checks needed:
  [ ] Vercel env vars configured
  [ ] DB migration applied (if applicable)
  [ ] Cloudinary URLs verified (if applicable)

Overall: [SAFE TO PUSH | BLOCKED: list issues]
```

If BLOCKED: list each issue with the command to run to fix it.
