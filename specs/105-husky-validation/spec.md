# SPEC-105 — Husky Hooks & Validation Pipeline
> **Status**: approved | **Owner**: Pablo Cubides | **Created**: 2026-04-28

---

## 1. Problem

Husky hooks are security and quality gates that prevent bad code from reaching the repo. The current hooks (secret scanning + syntax validation + `validate-push.js`) need to be extended to include the new SDD checks (content lint, spec lint, image budget). This spec documents what each hook does, what it must check, and how to maintain it.

---

## 2. Hook Definitions

### `pre-commit` — runs on every `git commit`
**Purpose**: Catch the cheapest-to-fix errors before they enter the commit history.

| Check | Tool | Why |
|---|---|---|
| Secret scanning | existing logic in `pre-commit` | Prevent credential leaks |
| Syntax validation | `scripts/validate-syntax.js` | Catch obvious JS/TS syntax errors |

**Blocking**: Yes. Commit is rejected if any check fails.  
**Performance target**: <5 seconds.  
**Bypassable**: `--no-verify` prohibited per constitution §8.4.

### `pre-push` — runs on every `git push`
**Purpose**: Full quality gate before code leaves the local machine.

| Check | Command | Why |
|---|---|---|
| TypeScript typecheck | `pnpm typecheck` | Type safety |
| ESLint | `pnpm lint` | Code quality |
| Tests | `pnpm test` | Correctness |
| Content lint | `pnpm lint:content` | Article validation |
| Spec lint | `pnpm lint:specs` | Spec index integrity |
| Image budget | `pnpm img:budget --changed-only` | Performance compliance |

All delegated to `release-preflight.mjs`.

**Blocking**: Yes. Push is rejected if any non-optional check fails.  
**Performance target**: <120 seconds (full test suite).  
**Bypassable**: `--no-verify` prohibited; hotfix exception requires `hotfix/` branch name.

---

## 3. Rules

- **BR-001**: Never remove a check from the hooks without an ADR.
- **BR-002**: Hooks must run in CI as well — local hooks are the first line of defense, not the only one.
- **BR-003**: Hook failures must produce clear, actionable error messages (not just exit code 1).
- **BR-004**: `scripts/validate-push.js` is replaced by `release-preflight.mjs` as the canonical pre-push script. Both call the same underlying checks.
- **BR-005**: If a hook takes >120s on a laptop with pnpm cache warm, the offending check must be optimized.

---

## 4. How to Add a New Check

1. Write the check as a standalone script in `.specify/scripts/` or `scripts/`.
2. Add it to `release-preflight.mjs` in the appropriate section.
3. If it should run on every commit (fast, <1s): add to `pre-commit`.
4. If it's a full validation (>1s): add to `pre-push` via `release-preflight.mjs`.
5. Add the corresponding CI step to the appropriate workflow.
6. Document in this spec.

---

## Constitution Compliance Checklist

- [x] `--no-verify` prohibited (§8.4).
- [x] All checks also run in CI (§4.3, §8.2).
- [x] Hooks produce clear error messages (§9 — AI agents read these errors).
