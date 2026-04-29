# SPEC-NNN — Tasks
> **Derived from plan**: [plan.md](plan.md)  
> **Status**: `pending` | `in-progress` | `complete`  
> **Sprint / Iteration**: [sprint name or date]

---

## Task Rules / Reglas de tareas

Each task must be:
- **Independently implementable** — can be picked up without knowing other tasks in progress.
- **Testable in isolation** — has a clear definition of done with a verifiable output.
- **Reviewable as a single PR** — small enough to review in < 30 minutes.
- **Linked to acceptance criteria** — references at least one `US-NNN / AC-NNN.X` from spec.

---

## Tasks

### T001 — [Task title]
**Status**: `pending`  
**Estimate**: [S=<2h | M=2-4h | L=4-8h | XL=>8h (split this one)]  
**Acceptance criteria (from spec)**: `US-001 / AC-001.1`, `AC-001.2`  
**Blocked by**: [T002 | none]

**What to do**:
- [ ] [Specific action 1 — e.g., "Add Prisma model `Article` in `packages/@ia-next/database/prisma/schema.prisma`"]
- [ ] [Specific action 2]
- [ ] [Specific action 3]

**Files to create/modify**:
- `[path/to/file.ts]` — [what changes]
- `[path/to/file.ts]` — [what changes]

**Definition of Done**:
- [ ] Code compiles (`pnpm typecheck` passes)
- [ ] Linting passes (`pnpm lint`)
- [ ] Tests written and passing (`pnpm test`)
- [ ] [Feature-specific check — e.g., "Prisma migration applied in dev DB"]

---

### T002 — [Task title]
**Status**: `pending`  
**Estimate**: [M]  
**Acceptance criteria (from spec)**: `US-001 / AC-001.3`  
**Blocked by**: `T001`

**What to do**:
- [ ] [Specific action 1]
- [ ] [Specific action 2]

**Files to create/modify**:
- `[path/to/file.ts]` — [what changes]

**Definition of Done**:
- [ ] Code compiles
- [ ] Linting passes
- [ ] Tests written and passing
- [ ] [Feature-specific check]

---

### T003 — [Task title]
**Status**: `pending`  
**Estimate**: [M]  
**Acceptance criteria (from spec)**: `US-002 / AC-002.1`  
**Blocked by**: `T002`

**What to do**:
- [ ] [Specific action 1]
- [ ] [Specific action 2]

**Files to create/modify**:
- `[path/to/file.ts]` — [what changes]

**Definition of Done**:
- [ ] Code compiles
- [ ] Linting passes
- [ ] Tests written and passing

---

### T004 — Write tests for SPEC-NNN critical paths
**Status**: `pending`  
**Estimate**: [M-L]  
**Acceptance criteria (from spec)**: All `AC-NNN.*`  
**Blocked by**: [all implementation tasks]

**What to do**:
- [ ] Unit tests for Zod schemas
- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] Coverage report confirms ≥70% for critical paths

**Files to create/modify**:
- `apps/api/src/__tests__/[feature].test.ts`
- `apps/web/src/__tests__/[feature].test.ts`

**Definition of Done**:
- [ ] `pnpm test --filter [package]` passes
- [ ] `pnpm test:coverage --filter [package]` shows ≥70% for new files

---

### T005 — Update documentation for SPEC-NNN
**Status**: `pending`  
**Estimate**: [S]  
**Blocked by**: [T004]

**What to do**:
- [ ] Update `docs/INDEX.md` if new routes or tools added.
- [ ] Update `README.md` if new scripts or workflows added.
- [ ] Update `docs/contracts/openapi.yaml` if new endpoints added.
- [ ] Add any new terms to `docs/domain/glossary.md`.
- [ ] Mark spec as `implemented` in `specs/README.md`.

**Definition of Done**:
- [ ] All doc files updated and accurate.
- [ ] Spec status updated to `implemented`.

---

## Progress Tracker

| Task | Status | PR | Notes |
|---|---|---|---|
| T001 | pending | — | |
| T002 | pending | — | |
| T003 | pending | — | |
| T004 | pending | — | |
| T005 | pending | — | |

---

*Tasks for SPEC-NNN | Template version: 1.0.0*
