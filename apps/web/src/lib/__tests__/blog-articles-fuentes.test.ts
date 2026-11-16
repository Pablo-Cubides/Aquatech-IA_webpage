import { describe, expect, it } from "vitest";
import { NEW_AMBIENTAL_ARTICLES_V2, NEW_IA_ARTICLES_V2 } from "@/lib/articles";
import { findStaticSlugCollisions, getAllArticlesSync, getArticleSync } from "@/lib/blog-articles";

const SLUG_N11 = "tokens-en-espanol-medicion-reproducible";

describe("fuentes estáticas de artículos: articles/index.ts está conectado", () => {
  it("un artículo registrado en articles/index.ts se resuelve por slug en su portal", () => {
    const article = getArticleSync("ia", SLUG_N11);
    expect(article).not.toBeNull();
    expect(article?.slug).toBe(SLUG_N11);
    expect(article?.title).toContain("Tokens en español");
  });

  it("aparece en el listado de su portal y no en el del otro", () => {
    expect(getAllArticlesSync("ia").map((a) => a.slug)).toContain(SLUG_N11);
    expect(getAllArticlesSync("ambiental").map((a) => a.slug)).not.toContain(SLUG_N11);
    expect(getArticleSync("ambiental", SLUG_N11)).toBeNull();
  });

  it("todos los artículos de articles/index.ts llegan al listado de su portal", () => {
    const ia = new Set(getAllArticlesSync("ia").map((a) => a.slug));
    const ambiental = new Set(getAllArticlesSync("ambiental").map((a) => a.slug));
    for (const a of NEW_IA_ARTICLES_V2) expect(ia.has(a.slug)).toBe(true);
    for (const a of NEW_AMBIENTAL_ARTICLES_V2) expect(ambiental.has(a.slug)).toBe(true);
  });
});

describe("fuentes estáticas de artículos: colisiones de slug", () => {
  // Si este test falla, hay un slug repetido entre blog-articles.ts, new-*-articles.ts y articles/index.ts.
  // No se resuelve cambiando el orden de fusión a ojo: es una decisión de arquitectura (ARQ-004).
  it("ningún slug se repite entre las fuentes estáticas de un mismo portal", () => {
    expect(findStaticSlugCollisions("ia")).toEqual([]);
    expect(findStaticSlugCollisions("ambiental")).toEqual([]);
  });

  it("los slugs de articles/index.ts no existen en el otro portal (BR-001: slug único global)", () => {
    const ia = new Set(getAllArticlesSync("ia").map((a) => a.slug));
    for (const a of NEW_AMBIENTAL_ARTICLES_V2) expect(ia.has(a.slug)).toBe(false);
    const ambiental = new Set(getAllArticlesSync("ambiental").map((a) => a.slug));
    for (const a of NEW_IA_ARTICLES_V2) expect(ambiental.has(a.slug)).toBe(false);
  });
});
