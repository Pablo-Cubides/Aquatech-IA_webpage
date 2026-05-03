package aquatechia.harness.require_pr_spec_reference

deny[msg] {
  is_pull_request
  not has_spec_reference
  not has_no_spec_label
  msg := "Pull requests must include `Spec: SPEC-NNN` in the body or carry the `no-spec` label."
}

is_pull_request {
  object.get(input, "triggerType", "") == "PullRequest"
}

is_pull_request {
  object.get(input.triggerPayload, "action", "") != ""
  input.triggerPayload.pull_request
}

has_spec_reference {
  body := object.get(input.triggerPayload.pull_request, "body", "")
  regex.match("Spec:\\s*SPEC-[0-9]+", body)
}

has_no_spec_label {
  label := input.triggerPayload.pull_request.labels[_]
  lower(label.name) == "no-spec"
}
