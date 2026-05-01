# CONTENT-SPEC — [Article title / Título del artículo]
> **Slug**: `[kebab-case-slug]` — must be unique across both portals  
> **Portal**: `ia` | `ambiental`  
> **Category**: [LLMs | Herramientas | Tutoriales | Análisis | Agua | Normativa | ...]  
> **Status**: `draft` | `approved` | `published` | `archived`  
> **Author**: [Pablo Cubides | AI-assisted by Claude Code | ...]  
> **Target publish date**: YYYY-MM-DD  

---

## 1. Editorial Brief [REQUIRED]

### Problem / Problem being addressed
> *What question does this article answer? What problem does the reader have?*

[2-3 sentences: what the reader is struggling with before reading this article.]

### Target audience
> *Reference persona from `docs/domain/personas.md`.*

- **Primary**: [e.g., "University student learning about AI fundamentals"]
- **Secondary**: [e.g., "Environmental professional curious about AI tools"]
- **Knowledge level**: beginner | intermediate | advanced

### Core message / Mensaje central
> *One sentence: if the reader remembers only one thing after reading, it should be:*

[Single sentence.]

---

## 2. SEO Specification [REQUIRED]

| Field | Value |
|---|---|
| `title` (max 60 chars) | [SEO title — may differ from article H1] |
| `description` (max 160 chars) | [Meta description for search engines] |
| Primary keyword | [main keyword in Spanish] |
| Secondary keywords (3-5) | [keyword1, keyword2, keyword3] |
| Internal links to | [slug1, slug2] |
| Internal links from | [slug1] |
| Schema.org type | `Article` | `TechArticle` | `HowTo` |

---

## 3. Content Structure [REQUIRED]

> *Approved outline. Sections map to the `content.sections[]` array in `BlogArticle`.*

| Section ID | Title | Type | Estimated words |
|---|---|---|---|
| `intro` | [Introduction title] | text | ~150 |
| `[section-id]` | [Section title] | text + image | ~400 |
| `[section-id]` | [Section title] | text + callout | ~300 |
| `cta` | [CTA title] | callout:success | ~100 |
| `conclusion` | [Conclusion] | text | ~100 |

**Total estimated words**: ~[N]  
**Estimated readTime**: ~[N] minutes (words / 200 wpm)

---

## 4. Images Required [REQUIRED]

| ID | Description | Source | Alt text | Storage |
|---|---|---|---|---|
| `heroImage` | [Description of hero image] | [Cloudinary / AI-generated / Stock] | [alt text ES] | Cloudinary |
| `section-[id]` | [Description] | [Source] | [alt text ES] | Cloudinary |

> Image budget: hero ≤200KB, inline ≤80KB. See constitution §5.3.  
> If AI-generated: complete `image-manifest.json` per constitution §7.4.

---

## 5. Internal Tool CTA [OPTIONAL]

> *If this article promotes an AquatechIA tool, define the CTA.*

- **Tool slug**: `/[portal]/herramientas/[tool-slug]`
- **CTA text**: [e.g., "Experimenta el Diagrama Interactivo"]
- **CTA type**: `callout:success`
- **Section**: placed in `cta` section

---

## 6. Content Rules / Reglas de contenido [REQUIRED]

- [ ] Language: Spanish (primary). Technical terms in English accepted with explanation.
- [ ] Tone: technical but accessible. No fluff. Direct sentences.
- [ ] No unverified statistics. All data points include source.
- [ ] No future promises ("soon", "upcoming") without confirmed dates.
- [ ] `readTime` field matches: `ceil(wordCount / 200)` ± 1 minute.
- [ ] `date` is publish date in ISO 8601 (YYYY-MM-DD).
- [ ] `tags`: 3–7 tags from approved taxonomy in `docs/domain/glossary.md`.
- [ ] `nextArticle` links to a real, published article slug.
- [ ] `heroImage` URL resolves correctly (Cloudinary URL or verified local path).

---

## 7. Article Data File [REQUIRED]

> *Location of the generated TypeScript file.*

```
apps/web/src/lib/articles/[portal]/[slug].ts
```

Must export a `BlogArticle` object that passes Zod validation:
```typescript
import { blogArticleSchema } from "@/lib/contracts/article.zod";
import type { BlogArticle } from "@/lib/contracts/article.zod";

export const article: BlogArticle = blogArticleSchema.parse({ ... });
```

---

## 8. Definition of Done [REQUIRED]

- [ ] Article data file created at correct path.
- [ ] `blogArticleSchema.parse()` succeeds without errors.
- [ ] `pnpm lint:content` passes (slug unique, links valid, alts present).
- [ ] Hero image uploaded to Cloudinary, URL set in `heroImage`.
- [ ] Image manifests created for AI-generated images.
- [ ] CI `content-lint.yml` passes on PR.
- [ ] Article renders correctly in both dev and production build.
- [ ] SEO metadata verified in browser dev tools.

---

*Content Spec for `[slug]` | Template version: 1.0.0*
