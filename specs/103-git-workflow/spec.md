---
id: SPEC-103
title: "Git Workflow & Branching Strategy"
status: approved
owner: Pablo Cubides
created: 2026-04-28
updated: 2026-05-02
---

# SPEC-103 — Git Workflow & Branching Strategy

## 1. Problem [REQUIRED]

Without a formal branching strategy, branch names are inconsistent, PRs don't reference specs, and it's hard to trace what was built against what requirement. This spec documents the agreed workflow so that AI agents and the developer follow identical conventions.

---

## 2. Constraints [REQUIRED]

- **C-001**: Conventional Commits MUST be followed for every commit message.
- **C-002**: Direct commits to the `main` branch are strictly prohibited.
- **C-003**: Squash merging is mandatory for all feature branches to maintain a clean git history.

---

## 3. Non-Goals [REQUIRED]

- Defining specific GitHub Action configurations (handled in SPEC-104).
- Third-party deployment service management.
- Automating changelog generation.

---

## 4. Users [REQUIRED]

| Persona | Role | How affected |
|---|---|---|
| Pablo (Instructor) | Developer | Follows the documented flow to ensure project traceability |
| AI Agent | Developer | Must follow the same naming and commit rules |

---

## 5. User Stories [REQUIRED]

> *Note: This is a process spec; rules serve as the "scenarios".*

### Branch Naming
| Branch type | Pattern | Example |
|---|---|---|
| Feature | `feature/SPEC-NNN-brief-slug` | `feature/SPEC-001-payment-init` |
| Bug fix | `fix/description` | `fix/webhook-duplicate-credit` |
| Spec authoring | `spec/SPEC-NNN-slug` | `spec/SPEC-004-user-profile` |
| ADR authoring | `adr/NNNN-slug` | `adr/0012-new-decision` |
| Hotfix | `hotfix/description` | `hotfix/payment-signature-bypass` |
| Chore / deps | `chore/description` | `chore/update-dependencies` |

### Commit Messages (Conventional Commits)
```
<type>(<scope>): <description>

Types: feat | fix | docs | spec | test | refactor | chore | style | perf | ci
Scope: component, route, package, or domain area (e.g., portal-ia, api, credits, content)

Examples:
  feat(credits): add atomic deduction with compensating transaction
  fix(webhooks): validate MercadoPago signature before processing
  spec(SPEC-100): approve content pipeline spec
  docs(adr): add ADR-0009 image pipeline decision
  ci(content): add content-lint workflow
  chore: update sharp to 0.35.0
```

---

## 6. Business Rules [REQUIRED]

- **BR-001**: Every non-trivial PR references a spec: `Spec: SPEC-NNN` in the description.
- **BR-002**: Trivial PRs (typo, dep bump, config tweak) use label `no-spec` with a one-line reason.
- **BR-003**: Branch lives ≤2 working days before merging or closing.
- **BR-004**: `--no-verify` is prohibited except for `hotfix` branches (label PR as `hotfix`).
- **BR-005**: `pnpm release:preflight` must pass before push (enforced by `pre-push` husky hook).

---

## 7. Non-Functional Requirements [REQUIRED]

- [x] Full traceability from commit to specification.
- [x] Zero build failures on main due to mandatory PR pre-checks.

---

## 8. Edge Cases & Error Scenarios [REQUIRED]

| Scenario | Expected behavior |
|---|---|
| Merge conflict | Resolve on feature branch before merging to main |
| CI failure on PR | Blocking merge — fix on branch |
| Urgent hotfix | Direct commit allowed? NO — PR required, but can skip non-critical checks with label |

---

## 9. Dependencies [OPTIONAL]

| Dependency | Type | Notes |
|---|---|---|
| Husky | Package | Enforces pre-push and commit-msg hooks |
| SPEC-105 | Spec | Validation pipeline details |

---

## Constitution Compliance Checklist

- [x] Conventional Commits (§3.5).
- [x] `--no-verify` prohibition (§8.4).
- [x] Spec reference in PR (§8.2).
- [x] Trunk-based strategy (§8.1).
