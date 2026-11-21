/**
 * VIS-007: fechas de artículos con zona (convención de formato) y sin `dateModified` inventado.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { MetadataRoute } from "next";
import { generateArticleSchema, generateCategorySchema } from "@/lib/blog-seo";
import { getStaticArticles, type BlogArticle } from "@/lib/blog-articles";
import { realModifiedDate, toSchemaDateTime } from "../article-dates";
import { renderArticle } from "../llms";

vi.mock("@/lib/blog-articles", async () => {
  const actual = await vi.importActual<typeof import("@/lib/blog-articles")>("@/lib/blog-articles");
  return { ...actual, getArticle: vi.fn(), getAllArticles: vi.fn(async () => []) };
});

const SRC = path.resolve(__dirname, "../../..");
const ZONED = /^\d{4}-\d{2}-\d{2}T00:00:00-05:00$/;

const base = getStaticArticles("ia")[0];
const articleWith = (patch: Partial<BlogArticle>): BlogArticle => ({ ...base, ...patch }) as BlogArticle;

describe("toSchemaDateTime", () => {
  it("un día suelto es la medianoche de Colombia", () => {
    expect(toSchemaDateTime("2026-11-15")).toBe("2026-11-15T00:00:00-05:00");
  });
  it("respeta un valor que ya trae hora y zona", () => {
    expect(toSchemaDateTime("2026-11-15T10:30:00Z")).toBe("2026-11-15T10:30:00Z");
    expect(toSchemaDateTime("2026-11-15T10:30:00-05:00")).toBe("2026-11-15T10:30:00-05:00");
  });
  it("un valor inválido o vacío no se emite", () => {
    for (const bad of ["", undefined, null, "no-es-fecha", "2026-13-45"]) expect(toSchemaDateTime(bad)).toBeUndefined();
  });
});

describe("realModifiedDate: sin respaldo", () => {
  it("sin dateModified no hay fecha de modificación", () => {
    expect(realModifiedDate({ date: "2026-11-15" })).toBeUndefined();
    expect(realModifiedDate({ date: "2026-11-15", dateModified: "" })).toBeUndefined();
    expect(realModifiedDate({ date: "2026-11-15", dateModified: null })).toBeUndefined();
  });
  it("una fecha real posterior se conserva tal cual se guardó", () => {
    expect(realModifiedDate({ date: "2026-04-07", dateModified: "2026-11-21" })).toBe("2026-11-21");
  });
  it("una igualdad explícita se respeta (la escribió alguien); solo se elimina la ausencia", () => {
    expect(realModifiedDate({ date: "2026-11-15", dateModified: "2026-11-15" })).toBe("2026-11-15");
  });
  it("nunca es anterior a la publicación", () => {
    expect(realModifiedDate({ date: "2026-11-15", dateModified: "2026-11-14" })).toBeUndefined();
  });
  it("una fecha inválida no cuenta", () => {
    expect(realModifiedDate({ date: "2026-11-15", dateModified: "basura" })).toBeUndefined();
  });
});

describe("JSON-LD del artículo", () => {
  it("sin dateModified real: no emite dateModified (y datePublished lleva zona)", () => {
    const schema = generateArticleSchema(articleWith({ date: "2026-11-15", dateModified: undefined }), "ia", "https://aquatechia.com");
    expect(schema).not.toHaveProperty("dateModified");
    expect(schema.datePublished).toMatch(ZONED);
  });
  it("con dateModified real: lo emite con zona", () => {
    const schema = generateArticleSchema(articleWith({ date: "2026-04-07", dateModified: "2026-11-21" }), "ambiental", "https://aquatechia.com");
    expect(schema.datePublished).toBe("2026-04-07T00:00:00-05:00");
    expect(schema.dateModified).toBe("2026-11-21T00:00:00-05:00");
  });
  it("dateModified anterior a datePublished no se emite", () => {
    const schema = generateArticleSchema(articleWith({ date: "2026-11-15", dateModified: "2026-01-01" }), "ia", "https://aquatechia.com");
    expect(schema).not.toHaveProperty("dateModified");
  });
  it("la lista de una categoría también usa la fecha con zona", () => {
    const category = { slug: "c", name: "C", description: "d", metaTitle: "t", metaDescription: "m" } as Parameters<typeof generateCategorySchema>[0];
    const schema = generateCategorySchema(category, "ia", [articleWith({ date: "2026-11-15" })]);
    const item = (schema.mainEntity.itemListElement[0] as { item: { datePublished: string } }).item;
    expect(item.datePublished).toMatch(ZONED);
  });
  it("ningún artículo de código emite dateModified anterior a datePublished, y solo lo emiten los que lo declaran", () => {
    for (const portal of ["ia", "ambiental"] as const) {
      for (const article of getStaticArticles(portal)) {
        const schema = generateArticleSchema(article, portal, "https://aquatechia.com");
        if (article.dateModified) {
          expect(Date.parse(schema.dateModified as string), article.slug).toBeGreaterThanOrEqual(Date.parse(schema.datePublished as string));
        } else {
          expect(schema, article.slug).not.toHaveProperty("dateModified");
        }
      }
    }
  });
});

describe("llms-full y .md", () => {
  it("«Actualizado» solo con fecha real", () => {
    const without = renderArticle(articleWith({ date: "2026-11-15", dateModified: undefined }), "ia", "https://aquatechia.com");
    expect(without).toContain("- Publicado: 2026-11-15");
    expect(without).not.toContain("- Actualizado:");
    const withDate = renderArticle(articleWith({ date: "2026-04-07", dateModified: "2026-11-21" }), "ia", "https://aquatechia.com");
    expect(withDate).toContain("- Actualizado: 2026-11-21");
  });
});

describe("metadatos Open Graph de las páginas de artículo", () => {
  const cases = [
    { portal: "ia" as const, load: () => import("@/app/(portals)/ia/(marketing)/blog/[slug]/page") },
    { portal: "ambiental" as const, load: () => import("@/app/(portals)/ambiental/(marketing)/blog/[slug]/page") },
  ];
  for (const { portal, load } of cases) {
    const article = getStaticArticles(portal).find((item) => item.dateModified) ?? getStaticArticles(portal)[0];
    const og = async (patch: Partial<BlogArticle>) => {
      const { getArticle } = await import("@/lib/blog-articles");
      vi.mocked(getArticle).mockResolvedValue({ ...article, ...patch } as BlogArticle);
      const page = await load();
      const metadata = await page.generateMetadata({ params: Promise.resolve({ slug: article.slug }) });
      return metadata.openGraph as { publishedTime?: string; modifiedTime?: string };
    };
    it(`${portal}: publishedTime con zona y modifiedTime solo con fecha real`, async () => {
      const without = await og({ date: "2026-11-15", dateModified: undefined });
      expect(without.publishedTime).toMatch(ZONED);
      expect(without.modifiedTime).toBeUndefined();
      const withDate = await og({ date: "2026-04-07", dateModified: "2026-11-21" });
      expect(withDate.modifiedTime).toBe("2026-11-21T00:00:00-05:00");
    });
  }
});

describe("sitemap: lastmod coherente con el JSON-LD", () => {
  it("usa la fecha de modificación real o, si no, la de publicación, y la misma instante que el JSON-LD", async () => {
    vi.resetModules();
    vi.doMock("@/lib/articles-for-indexing", () => ({
      getArticlesForIndexing: async (portal: string) =>
        portal === "ia"
          ? [
              { ...base, slug: "sin-modificacion", date: "2026-11-15", dateModified: undefined },
              { ...base, slug: "con-modificacion", date: "2026-04-07", dateModified: "2026-11-21" },
            ]
          : [],
    }));
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = (await sitemap()) as MetadataRoute.Sitemap;
    const find = (slug: string) => entries.find((entry) => entry.url.endsWith(`/ia/blog/${slug}`));
    const sin = find("sin-modificacion")?.lastModified as Date;
    const con = find("con-modificacion")?.lastModified as Date;
    expect(sin.getTime()).toBe(Date.parse("2026-11-15T00:00:00-05:00"));
    expect(con.getTime()).toBe(Date.parse("2026-11-21T00:00:00-05:00"));
    vi.doUnmock("@/lib/articles-for-indexing");
  });
});

describe("guarda estática: el respaldo de dateModified no vuelve", () => {
  function walk(dir: string, out: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === "__tests__" || entry.name === "articles") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, out);
      else if (/\.(tsx?|mjs)$/.test(entry.name) && !/\.test\./.test(entry.name)) out.push(full);
    }
    return out;
  }
  it("ningún archivo rellena dateModified/modifiedTime con la fecha de publicación", () => {
    const offenders = walk(SRC).filter((file) => {
      const text = fs.readFileSync(file, "utf8");
      return /dateModified\s*\|\|/.test(text) || /modifiedTime:[^\n]*\|\|\s*article\.date/.test(text) || /updated\s*=\s*article\.dateModified\s*\|\|/.test(text);
    });
    expect(offenders.map((file) => path.relative(SRC, file))).toEqual([]);
  });
});
