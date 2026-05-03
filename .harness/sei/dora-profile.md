# Harness SEI DORA Profile

This profile defines how Harness Software Engineering Insights should interpret the AquatechIA delivery flow during the SPEC-106 phase.

## Integrations

| Source | Purpose | Notes |
|---|---|---|
| GitHub SCM | PRs, commits, reviews | Required for lead time and PR hygiene |
| GitHub Actions | Current CI source | GitHub Actions remains the active CI gate |
| Harness CI | SDD Governance status | Adds governance visibility, not primary CI replacement |
| Vercel | Production deployments | Preferred deployment-frequency source when available |
| GitHub issues/labels | Failures and recovery | Use `production-failure` and rollback issues for CFR/MTTR |

## DORA definitions

| Metric | Primary definition | Fallback |
|---|---|---|
| Lead time for changes | PR opened to PR merged into `main` | Commit timestamp to merge if PR data is missing |
| Deployment frequency | Successful Vercel production deployments | Merges to `main` |
| Change failure rate | Production deployments linked to `production-failure` issues or rollback records | Manual incident log in PR/release notes |
| MTTR | Time from failure issue creation to rollback or recovery PR merge | Manual recovery timestamp in incident issue |

## Collections and filters

- Repository: AquatechIA webpage repository.
- Branch: `main`.
- Production changes: merged PRs with `Spec: SPEC-NNN` or approved `no-spec`.
- Exclude: draft-only spec branches that never merge to `main`.

## Operating rules

- DORA metrics are for process improvement, not individual performance evaluation.
- If Vercel data is unavailable, document the fallback to `main` merges in the SEI dashboard description.
- Review SEI widgets monthly and update this profile when the delivery workflow changes.
