package aquatechia.harness.require_pr_spec_reference

test_allow_with_spec_reference {
  not deny with input as {
    "triggerPayload": {
      "pull_request": {
        "body": "Fixes bug in login.\n\nSpec: SPEC-106",
        "labels": []
      }
    }
  }
}

test_allow_with_no_spec_label {
  not deny with input as {
    "triggerPayload": {
      "pull_request": {
        "body": "Minor typo fix.",
        "labels": [{"name": "no-spec"}]
      }
    }
  }
}

test_deny_without_spec_reference {
  deny["Pull requests must include `Spec: SPEC-NNN` in the body or carry the `no-spec` label."] with input as {
    "triggerPayload": {
      "action": "opened",
      "pull_request": {
        "body": "Added a new feature without a spec.",
        "labels": []
      }
    }
  }
}

test_deny_with_wrong_spec_format {
  deny["Pull requests must include `Spec: SPEC-NNN` in the body or carry the `no-spec` label."] with input as {
    "triggerPayload": {
      "action": "opened",
      "pull_request": {
        "body": "Spec: missing number",
        "labels": [{"name": "bug"}]
      }
    }
  }
}
