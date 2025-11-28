# Maintenance & Operational Notes

This document contains maintenance recommendations, recurring operational tasks, and a short-runbook for common incidents.

Routine tasks
- Weekly: run dependency updates in a feature branch and test (pnpm up, pnpm install, pnpm test).
- Monthly: review Upstash usage and Redis key counts; rotate any expiring tokens.
- Quarterly: audit third-party dependencies for vulnerabilities and update major versions.

Backups & database
- Ensure Supabase (or Postgres) backups are enabled and retention meets SLA. Document restore steps in the private runbook.

Monitoring
- Verify Sentry project is receiving events for production; alerts for `error` level should notify on-call.

Common incidents
- 429 Rate-limited API: check Upstash quotas and adjust sliding window limits. Consider caching more aggressively for hot endpoints (`/api/normas`).
- Webhook failures: verify MercadoPago signature secret and retry logic. Check webhook logs in `apps/api`.
- Build fails due to missing static assets (e.g., `cases` folder): confirm the folder exists and is included in the repo or add fallback logic when missing.

Upgrade notes
- When upgrading Next.js or TypeScript, run an isolated upgrade branch, run all tests, and audit any `use client`/SSR behavior changes.
