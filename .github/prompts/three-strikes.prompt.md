---
mode: agent
description: Propose and create the right artifact when a pattern has been repeated 3+ times
---

# /three-strikes — Create artifact for repeated pattern

## Pre-conditions
1. Read `.specify/instructions/three-strikes-rule.md` fully.
2. Read `.specify/memory/three-strikes-log.md` for prior triggers.

## Your task
The user (or you as an agent) has detected a pattern repeated ≥3 times. Determine the right artifact and create it.

### Step 1: Identify the pattern type
Ask (or derive from context):
- What exactly is being repeated? (Describe the pattern in 1-2 sentences)
- How many times has it occurred? (exact count or "3+")
- Evidence: commit hashes, file names, conversation context

### Step 2: Determine the artifact
| Pattern type | Artifact to create |
|---|---|
| Manual command sequence | Script in `.specify/scripts/` |
| Feature type repeated | Template in `.specify/templates/` |
| Repeated AI interaction | Prompt in `.github/prompts/` |
| Architectural decision revisited | ADR in `docs/adr/` |
| Recurring CI step | Reusable workflow in `.github/workflows/` |
| Recurring bug category | Spec stub in `specs/` |

### Step 3: Create the artifact
- Scripts: follow the style of `optimize-image.mjs` (Node.js ESM, clear CLI output, helpful errors).
- Templates: follow `spec.template.md` structure (sections, checklists, Required/Optional markers).
- Prompts: follow `spec.new.prompt.md` structure (pre-conditions, task, output format).
- ADRs: use `adr.template.md` exactly.

### Step 4: Log the trigger
Append to `.specify/memory/three-strikes-log.md`:
```markdown
## [YYYY-MM-DD] — [Pattern name]
- **Detected by**: [agent/developer]
- **Pattern**: [description]
- **Instances**: [list of occurrences]
- **Artifact created**: [path]
- **Result**: [brief outcome note]
```

### Step 5: Register the artifact
- New script → add to `package.json` scripts if user-facing.
- New prompt → mention in README.md SDD section.
- New ADR → add to `docs/adr/README.md` index.

## Output format
```
⚡ Three-Strikes Rule triggered

Pattern: [description]
Occurrences: [count]
Artifact type: [script | template | prompt | ADR | workflow]
Created at: [path]

Log entry added to .specify/memory/three-strikes-log.md.

Usage going forward:
  [pnpm command | /slash-command | git workflow]

Third instance implemented using the new artifact: [yes/no — implement now if yes]
```
