# Architecture Decision Records (ADRs)

> ADRs document significant architectural choices — the **why** behind how the system is built.  
> Every ADR is immutable once `accepted`. To supersede one, create a new ADR that references the old one.

---

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [ADR-0001](0001-turborepo-pnpm-workspaces.md) | Turborepo + pnpm workspaces monorepo | accepted | 2025-10-01 |
| [ADR-0002](0002-dual-portal-route-groups.md) | Dual-portal architecture with Next.js route groups | accepted | 2025-10-01 |
| [ADR-0003](0003-firebase-auth-supabase-db.md) | Firebase Auth for identity + Supabase for data storage | accepted | 2025-10-01 |
| [ADR-0004](0004-mercadopago-checkout-pro.md) | MercadoPago Checkout Pro for payments | accepted | 2025-10-01 |
| [ADR-0005](0005-server-components-default.md) | Server Components as default rendering strategy | accepted | 2025-10-01 |
| [ADR-0006](0006-prisma-only-db-access.md) | Prisma as the sole database access layer | accepted | 2025-10-01 |
| [ADR-0007](0007-upstash-redis-rate-limit.md) | Upstash Redis for rate limiting | accepted | 2025-10-01 |
| [ADR-0008](0008-ts-data-vs-mdx-for-articles.md) | TypeScript data files vs MDX for blog articles | accepted | 2026-04-28 |
| [ADR-0009](0009-image-pipeline-local-vs-cloudinary.md) | Image pipeline: local for tools, Cloudinary for new blog images | accepted | 2026-04-28 |
| [ADR-0010](0010-ai-articles-direct-publish.md) | AI-generated articles published without mandatory human review | accepted | 2026-04-28 |
| [ADR-0011](0011-trunk-based-vercel-deploy.md) | Trunk-based development with Vercel auto-deploy | accepted | 2026-04-28 |

---

## How to Create a New ADR

1. Copy `.specify/templates/adr.template.md`.
2. Name it `NNNN-kebab-case-title.md` (increment from the last ADR).
3. Add it to the index table above.
4. Open a PR on a branch named `adr/NNNN-slug`.
5. Commit message: `docs(adr): add ADR-NNNN description`

## Rules
- ADRs are **write-once**: do not edit an `accepted` ADR to change its decision.
- To revise a decision: create a new ADR with status `superseded by ADR-NNNN` on the old one.
- Constitution changes always require an ADR.
