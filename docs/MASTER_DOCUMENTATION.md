# AquatechIA — Master Documentation

This document is the single-source, developer-focused reference for the AquatechIA monorepo. It covers architecture, development setup, and a complete inventory of every portal tool (IA portal, Environmental portal) and authoring/admin utilities. Written in clear, practical English for engineers, devops, and maintainers.

**Last updated:** November 27, 2025

**Contents**
- Overview
- Quick start (developer)
- Repository layout
- Architecture summary
- Environment & secrets
- Full tools inventory (by portal)
  - IA Portal — User tools
  - IA Portal — Author/Admin tools
  - Environmental Portal — User tools
  - Environmental Portal — Author/Admin tools
- Shared packages & scripts
- API endpoints used by tools
- Testing, linting, and typechecking
- Deployment and CI/CD
- Troubleshooting & common errors
- Maintenance notes & recommended improvements
- Glossary

---

**Overview**

AquatechIA is a dual-portal, AI-first web platform implemented as a Turborepo monorepo. The two main portals are:
- IA Portal (theme: dark) — AI tools, visualizers and educational micro-apps.
- Environmental Portal (theme: light) — Environmental data tools, regulatory databases, GIS viewers and EIA matrix generators.

Both portals run inside the same Next.js frontend (`apps/web`) and share backend capabilities from `apps/api` and shared packages under `packages/@ia-next`.

This master doc collects and expands the existing `README.md`, `ARCHITECTURE.md`, and tool-level READMEs into a single, searchable resource.

**Quick start (developer)**

1. Clone the repository and install dependencies:

```pwsh
git clone <repo-url>
cd webpage
pnpm install
```

2. Copy env template and set local secrets:

```pwsh
copy .env.example .env.local
# Edit .env.local with local credentials (see "Environment & secrets")
```

3. Start the dev environment (monorepo default):

```pwsh
pnpm dev
```

4. Web app available: `http://localhost:3000`; API: `http://localhost:3001` (default config)

**Repository layout (quick)**

- `apps/web` — Next.js frontend (App Router). Contains `(portals)/ia` and `(portals)/ambiental` routes with their tools.
- `apps/api` — API app with webhooks (MercadoPago, Brevo), auth verification, and backend logic.
- `packages/@ia-next/*` — Shared utilities (database/prisma client, UI, TS/ESLint configs, matriz-generator).
- `docs/` — (this file) master documentation.
- `scripts/` — helper scripts (SVG conversion etc.)

**Environment & secrets**

Essential environment variables (non-exhaustive — check `.env.example`):
- `DATABASE_URL` — Supabase/Postgres connection string
- `NEXTAUTH_URL` / `NEXTAUTH_SECRET` — NextAuth settings
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — OAuth
- `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET` — Payments
- `BREVO_API_KEY` — Transactional email
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — Redis cache + rate limiter
- `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` — Monitoring

Always keep production secrets in your deployment provider's environment store (Vercel, etc.) and never commit `.env.local`.

---

**Full tools inventory (complete)**

Below is a concise, definitive list of all tools and authoring utilities found in the codebase. For each tool: route, purpose, developer notes, APIs & env vars needed, and tests or TODOs.

IA Portal — User tools (routes under `/ia/herramientas`)

- `visor-difusion` — Route: `/ia/herramientas/visor-difusion`
  - Purpose: AI image diffusion visualizer — runs multi-step diffusion simulations, shows noise/steps, exports GIFs.
  - Developer notes: uses client-side controls and a sequence API under `/api/visor-step`, `/api/visor-noise`, `/api/visor-prompts`. Static 'cases' and 'noise' assets live near component static folders. Watch build logs for missing `cases` directory (some builds show missing path warnings).
  - API: `/api/visor-step` (POST), `/api/visor-prompts` (GET), `/api/visor-noise/[step]` (GET)
  - Env: none specific (uses local assets and web APIs)
  - Tests: component tests exist (see `__tests__` locations in repo).

- `filtrado-ia` — Route: `/ia/herramientas/filtrado-ia`
  - Purpose: Demonstrates how AI filters responses; front-end UI for evaluating model outputs and test cases.
  - Developer notes: README exists in Spanish; the frontend is Next.js app router and uses reusable components and a `CasosContext`. Translate the readme and update examples to English for contributors. Tests under `__tests__` exist (CasosContext).
  - API: consumes internal filtering logic (component-level). No production env required.

