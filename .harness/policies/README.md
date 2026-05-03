# Harness Policy Validation

These policies are intended for Harness Policy as Code policy sets.

## Local validation

Install the OPA CLI locally, then run:

```bash
opa check .harness/policies/*.rego
```

Optional sample evaluation:

```bash
opa eval --data .harness/policies/require-sdd-governance-stage.rego \
  --input .harness/policies/examples/pipeline-without-sdd-stage.json \
  "data.aquatechia.harness.require_sdd_governance_stage.deny"
```

## Harness policy sets

Recommended policy sets:

- Pipeline authoring: `require-sdd-governance-stage.rego`
- Pipeline execution: `require-pr-spec-reference.rego`
- Production safety: `require-prod-approval.rego`

Keep these policies advisory until the first successful Harness SDD Governance runs have been reviewed.
