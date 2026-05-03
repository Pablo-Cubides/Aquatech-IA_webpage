package aquatechia.harness.require_prod_approval

deny[msg] {
  stage := input.pipeline.stages[_].stage
  production_stage(stage)
  not has_manual_approval(stage)
  msg := sprintf("Production-affecting stage %q must include a manual approval step.", [stage.name])
}

production_stage(stage) {
  lower(stage.type) == "deployment"
  contains(lower(object.get(stage.spec, "environment", "")), "prod")
}

production_stage(stage) {
  lower(stage.type) == "deployment"
  contains(lower(stage.name), "prod")
}

has_manual_approval(stage) {
  step := stage.spec.execution.steps[_].step
  lower(step.type) == "harnessapproval"
}

has_manual_approval(stage) {
  step := stage.spec.execution.steps[_].step
  lower(step.type) == "approval"
}