- `parametros-decodificacion` — Route: `/ia/herramientas/parametros-decodificacion`
  - Purpose: Educational tool to experiment with LLM decoding parameters (temperature, top_k, top_p, etc.).
  - Developer notes: Contains a `ProcessContext` and global types. Useful for reproducible experiments and user education.
  - API: may call LLM / server-side endpoints if integrated; otherwise client-only.

- `como-funcionan-llm` — Route: `/ia/herramientas/como-funcionan-llm`
  - Purpose: Explanatory/educational pages about LLM internals, likely static/interactive docs and small widgets.

- `[slug]` — Route: generic tool landing / tool detail pages at `/ia/herramientas/[slug]`

IA Portal — Author/Admin tools (routes under `/ia/autor/herramientas`)

- `aula-score` — Route: `/ia/autor/herramientas/aula-score`
  - Purpose: Classroom gamified scoreboard for instructors. Client-only, local state, no persistence. Supports 1–30 groups, countdown, timer, add groups, theme toggle.
  - Developer notes: README exists (Spanish) with tests, validations and component list. Convert README to English and add optional persistence/real-time features later.
  - Tests: Manual test cases included in README; components include `ScoreCard`, `CountdownModal`, `TimerModal`.

- `consulta-nota` — Route: `/ia/autor/herramientas/consulta-nota`
  - Purpose: Grade visualization and import tool for instructors. Exposes an upload CSV/Excel pipeline and routes under `/api/notes` in the web app.
  - Developer notes: Ensure proper Zod validation and pagination on large imports. Watch for rate limits on bulk imports.

- `ruleta-academica` — Route: `/ia/autor/herramientas/ruleta-academica`
  - Purpose: Question wheel for classroom gamification. Includes an authoring UI and a gameplay page (`/juego`).
  - Developer notes: Build errors noticed in CI for prerendering `/juego` — ensure CSR-only hooks (like `useSearchParams`) are used inside appropriate client components or wrapped with Suspense boundaries when needed.

Environmental Portal — User tools (routes under `/ambiental/herramientas`)

- `visor-mapas-ambientales` — Route: `/ambiental/herramientas/visor-mapas-ambientales`
  - Purpose: GIS/Map viewer for environmental datasets. Upload wizard, MapLibre-based viewer, dataset API under `/api/datasets`.
  - Developer notes: Types for GeoJSON must match shared types. Type errors in `typecheck_error.log` indicate mismatched feature types; consolidate `types/index` usage to avoid duplicate type definitions.
  - API: `/api/tiles/*` and `/api/datasets` for tile/dataset serving. Uses Supabase for file storage in some flows.

- `normas-ambientales` — Route: `/ambiental/herramientas/normas-ambientales`
  - Purpose: Browse regulatory texts (water, air, solid waste, discharges) stored as JSON in `public/data/json/`.
  - Developer notes: Caching is implemented via `normasCache` (Redis). Admin UI exists to manage sources and to refresh/ingest JSON files.
  - API: `/api/normas` (GET), `/api/sectores` (GET)

- `generador-matrices` — Route: `/ambiental/herramientas/generador-matrices`
  - Purpose: Generate environmental impact analysis matrices (Leopold, Conesa, Battelle) with guided builders and matrix views.
  - Developer notes: Shared package `packages/@ia-next/matriz-generator` contains core logic. The public SVG/logo is in `apps/web/public/tools/generador-matrices.svg`.

- `analisis-correlaciones` — Route: `/ambiental/herramientas/analisis-correlaciones`
  - Purpose: Statistical correlation analysis tool with charts (ScatterPlot/CorrelationTable) and export features.
  - Developer notes: See `__tests__` and `components/*` for existing tests and example datasets. Ensure Analytics export matches CSV/XLSX formats.

Environmental Portal — Author/Admin tools

- The environmental portal contains mirrored `autor` routes for authoring content and managing datasets, including `visualizador-notas`, `genealogia-app` and route rewrites configured in `next.config.mjs`. Admin endpoints are available under web app API for creating/updating norms and datasets.

Shared and utility tools

- `packages/@ia-next/database` — Prisma client. Central DB access; used by both apps.
- `packages/@ia-next/ui` — Shared UI components and Tailwind config.
- `packages/@ia-next/matriz-generator` — EIA matrix generation logic used by `generador-matrices`.
- `scripts/convert-svg-professional.mjs` — SVG optimization script for design assets.

APIs referenced by tools (summary)

