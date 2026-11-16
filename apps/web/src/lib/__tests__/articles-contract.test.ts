/**
 * Lint de contenido de TODAS las fuentes de código (ARQ-004).
 *
 * `.specify/scripts/lint-content.mjs` solo lee `lib/articles/<portal>/*.ts` (hoy 1 archivo): los
 * artículos de blog-articles.ts y new-*.ts nunca pasaban por el contrato Zod. Esta prueba valida
 * cada artículo publicado de cualquier fuente de código contra `blogArticleSchema`.
 *
 * Es un trinquete: las violaciones que ya existían se listan en KNOWN_VIOLATIONS con su motivo,
 * y solo pueden DISMINUIR (si arreglas un artículo, la prueba te obliga a quitarlo de la lista).
 * Cualquier artículo nuevo, o un artículo conocido que empeore, rompe la prueba. Arreglar los
 * artículos es contenido (cargo CONT); aquí solo se deja de ignorarlos.
 *
 * Los artículos que viven SOLO en PostgreSQL no se pueden leer sin base de datos: se validan
 * en la escritura (API de admin/agente), no aquí.
 */
import { describe, expect, it } from "vitest";
import { blogArticleSchema } from "@ia-next/contracts";
import { getStaticArticles } from "@/lib/blog-articles";
import { NEW_IA_ARTICLES_V2, NEW_AMBIENTAL_ARTICLES_V2 } from "@/lib/articles";

const PORTALS = ["ia", "ambiental"] as const;

/** slug → motivo. Medido el 2026-11-15 al crear esta prueba. */
const KNOWN_VIOLATIONS: Record<string, string> = {
};

const all = PORTALS.flatMap((portal) => getStaticArticles(portal).map((article) => ({ portal, article })));

describe("contrato de artículos (fuentes de código)", () => {
  it("hay artículos que validar", () => {
    expect(all.length).toBeGreaterThan(0);
  });

  it("cada artículo cumple blogArticleSchema, salvo las violaciones conocidas", () => {
    const unexpected = all
      .filter(({ article }) => !(article.slug in KNOWN_VIOLATIONS))
      .map(({ portal, article }) => ({ portal, slug: article.slug, result: blogArticleSchema.safeParse(article) }))
      .filter((r) => !r.result.success)
      .map((r) => `${r.portal}/${r.slug}: ${r.result.success ? "" : r.result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    expect(unexpected, "artículos nuevos o empeorados que no cumplen el contrato").toEqual([]);
  });

  it("las violaciones conocidas siguen siendo reales (si arreglas un artículo, quítalo de la lista)", () => {
    for (const slug of Object.keys(KNOWN_VIOLATIONS)) {
      const entry = all.find(({ article }) => article.slug === slug);
      expect(entry, `${slug} ya no existe: quítalo de KNOWN_VIOLATIONS`).toBeDefined();
      expect(blogArticleSchema.safeParse(entry!.article).success, `${slug} ya cumple el contrato: quítalo de KNOWN_VIOLATIONS`).toBe(false);
    }
  });

  it("los slugs son únicos entre portales y fuentes (constitución §7.1)", () => {
    const slugs = all.map(({ article }) => article.slug);
    const repeated = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
    expect(repeated).toEqual([]);
  });

  it("el registro articles/index.ts (flujo content:new) cumple el contrato sin excepciones y con readTime coherente", () => {
    for (const article of [...NEW_IA_ARTICLES_V2, ...NEW_AMBIENTAL_ARTICLES_V2]) {
      expect(blogArticleSchema.safeParse(article).success, article.slug).toBe(true);
      const text = [
        article.content.introduction,
        ...article.content.sections.flatMap((s) => [s.title, s.content, ...(s.subsections ?? []).flatMap((x) => [x.title, x.content])]),
        article.content.conclusion ?? "",
      ].join(" ");
      const expected = Math.ceil(text.split(/\s+/).filter(Boolean).length / 200);
      expect(Math.abs(article.readTime - expected), `${article.slug}: readTime ${article.readTime} vs ${expected} esperado`).toBeLessThanOrEqual(Math.max(1, Math.ceil(expected * 0.2)));
    }
  });
});
