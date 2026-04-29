# ADR-0003 — Firebase Auth for Identity + Supabase for Data Storage
> **Status**: accepted | **Date**: 2025-10-01 | **Author**: Pablo Cubides

## Context
The platform needs both user authentication and persistent data storage. Two popular managed services appeared as candidates: Firebase (full BaaS with Auth + Firestore + Storage) and Supabase (PostgreSQL-based BaaS). The question was whether to use one service for everything or split responsibilities.

### Forces
- Firebase Auth is industry-standard for Google OAuth and social auth — simple to implement and maintain.
- Supabase provides a real PostgreSQL database with Prisma compatibility.
- Relational data model required: users, credits, payments, tool usage — not a good fit for document DBs.
- Budget: both services have generous free tiers for a startup-scale application.
- Prisma ORM is already part of the stack for type-safe queries.

## Decision
**We use Firebase Authentication for identity (token issuance and Google OAuth) and Supabase PostgreSQL for all data storage, accessed exclusively via Prisma.**

Firebase handles the authentication flow; the resulting Firebase UID is stored in Supabase as the user identifier. NextAuth bridges the two: it validates Firebase tokens server-side and maintains the session.

## Consequences

### Positive
- Firebase Auth handles OAuth provider complexity (Google, future: Apple, GitHub) without custom implementation.
- Supabase PostgreSQL supports the relational data model with ACID guarantees.
- Prisma provides type-safe queries derived from the schema — no raw SQL risks.
- Each service does one thing well — no over-reliance on a single vendor.

### Negative
- Three systems (Firebase + Supabase + NextAuth) must stay synchronized — a bug in any bridge can break auth.
- Developer onboarding requires understanding all three services.
- Firebase UID + Supabase ID duality in user records requires careful mapping.

### Neutral
- Firebase and Supabase are both cloud-managed — no self-hosted infrastructure.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Firebase only (Firestore) | Firestore document model doesn't fit relational credit/payment data; no Prisma support |
| Supabase Auth + Supabase DB | Firebase Auth's Google OAuth is more mature and easier to configure |
| Auth0 + PostgreSQL | Auth0 adds cost and complexity for features already available in Firebase free tier |
| NextAuth alone (credentials) | No OAuth provider support without additional configuration complexity |

## Implementation Notes
- Constitution §2.5: "The three systems are decoupled — never conflate their responsibilities."
- Firebase Admin SDK in `apps/api` validates tokens server-side.
- User sync: on first login, Firebase UID is written to Supabase `users` table.
- Environment variables: `FIREBASE_*` + `DATABASE_URL` (Supabase) + `NEXTAUTH_*`.
- See SPEC-002 for full auth flow spec.
