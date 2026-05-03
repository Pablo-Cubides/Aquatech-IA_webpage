package aquatechia.harness.require_sdd_governance_stage

deny[msg] {
  not has_sdd_governance_stage
  msg := "Harness pipelines for AquatechIA must include an SDD Governance stage."
}

has_sdd_governance_stage {
  stage := input.pipeline.stages[_].stage
  lower(stage.name) == "sdd governance"
}

has_sdd_governance_stage {
  stage := input.pipeline.stages[_].stage
  lower(stage.identifier) == "sdd_governance"
}
