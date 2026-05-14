# Constitution Changelog

All modifications to `constitution.md` are recorded here with the corresponding ADR.

## [1.0.0] — 2026-04-28

**Initial constitution.** Establishes all foundational rules for AquatechIA SDD.

- Authored by: Pablo Cubides
- Reviewed by: Claude Code (claude-sonnet-4-6)
- ADR: Initial — no prior version

### Sections added
- §1 Stack & Versions (Next 16, React 19, TS 5.9, Zod 4, Prisma 7, Vitest 4, Sharp 0.34)
- §2 Architectural Principles (monorepo, dual portal, Server Components, data access, auth)
- §3 Code Conventions (TS strict, naming, comments, imports, commits)
- §4 Quality Gates (coverage ramp-up, a11y, linting)
- §5 Performance Budgets (portal IA vs ambiental differentiated, image budgets)
- §6 Security Rules (OWASP, Zod validation, env vars, Firebase, MercadoPago webhooks)
- §7 Content & Image Policy (article structure, AI articles, Cloudinary vs local, image manifests)
- §8 Git & Release Process (trunk-based, PRs, Vercel deploy, husky hooks)
- §9 AI Agent Rules (10 rules for coding agents)
- §10 Three-Strikes Rule

## [1.1.0] — 2026-05-14

**SDD harness improvements.** Based on expert review and 2025 best practices research.

- Reviewed by: Claude Code (claude-opus-4-7 + claude-sonnet-4-6)
- Sources: Anthropic docs, HumanLayer, Martin Fowler SDD series, Pixelmojo hooks guide

### Changes
- **§8.4**: Migrated git hooks from Husky → Lefthook. Updated hook descriptions.
- **§8.5 (new)**: Added Spec Lifecycle & Archiving policy (stale after 60d, deprecated stays, supersedes field).

---

*To modify the constitution: open a `spec/constitution-vX.Y.Z` branch, write an ADR in `docs/adr/`, get it reviewed, then merge. Bump SemVer accordingly.*
