# Content Generation Instructions
> **Applies to**: Any AI agent generating blog articles for AquatechIA portals.  
> **Version**: 1.0.0  
> **Reference**: Constitution §7.1–7.2, SPEC-100, SPEC-101

---

## Step 0: Pre-Generation Checklist

Before generating an article, confirm:

- [ ] There is a `content-spec.template.md` filled out for this article (or fill it now).
- [ ] The slug is unique: check `apps/web/src/lib/articles/ia/` and `apps/web/src/lib/articles/ambiental/`.
- [ ] The portal is defined: `ia` or `ambiental`.
- [ ] The category is from the approved list in `docs/domain/glossary.md`.
- [ ] The hero image is planned (Cloudinary URL or will be generated separately).

---

## Step 1: Understand the Article Brief

Read the content spec at `.specify/templates/content-spec.template.md` (filled for this article).

Key inputs to extract:
- **Primary keyword** and secondary keywords → will be woven into title, introduction, and section headings naturally.
- **Target audience** and knowledge level → determines vocabulary, depth, and examples.
- **Core message** → the single idea everything in the article serves.
- **Content structure** → section IDs, titles, types, estimated word counts.
- **CTA tool** (if any) → portal path, CTA text, placement.

---

## Step 2: Generate the TypeScript Article File

Output path: `apps/web/src/lib/articles/[portal]/[slug].ts`

### Required structure (mirrors `BlogArticle` type):

```typescript
import { blogArticleSchema } from "@/lib/contracts/article.zod";
import type { BlogArticle } from "@/lib/contracts/article.zod";

const article: BlogArticle = blogArticleSchema.parse({
  slug: "[slug]",           // kebab-case, Spanish, unique
  title: "[title]",         // H1 displayed on page
  category: "[category]",   // from approved taxonomy
  date: "YYYY-MM-DD",       // ISO 8601 publish date
  readTime: N,              // ceil(wordCount / 200)
  excerpt: "[excerpt]",     // 1-2 sentences, max 280 chars, SEO-friendly
  heroImage: "[url]",       // Cloudinary URL for new articles
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ia/autor/pablo-cubides.png",
    bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
  },
  content: {
    introduction: "[introduction text]", // ~150 words, hooks the reader, states the core message
    sections: [
      {
        id: "[section-id]",       // kebab-case, unique within article
        title: "[Section title]", // Numbered: "1. Title" for main sections
        content: "[markdown]",    // Markdown allowed: **bold**, *italic*, lists, inline code
        image: "[url or path]",   // OPTIONAL: only if planned in content spec
        callout: {                // OPTIONAL
          type: "info" | "warning" | "success",
          title: "[callout title]",
          content: "[callout content with optional markdown links]",
        },
        subsections: [            // OPTIONAL: for deeply nested content
          {
            id: "[subsection-id]",
            title: "[Subsection title]",
            content: "[markdown]",
          },
        ],
      },
    ],
    conclusion: "[conclusion text]", // ~100 words. Reinforces core message, avoids repetition.
  },
  tags: ["[tag1]", "[tag2]", "[tag3]"], // 3-7 tags, from glossary taxonomy
  nextArticle: {             // OPTIONAL but recommended
    slug: "[related-slug]",  // Must be an existing, published article
    title: "[related title]",
  },
});

export default article;
```

---

## Step 3: Content Quality Rules

### Writing standards
- **Tone**: technical and direct. No filler phrases like "En conclusión, podemos afirmar que...". Say the thing.
- **Sentences**: prefer short to medium. Max 2 lines per sentence.
- **Paragraphs**: max 4-5 sentences. Break complex ideas into numbered lists or subsections.
- **Spanish**: primary language. Technical English terms accepted without translation (e.g., "transformer", "tokenización", "rate limit") when they are the standard in the field.
- **Examples**: concrete and relevant. Avoid abstract explanations without a grounding example.

### Data and accuracy
- No statistics without a source. Format: `(Source: CEPAL, 2024)` or similar inline.
- No future promises ("próximamente", "en el futuro implementaremos") without confirmed dates.
- No claims about AquatechIA tools that aren't verified against the actual tool implementation.

### SEO rules
- Primary keyword appears in: title (H1), first sentence of introduction, at least one section heading, and conclusion.
- `excerpt` is written for humans who read it on Google — it must make them want to click.
- Internal links: use `[tool name](/[portal]/herramientas/[slug])` format.
- No keyword stuffing. Maximum natural density.

### Markdown in content fields
- Supported: `**bold**`, `*italic*`, `` `inline code` ``, `\n\n` for paragraph breaks, `- list items`, `[text](url)` links.
- Do NOT use `#` headings inside content strings — the section `title` is the heading.
- Escape double quotes with `\"` if inside a TS string (or use template literals).

---

## Step 4: Validation Before Saving

Run validation mentally before writing the final file:

```typescript
// Conceptual validation — actual validation runs via Zod parse in the file
✓ slug: is kebab-case, Spanish, no spaces, no special chars except hyphens
✓ date: YYYY-MM-DD format, not in the future
✓ readTime: within 20% of wordCount / 200
✓ excerpt: ≤ 280 chars
✓ heroImage: valid URL (Cloudinary) or valid /public path
✓ tags: 3-7 items, from approved taxonomy
✓ All section IDs: unique within the article
✓ nextArticle.slug: verified to exist in the articles library
✓ content.introduction: ≥ 100 words
✓ Each section.content: ≥ 150 words (unless it's a pure callout/CTA section)
✓ Markdown: no unescaped quotes, no raw # headings
```

---

## Step 5: Register in Articles Index

After creating the article file, add it to the appropriate import in:
- `apps/web/src/lib/blog-articles.ts` (or the updated articles index file per SPEC-100)

---

## Step 6: Run CI Checks

```bash
pnpm lint:content   # validates frontmatter, slugs, links, alts
pnpm typecheck      # ensures TypeScript compiles
```

Both must pass before opening a PR.

---

## Common Mistakes to Avoid

| Mistake | Correct approach |
|---|---|
| Using `any` in the article object | Let Zod's `parse()` catch errors — fix the data |
| `readTime: 0` | Calculate: `ceil(totalWords / 200)` |
| `heroImage: ""` | Always provide a real URL before publishing |
| `nextArticle` pointing to non-existent slug | Verify slug exists before setting |
| Long, run-on sentences in `content` | Break into shorter sentences or lists |
| `date` in the future | Set to today's date for immediate publish |
| Tags not in glossary | Add the tag to glossary first, then use it |
