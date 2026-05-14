---
id: SPEC-106
title: "Harness Engineering Governance"
status: approved
owner: Pablo Cubides
created: 2026-05-03
updated: 2026-05-14
---

# SPEC-106 — Harness Engineering Governance

## 1. Problem [REQUIRED]

AquatechIA now has a solid SDD baseline, but the enforcement is split across local scripts, GitHub Actions, PR templates, and human process. Harness should add a governance and engineering-insights layer without replacing the current GitHub Actions or Vercel deployment path.

### Context
Harness will be introduced as a thin control plane for SDD governance, PR status reporting, Policy as Code, and Software Engineering Insights (SEI/DORA). GitHub Actions remains the active CI implementation and Vercel remains the production deploy mechanism in this phase.

---

## 2. Constraints [REQUIRED]

- **C-001**: Harness MUST NOT replace GitHub Actions or Vercel in this phase.
- **C-002**: Harness checks MUST consume repository-owned scripts and policies, not duplicate rules manually in the Harness UI.
- **C-003**: SDD enforcement MUST be progressive: bootstrap specs are not forced to retroactively add `plan.md` or `tasks.md`.
- **C-004**: Pull request governance MUST report a GitHub status named `Harness / SDD Governance`.

---

## 3. Non-Goals [REQUIRED]

- Moving all CI jobs from GitHub Actions to Harness CI.
- Moving production deployment orchestration from Vercel to Harness CD.
- Provisioning Harness account, org, project, connectors, or secrets automatically from this repo.
- Requiring historical specs to add `plan.md` and `tasks.md` before new SDD work exists.

---

## 4. Users [REQUIRED]

| Persona | Role | How affected |
|---|---|---|
| Pablo (Instructor) | Engineering owner | Gets PR-level SDD governance and delivery metrics without changing the current deploy path |
| AI Agent | Contributor | Receives machine-readable SDD failures and can self-correct before merge |
| Reviewer | Code reviewer | Uses Harness status and SEI context to verify traceability and process health |

---

## 5. User Stories [REQUIRED]

### US-001: Validate SDD governance on pull requests
```gherkin
As a reviewer
I want Harness to run the SDD governance checks on pull requests to main
So that implementation work follows the approved SDD process before merge

Acceptance Criteria:
  Scenario: PR changes a valid draft spec
    Given a pull request changes a draft spec
    When the Harness SDD Governance pipeline runs
    Then `lint-specs.mjs --changed-only --json` passes
    And GitHub receives a successful `Harness / SDD Governance` status

  Scenario: PR changes an implementing spec without tasks
    Given a pull request changes a spec with status `implementing`
    And the spec directory has no `tasks.md`
    When the Harness SDD Governance pipeline runs
    Then the pipeline fails with a machine-readable JSON error
    And GitHub receives a failing `Harness / SDD Governance` status
```

### US-002: Enforce Harness governance policies
```gherkin
As Pablo
I want Harness Policy as Code to enforce delivery governance
So that future pipelines cannot bypass SDD or production safety checks

Acceptance Criteria:
  Scenario: Pipeline is saved without SDD Governance stage
    Given a Harness pipeline belongs to the AquatechIA project
    When the pipeline is saved
    Then the policy evaluation fails unless a stage named or identified as SDD Governance exists

  Scenario: Production-affecting stage has no approval
    Given a Harness pipeline includes a production deployment stage
    When the pipeline is saved or run
    Then the policy evaluation fails unless a manual approval step is present
```

### US-003: Track engineering delivery metrics
```gherkin
As Pablo
I want Harness SEI to calculate DORA metrics from existing delivery events
So that process improvements can be measured without changing the deploy system

Acceptance Criteria:
  Scenario: DORA profile is configured
    Given GitHub SCM and CI data are connected to Harness SEI
    When the DORA profile is created
    Then lead time is measured from PR opened to merge
    And deployment frequency uses Vercel deployments when available
    And merges to main are used as the documented fallback
```

---

## 6. Business Rules [REQUIRED]

- **BR-001**: GitHub Actions remains the required CI gate until a future spec explicitly replaces it.
- **BR-002**: Vercel remains the production deploy source of truth until a future spec explicitly replaces it.
- **BR-003**: Harness SDD Governance runs on pull requests targeting `main`.
- **BR-004**: PRs must reference `Spec: SPEC-NNN` unless they carry the `no-spec` label.
- **BR-005**: `plan.md` is required for changed specs in `approved`, `implementing`, or `implemented` status.
- **BR-006**: `tasks.md` is required for changed specs in `implementing` or `implemented` status.
- **BR-007**: A spec marked `implemented` cannot contain pending or in-progress tasks.

---

## 7. Non-Functional Requirements [REQUIRED]

### Reliability
- [x] Harness failures are advisory until branch protection is explicitly updated.
- [x] Repository-owned scripts remain runnable locally and in GitHub Actions.

### Observability
- [x] `lint-specs.mjs --json` emits structured output for Harness parsing.
- [x] SEI uses GitHub and deployment events to calculate DORA metrics.

### Security
- [x] Harness credentials and connector secrets are stored in Harness, not in the repository.
- [x] Policy as Code is stored in git for reviewability.

---

## 8. Edge Cases & Error Scenarios [REQUIRED]

| Scenario | Expected behavior |
|---|---|
| Harness connector is unavailable | GitHub Actions and Vercel continue to operate; Harness status fails or is absent |
| Vercel deployment data is not connected to SEI | Use merges to `main` as deployment frequency fallback |
| Existing approved bootstrap spec lacks `plan.md` | Full lint passes unless the spec enters strict PR enforcement through changed-only mode |
| PR is trivial | `no-spec` label is accepted by Harness policy and GitHub spec-lint |

---

## 9. Dependencies [OPTIONAL]

| Dependency | Type | Notes |
|---|---|---|
| Harness CI/CD | External platform | Runs SDD Governance pipeline and reports GitHub status |
| Harness Policy as Code | External platform | Evaluates OPA/Rego policies |
| Harness SEI | External platform | Aggregates DORA and engineering flow metrics |
| GitHub | SCM/CI | Source of PR, commit, and GitHub Actions data |
| Vercel | Deployment platform | Production deployment source of truth |

---

## 10. Open Questions

- [ ] **Q1**: Confirm Harness account/org/project identifiers before importing pipeline YAML. — *Owner: Pablo, Due: TBD*
- [ ] **Q2**: Confirm whether Vercel deployment data can be connected directly to SEI. — *Owner: Pablo, Due: TBD*

---

## Constitution Compliance Checklist

- [x] Stack used matches constitution §1; no new runtime dependencies introduced.
- [x] Dual portal isolation respected (§2.2).
- [x] No app input surface or database access added (§2.4).
- [x] Performance budgets unaffected (§5).
- [x] Security rules addressed; no secrets stored in repository (§6).
- [x] Git and PR traceability strengthened (§8).
- [x] SDD and AI agent rules strengthened (§9).

---

*Spec ID: SPEC-106 | Template version: 1.0.0*
