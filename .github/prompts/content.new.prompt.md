---
mode: agent
description: Generate a complete blog article following SDD content pipeline
---

# /content.new — Generate a new blog article

## Pre-conditions (read in this order)
1. Read `.specify/memory/constitution.md` §7.1–7.2.
2. Read `.specify/instructions/content-generation.md` fully — this is your operating manual.
3. Read `docs/domain/glossary.md` — for approved tag taxonomy and domain terms.
4. Read `docs/domain/personas.md` — for audience targeting.
5. Check slug uniqueness: list files in `apps/web/src/lib/articles/ia/` and `apps/web/src/lib/articles/ambiental/`.

## Input required from user
If not provided, ask:
- **Portal**: `ia` or `ambiental`
- **Slug**: kebab-case in Spanish (e.g., `redes-neuronales-convolucionales`)
- **Topic / brief**: what the article is about
- **Primary keyword**: main SEO keyword in Spanish
- **Target persona**: from personas.md
- **CTA tool**: which AquatechIA tool to link (or none)
- **Key sections**: 3-5 section topics to cover

## Your task

### Step 1: Run scaffold script
```bash
node .specify/scripts/new-content.mjs <portal> <slug>
```

### Step 2: Fill the article
Open the generated file and fill ALL `[REQUIRED]` fields following `content-generation.md`.

Specifically:
- `introduction`: ~150 words, hooks reader, includes primary keyword in first sentence.
- `sections[]`: minimum 3 sections. Each `content` field ≥200 words. Use Markdown formatting.
- `readTime`: calculate `Math.ceil(totalWordCount / 200)`.
- `excerpt`: ≤280 chars, SEO-optimized, written for humans who see it on Google.
- `tags`: 3-7 from `docs/domain/glossary.md` approved taxonomy.
- `heroImage`: leave as `""` for now — flag to upload to Cloudinary separately.

### Step 3: Add a CTA section (if tool provided)
```typescript
{
  id: "cta",
  title: "[Tool name] — Experimenta en AquatechIA",
  content: "...",
  callout: {
    type: "success",
    title: "Herramienta Activa",
    content: "👉 [Ir a la herramienta](/[portal]/herramientas/[tool-slug])",
  },
}
```

### Step 4: Validate
```bash
pnpm typecheck
pnpm lint:content
```
Fix any errors before reporting done.

### Step 5: Register in articles index
Add the import and export to the appropriate articles index file.

## Output format
```
✅ Article created: apps/web/src/lib/articles/[portal]/[slug].ts

Word count: ~N words
Read time: N minutes
Tags: [list]
Validation: pnpm typecheck ✓ | pnpm lint:content ✓

⚠️  heroImage is empty — upload to Cloudinary and set URL before final publish.

Next steps:
1. Upload hero image: pnpm img:optimize <input> --context=hero --cloudinary
2. Set heroImage URL in the article file
3. Register in articles index
4. Open PR: Spec: SPEC-100 (Content Pipeline), SPEC-101 (AI Article Generator)
```

## Three-strikes check
Is this the 3rd+ article of the same category/type? If yes, consider creating a category-specific content template in `.specify/templates/`.