- Web app API (`apps/web/src/app/api`)
  - `/api/health` — health checks
  - `/api/notes` — grade queries and import
  - `/api/normas`, `/api/sectores`, `/api/paises` — regulations lookup (cached)
  - `/api/questionsets` — ruleta-academica question sets
  - `/api/tiles/[z]/[x]/[y]` — map tiles proxy
  - `/api/tools/analytics` — usage tracking
  - `/api/visor-step`, `/api/visor-prompts`, `/api/visor-noise/[step]` — diffusion/visor endpoints

- API app (`apps/api/src/app/api`)
  - `/api/auth` — Firebase token validation endpoint
  - `/api/payments` — create MercadoPago preferences
  - `/api/mp/webhook` — MercadoPago webhook (signature must be verified)
  - `/api/email/webhook` — Brevo webhook

Testing, linting and typechecking

- Run linter and typecheck regularly. Observed files: `lint_error.txt` and `typecheck_error.log` point to actionable fixes (mismatched types, missing `cache` usage, and missing component directories). Fixes:
  - Consolidate type definitions under `apps/web/src/types/index.ts` and import consistently.
  - For pages requiring client-only hooks, mark components with `'use client'` or wrap with Suspense/CSR boundaries to avoid prerender errors.

Commands:

```pwsh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm dev
```

Deployment & CI/CD

- CI pipeline exists in `.github/workflows/ci.yml` (lint, test, typecheck, build). Deploy to Vercel using `vercel.json` routes that map `/api/*` to `apps/api` and the rest to `apps/web`.
- Production checklist:
  - Ensure env vars set in Vercel (see `Environment & secrets`).
  - Configure OAuth redirect URIs.
  - Add MercadoPago and Brevo webhook URLs and verify signatures.

Troubleshooting & common errors

- Prerender/CSR errors for pages using client-only hooks: use `'use client'` or refactor to client components.
- Type mismatch in GeoJSON: unify types and avoid duplicate type declarations in tool subfolders.
- Missing static `cases` folder referenced by `visor-difusion`: create or symlink the expected directory under the tool components path.
- Rate limit-related 429s: examine Upstash quota and adjust sliding-window thresholds for public endpoints.

Maintenance notes & recommended improvements

- Add a top-level `docs/` with one-page HOWTOs for common tasks (add tool, publish norm JSON, add matrix templates).
- Standardize types by moving all shared types into `packages/@ia-next/types` or `apps/web/src/types` and reference from subfolders.
- Introduce minimal e2e tests for key workflows (login + buy credits + use `visor-difusion`, upload notes import, generate matrix).
- Consider making `aula-score` optionally persistent (localStorage toggle) and adding an opt-in real-time socket mode.

Glossary

- Tool: An interactive micro-app inside a portal (e.g., `visor-difusion`).
- Author tools: Admin-facing pages for creating or managing content/datasets.
- Credits: Internal virtual currency used to run credit-gated tools.

---

If you'd like, I can:
- Expand each tool entry into its own detailed README (routes, file map, props, major components). 
- Generate a `docs/` index with per-tool anchors and copy the Spanish tool READMEs translated into English.
- Create a PR that adds simple health-check documentation and a `CONTRIBUTING.md` file with branch/release rules.

Tell me which next step you prefer and I will proceed.

---

**Usage examples (developer workflows)**

- Local development (start everything):

```pwsh
pnpm install
# dev server (monorepo)
pnpm dev
```

- Run only web app:

```pwsh
pnpm --filter web dev
```

- Run typecheck & lint locally:

```pwsh
pnpm lint
pnpm typecheck
```

- Generate and apply database migrations (api package):

```pwsh
pnpm --filter @ia-next/api prisma:migrate
pnpm --filter @ia-next/api prisma:push
```

**Executive summary & next steps (for lead dev)**

- This repository hosts two portals and a shared multi-package monorepo. The main gaps identified:
  1. Type duplication in GeoJSON types across tool folders — consolidate to a single shared types package.
  2. Several tool-level READMEs were missing or in Spanish — translated and added `README.md` files for each major tool.
  3. Build issues referencing static folders (visor-difusion cases) — add missing directories or defensive fallbacks.
  4. Prerender errors for CSR pages — audit client-only hooks and mark client components explicitly.

- Recommended immediate actions:
  - Merge this `docs/MASTER_DOCUMENTATION.md` and the added per-tool READMEs.
  - Add CI job to verify no missing static assets before build (simple script to ensure required directories exist).
  - Consolidate shared types into `packages/@ia-next/types` and replace local duplicates.

