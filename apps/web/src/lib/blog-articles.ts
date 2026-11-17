// Article configuration for both portals
// This file can be easily edited to add new articles

import type { BlogArticle as ContractBlogArticle } from "@ia-next/contracts";
import { isRetiredArticle } from "./retired-articles.mjs";
import { NEW_IA_ARTICLES_V2, NEW_AMBIENTAL_ARTICLES_V2 } from "./articles";
import {
  getStoredArticles,
  getStoredArticlesStrict,
  getStoredArticlesSync,
  type StoredBlogArticle,
} from "./services/blog-store";
import { reportDegradation } from "./observability/degradation";

/**
 * El artículo MAQUETADO que se publica es el del contrato (`@ia-next/contracts`, fuente única de
 * verdad: ADR-0016). Aquí solo se le añade lo que pone el sitio al servirlo: estado, portal, origen,
 * id y fecha de publicación de la base de datos. No vuelvas a copiar a mano los campos del contrato.
 */
export type BlogArticle = ContractBlogArticle & {
  status?: "PUBLISHED" | "SCHEDULED" | "PAUSED" | "ARCHIVED" | "DRAFT";
  portal?: "ia" | "ambiental";
  source?: "AGENT" | "ADMIN" | "CODE";
  id?: string;
  publishedAt?: string;
};

/**
 * Fuente ESTATICA (en código) de un portal: el registro `articles/index.ts`, un archivo por artículo,
 * convertido en un mapa slug -> artículo. Antes había tres fuentes (blog-articles.ts, new-ambiental-
 * articles.ts y el registro); ARQ-007 las unificó en el registro.
 *
 * PRECEDENCIA: PostgreSQL (BlogPost) queda fuera de este mapa y SIEMPRE tiene prioridad sobre él:
 * getArticle() y getAllArticles() lo consultan primero y sustituyen el estático con el mismo slug.
 * La base de datos manda sobre el código porque es donde se edita en caliente (admin y API del
 * agente). Censo de fuentes: docs/domain/article-sources-census.md.
 *
 * Un slug repetido dentro del registro de un portal es un error: gana el último y un test falla
 * (findStaticSlugCollisions). Borra o renombra el duplicado.
 */
function registeredArticles(portal: "ia" | "ambiental"): BlogArticle[] {
  return portal === "ia" ? NEW_IA_ARTICLES_V2 : NEW_AMBIENTAL_ARTICLES_V2;
}

function getStaticArticleMap(portal: "ia" | "ambiental"): Record<string, BlogArticle> {
  return Object.fromEntries(registeredArticles(portal).map((article) => [article.slug, article as BlogArticle]));
}

/** Los slugs repetidos dentro del registro de un portal (para el test de colisiones). */
export function findStaticSlugCollisions(portal: "ia" | "ambiental"): string[] {
  const vistos = new Set<string>();
  const repetidos = new Set<string>();
  for (const { slug } of registeredArticles(portal)) {
    if (vistos.has(slug)) repetidos.add(slug);
    vistos.add(slug);
  }
  return [...repetidos];
}

type Portal = "ia" | "ambiental";

/** Visible para el publico: ya publicado (no futuro) y con estado PUBLISHED o SCHEDULED vencido. */
function isPubliclyVisible(article: { status?: string; publishedAt: string }, now = Date.now()): boolean {
  if (new Date(article.publishedAt).getTime() > now) return false;
  return article.status === "PUBLISHED" || article.status === "SCHEDULED";
}

/** Artículos de las fuentes estáticas (código) de un portal, sin retirados, listos para listar. */
function staticArticlesFor(portal: Portal): BlogArticle[] {
  return Object.values(getStaticArticleMap(portal))
    .filter((a) => !isRetiredArticle(portal, a.slug))
    .map((a) => ({
      ...a,
      portal,
      status: "PUBLISHED" as const,
      source: "CODE" as const,
    }));
}

/** Artículos de las fuentes de CÓDIGO de un portal (sin retirados, sin base de datos): para pruebas y lint. */
export function getStaticArticles(portal: Portal): BlogArticle[] {
  return staticArticlesFor(portal);
}

/**
 * Fusiona los artículos de PostgreSQL (o del caché de disco) con los de código, con la regla de
 * visibilidad y de precedencia en UN solo sitio: lo usan las variantes tolerante, estricta y
 * síncrona, para que no puedan divergir.
 */
