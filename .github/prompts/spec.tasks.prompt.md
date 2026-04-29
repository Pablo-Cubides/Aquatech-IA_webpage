---
mode: agent
description: Decompose an approved plan into atomic, independently implementable tasks
---

# /spec.tasks — Break plan into atomic tasks

## Pre-conditions
1. Read `specs/NNN-slug/plan.md` — confirm status is `approved`.
2. Read `specs/NNN-slug/spec.md` — extract all acceptance criteria IDs (AC-NNN.X).
3. Read `.specify/templates/tasks.template.md`.
4. Understand the implementation order from plan §10.

## Your task
Generate `specs/NNN-slug/tasks.md` with atomic task breakdown.

### Rules for good tasks
Each task T00N must be:
- **Independently implementable**: another developer (or AI agent) can pick it up without context from other in-progress tasks.
- **Testable in isolation**: has a clear, binary Definition of Done.
- **Reviewable as one PR**: small enough to review in <30 minutes. If a task would take >8h (XL), split it.
- **References acceptance criteria**: every task maps to at least one `US-NNN / AC-NNN.X`.
- **Lists specific files**: "files to create/modify" should name exact paths.

### Required tasks (always include these)
- Last-1 task: "Write tests for SPEC-NNN critical paths" (after all implementation tasks).
- Last task: "Update documentation for SPEC-NNN" (update INDEX.md, README, contracts, glossary, spec status).

### Task sizing guide
- S (<2h): single file change, simple validation, add one field.
- M (2-4h): new API endpoint with tests, new component with basic interactivity.
- L (4-8h): new feature with multiple files, DB migration + route + component.
- XL (>8h): SPLIT THIS. No XL tasks allowed.

### After generating tasks.md
Verify:
- [ ] Every acceptance criterion from the spec is covered by at least one task.
- [ ] No task is XL.
- [ ] Dependencies between tasks are explicit (T002 blocked by T001).
- [ ] Progress tracker table is populated.

## Output format
```
📋 Tasks generated: specs/NNN-slug/tasks.md

Total tasks: N
Sizes: S×N, M×N, L×N
Estimated total: ~Nh

Acceptance criteria coverage:
  AC-001.1 → T001
  AC-001.2 → T002
  ...
  ✓ All ACs covered

Next step: Start implementing T001. Use /spec.analyze after each task.
```
