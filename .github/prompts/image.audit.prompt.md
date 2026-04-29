---
mode: agent
description: Audit images in the project for budget compliance, format coverage, and missing alts
---

# /image.audit — Audit project images

## Pre-conditions
1. Read `.specify/memory/constitution.md` §5.3 (budgets).
2. Read `.specify/instructions/image-generation.md`.

## Your task
Run a comprehensive image audit across `apps/web/public/images/`.

### 1. Run the budget script
```bash
node .specify/scripts/image-budget.mjs
```
List all over-budget images with their context and overage.

### 2. Check format coverage
For each image found, check:
- [ ] Does it have a `.avif` variant?
- [ ] Does it have a `.webp` variant?
- [ ] Does it have a `.jpg` or `.png` fallback?
Images missing AVIF or WebP variants need to run through `optimize-image.mjs`.

### 3. Check naming conventions
- [ ] All filenames are kebab-case (no spaces, no uppercase, no underscores).
Report violations.

### 4. Check for AI-generated images without manifests
- For each image in `public/images/`, check if there's a corresponding `.image-manifest.json` file.
- AI-generated images without manifests are a violation.
- Note: not all images are AI-generated — flag only obvious ones or ask the user.

### 5. Check alt text (for article-referenced images)
- Scan all article files in `apps/web/src/lib/articles/`.
- For each `section.image` or `heroImage` value, check that the article's section or alt is non-empty.
- Run: `pnpm lint:content` (also catches this).

### 6. Cloudinary compliance
- Any image in `public/images/portal-*/blog/` that was created after 2026-04-28 should be in Cloudinary, not local.
- Flag local blog images created after that date.

## Output format
```
🖼️  Image Audit Report

Over-budget: N images
  - [path]: [size] (budget: [budget], over by: [amount])

Missing AVIF variants: N images
  - [path]

Missing WebP variants: N images
  - [path]

Naming violations: N
  - [path]

Missing manifests (AI-generated): N
  - [path]

Missing alt text: N
  - [article slug]: [section id]

Cloudinary compliance violations: N
  - [path]

Recommended actions:
  1. Run: pnpm img:optimize [path] --context=[context] for over-budget/missing-variant images
  2. Create manifests for AI-generated images
  3. Fix naming violations
```
