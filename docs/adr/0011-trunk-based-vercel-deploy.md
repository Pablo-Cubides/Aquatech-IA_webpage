# ADR-0011 — Trunk-Based Development with Vercel Auto-Deploy
> **Status**: accepted | **Date**: 2026-04-28 | **Author**: Pablo Cubides

## Context
The project needs a branching strategy and deployment pipeline. Common strategies include Gitflow (main + develop + feature/release branches), trunk-based (short-lived branches off main), and others. The deployment pipeline is hosted on Vercel, which has native GitHub integration.

### Forces
- Solo developer: complex branching strategies add overhead without benefiting collaboration.
- Fast iteration desired: ideas to production in hours, not days.
- Vercel auto-deploy on push to `main` provides instant feedback.
- Vercel preview deployments on PRs allow validation before merge.
- Risk management: `release-preflight.mjs` provides the quality gate before push.
- No freeze windows or release schedule — publish when ready.

## Decision
**Trunk-based development: a single `main` branch. Feature branches are short-lived (≤2 working days) and merged directly to `main` via PR. Push to `main` triggers Vercel auto-deploy to production. No `develop` branch.**

Branch naming:
- `feature/SPEC-NNN-slug` for features
- `fix/description` for bug fixes
- `spec/SPEC-NNN-slug` for spec authoring
- `adr/NNNN-slug` for ADR authoring

Rollback: Vercel instant rollback (promote previous deployment) if critical issues arise post-deploy.

## Consequences

### Positive
- Minimal branching overhead for a solo developer.
- Short-lived branches reduce merge conflict risk.
- Vercel preview deployments on every PR enable visual verification before merge.
- Deploy-on-push to `main` keeps production always at HEAD.
- `release-preflight.mjs` provides the discipline that would otherwise come from a `develop` branch.

### Negative
- No staging environment separate from Vercel preview — some production-only issues may not be caught.
- If `main` breaks, production breaks immediately (mitigated by preflight + CI checks).
- Solo developer has no peer review unless explicitly requested.

### Neutral
- Vercel `--no-verify` is prohibited to prevent bypassing the preflight.
- The `pre-push` husky hook runs `release-preflight.mjs` as the primary safety net.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Gitflow (main + develop) | Overkill for solo dev; adds merge ceremony without benefit |
| GitHub Flow (main + feature) | This IS what we do — trunk-based is a variant with shorter branch lifetimes |
| Separate staging environment | Cost and complexity not justified at current scale |
| Manual deploy (no auto-deploy) | Slower iteration; Vercel auto-deploy is the main productivity benefit |

## Implementation Notes
- Constitution §8.1: Branch naming conventions defined.
- Constitution §8.2: PR template requires spec reference or `no-spec` label.
- Constitution §8.3: `push to main` → Vercel deploy. Rollback via Vercel dashboard.
- Constitution §8.4: `pre-push` hook runs `release-preflight.mjs`. `--no-verify` prohibited.
- Vercel project connected to `main` branch in Vercel dashboard settings.
- Vercel preview deployments enabled for all branches/PRs.
