# Three-Strikes Rule
> **Version**: 1.0.0  
> **Reference**: Constitution §10

---

## The Rule

> **If a process is executed manually 3 or more times, it must be formalized.**

This rule prevents knowledge from living only in conversation history or developer memory. It forces operational patterns into discoverable, reusable, and versionable artifacts.

---

## When to Apply

An AI agent or developer must apply this rule when detecting any of these signals:

### Signal 1: Repeated manual steps
You are about to do something for the **third time** that you've done before in this project:
- Running the same sequence of commands.
- Making the same type of code modification.
- Generating the same type of content with the same structure.
- Fixing the same category of bug.

### Signal 2: "This again" recognition
The developer or agent says (or implies):
- "Same as last time..."
- "Like we did for [X]..."
- "We always do this when..."
- "Another one of these..."

### Signal 3: Repetitive git history
Scanning recent `git log --oneline` reveals 3+ commits with the same pattern:
- 3+ commits: `fix: escaped quotes in article content`
- 3+ commits: `chore: optimize image for blog post`
- 3+ commits: `refactor: extract repeated API validation pattern`

---

## Decision Matrix

| Pattern type | Third time → Create | Where |
|---|---|---|
| Manual workflow / commands sequence | Script | `.specify/scripts/` |
| Feature type (new article, new tool, new endpoint) | Spec template | `.specify/templates/` |
| AI interaction pattern | Prompt / slash command | `.github/prompts/` |
| Architectural choice revisited | ADR | `docs/adr/` |
| Repeated CI step or validation | Reusable workflow | `.github/workflows/` |
| Recurring type of bug | Spec stub + root cause note | `specs/` |

---

## Protocol for AI Agents

### Step 1: Detect
Count occurrences of the pattern in:
- Current conversation history.
- `git log --oneline -20` output.
- File creation patterns in the PR.

### Step 2: Announce (before implementing the third instance)
```
⚡ Three-Strikes Rule triggered.

Pattern detected: "[describe the pattern]"
Occurrences: 3+ times ([instance 1], [instance 2], now)

Proposal: Create a [script | template | prompt | ADR | workflow] to formalize this.

Options:
  A) Create the artifact now, then implement the third instance using it.
  B) Implement the third instance now, create the artifact immediately after.
  C) Defer artifact creation (note: this means accepting the violation).

Which do you prefer?
```

### Step 3: Create the artifact (if A or B selected)
- Script: use `/three-strikes` slash command or create manually in `.specify/scripts/`.
- Template: add to `.specify/templates/` following existing template format.
- Prompt: add to `.github/prompts/` as `[verb].[noun].prompt.md`.
- ADR: use `adr.template.md`, increment ADR number, place in `docs/adr/`.

### Step 4: Commit the artifact separately
```
chore(specify): add [name] script/template/prompt per three-strikes rule
```

### Step 5: Use the artifact for the third instance
Demonstrate that the new artifact works by using it immediately.

---

## Examples

### Example 1: Repeated image optimization
- Day 1: "I'll manually resize this image with Sharp..."
- Day 5: "Same as last time, Sharp resize..."
- Day 12: 🚨 TRIGGER → "Before I do this again, I'll create `optimize-image.mjs`"
- Result: `pnpm img:optimize` exists and is used from now on.

### Example 2: Repeated article creation
- Article 1: Generate TypeScript object, set up file, import, done.
- Article 2: Same steps again.
- Article 3: 🚨 TRIGGER → Create `new-content.mjs` script + `content.new.prompt.md`
- Result: `pnpm content:new <slug>` scaffolds everything from now on.

### Example 3: Repeated API validation pattern
- Endpoint 1: Zod schema → parse → 400 handler.
- Endpoint 2: Same pattern.
- Endpoint 3: 🚨 TRIGGER → Extract `validateRequest(schema, handler)` wrapper utility.
- Result: Pattern is codified and consistent across all endpoints.

---

## Tracking

Keep a running log of three-strikes triggers in:

```
.specify/memory/three-strikes-log.md
```

Format:
```markdown
## [YYYY-MM-DD] — [Pattern name]
- **Detected by**: [agent/developer]
- **Pattern**: [description]
- **Instances**: [commit1, commit2, commit3]
- **Artifact created**: [path to script/template/prompt/ADR]
- **Result**: [Brief note on outcome]
```

This log is reviewed monthly as part of continuous improvement (constitution §8 — "Metrics and improvement").
