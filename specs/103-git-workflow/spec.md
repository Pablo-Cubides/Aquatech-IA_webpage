# SPEC-103 — Git Workflow & Branching Strategy
> **Status**: approved | **Owner**: Pablo Cubides | **Created**: 2026-04-28  
> **ADR**: [ADR-0011](../../docs/adr/0011-trunk-based-vercel-deploy.md)

---

## 1. Problem

Without a formal branching strategy, branch names are inconsistent, PRs don't reference specs, and it's hard to trace what was built against what requirement. This spec documents the agreed workflow so that AI agents and the developer follow identical conventions.

---

## 2. Rules (no user stories — this is a process spec)

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

### PR Rules
- Every non-trivial PR references a spec: `Spec: SPEC-NNN` in the description.
- Trivial PRs (typo, dep bump, config tweak) use label `no-spec` with a one-line reason.
- PR title follows Conventional Commits format.
- PR uses `.github/pull_request_template.md`.
- Branch lives ≤2 working days before merging or closing.

### Merge Strategy
- **Squash merge** preferred for feature branches (clean history on main).
- **Merge commit** for spec/adr branches (preserve the authoring history).
- **Never force-push to main**.

### Protected Behaviors
- `--no-verify` is prohibited except for `hotfix` branches (label PR as `hotfix`).
- Never commit directly to `main` — always via PR.
- `pnpm release:preflight` must pass before push (enforced by `pre-push` husky hook).

---

## Constitution Compliance Checklist

- [x] Conventional Commits (§3.5).
- [x] `--no-verify` prohibition (§8.4).
- [x] Spec reference in PR (§8.2).
- [x] Trunk-based strategy (§8.1).
