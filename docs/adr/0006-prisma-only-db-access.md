# ADR-0006 — Prisma as the Sole Database Access Layer
> **Status**: accepted | **Date**: 2025-10-01 | **Author**: Pablo Cubides

## Context
The platform uses Supabase PostgreSQL. Multiple approaches exist for querying a PostgreSQL database from Node.js: raw `pg` client, query builders (Knex), ORMs (Prisma, Drizzle), or Supabase's own JavaScript client. A consistent, type-safe, and maintainable approach was needed.

### Forces
- Type safety: raw SQL has no type guarantees; TS-first ORMs do.
- Schema as code: database structure should be version-controlled and reviewable.
- Migration management: automated migration generation from schema diffs.
- Developer productivity: type-safe queries catch errors at compile time.
- Supabase: using Supabase's JS client bypasses row-level security at the ORM level and splits logic between two query APIs.

## Decision
**All database access goes through Prisma. The `@ia-next/database` package provides the single PrismaClient instance. No other method (raw `pg`, Supabase JS client for data queries, Knex) is used for data access.**

The Prisma schema in `packages/@ia-next/database/prisma/schema.prisma` is the single source of truth for the database structure.

## Consequences

### Positive
- Full TypeScript types auto-generated from schema — no manual type definitions for DB entities.
- Migrations are tracked as files in `prisma/migrations/` — version controlled and reviewable.
- Single query API across the entire codebase — no context switching between libraries.
- `PrismaClient` instance shared via `@ia-next/database` prevents connection pool exhaustion.

### Negative
- Prisma's abstraction occasionally produces suboptimal queries — complex cases may need `$queryRaw`.
- Schema changes require `prisma generate` to update client types.
- Learning curve for developers who prefer raw SQL.

### Neutral
- Supabase JS client is still used for auth/storage features where applicable, but NOT for data queries.
- Raw `pg` is installed but used only for Supabase keepalive, not for application data access.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Supabase JS client for data | Splits query logic; bypasses type safety; harder to mock in tests |
| Drizzle ORM | Newer, less ecosystem maturity at time of decision; Prisma more established |
| Raw pg + manual types | No type generation; high maintenance burden |
| Knex query builder | No type generation from schema; verbose |

## Implementation Notes
- Constitution §2.4: "DB queries: only via `packages/@ia-next/database` (Prisma Client)."
- Constitution §2.4: "Never access the database from `apps/web` directly."
- `$queryRaw` is permitted for performance-critical complex queries — tag with a comment explaining why.
- Prisma `@ia-next/database/prisma/schema.prisma` is the authoritative schema. Do not modify Supabase tables directly.
