---
id: SPEC-105
title: "Husky Hooks & Validation Pipeline"
status: approved
owner: Pablo Cubides
created: 2026-04-28
updated: 2026-05-02
---

# SPEC-105 — Husky Hooks & Validation Pipeline

## 1. Problem [REQUIRED]

Husky hooks are security and quality gates that prevent bad code from reaching the repo. The current hooks (secret scanning + syntax validation + `validate-push.js`) need to be extended to include the new SDD checks (content lint, spec lint, image budget). This spec documents what each hook does, what it must check, and how to maintain it.

---

## 2. Constraints [REQUIRED]

- **C-001**: Pre-commit hooks MUST complete in <5 seconds to avoid developer friction.
- **C-002**: Pre-push hooks MUST NOT exceed 120 seconds for the entire suite.
- **C-003**: All hooks MUST output machine-readable errors that AI agents can parse for self-correction.

---

## 3. Non-Goals [REQUIRED]

- Managing GitHub Action runner configurations.
- Pre-merge hook for external PRs (handled in SPEC-104).
- Automatic code formatting (handled via separate IDE/script commands).

---

## 4. Users [REQUIRED]

| Persona | Role | How affected |
|---|---|---|
| Pablo (Instructor) | Developer | Receives immediate feedback on commit/push quality |
| AI Agent | Developer | Uses hook errors to self-correct code/specs before PR |

---

## 5. User Stories [REQUIRED]

> *Note: This is a process spec; hook definitions serve as scenarios.*

### `pre-commit` — runs on every `git commit`
| Check | Tool | Why |
|---|---|---|
| Secret scanning | existing logic in `pre-commit` | Prevent credential leaks |
| Syntax validation | `scripts/validate-syntax.js` | Catch obvious JS/TS syntax errors |

### `pre-push` — runs on every `git push`
| Check | Command | Why |
|---|---|---|
| TypeScript typecheck | `pnpm typecheck` | Type safety |
| ESLint | `pnpm lint` | Code quality |
| Tests | `pnpm test` | Correctness |
| Content lint | `pnpm lint:content` | Article validation |
| Spec lint | `pnpm lint:specs` | Spec index integrity |
| Image budget | `pnpm img:budget --changed-only` | Performance compliance |

---

## 6. Business Rules [REQUIRED]

- **BR-001**: Never remove a check from the hooks without an ADR.
- **BR-002**: Hooks must run in CI as well — local hooks are the first line of defense, not the only one.
- **BR-003**: Hook failures must produce clear, actionable error messages.
- **BR-004**: `scripts/validate-push.js` is replaced by `release-preflight.mjs` as the canonical pre-push script.
- **BR-005**: If a hook takes >120s with pnpm cache warm, it must be optimized.

---

## 7. Non-Functional Requirements [REQUIRED]

- [x] Pre-commit <5s.
- [x] Pre-push <120s.
- [x] 100% enforcement of constitution rules before code reaches the repo.

---

## 8. Edge Cases & Error Scenarios [REQUIRED]

| Scenario | Expected behavior |
|---|---|
| Hook script fails to run | Reject commit/push for safety |
| Staged vs Unstaged changes | Hooks only check what is being committed |
| Force push to bypass | Prohibited by policy; blocked by branch protection on main |

---

## 9. Dependencies [OPTIONAL]

| Dependency | Type | Notes |
|---|---|---|
| Husky | Package | Git hook manager |
| lint-staged | Package | Optimizes checks for changed files only |

---

## Constitution Compliance Checklist

- [x] `--no-verify` prohibited (§8.4).
- [x] All checks also run in CI (§4.3, §8.2).
- [x] Hooks produce clear error messages (§9 — AI agents read these errors).
