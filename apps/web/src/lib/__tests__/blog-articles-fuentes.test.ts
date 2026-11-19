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
  // Si este test falla, hay un slug repetido dentro del registro articles/index.ts de un portal.
  // Borra o renombra el duplicado: no se resuelve con el orden de la lista.
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

describe("orden del listado: fecha descendente y, a igual fecha, el orden del registro (ARQ-007)", () => {
  const cases = [
    ["ia", NEW_IA_ARTICLES_V2],
    ["ambiental", NEW_AMBIENTAL_ARTICLES_V2],
  ] as const;

  it.each(cases)("en %s, los artículos del registro salen por fecha descendente", (portal, registry) => {
    const registered = new Set(registry.map((a) => a.slug));
    const dates = getAllArticlesSync(portal)
      .filter((a) => registered.has(a.slug))
      .map((a) => a.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it.each(cases)("en %s, con la misma fecha manda el orden de articles/index.ts", (portal, registry) => {
    const listed = getAllArticlesSync(portal).map((a) => a.slug);
    const byDate = new Map<string, string[]>();
    for (const a of registry) byDate.set(a.date, [...(byDate.get(a.date) ?? []), a.slug]);
    for (const slugs of byDate.values()) {
      expect(listed.filter((slug) => slugs.includes(slug))).toEqual(slugs);
    }
  });

  it("hoy hay empates reales que este orden resuelve (si deja de haberlos, el test no protege nada)", () => {
    const tied = [...NEW_AMBIENTAL_ARTICLES_V2.reduce((m, a) => m.set(a.date, (m.get(a.date) ?? 0) + 1), new Map<string, number>()).values()];
    expect(Math.max(...tied)).toBeGreaterThan(1);
  });
});
