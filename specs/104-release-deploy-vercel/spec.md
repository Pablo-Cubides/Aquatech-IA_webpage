---
id: SPEC-104
title: "Release & Vercel Deploy Process"
status: approved
owner: Pablo Cubides
created: 2026-04-28
updated: 2026-05-02
---

# SPEC-104 — Release & Vercel Deploy Process

## 1. Problem [REQUIRED]

Without a formal release process, pushes to `main` can deploy broken code, missing env vars, or un-migrated DB schemas to production. This spec defines what must be true before any push to `main` and what to do post-deploy.

---

## 2. Constraints [REQUIRED]

- **C-001**: NO push to `main` is allowed if `release-preflight.mjs` fails.
- **C-002**: Production environment variables MUST be set in Vercel before merging the PR that uses them.
- **C-003**: Destructive database migrations MUST be approved via a separate plan documented in the PR.

---

## 3. Non-Goals [REQUIRED]

- Automated end-to-end testing (future scope).
- Automated rollback on performance regression.
- Managing DNS records or external domain routing.

---

## 4. Users [REQUIRED]

| Persona | Role | How affected |
|---|---|---|
| Pablo (Instructor) | Release Manager | Oversees deployment health and performs smoke tests |
| AI Agent | Developer | Ensures all pre-flight checks pass before proposing a merge |

---

## 5. User Stories [REQUIRED]

> *Note: This is a process spec; requirements serve as scenarios.*

### Pre-Push Requirements (automated via `pre-push` hook)
| Check | Command | Blocking? |
|---|---|---|
| TypeScript compile | `pnpm typecheck` | Yes |
| Lint | `pnpm lint` | Yes |
| Tests | `pnpm test` | Yes |
| Content lint | `pnpm lint:content` | Yes |
| Spec index | `pnpm lint:specs` | Yes |
| Image budget (changed files) | `pnpm img:budget --changed-only` | Yes |
| Dependency audit | `pnpm audit --audit-level moderate` | Warning only |

### Post-Deploy Smoke Tests (manual, <5 minutes)
| Check | What to verify |
|---|---|
| Home page | HTTP 200, no console errors |
| IA Portal | `/ia` loads, navigation works |
| Ambiental Portal | `/ambiental` loads, navigation works |
| Auth | Sign-in flow completes |
| Latest Feature | Acceptance criteria from its spec pass manually |
| Sentry | No new error spike in the 5 minutes post-deploy |

---

## 6. Business Rules [REQUIRED]

- **BR-001**: Vercel Dashboard is the source of truth for deployment status.
- **BR-002**: A failed build on Vercel results in NO update to production (safe-state).
- **BR-003**: Rollback via "Promote to Production" in Vercel Dashboard is the primary recovery mechanism.
- **BR-004**: Any new env var must be added to `.env.example` in the same PR.

---

## 7. Non-Functional Requirements [REQUIRED]

- [x] Pre-push hook enforces all quality gates.
- [x] Rollback completes in <60 seconds.
- [x] Production build identical to local build environment.

---

## 8. Edge Cases & Error Scenarios [REQUIRED]

| Scenario | Expected behavior |
|---|---|
| Vercel build fails | Previous deployment stays live; developer fixes on branch |
| Env var missing in production | App may fail; developer performs manual rollback and fixes |
| Database migration fails | Deploy fails; developer must resolve migration state manually |

---

## 9. Dependencies [OPTIONAL]

| Dependency | Type | Notes |
|---|---|---|
| Vercel | Platform | Primary hosting and deployment |
| Prisma | DB | Handles migrations |
| Sentry | Telemetry | Post-deploy error monitoring |

---

## Constitution Compliance Checklist

- [x] Pre-push hook enforces all quality gates (§8.4).
- [x] `--no-verify` prohibited except hotfix (§8.4).
- [x] Vercel auto-deploy on push to main (§8.3).
- [x] `.env.example` kept in sync (§6).
- [x] Rollback procedure documented (§8.3).
