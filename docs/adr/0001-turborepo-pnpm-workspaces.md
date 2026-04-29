# ADR-0001 — Turborepo + pnpm Workspaces Monorepo
> **Status**: accepted | **Date**: 2025-10-01 | **Author**: Pablo Cubides

## Context
AquatechIA has two distinct applications (web portal + API) and multiple shared packages (UI components, database client, configs). Managing these as separate repositories would create friction: shared type changes would require publishing packages, syncing versions, and coordinating deployments. We needed a monorepo strategy that scales without introducing unnecessary complexity.

### Forces
- Shared TypeScript types and UI components between web and API.
- Single CI pipeline desired for consistency.
- Team size: solo developer — minimal overhead preferred.
- Need for independent build caching (avoid rebuilding unchanged packages).

## Decision
**We use Turborepo for build orchestration and pnpm workspaces for package management in a single monorepo.**

Turborepo handles task parallelism and caching (lint, typecheck, build, test). pnpm workspaces handle dependency hoisting and cross-package linking via `workspace:*` protocol.

## Consequences

### Positive
- Single `git clone` gives access to all apps and packages.
- Turborepo cache means unchanged packages skip rebuild — fast CI.
- TypeScript paths and shared configs work natively across packages.
- `pnpm` strict peer resolution prevents phantom dependency bugs.

### Negative
- Contributors must use pnpm (npm/yarn not supported — enforced by `packageManager` field).
- Learning curve for developers unfamiliar with monorepos.
- Turborepo cache can mask issues if cache keys are misconfigured.

### Neutral
- Node ≥18.17 required (enforced in `engines` field).

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Nx | More complex configuration for a solo project; Turborepo is simpler |
| Separate repos | Cross-package type changes require npm publish coordination — too much overhead |
| npm workspaces | pnpm's strict resolution and faster installs preferred |
| yarn workspaces | pnpm preferred for deterministic lockfile and disk efficiency |

## Implementation Notes
- `pnpm-workspace.yaml` defines workspace roots.
- `turbo.json` defines the task pipeline.
- Constitution §2.1 enforces this structure: "Never add a third `apps/*` without an ADR."
