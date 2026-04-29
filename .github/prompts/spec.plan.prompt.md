---
mode: agent
description: Derive a technical plan from an approved spec
---

# /spec.plan — Generate technical plan from approved spec

## Pre-conditions (read ALL before writing a single line of plan)
1. Read `.specify/memory/constitution.md` fully.
2. Read the spec at `specs/NNN-slug/spec.md` — confirm status is `approved`.
3. Read `.specify/templates/plan.template.md`.
4. Read `docs/contracts/` — check if relevant Zod schemas already exist.
5. Read `docs/adr/README.md` — check if any ADR is relevant to the technical approach.
6. Read the existing code in the areas that will be touched (route handlers, components, Prisma schema).

## Your task
Generate `specs/NNN-slug/plan.md` using `plan.template.md`.

### §1 Affected Stack
- Be specific: list exact files and routes, not just "apps/api".
- Note new dependencies. If a new dependency changes the stack, an ADR is required — flag it.

### §2 Database Changes
- Include the full Prisma model addition/modification.
- Define migration strategy: push vs migrate.
- Flag any destructive changes explicitly.

### §3 API Design
- Write Zod schemas for every new/modified endpoint — these are the source of truth.
- Include all error responses (400, 401, 403, 404, 409, 429, 500) with their causes.
- Rate limit values must be specified (not just "rate limited").
- Auth requirement must be explicit.

### §4 Component Design
- Every new component: is it Server Component or Client Component? Explain why.
- Define TypeScript props type (derived from Zod schema if possible).

### §6 Testing Strategy
- For critical paths (payments, auth, credits): plan for ≥70% coverage.
- For every new API endpoint: at least one integration test.
- For business rules: unit tests for each rule's happy and failure paths.

### §9 Constitution Compliance
- Go through each checklist item and verify it's actually addressed in the plan.
- Do not rubber-stamp — if a check is hard to satisfy, flag it.

### §10 Implementation Order
- Order steps so each builds on the previous.
- Steps should map roughly to task boundaries (each step ≈ one T00N task).

## After generating plan.md
```bash
# Verify no constitution violations missed
```

## Output format
```
📐 Plan generated: specs/NNN-slug/plan.md
Status: draft

New dependencies introduced: [none | list]
ADR required: [no | yes — for: reason]
Constitution issues found: [none | list]
Estimated tasks: ~N (will be broken down in /spec.tasks)

Next step: Review plan, then run /spec.tasks
```
