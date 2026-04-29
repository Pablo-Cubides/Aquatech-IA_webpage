# ADR-0008 — TypeScript Data Files vs MDX for Blog Articles
> **Status**: accepted | **Date**: 2026-04-28 | **Author**: Pablo Cubides

## Context
AquatechIA blog articles are currently authored as TypeScript data objects in `apps/web/src/lib/blog-articles.ts` and related files. Articles have structured data: sections, subsections, callouts, images, authors, tags — not free-form prose. An alternative approach would be MDX (Markdown + JSX) files in `content/blog/`, which is a common pattern for content-heavy Next.js apps.

### Forces
- Articles have rich structured metadata (readTime, tags, nextArticle, author, callout types, section IDs).
- AI agents generate articles — TypeScript with Zod validation catches schema errors at parse time.
- MDX would enable free-form prose but makes structured data harder to validate programmatically.
- `content/blog/` currently contains only 2 markdown files without proper frontmatter — not a mature pipeline.
- The team (solo developer) does not need a CMS or editorial workflow; content is code.
- TypeScript files are already in the codebase and working.

## Decision
**We continue using TypeScript data files for blog articles. Each article is a separate `.ts` file in `apps/web/src/lib/articles/<portal>/<slug>.ts` exporting a `BlogArticle` object validated against `article.zod.ts`.**

MDX is not adopted at this time. The two existing markdown files in `content/blog/` are not part of the active pipeline — they are archived content drafts.

Migration to MDX may be reconsidered in the future (see Alternatives) if editorial needs change.

## Consequences

### Positive
- Zod validation at parse time catches schema errors before deploy — strong content QA.
- AI agents can generate valid TypeScript with type checking and schema enforcement.
- No additional tooling (MDX compiler, remark plugins, content layer) required.
- TypeScript articles are refactorable — rename a field across all articles with a single search-replace.
- CI content-lint runs without MDX parsing complexity.

### Negative
- Content authors cannot use a WYSIWYG editor — must edit TypeScript.
- Prose is embedded as template literals — Markdown syntax awareness is manual.
- Large articles create large TypeScript files that IDE may struggle with.
- Harder to integrate with headless CMS in the future without migration.

### Neutral
- `content/blog/` directory is retained but inactive. It will be removed or repurposed in a future spec.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| MDX + `@next/mdx` | Additional compiler setup; structured metadata harder to validate; not needed for solo dev |
| Contentlayer | Adds a build dependency; overhead for current team size |
| Headless CMS (Sanity, Contentful) | Cost + complexity not justified for current traffic and team size |
| YAML frontmatter + Markdown | Structured data (sections, callouts) becomes awkward in YAML |

## Implementation Notes
- Constitution §7.1: "Source of truth: TypeScript files in `apps/web/src/lib/articles/<portal>/<slug>.ts`"
- Each article file validates via `blogArticleSchema.parse()` at module load time.
- `pnpm content:new <portal> <slug>` scaffolds new article files.
- `pnpm lint:content` validates all article files via `lint-content.mjs`.
- Future MDX migration would require: ADR superseding this one + migration script + CI update.
