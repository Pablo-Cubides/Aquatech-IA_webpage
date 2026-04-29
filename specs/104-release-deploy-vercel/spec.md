# SPEC-104 — Release & Vercel Deploy Process
> **Status**: approved | **Owner**: Pablo Cubides | **Created**: 2026-04-28  
> **ADR**: [ADR-0011](../../docs/adr/0011-trunk-based-vercel-deploy.md)

---

## 1. Problem

Without a formal release process, pushes to `main` can deploy broken code, missing env vars, or un-migrated DB schemas to production. This spec defines what must be true before any push to `main` and what to do post-deploy.

---

## 2. Rules (process spec)

### Pre-Push Requirements (automated via `pre-push` hook)
All of the following must pass before push to `main`:

| Check | Command | Blocking? |
|---|---|---|
| TypeScript compile | `pnpm typecheck` | Yes |
| Lint | `pnpm lint` | Yes |
| Tests | `pnpm test` | Yes |
| Content lint | `pnpm lint:content` | Yes |
| Spec index | `pnpm lint:specs` | Yes |
| Image budget (changed files) | `pnpm img:budget --changed-only` | Yes |
| Dependency audit | `pnpm audit --audit-level moderate` | Warning only |

All checks are consolidated in `release-preflight.mjs` and invoked by `.husky/pre-push`.

### Deploy Pipeline
1. Push to `main` → Vercel auto-triggers build.
2. Vercel runs `pnpm build` (same as local build).
3. Build passes → deployment goes live at production URL.
4. Build fails → Vercel does NOT update production (safe — previous deploy stays live).
5. Developer checks Vercel dashboard for deployment status.

### Post-Deploy Smoke Tests (manual, <5 minutes)
| Check | What to verify |
|---|---|
| Home page | HTTP 200, no console errors |
| IA Portal | `/ia` loads, navigation works |
| Ambiental Portal | `/ambiental` loads, navigation works |
| Auth | Sign-in flow completes |
| Most recently deployed feature | Acceptance criteria from its spec pass manually |
| Sentry | No new error spike in the 5 minutes post-deploy |

### Rollback Procedure
If critical issue found post-deploy:
1. Vercel Dashboard → Deployments → previous deployment → "Promote to Production".
2. Takes ~30 seconds. No git changes needed.
3. Open a GitHub Issue describing the issue.
4. Fix on `hotfix/description` branch.
5. Merge hotfix PR with `Spec: no-spec: hotfix` or reference the relevant spec.

### Env Var Protocol
- Any new env var must be added to `.env.example` in the same PR.
- New env vars must be configured in Vercel Dashboard (production + preview environments) before the PR is merged.
- Never merge a PR that adds a `process.env.NEW_VAR` reference without adding it to `.env.example` and Vercel.

### DB Migration Protocol
- Schema changes: `prisma migrate dev` creates migration file. Migration file committed to repo.
- Migrations run automatically on Vercel deploy if configured, or manually via `prisma migrate deploy`.
- Destructive migrations (DROP, ALTER NOT NULL on existing data) require explicit plan documented in the PR.

---

## Constitution Compliance Checklist

- [x] Pre-push hook enforces all quality gates (§8.4).
- [x] `--no-verify` prohibited except hotfix (§8.4).
- [x] Vercel auto-deploy on push to main (§8.3).
- [x] `.env.example` kept in sync (§6).
- [x] Rollback procedure documented (§8.3).
