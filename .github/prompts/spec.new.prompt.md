---
mode: agent
description: Bootstrap a new SDD feature spec from a description
---

# /spec.new — Create a new feature spec

## Pre-conditions (read before starting)
1. Read `.specify/memory/constitution.md` fully.
2. Read `.specify/templates/spec.template.md`.
3. Read `specs/README.md` to find the next available SPEC-NNN number.
4. Read `docs/domain/glossary.md` for domain terminology.
5. Read `docs/domain/personas.md` for persona references.

## Your task
The user will provide a feature description. Your job is to:

1. **Ask clarifying questions** if any of these are missing:
   - Which portal(s) does this affect? (`ia`, `ambiental`, `both`, `backend`)
   - Who is the primary user? (reference a persona from personas.md)
   - What specific problem does this solve? (not the solution — the pain)
   - Are there related specs this depends on?

2. **Generate the spec file** at `specs/NNN-slug/spec.md` using `spec.template.md`.
   - Fill ALL `[REQUIRED]` fields with real content.
   - Write at least 2 user stories with Gherkin acceptance criteria.
   - Write at least 3 business rules.
   - Fill the constitution compliance checklist.
   - Mark any open questions as `[ ] **Q1**: ... — *Owner: Pablo, Due: TBD*`

3. **Run the scaffold script**:
   ```bash
   node .specify/scripts/new-feature.mjs <slug> --spec-id=NNN
   ```
   (This creates the directory, stubs plan.md and tasks.md, and updates specs/README.md)

4. **Output a summary**:
   - Spec location
   - SPEC-ID assigned
   - Open questions that need resolution before approval
   - Whether constitution violations were detected

## Output format
After generating the file, print:
```
✅ SPEC-NNN created at specs/NNN-slug/spec.md
Status: draft
Open questions: [N]
Constitution issues: [none | list]
Next step: Review open questions, then run /spec.clarify
```

## Three-strikes check
Before creating: has this type of feature been specced 3+ times with the same pattern? If yes, suggest creating a spec template for this feature type.
