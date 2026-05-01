---
mode: agent
description: Identify and resolve open questions in a spec before approval
---

# /spec.clarify — Clarify open questions in a spec

## Pre-conditions
1. Read the spec file provided (or the most recently modified spec in `specs/`).
2. Read `.specify/memory/constitution.md` §1–§10.
3. Read `docs/domain/personas.md`.

## Your task
Given a spec file (user provides path or SPEC-NNN):

1. **List all open questions** from the spec's §9 Open Questions section.

2. **Identify implicit open questions** not yet written but needed:
   - Unclear acceptance criteria (not testable as written)
   - Missing error scenarios
   - Ambiguous business rules (edge cases not covered)
   - Missing NFRs (no performance, security, or a11y requirements)
   - Dependencies not identified

3. **For each question**, ask the user directly and wait for answers. Do not guess.

4. **After receiving answers**, update the spec file:
   - Fill in resolved questions with the answers.
   - Mark resolved questions as: `[x] **Q1**: resolved — *answer: ...*`
   - Add any new business rules or acceptance criteria derived from the answers.

5. **Check constitution compliance** (spec §Constitution Compliance Checklist):
   - Verify each checklist item.
   - Flag any items that are checked without a plan to fulfill them.

6. **Determine spec readiness**:
   - If all open questions resolved AND constitution checklist complete → suggest changing status to `review` or `approved`.
   - If questions remain → list them clearly.

## Output format
```
📋 SPEC-NNN: [Title]
Current status: draft

Open questions resolved this session: N
Remaining open questions: N
Constitution checklist: N/N items ✓

Suggested next status: [draft | review | approved]
Reason: [why or why not ready]
```