function composeArticles(portal: Portal, stored: StoredBlogArticle[], includeUnpublished: boolean): BlogArticle[] {
  const dynamicArticles = stored.filter((a) => a.portal === portal);
  const filteredDynamic = includeUnpublished
    ? dynamicArticles
    : dynamicArticles.filter((a) => isPubliclyVisible(a));
  const dynamicSlugs = new Set(filteredDynamic.map((a) => a.slug));
  const nonOverriddenStatic = staticArticlesFor(portal).filter((a) => !dynamicSlugs.has(a.slug));
  // Orden: fecha descendente. DESEMPATE: Array.prototype.sort es estable (ES2019), así que a igual
  // fecha manda el orden de la lista de entrada: primero los de la base de datos, luego los del código
  // en el orden de su registro (articles/index.ts). No reordenes el registro sin querer cambiar los listados.
  return [...filteredDynamic, ...nonOverriddenStatic].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function pickStored(
  stored: StoredBlogArticle[],
  portal: Portal,
  slug: string,
  includeUnpublished: boolean,
): StoredBlogArticle | null {
  const match = stored.find((a) => a.portal === portal && a.slug === slug);
  if (!match) return null;
  if (includeUnpublished) return match;
  return isPubliclyVisible(match) ? match : null;
}

// Helper function to get article by slug and portal
export async function getArticle(
  portal: Portal,
  slug: string,
  includeUnpublished = false
): Promise<BlogArticle | null> {
  try {
    const stored = await getStoredArticles();
    if (stored.some((a) => a.portal === portal && a.slug === slug)) {
      return pickStored(stored, portal, slug, includeUnpublished);
    }
  } catch (e) {
    // Dynamic read fallback
  }

  if (isRetiredArticle(portal, slug)) return null;
  return getStaticArticleMap(portal)[slug] || null;
}

// Synchronous version for fallback
export function getArticleSync(
  portal: Portal,
  slug: string,
  includeUnpublished = false
): BlogArticle | null {
  try {
    const stored = getStoredArticlesSync();
    if (stored.some((a) => a.portal === portal && a.slug === slug)) {
      return pickStored(stored, portal, slug, includeUnpublished);
    }
  } catch (e) {
    // Fallback
  }

  if (isRetiredArticle(portal, slug)) return null;
  return getStaticArticleMap(portal)[slug] || null;
}

// Helper function to get all articles from a portal. TOLERANTE: si la base falla degrada a
// código/disco y deja señal (OPS-001). Para saber si el resultado está COMPLETO usa
// getAllArticlesStrict.
export async function getAllArticles(
  portal: Portal,
  includeUnpublished = false
): Promise<BlogArticle[]> {
  try {
    return composeArticles(portal, await getStoredArticles(), includeUnpublished);
  } catch (e) {
    // OPS-001: solo los artículos del código; el resto (base de datos) desaparece del sitio.
    const fromCode = staticArticlesFor(portal);
    reportDegradation("blog-articles-fallback", e, { portal, articlesFromCode: fromCode.length });
    return fromCode;
  }
}

/**
 * Igual que getAllArticles, mismo filtrado, misma fusión y misma precedencia, pero si la base
 * de datos falla LANZA: nunca devuelve un subconjunto sin avisar. Es lo que deben usar los
 * consumidores que necesitan el conjunto completo (sitemap, llms.txt, contadores).
 * No le pongas un try/catch: el comentario de getStoredArticlesStrict explica por qué.
 */
export async function getAllArticlesStrict(
  portal: Portal,
  includeUnpublished = false
): Promise<BlogArticle[]> {
  return composeArticles(portal, await getStoredArticlesStrict(), includeUnpublished);
}

// Synchronous version for fallback
export function getAllArticlesSync(
  portal: Portal,
  includeUnpublished = false
): BlogArticle[] {
  try {
    return composeArticles(portal, getStoredArticlesSync(), includeUnpublished);
  } catch (e) {
    return staticArticlesFor(portal);
  }
}

/** Los últimos `count` artículos publicados del portal, de TODAS las fuentes (portadas). */
export async function getLatestArticles(portal: Portal, count: number): Promise<BlogArticle[]> {
  return (await getAllArticles(portal)).slice(0, count);
}


// Helper function to generate table of contents
export function generateTOC(sections: BlogArticle["content"]["sections"]) {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    subsections:
      section.subsections?.map((sub) => ({
        id: sub.id,
        title: sub.title,
      })) || [],
  }));
}
