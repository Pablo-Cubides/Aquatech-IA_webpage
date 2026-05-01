# AI Agent SDD Workflow
> **Applies to**: Claude Code, GitHub Copilot, Antigravity, and any AI coding agent working in this repo.  
> **Version**: 1.0.0  
> **Reference**: Constitution [.specify/memory/constitution.md](../memory/constitution.md)

---

## Mandatory Reading Before Any Non-Trivial Task

Before writing a single line of code for a feature or significant change:

1. **Read the constitution** → `.specify/memory/constitution.md`
2. **Read the relevant spec** → `specs/NNN-feature/spec.md`
3. **Read the plan** → `specs/NNN-feature/plan.md`
4. **Check existing tests** to understand what's already covered.
5. **Check open questions** in spec — if any are unresolved, flag them before starting.

---

## Standard SDD Workflow

### Phase 1: Specify (`/spec.new` or `/spec.clarify`)
- Goal: document WHAT and WHY in `specs/NNN-feature/spec.md`.
- Output: approved spec with user stories, acceptance criteria, business rules, NFRs.
- Agent role: ask clarifying questions, structure the spec from answers. Do NOT design solutions here.
- Done when: spec status = `approved`, all open questions resolved.

### Phase 2: Plan (`/spec.plan`)
- Goal: document HOW in `specs/NNN-feature/plan.md`.
- Output: approved plan with Zod schemas, component design, DB changes, test strategy.
- Agent role: derive the technical approach from the spec, validate against constitution.
- Done when: plan status = `approved`, constitution compliance checklist complete.

### Phase 3: Tasks (`/spec.tasks`)
- Goal: decompose plan into atomic, independently testable tasks in `specs/NNN-feature/tasks.md`.
- Output: numbered task list, each ≤ 1 PR, with Definition of Done.
- Agent role: break plan into T001, T002... with files and acceptance criteria.
- Done when: all tasks have clear DoD, no task is "XL" (if so, split).

### Phase 4: Implement
- Pick one task (e.g., T001), mark as `in-progress`.
- Write code that satisfies ONLY that task's DoD.
- Do not implement beyond the task scope (no gold-plating).
- Every PR references `Spec: SPEC-NNN` in description.
- Commit with Conventional Commits format.

### Phase 5: Verify (`/spec.analyze`)
- After all tasks complete, run full verification:
  - `pnpm typecheck` ✓
  - `pnpm lint` ✓
  - `pnpm test` ✓ (with coverage check)
  - `pnpm lint:content` ✓ (if content was touched)
  - CI passes.
- Manually test all acceptance criteria from spec.
- Mark spec as `implemented` in `specs/README.md`.

---

## Rules for Code Generation

### DO
- Generate code that matches the existing code style in the touched files.
- Use Zod for all new type definitions — derive TypeScript types from schemas.
- Add `"use client"` only when necessary and explain why in a comment.
- Write tests alongside the implementation, not after.
- Follow the naming conventions in constitution §3.2.
- Generate the smallest change that satisfies the task's DoD.

### DO NOT
- Introduce new dependencies not in the constitution without opening an ADR first.
- Add error handling for impossible scenarios (trust TypeScript + Zod at boundaries).
- Access the database from `apps/web` (only via `apps/api`).
- Import portal-specific code across portals.
- Add `any` types without inline justification.
- Skip writing tests for critical paths (payments, auth, credits).
- Generate code beyond the task scope.
- Use `--no-verify` with git hooks.

---

## Three-Strikes Protocol

Count how many times a manual task has been done in this conversation or recent git history.

If a pattern has occurred **≥ 3 times**:
1. **Stop** before implementing the third instance.
2. **Announce**: "This pattern has occurred 3+ times. Per the three-strikes rule, I propose creating a [spec / script / prompt / ADR] before continuing."
3. **Propose** the appropriate artifact (use `/three-strikes` prompt).
4. **Wait** for approval before creating the third instance.

---

## Constitution Violation Protocol

If implementing a task requires violating a constitution rule:

1. **Flag it explicitly**: "⚠️ Constitution violation required: §N.N — [reason]"
2. **Propose alternatives** that avoid the violation.
3. **If the violation is unavoidable**: open an ADR, get it approved, then proceed.
4. **Never silently violate** the constitution.

---

## Context Management

When the conversation context grows large:
- Re-read the spec and plan before each new task.
- Do not rely on memory of previous messages for technical decisions — trust the spec files.
- If context is lost, use `.specify/memory/constitution.md` as the ground truth.

---

## Agent Self-Check (run before finalizing any response with code)

```
□ Did I read the relevant spec and plan?
□ Does my code violate any constitution rule?
□ Did I introduce any new dependency not in constitution §1?
□ Did I use `any` without justification?
□ Did I add `"use client"` unnecessarily?
□ Did I access DB from apps/web?
□ Did I cross portal boundaries?
□ Did I write tests for new critical logic?
□ Does this change stay within the task scope?
□ Is the three-strikes rule triggered?
```
