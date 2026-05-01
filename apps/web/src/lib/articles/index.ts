/**
 * Articles index — single import point for all blog articles.
 *
 * Architecture (SPEC-100, ADR-0008):
 *   - Legacy articles: still in apps/web/src/lib/blog-articles.ts (untouched)
 *   - New articles: one file per article in articles/ia/ or articles/ambiental/
 *
 * To add a new article:
 *   1. Run: pnpm content:new <portal> <slug>
 *   2. Fill all [REQUIRED] fields in the generated file
 *   3. Import and add it to the NEW_IA_ARTICLES or NEW_AMBIENTAL_ARTICLES array below
 *
 * To get all articles (legacy + new) for a portal, use getAllArticles() below.
 */

import { IA_ARTICLES, AMBIENTAL_ARTICLES } from "../blog-articles";
import type { BlogArticle } from "../blog-articles";

// ─── New articles (one file per article) ─────────────────────────────────────
// Import new IA articles here as they are created:
// import iaArticleExample from "./ia/example-slug";

const NEW_IA_ARTICLES_V2: BlogArticle[] = [
  // Add new IA articles here after generating with: pnpm content:new ia <slug>
];

// Import new Ambiental articles here as they are created:
// import ambientalArticleExample from "./ambiental/example-slug";

const NEW_AMBIENTAL_ARTICLES_V2: BlogArticle[] = [
  // Add new Ambiental articles here after generating with: pnpm content:new ambiental <slug>
];

// ─── Combined exports ─────────────────────────────────────────────────────────

/** All IA portal articles (legacy + new), sorted by date descending */
export function getAllIAArticles(): BlogArticle[] {
  const legacy = Object.values(IA_ARTICLES);
  const latest = NEW_IA_ARTICLES_V2;
  return [...legacy, ...latest].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** All Ambiental portal articles (legacy + new), sorted by date descending */
export function getAllAmbientalArticles(): BlogArticle[] {
  const legacy = Object.values(AMBIENTAL_ARTICLES);
  const latest = NEW_AMBIENTAL_ARTICLES_V2;
  return [...legacy, ...latest].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Get a single article by slug (searches both portals) */
export function getArticleBySlug(slug: string): BlogArticle | undefined {
  const all = [...getAllIAArticles(), ...getAllAmbientalArticles()];
  return all.find((a) => a.slug === slug);
}

/** Get all articles across both portals, sorted by date descending */
export function getAllArticles(): BlogArticle[] {
  return [...getAllIAArticles(), ...getAllAmbientalArticles()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export type { BlogArticle };
