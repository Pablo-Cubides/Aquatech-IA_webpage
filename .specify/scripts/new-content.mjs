#!/usr/bin/env node
/**
 * Scaffold a new blog article file from template.
 * Usage: node .specify/scripts/new-content.mjs <portal> <slug>
 * Example: node .specify/scripts/new-content.mjs ia redes-neuronales-convolucionales
 *
 * Outputs: apps/web/src/lib/articles/<portal>/<slug>.ts
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const ARTICLES_DIR = (portal) =>
  join(ROOT, "apps", "web", "src", "lib", "articles", portal);

// ─── Helpers ────────────────────────────────────────────────────────────────

function success(msg) { console.log(`\x1b[32m✓\x1b[0m ${msg}`); }
function error(msg) { console.error(`\x1b[31m✗\x1b[0m ${msg}`); process.exit(1); }
function warn(msg) { console.warn(`\x1b[33m⚠\x1b[0m ${msg}`); }

function toTitleCase(slug) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ─── Main ────────────────────────────────────────────────────────────────────

const [, , portal, slug] = process.argv;

if (!portal || !slug) error("Usage: node new-content.mjs <portal> <slug>\n  portal: ia | ambiental\n  slug: kebab-case-in-spanish");
if (!["ia", "ambiental"].includes(portal)) error('Portal must be "ia" or "ambiental".');
if (!/^[a-z0-9-]+$/.test(slug)) error("Slug must be kebab-case (lowercase, hyphens only, Spanish).");

const today = new Date().toISOString().slice(0, 10);
const title = toTitleCase(slug);
const outputDir = ARTICLES_DIR(portal);
const outputPath = join(outputDir, `${slug}.ts`);

if (existsSync(outputPath)) error(`Article already exists: apps/web/src/lib/articles/${portal}/${slug}.ts`);

// Check for slug conflicts across portals
const otherPortal = portal === "ia" ? "ambiental" : "ia";
const conflictPath = join(ARTICLES_DIR(otherPortal), `${slug}.ts`);
if (existsSync(conflictPath)) {
  warn(`Slug "${slug}" already exists in the ${otherPortal} portal. Slugs must be unique across portals.`);
  warn(`Consider: ${slug}-${portal}`);
  process.exit(1);
}

// Create output directory if needed
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
  success(`Created directory: apps/web/src/lib/articles/${portal}/`);
}

// Generate article file
const template = `import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// SPEC: Fill this article following .specify/instructions/content-generation.md
// Constitution §7.1–7.2 applies to all content fields.

const article: BlogArticle = blogArticleSchema.parse({
  slug: "${slug}",
  title: "${title}",         // [REQUIRED] H1 displayed on page
  category: "",              // [REQUIRED] From taxonomy in docs/domain/glossary.md
  date: "${today}",          // [REQUIRED] ISO 8601 publish date
  readTime: 0,               // [REQUIRED] ceil(wordCount / 200) — update after writing
  excerpt: "",               // [REQUIRED] 1-2 sentences, max 280 chars
  heroImage: "",             // [REQUIRED] Cloudinary URL — upload before publishing
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ia/autor/pablo-cubides.png",
    bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
  },
  content: {
    introduction: "",        // [REQUIRED] ~150 words
    sections: [
      {
        id: "section-1",
        title: "1. [Section Title]",
        content: "",         // [REQUIRED] Markdown supported. Min ~200 words.
      },
      {
        id: "section-2",
        title: "2. [Section Title]",
        content: "",
        // image: "",        // [OPTIONAL] Cloudinary URL or /public path
        // callout: {        // [OPTIONAL]
        //   type: "info",   // "info" | "warning" | "success"
        //   title: "",
        //   content: "",
        // },
      },
      {
        id: "cta",
        title: "[Tool or Action CTA]",
        content: "",
        callout: {
          type: "success",
          title: "Herramienta Activa",
          content: "👉 [Link text](/[portal]/herramientas/[tool-slug])",
        },
      },
    ],
    conclusion: "",          // [OPTIONAL] ~100 words
  },
  tags: [],                  // [REQUIRED] 3-7 tags from docs/domain/glossary.md taxonomy
  // nextArticle: {          // [OPTIONAL] Link to related article
  //   slug: "",
  //   title: "",
  // },
});

export default article;
`;

writeFileSync(outputPath, template);
success(`Article file created: apps/web/src/lib/articles/${portal}/${slug}.ts`);

console.log(`
\x1b[32m✅ Article scaffolded!\x1b[0m

  📄 apps/web/src/lib/articles/${portal}/${slug}.ts

  Next steps:
  1. Fill all [REQUIRED] fields in the article file.
  2. Follow: .specify/instructions/content-generation.md
  3. Upload hero image to Cloudinary, set heroImage URL.
  4. Run: pnpm lint:content (validates slug, links, alts)
  5. Run: pnpm typecheck (ensures Zod parse succeeds)
  6. Import and register the article in the articles index.
  7. Open PR with: Spec: SPEC-100 (Content Pipeline)

  ⚠️  The article will NOT appear until imported in the articles index.
`);
