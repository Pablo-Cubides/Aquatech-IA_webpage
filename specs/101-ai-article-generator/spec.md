---
id: SPEC-101
title: "AI Article Generator"
status: approved
owner: Pablo Cubides
created: 2026-04-28
updated: 2026-05-02
---

# SPEC-101 — AI Article Generator

## 1. Problem [REQUIRED]

AquatechIA needs to publish technical blog content regularly. Writing full articles manually is time-intensive. AI agents (Claude Code, Copilot, Antigravity) can generate high-quality technical content — but they need clear rules, a defined input contract, and automated validation to ensure structural correctness before publication.

The existing `write-ia-articles.js` was a proof-of-concept without spec, validation, or a formal workflow. This spec formalizes and improves that process.

### Context
Per ADR-0010, AI-generated articles are published directly without mandatory human review. The safeguard is automated validation (Zod + `lint-content.mjs`).

---

## 2. Constraints [REQUIRED]

- **C-001**: AI agents MUST NOT use `any` types in generated article objects.
- **C-002**: No external libraries allowed for article generation beyond standard `@ia-next` packages.
- **C-003**: Generated content MUST be valid Spanish (primary) with English technical terms allowed.
- **C-004**: Must use Zod for structural validation before committing.

---

## 3. Non-Goals [REQUIRED]

- Automatic image generation alongside the article (separate process per SPEC-102).
- Automatic SEO optimization / A/B testing of titles.
- Scheduled article publishing.
- Social media post generation from articles.

---

## 4. Users [REQUIRED]

| Persona | Role | How affected |
|---|---|---|
| Pablo (Instructor) | Article commissioner | Triggers article generation via AI agents |
| AI Agent (Claude, Copilot, Antigravity) | Generator | Produces article TypeScript file following instructions |

---

## 5. User Stories [REQUIRED]

### US-001: Generate a new article via AI agent
```gherkin
As Pablo
I want to describe an article topic to an AI agent
And have it generate a complete, valid article file
So that I can publish new content without writing it from scratch

Acceptance Criteria:
  Scenario: Valid article generated
    Given I provide: portal, slug, topic, target audience, key sections
    When the AI agent generates the article using content-generation.md instructions
    Then a file is created at apps/web/src/lib/articles/[portal]/[slug].ts
    And blogArticleSchema.parse() succeeds without errors
    And pnpm lint:content passes
    And readTime is correctly calculated
    And all section IDs are unique

  Scenario: Agent detects schema error and self-corrects
    Given the agent generates an article with an empty required field
    When pnpm typecheck or lint:content is run
    Then the error is visible to the agent
    And the agent corrects the field before the PR is opened
```

### US-002: Article uses correct instructions
```gherkin
As the generation system
I want the AI agent to follow .specify/instructions/content-generation.md
So that all generated articles have consistent quality and structure

Acceptance Criteria:
  Scenario: Instruction compliance
    Given the agent reads content-generation.md before generating
    Then the article:
      - Has primary keyword in title, introduction, and at least one section heading
      - Has no unverified statistics without source attribution
      - Has no future promises ("próximamente") without confirmed dates
      - Has excerpt ≤280 chars
      - Has 3-7 tags from approved taxonomy
      - Has a CTA section linking to a relevant tool (if applicable)
```

---

## 6. Business Rules [REQUIRED]

- **BR-001**: AI agents MUST read `.specify/instructions/content-generation.md` before generating.
- **BR-002**: AI agents MUST read `.specify/memory/constitution.md` before generating.
- **BR-003**: Generated articles are validated by `blogArticleSchema.parse()` at module load — if validation fails, the file cannot be imported and the build fails.
- **BR-004**: `heroImage` may be empty during generation (article can be pushed as draft with `// DRAFT` comment) but must be set before removing the `// DRAFT` comment and registering in the index.
- **BR-005**: Generated content must not cite URLs it cannot verify exist.
- **BR-006**: No claims about AquatechIA tools that contradict what the tool actually does.

---

## 7. Non-Functional Requirements [REQUIRED]

### Content Quality
- [x] `pnpm lint:content` passes before merge.
- [x] `pnpm typecheck` passes (Zod parse succeeds at build time).
- [x] SEO fields (title ≤60 chars, excerpt ≤280 chars) enforced by Zod schema.

### Traceability
- [x] Commit message uses `feat(content/[portal]): add article [slug]`.
- [x] PR description references `Spec: SPEC-101`.

---

## 8. Edge Cases & Error Scenarios [REQUIRED]

| Scenario | Expected behavior |
|---|---|
| Zod parse fails on generated file | Build fails; agent must fix before PR |
| Slug conflicts with existing article | `new-content.mjs` blocks scaffold; agent must choose a different slug |
| `nextArticle` slug doesn't exist | `lint-content.mjs` fails; agent must remove or fix the reference |
| Agent generates content in English | Acceptable for technical terms; main prose must be in Spanish |
| Article cites a statistic without source | Per content-generation.md rules, agent must add `(Fuente: X, YYYY)` inline |

---

## 9. Dependencies [OPTIONAL]

| Dependency | Type | Notes |
|---|---|---|
| SPEC-100 (Content Pipeline) | Spec | Article files follow the pipeline defined in SPEC-100 |
| `.specify/instructions/content-generation.md` | Instruction | Agent must follow this |
| `.specify/memory/constitution.md` | Constitution | Agent must read first |
| `docs/contracts/article.zod.ts` | Contract | Validation schema |
| `.specify/scripts/new-content.mjs` | Script | Scaffold command |
| `.github/workflows/content-lint.yml` | CI | Validation in CI |
| SPEC-102 (Images) | Spec | Hero image sourcing |

---

## Constitution Compliance Checklist

- [x] Agent reads constitution before generating (§9, rule 1).
- [x] Zod validation of all generated content (§3.1).
- [x] Content follows image policy for heroImage (§7.1).
- [x] Tags from approved taxonomy (§7.1).
- [x] Conventional commit for article PR (§3.5).
