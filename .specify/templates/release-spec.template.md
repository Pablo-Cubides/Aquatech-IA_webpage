# RELEASE — [Release description / Descripción del release]
> **Date**: YYYY-MM-DD  
> **Release type**: `feature` | `fix` | `chore` | `hotfix`  
> **Specs included**: SPEC-NNN, SPEC-NNN  
> **Deploy target**: Vercel production  
> **Rollback plan**: Vercel instant rollback to previous deployment

---

## Pre-Push Preflight Checklist [REQUIRED — run `pnpm release:preflight`]

### Code Quality
- [ ] `pnpm typecheck` — zero errors
- [ ] `pnpm lint` — zero errors
- [ ] `pnpm test` — all tests pass
- [ ] Coverage has not decreased in any touched package

### Content & Assets
- [ ] `pnpm lint:content` — frontmatter valid, no broken links, all alts present
- [ ] `pnpm lint:specs` — all referenced specs exist and are `approved`
- [ ] Image budget: all new images within size budget
- [ ] Cloudinary URLs for new blog images are live and resolving

### Database
- [ ] Prisma schema changes tested in dev DB
- [ ] Migration file created if schema changed (`prisma migrate dev`)
- [ ] Migration applied to staging/production DB (if separate from Vercel deploy)
- [ ] No destructive migration (DROP, ALTER NOT NULL) without explicit plan

### Environment & Config
- [ ] `.env.example` updated if new env vars introduced
- [ ] New env vars set in Vercel dashboard (production + preview)
- [ ] No secrets hardcoded in any committed file
- [ ] External service configs (Cloudinary, MercadoPago, Brevo) verified in production

### Security
- [ ] `pnpm audit` — no new `moderate` or above vulnerabilities
- [ ] New API endpoints have rate limiting configured
- [ ] New webhooks have signature validation

### Performance
- [ ] New pages/routes don't break Lighthouse CI (if configured)
- [ ] No new synchronous blocking operations in critical paths
- [ ] New images have AVIF + WebP variants

---

## Deploy Execution

### Steps
1. [ ] All preflight checks green
2. [ ] `git push origin main` executed
3. [ ] Vercel deployment triggered (confirm in Vercel dashboard)
4. [ ] Deployment URL verified: `https://aquatechIA.com`
5. [ ] Smoke test critical paths (see §Post-Deploy Verification)

---

## Post-Deploy Verification [REQUIRED]

| Check | URL / Command | Expected result |
|---|---|---|
| Home page loads | `https://[domain]/` | HTTP 200, no console errors |
| IA portal | `https://[domain]/ia` | HTTP 200 |
| Ambiental portal | `https://[domain]/ambiental` | HTTP 200 |
| Auth flow | Login flow | Completes without error |
| [Feature-specific] | [URL or action] | [Expected result] |
| Sentry: new errors | Sentry dashboard | No spike in error rate |
| Vercel analytics | Vercel dashboard | LCP within budget |

---

## Rollback Procedure

If critical issues found post-deploy:

1. Open Vercel dashboard → Deployments.
2. Find the last known-good deployment.
3. Click "Promote to Production" (instant rollback, ~30 seconds).
4. Open GitHub Issue documenting the rollback.
5. Create hotfix branch: `fix/[description]`.
6. Fix forward, open PR with `Spec: SPEC-NNN` or `no-spec: hotfix`.

---

## Post-Release Notes [OPTIONAL]

| Item | Detail |
|---|---|
| Incidents during deploy | [none | describe] |
| Performance delta | [LCP before/after if measured] |
| User-facing changes | [Brief description for changelog] |
| Follow-up tasks | [GitHub Issue links] |

---

*Release Spec | Template version: 1.0.0*
