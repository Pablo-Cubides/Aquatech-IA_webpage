## Spec Reference / Referencia de spec

> Every non-trivial PR must reference a spec. For trivial changes, use `no-spec` and explain why.

- [ ] **Spec**: `SPEC-NNN` → [`specs/NNN-slug/spec.md`](../specs/)
- [ ] **No-spec** (trivial): _reason: ___________________

---

## Summary / Resumen

> What does this PR do? 1-3 bullet points.

- 
- 

---

## Tasks completed / Tareas completadas

> Reference task IDs from `tasks.md`.

- [ ] T001 — 
- [ ] T002 — 
- [ ] T003 — 

---

## Constitution Compliance / Cumplimiento de constitución

> Check all that apply. Unchecked items need a comment explaining the exception.

### Code Quality
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (coverage not decreased in touched packages)
- [ ] No `any` types introduced without inline justification comment
- [ ] No `"use client"` added without a comment explaining why

### Architecture
- [ ] DB accessed only via `@ia-next/database` (Prisma) — not from `apps/web`
- [ ] No cross-portal imports (`(portals)/ia/*` ↔ `(portals)/ambiental/*`)
- [ ] New dependencies: none / listed below with ADR if required
- [ ] New env vars: none / added to `.env.example` + Vercel dashboard

### Content & Images (check if applicable)
- [ ] `pnpm lint:content` passes (if articles modified)
- [ ] Image budget within limits (if images added/modified)
- [ ] `alt` text set on all new images
- [ ] New blog images uploaded to Cloudinary (not committed to `public/`)
- [ ] AI-generated images have `.image-manifest.json`

### Security
- [ ] All new API endpoints have Zod validation
- [ ] All new public endpoints have Upstash rate limiting
- [ ] No secrets hardcoded
- [ ] Webhook signature validation added (if new webhook endpoint)

---

## New dependencies / Nuevas dependencias

> List any new packages introduced. Each requires a justification and ADR if it changes the tech stack.

| Package | Version | Justification | ADR needed? |
|---|---|---|---|
| — | — | — | — |

---

## Testing notes / Notas de testing

> How was this manually tested? What scenarios were verified?

- [ ] Happy path: 
- [ ] Edge case: 
- [ ] Error case: 

---

## Checklist before requesting review / Checklist pre-review

- [ ] PR title follows Conventional Commits format
- [ ] Branch name follows convention (`feature/SPEC-NNN-*`, `fix/*`, etc.)
- [ ] `pnpm release:preflight` ran and passed locally
- [ ] Spec status updated to `implementing` (or `implemented` if all tasks done)

---

> **Three-Strikes Check**: Did you do something for the 3rd+ time in this PR without a script/spec/prompt for it?  
> If yes: [open an issue or create the artifact before merging](../.specify/instructions/three-strikes-rule.md).
