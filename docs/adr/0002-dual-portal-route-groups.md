# ADR-0002 — Dual-Portal Architecture with Next.js Route Groups
> **Status**: accepted | **Date**: 2025-10-01 | **Author**: Pablo Cubides

## Context
AquatechIA serves two distinct audiences with different themes, content, and toolsets: (1) AI practitioners via the IA portal (dark theme), and (2) environmental professionals via the Ambiental portal (light theme). These audiences have minimal overlap in their workflows. The challenge was how to structure routing and layouts without duplicating infrastructure.

### Forces
- Two distinct visual identities (dark vs light theme) and navigation structures.
- Shared auth, payment, and database infrastructure.
- Independent content and toolsets per portal.
- Must avoid cross-portal logic leakage that would create maintenance complexity.

## Decision
**We use Next.js App Router route groups — `(portals)/ia/*` and `(portals)/ambiental/*` — to isolate each portal's layouts, components, and pages while sharing the underlying infrastructure.**

Route groups (`(groupName)`) are invisible in the URL and allow separate `layout.tsx` files per portal without URL nesting. Each portal has its own theme provider, navigation, and page tree.

## Consequences

### Positive
- Each portal can evolve independently (different components, layouts, feature sets).
- No URL pollution from the group name.
- Shared components in `packages/@ia-next/ui` serve both portals.
- Clear codebase boundary: a developer knows exactly which files belong to which portal.

### Negative
- Strict discipline required: accidental cross-portal imports silently compile but violate the architecture.
- Portal-specific route collisions are possible if slug namespaces aren't managed.

### Neutral
- Both portals share the same Vercel deployment and domain (different URL paths).

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Separate Next.js apps (ia.domain.com, ambiental.domain.com) | Two separate deployments, double the infrastructure cost and CI complexity |
| Single layout with theme switching | Harder to evolve portals independently; risk of theme bleed |
| Subdirectory routing without route groups | Would expose `portals` in URLs — undesirable |

## Implementation Notes
- Constitution §2.2: "Never cross-import portal-specific logic between portals."
- Shared UI → `packages/@ia-next/ui` only.
- Each portal has its own `layout.tsx`, `loading.tsx`, and `error.tsx`.
- ESLint rule or PR review should catch cross-portal imports (no automated enforcement yet — TODO: SPEC for this).
