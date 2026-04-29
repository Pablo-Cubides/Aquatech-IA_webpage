---
mode: agent
description: Review an article file for quality, accuracy, and compliance before publishing
---

# /content.review — Review a blog article before publishing

## Pre-conditions
1. Read `.specify/memory/constitution.md` §7.1–7.2.
2. Read `.specify/instructions/content-generation.md`.
3. Read `docs/domain/glossary.md` (tag taxonomy).

## Input
User provides: article file path or slug.

## Your task
Review the article at `apps/web/src/lib/articles/[portal]/[slug].ts` on these dimensions:

### 1. Schema Compliance
- [ ] All required fields are filled (no empty strings).
- [ ] `date`: valid ISO 8601, not in future.
- [ ] `readTime`: within 20% of `ceil(wordCount / 200)`.
- [ ] `excerpt`: ≤280 chars.
- [ ] `heroImage`: non-empty URL (Cloudinary or valid path).
- [ ] `tags`: 3-7 items from approved taxonomy.
- [ ] `nextArticle.slug` (if set): exists in articles library.
- [ ] Section IDs: unique within article.

### 2. Content Quality
- [ ] Primary keyword appears in: title, first sentence of intro, at least one heading.
- [ ] No unverified statistics (all data points have inline source citation).
- [ ] No future promises without confirmed dates.
- [ ] Tone is technical and direct (no filler phrases).
- [ ] No raw `#` headings inside `content` strings.
- [ ] No unescaped quotes in template literal strings.
- [ ] `conclusion` reinforces core message without repeating intro verbatim.

### 3. SEO
- [ ] Title is ≤60 characters.
- [ ] `excerpt` is written for humans on search results.
- [ ] Internal links use proper format: `[text](/portal/herramientas/slug)`.
- [ ] CTA section present with link to a real tool (if applicable).

### 4. Images
- [ ] `heroImage` is a Cloudinary URL for new articles.
- [ ] All `section.image` values are valid URLs or paths.
- [ ] Image `alt` is set in the article — if image is referenced, the alt text should be in a comment or manifest.

### 5. Validation Commands
```bash
pnpm typecheck
pnpm lint:content
```
Both must pass.

## Output format
```
📖 Review: [slug] ([portal] portal)

Schema: ✓ / ⚠️ [N issues]
Content: ✓ / ⚠️ [N issues]
SEO: ✓ / ⚠️ [N issues]
Images: ✓ / ⚠️ [N issues]
Validation: pnpm typecheck [✓/✗] | pnpm lint:content [✓/✗]

Issues found:
  1. [field/section]: [description of issue]
  2. ...

Overall: [READY TO PUBLISH | NEEDS FIXES]
```

For each issue: provide the exact field name and what the correct value should be.
