---
mode: agent
description: Validate implementation against spec, plan, and constitution
---

# /spec.analyze — Validate implementation against spec

## Pre-conditions
1. Read `.specify/memory/constitution.md`.
2. Read `specs/NNN-slug/spec.md` (all acceptance criteria).
3. Read `specs/NNN-slug/plan.md` (approved technical approach).
4. Read `specs/NNN-slug/tasks.md` (task definitions and DoDs).

## Your task
Given a SPEC-NNN (or the most recently worked spec), validate the current implementation:

### 1. Acceptance Criteria Coverage
For each AC-NNN.X in the spec:
- [ ] Is it implemented?
- [ ] Is there a test that verifies it?
- If not: flag it.

### 2. Plan Compliance
- [ ] Are all Zod schemas from plan §3 implemented?
- [ ] Are all API endpoints rate-limited and auth-protected as specified?
- [ ] Are DB changes matching the Prisma schema in plan §2?
- [ ] Are components Server/Client as decided in plan §4?

### 3. Constitution Compliance
Run through constitution §1–§10:
- [ ] Stack matches §1 (no unlisted dependencies).
- [ ] Monorepo rules §2.1: no DB access from `apps/web`.
- [ ] Portal isolation §2.2: no cross-portal imports.
- [ ] Server Components §2.3: all `"use client"` justified with comments.
- [ ] Data access §2.4: Zod on all inputs; DB via `@ia-next/database`.
- [ ] TypeScript §3.1: no `any` without comments.
- [ ] Coverage §4.1: critical paths have ≥70% coverage.
- [ ] Performance §5: no new obvious performance regressions.
- [ ] Security §6: no secrets in code, rate limiting present, input validated.
- [ ] Content §7 (if applicable): image policy, article structure.
- [ ] Git §8: PR references spec, conventional commits used.

### 4. Task Completion
- [ ] All task DoDs satisfied?
- [ ] Any uncompleted tasks that should be flagged?

### 5. Three-Strikes Check
- Any pattern repeated 3+ times during this implementation that should be scripted/specced?

## Output format
```
🔍 Analysis: SPEC-NNN — [Title]

Acceptance Criteria: N/N covered
Tests: N/N ACs have test coverage
Plan compliance: [✓ | issues: list]
Constitution: [✓ | violations: list]
Tasks: N/N complete

Overall: [READY TO MERGE | NEEDS WORK: list issues]

Three-strikes: [none detected | proposed artifact: ...]
```

If issues found: list each with the specific file and line where the violation occurs.
