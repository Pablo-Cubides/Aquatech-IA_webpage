---
id: SPEC-100
title: Blog Content Pipeline
status: approved
owner: Pablo Cubides
created: 2026-04-28
updated: 2026-05-01
---

# SPEC-100 — Blog Content Pipeline

## 1. Problem

Blog articles are currently split across multiple large TypeScript files (`blog-articles.ts`, `new-blog-articles.ts`, `new-ambiental-articles.ts`) and 2 unstructured Markdown files in `content/blog/`. There is no single canonical pipeline for creating, validating, and publishing articles. This causes: no schema enforcement, duplicate slug risk, and no content quality checks.

### Context
Per ADR-0008, we continue with TypeScript data files (not MDX). The goal is a clean, scriptable pipeline with a single article-per-file structure and automated validation.

---

## 2. Constraints

- **C-001**: Zod schema MUST be the single source of truth for structural validation of articles.
- **C-002**: Every article MUST pass `lint-content.mjs` business rules before merge.
- **C-003**: No mega-files allowed; each article must be in its own file (BR-006).
- **C-004**: CI must block merge on any validation error.

---

## 3. Non-Goals

- Migration of the 2 legacy Markdown files in `content/blog/`.
- MDX compilation (per ADR-0008).
- CMS integration / Article editing UI.
- Multi-language articles (future spec).
- Article comments / reactions.

---

## 4. Users

| Persona | Role | How affected |
|---|---|---|
| Pablo (Instructor) | Content creator | Creates articles via AI agents or manually; needs a fast, reliable publishing path |
| AI Agents (Claude, Copilot, Antigravity) | Content generator | Generates article files that must pass Zod validation before CI can merge |

---

## 5. User Stories

### US-001: Create a new article
```gherkin
As Pablo (or an AI agent acting on his behalf)
I want to scaffold a new article file with a single command
So that I don't manually copy-paste boilerplate

Acceptance Criteria:
  Scenario: Scaffold new article
    Given I run: pnpm content:new ia redes-neuronales-cnn
    Then a file is created at apps/web/src/lib/articles/ia/redes-neuronales-cnn.ts
    And it exports a BlogArticle stub with all required fields marked [REQUIRED]
    And the slug "redes-neuronales-cnn" is checked for uniqueness before creation
    And the file is NOT registered in the articles index yet
```

### US-002: Validate article before publishing
```gherkin
As Pablo (or CI)
I want all articles validated against the Zod schema before merge
So that no broken articles reach production

Acceptance Criteria:
  Scenario: Valid article passes CI
    Given an article file has all required fields correctly filled
    When CI runs pnpm lint:content
    Then the check passes and the PR can be merged

  Scenario: Invalid article blocks CI
    Given an article has readTime: 0 or an empty excerpt
    When CI runs pnpm lint:content
    Then the check fails with a descriptive error pointing to the specific field
    And the PR cannot be merged
```

### US-003: Article appears on the blog
```gherkin
As a blog reader
I want to see new articles after they are published
So that the content is accessible

Acceptance Criteria:
  Scenario: Article registered and deployed
    Given an article file is created and registered in the articles index
    And the PR is merged (triggering Vercel deploy)
    Then the article appears at /[portal]/blog/[slug]
    And the article appears in the blog listing page
```

---

## 6. Business Rules

- **BR-001**: Slugs are globally unique across both portals (ia + ambiental).
- **BR-002**: `date` must be a valid ISO 8601 date. Articles cannot be future-dated.
- **BR-003**: `readTime` must be within 20% of `ceil(wordCount / 200)`.
- **BR-004**: `heroImage` must be non-empty for any article in production (not a `// DRAFT` file).
- **BR-005**: `tags` must contain 3–7 items from the approved taxonomy in `docs/domain/glossary.md`.
- **BR-006**: Each article is one file. Mega-files with multiple articles are prohibited.
- **BR-007**: `nextArticle.slug` must reference an existing, published article slug.

---

## 7. Non-Functional Requirements

### Performance
- [x] Content pipeline (lint + typecheck) adds <30s to CI run.
- [x] Scaffold script (`pnpm content:new`) completes in <2s.

### Content Quality
- [x] Zod schema enforces structural correctness at parse time.
- [x] `lint-content.mjs` enforces business rules BR-001 through BR-007.
- [x] CI blocks merge on any validation error.

---

## 8. Edge Cases & Error Scenarios

| Scenario | Expected behavior |
|---|---|
| Slug already exists in other portal | `new-content.mjs` blocks creation with a descriptive error |
| `nextArticle` slug doesn't exist | `lint-content.mjs` fails with "nextArticle.slug does not exist" |
| Article file created but not registered in index | Article is not visible — expected behavior; must be registered separately |
| Two articles with same slug in same portal | `lint-content.mjs` detects and fails CI |
| `heroImage` is empty at publish time | `lint-content.mjs` fails unless file has `// DRAFT` comment |

---

## 9. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| `docs/contracts/article.zod.ts` | Contract | Must be copied to `apps/web/src/lib/contracts/` |
| `.specify/scripts/new-content.mjs` | Script | Scaffold command |
| `.specify/scripts/lint-content.mjs` | Script | Validation |
| `.github/workflows/content-lint.yml` | CI | Runs lint-content in CI |
| SPEC-101 | Spec | AI article generator uses this pipeline |

---

## Constitution Compliance Checklist

- [x] Zod as sole type source for BlogArticle (§3.1).
- [x] Image policy (heroImage Cloudinary for new articles) (§7.1, §7.3).
- [x] CI validation enforced (§4.3).
- [x] Slug naming kebab-case Spanish (§3.2).
