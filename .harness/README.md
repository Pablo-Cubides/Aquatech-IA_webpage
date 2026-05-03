# Harness Governance

This directory contains the repository-owned Harness configuration for SPEC-106.

Harness is introduced as a governance and Software Engineering Insights layer only. GitHub Actions remains the active CI gate and Vercel remains the production deployment source of truth until a future spec changes that.

## Import order

1. Create the Harness project and GitHub connector in the Harness UI.
2. Import `pipelines/sdd-governance.yaml` and replace placeholder identifiers.
3. Create the GitHub PR trigger from `triggers/sdd-governance-pr.yaml`.
4. Import the Rego files in `policies/` into Harness Policy as Code policy sets.
5. Configure SEI using `sei/dora-profile.md`.
6. After several successful runs, make `Harness / SDD Governance` a required GitHub status check.

## Required Harness secrets and connectors

- GitHub connector with repository read access and status-check write access.
- Optional Vercel integration or API source for SEI deployment data.
- No Harness secrets are stored in this repository.
