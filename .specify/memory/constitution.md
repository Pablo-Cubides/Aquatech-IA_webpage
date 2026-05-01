# AquatechIA — Constitution / Constitución
> **Version**: 1.0.0 | **Status**: Active | **Last modified**: 2026-04-28  
> Changes to this document require an explicit ADR and a SemVer bump.  
> Cambios a este documento requieren un ADR explícito y un bump de SemVer.

---

## Index / Índice
1. [Stack & Versions](#1-stack--versions)
2. [Architectural Principles](#2-architectural-principles)
3. [Code Conventions](#3-code-conventions)
4. [Quality Gates](#4-quality-gates)
5. [Performance Budgets](#5-performance-budgets)
6. [Security Rules](#6-security-rules)
7. [Content & Image Policy](#7-content--image-policy)
8. [Git & Release Process](#8-git--release-process)
9. [AI Agent Rules](#9-ai-agent-rules)
10. [Three-Strikes Rule](#10-three-strikes-rule)

---

## 1. Stack & Versions

| Layer | Technology | Locked Version |
|---|---|---|
| Framework | Next.js (App Router) | `^16.0.10` |
| UI Runtime | React + React DOM | `^19.2.3` |
| Language | TypeScript | `^5.9.3` (strict mode) |
| Styling | Tailwind CSS | per package |
| Validation | **Zod** (único / sole validator) | `^4.1.5` |
| ORM | Prisma | `^7.4.0` |
| Database | Supabase PostgreSQL | cloud |
| Auth | Firebase Admin + NextAuth | `^13.5.0` / `^4.24.13` |
| Payments | MercadoPago | `^2.9.0` |
| Email | Brevo (`@getbrevo/brevo`) | `^3.0.1` |
| Rate Limiting | Upstash Redis | `^2.0.6` / `^1.35.6` |
| Monitoring | Sentry | `^10.x` |
| Maps | MapLibre GL | `^5.10.0` |
| Build | Turborepo | `^2.5.8` |
| Package Manager | pnpm | `8.15.6` (Node ≥18.17) |
| Testing | Vitest | `^4.0.5` |
| Image processing | Sharp + Jimp | `^0.34.4` / `^1.6.0` |
| CDN (blog images) | Cloudinary | account: aquatechIA |

> **Rule**: Do NOT introduce alternative package managers, validation libraries, or ORMs. Any stack change requires an ADR.

---

## 2. Architectural Principles

### 2.1 Monorepo Structure
```
apps/web      → Frontend (Next.js, port 3000)
apps/api      → Backend API (Next.js API Routes, port 3001)
packages/@ia-next/*  → Shared packages
```
- **Never** add a third `apps/*` without an ADR.
- **Never** access the database from `apps/web` directly. All DB access goes through `apps/api`.

### 2.2 Dual Portal Isolation
- `(portals)/ia/*` — AI portal, dark theme.
- `(portals)/ambiental/*` — Environmental portal, light theme.
- **Never cross-import** portal-specific logic between portals.
- Shared UI → `packages/@ia-next/ui` only.

### 2.3 Rendering Strategy
- **Server Components by default.** Add `"use client"` only when:
  - Browser APIs are needed (window, localStorage, geolocation).
  - React hooks with interactivity (useState, useEffect for side effects).
  - Third-party client-only libraries.
- Document every `"use client"` with a one-line comment explaining why.

### 2.4 Data Access
- DB queries: **only** via `packages/@ia-next/database` (Prisma Client).
- External APIs: called from `apps/api` route handlers only. Never from frontend.
- Zod schema validates **all** inputs at system boundaries (API routes, form submissions, env vars).

### 2.5 Authentication
- Firebase Authentication handles identity (tokens).
- NextAuth handles session management.
- Supabase handles data storage.
- The three systems are **decoupled** — never conflate their responsibilities.

---

## 3. Code Conventions

### 3.1 TypeScript
- `strict: true` in all tsconfig files. No exceptions.
- No `any` without an inline comment justifying the escape hatch.
- Prefer `type` over `interface` for data shapes; `interface` for extensible contracts.
- Derive types from Zod schemas — never duplicate type definitions.

### 3.2 Naming
| Entity | Convention | Example |
|---|---|---|
| Files/folders | `kebab-case` | `blog-articles.ts` |
| Components | `PascalCase` | `ArticleCard.tsx` |
| Hooks | `camelCase` with `use` prefix | `usePortalTheme` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_CREDITS` |
| DB tables | `snake_case` | `user_credits` |
| Env vars | `SCREAMING_SNAKE_CASE` | `MERCADOPAGO_ACCESS_TOKEN` |
| Image files | `kebab-case` | `hero-llm-transformers.avif` |
| Spec IDs | `SPEC-NNN` | `SPEC-001` |
| ADR IDs | `ADR-NNNN` | `ADR-0001` |
| Task IDs | `TNNN` within spec | `T001` |

### 3.3 Comments
- Write comments only when the **WHY** is non-obvious.
- No JSDoc on every function. Only on exported public APIs of shared packages.
- No `// TODO:` without a linked GitHub Issue number.

### 3.4 Imports
- Absolute imports via `@/` alias in each app.
- Cross-package imports only via workspace package names (`@ia-next/database`, `@ia-next/ui`).
- No circular dependencies between packages.

### 3.5 Commits
- **Conventional Commits** mandatory:
  ```
  feat(portal-ia): add article slug validation
  fix(api): handle mercadopago webhook timeout
  docs(adr): add ADR-0009 image pipeline decision
  spec(SPEC-100): define content pipeline requirements
  ```
- Allowed types: `feat`, `fix`, `docs`, `spec`, `test`, `refactor`, `chore`, `style`, `perf`, `ci`.
- **`--no-verify` is prohibited** except in documented `hotfix` emergencies (label PR as `hotfix` + add retroactive spec note).

---

## 4. Quality Gates

### 4.1 Test Coverage (ramp-up strategy)
| Package / Area | Current | Gate (blocker) | Target (6 months) |
|---|---|---|---|
| `apps/api` payments | ~30% | **≥70%** (enforced now) | ≥85% |
| `apps/api` auth | ~30% | **≥70%** (enforced now) | ≥85% |
| `apps/api` credits | ~30% | **≥70%** (enforced now) | ≥85% |
| `apps/api` other | ~30% | no decrease | ≥60% |
| `apps/web` | ~30% | no decrease | ≥50% |
| `packages/*` | varies | no decrease | ≥60% |

- Coverage check runs in CI on every PR.
- A PR **cannot decrease** coverage in any package it touches.

### 4.2 Accessibility
- WCAG 2.1 AA for all user-facing pages.
- All `<img>` and Next.js `<Image>` components must have non-empty `alt`.
- Color contrast ratio ≥4.5:1 for text.
- Keyboard navigation required for all interactive elements.

### 4.3 Linting & Formatting
- `pnpm lint` must pass with zero errors before merge.
- `pnpm typecheck` must pass.
- `pnpm format` applied automatically via Prettier.

---

## 5. Performance Budgets

### 5.1 Portal IA (marketing pages, no heavy data)
| Metric | Budget | Tool |
|---|---|---|
| LCP | < 2.5s | Vercel Analytics |
| CLS | < 0.1 | Vercel Analytics |
| INP | < 200ms | Vercel Analytics |
| JS bundle (main) | < 250KB gzipped | Next.js build analysis |

### 5.2 Portal Ambiental (maps, data visualizations)
| Metric | Budget | Notes |
|---|---|---|
| LCP (non-map routes) | < 2.5s | Same as IA portal |
| LCP (map routes) | < 3.5s | MapLibre tiles exception |
| CLS | < 0.1 | |
| INP | < 200ms | |

### 5.3 Image Budgets
| Asset type | Max size | Format |
|---|---|---|
| Hero images (blog) | ≤ 200KB | AVIF + WebP fallback |
| Inline images (blog) | ≤ 80KB | AVIF + WebP fallback |
| Tool screenshots/UI | ≤ 120KB | WebP |
| Author avatars | ≤ 40KB | WebP |
| Icons/logos | ≤ 10KB | SVG preferred |

- All images must have AVIF + WebP variants generated by `optimize-image.mjs`.
- `alt` attribute is **mandatory and blocking** in CI (`image-budget.yml`).

---

## 6. Security Rules

- OWASP Top 10 must be considered for any feature touching user data.
- All user input validated with Zod at route handler entry (never trust client data).
- Environment variables for all secrets — **never hardcode** credentials.
- `.env.example` must stay in sync with actual env vars used.
- Firebase tokens validated server-side on every protected route.
- MercadoPago webhook signatures validated before processing.
- CORS restricted to known origins in production.
- Upstash rate limiting on all public-facing API endpoints.
- Security audit (`pnpm audit`) runs in CI; `moderate` findings block merge.

---

## 7. Content & Image Policy

### 7.1 Article Data Structure
- Source of truth: TypeScript files in `apps/web/src/lib/articles/<portal>/<slug>.ts`.
- Each file exports a single `BlogArticle` object validated against `article.zod.ts`.
- Slugs: `kebab-case`, unique across both portals, URL-safe, in Spanish.
- `date`: ISO 8601 (`YYYY-MM-DD`). No future-dated articles in production.
- `readTime`: integer in minutes. Must be within 20% of actual word count / 200 wpm estimate.
- `heroImage`: URL to Cloudinary (new articles) or `/images/...` path (legacy).
- `tags`: 3–7 tags per article, from the approved taxonomy in `docs/domain/glossary.md`.

### 7.2 AI-Generated Articles
- Generated by AI agents (Claude Code, Antigravity, Copilot) using `.specify/instructions/content-generation.md`.
- Published directly to production — no mandatory human review gate.
- **Safeguard**: Zod validation + `content-lint.yml` must pass in CI before merge.
- Author field must reflect the generating agent context or Pablo Cubides as responsible.

### 7.3 Image Storage
| Asset origin | Storage | Tool |
|---|---|---|
| Blog hero / inline (new) | Cloudinary | `optimize-image.mjs` with `--cloudinary` flag |
| Tool UI / screenshots | `public/images/portal-*/` | `optimize-image.mjs` (local) |
| Author photos | `public/images/portal-*/autor/` | Manual + Sharp |
| AI-generated images | Cloudinary | + `image-manifest.json` with model/prompt/rights |

### 7.4 AI-Generated Image Manifest
Every AI-generated image must have a `<slug>.image-manifest.json` alongside it:
```json
{
  "model": "dall-e-3 | midjourney | stable-diffusion | ...",
  "prompt": "...",
  "generatedAt": "YYYY-MM-DD",
  "license": "ai-generated-no-commercial-restriction",
  "cloudinaryUrl": "https://res.cloudinary.com/..."
}
```

---

## 8. Git & Release Process

### 8.1 Branching
- **Trunk-based development**: single main branch (`main`).
- Feature branches: `feature/<SPEC-NNN>-brief-description`
- Fix branches: `fix/<issue-or-description>`
- Spec branches: `spec/<SPEC-NNN>-slug` (for spec authoring PRs)
- ADR branches: `adr/<ADR-NNNN>-slug`
- Branches live ≤2 working days. Stale branches deleted.

### 8.2 Pull Requests
- Every non-trivial PR must reference a Spec: `Spec: SPEC-NNN` in description.
- Trivial PRs (typo, dep bump, config) use label `no-spec` with a one-line reason.
- PR template in `.github/pull_request_template.md` is mandatory.
- `spec-lint.yml` CI job validates spec reference exists.

### 8.3 Deploy
- `push to main` → Vercel auto-deploy to production.
- No deploy freeze windows (flexibility preferred).
- Rollback: Vercel instant rollback to previous deployment.
- `release-preflight.mjs` runs as part of `pre-push` hook before every push to main.

### 8.4 Husky Hooks
| Hook | What it runs | Bypassable? |
|---|---|---|
| `pre-commit` | Secret scan + syntax validation | `--no-verify` **prohibited** |
| `pre-push` | Full preflight (lint + typecheck + test + content-lint + spec check) | `--no-verify` **prohibited** |

---

## 9. AI Agent Rules

When working in this repo, an AI coding agent (Claude Code, GitHub Copilot, Antigravity, or equivalent) **must**:

1. **Read constitution first** before generating code for any non-trivial change.
2. **Read the relevant spec** (`specs/NNN-feature/spec.md`) before implementing.
3. **Check the relevant plan** (`specs/NNN-feature/plan.md`) for the approved technical approach.
4. **Never generate code that violates the constitution** (wrong stack, wrong patterns, bypassing DB access rules, etc.).
5. **Flag constitution violations** in the PR description if a compromise was necessary.
6. **Follow the three-strikes rule** (see §10).
7. **Validate outputs** against Zod schemas and TypeScript types — never assume `any`.
8. **Prompt files** in `.github/prompts/` are the approved interaction templates. Use them.
9. When generating articles: follow `.specify/instructions/content-generation.md` exactly.
10. When generating images: follow `.specify/instructions/image-generation.md` exactly.

---

## 10. Three-Strikes Rule

> "If you do something manually three times, it deserves a spec, a script, or a decision record."

When an AI agent or developer detects a pattern repeated **≥ 3 times**:

| Pattern type | Action |
|---|---|
| Manual process / workflow | Create a script in `.specify/scripts/` + spec in `specs/` |
| Recurring feature type | Create a spec template in `.specify/templates/` |
| Architectural decision revisited | Create or update an ADR in `docs/adr/` |
| Repeated AI interaction pattern | Create a prompt in `.github/prompts/` |
| Recurring CI step | Consolidate into a reusable workflow |

The agent must **propose** this before implementing the third instance, not after.

---

*This constitution is versioned. See [constitution.changelog.md](constitution.changelog.md) for history.*
