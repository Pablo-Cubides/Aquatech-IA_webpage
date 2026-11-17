import { describe, expect, it } from "vitest";
import { blogArticleSchema, blogArticleBaseSchema, imageUrlSchema, httpUrlSchema } from "@ia-next/contracts";
import { getStaticArticles } from "@/lib/blog-articles";

/**
 * SEC-004b (ADR-0016): campos nuevos (dateModified, references), esquemas de URL y topes de longitud
 * del contrato canónico. Un artículo real y válido es el control positivo de cada caso.
 */
const base = getStaticArticles("ia")[0];
const valid = () => structuredClone(base) as Record<string, any>;
const fails = (article: unknown, path?: string) => {
  const result = blogArticleSchema.safeParse(article);
  expect(result.success).toBe(false);
  if (path && !result.success) {
    expect(result.error.issues.map((i) => i.path.join(".")).join(" | ")).toContain(path);
  }
};

describe("contrato canónico: control positivo", () => {
  it("un artículo real cumple el contrato", () => {
    expect(blogArticleSchema.safeParse(valid()).success).toBe(true);
  });
});

describe("dateModified y references (opcionales)", () => {
  it("sin ellos, los artículos actuales siguen cumpliendo", () => {
    const article = valid();
    delete article.dateModified;
    delete article.references;
    expect(blogArticleSchema.safeParse(article).success).toBe(true);
  });

  it("dateModified válido y no anterior a date", () => {
    const article = valid();
    article.dateModified = article.date;
    expect(blogArticleSchema.safeParse(article).success).toBe(true);
    article.dateModified = "2099-01-01";
    expect(blogArticleSchema.safeParse(article).success).toBe(true);
    article.dateModified = "1999-01-01";
    fails(article, "dateModified");
    article.dateModified = "no-es-fecha";
    fails(article, "dateModified");
  });

  it("references: forma, máximo de 50 y solo http(s)", () => {
    const ref = { title: "Resolución 2115 de 2007", url: "https://www.minsalud.gov.co/x", source: "MinSalud" };
    const article = valid();
    article.references = [ref, { ...ref, url: "http://www.ideam.gov.co/", description: "IDEAM" }];
    expect(blogArticleSchema.safeParse(article).success).toBe(true);
    article.references = Array.from({ length: 51 }, () => ref);
    fails(article, "references");
    for (const url of ["javascript:alert(1)", "data:text/html,<b>x</b>", "vbscript:x", "ftp://x.y/z", "https://a b", "//evil.example/x"]) {
      article.references = [{ ...ref, url }];
      fails(article, "references");
    }
    article.references = [{ ...ref, source: "" }];
    fails(article, "references");
  });
});

describe("URLs de imagen: solo https o ruta del sitio", () => {
  it.each(["/images/a.jpg", "https://res.cloudinary.com/x/image/upload/a.jpg"])("acepta %s", (url) => {
    expect(imageUrlSchema.safeParse(url).success).toBe(true);
  });

  it.each([
    "http://x.example/a.jpg",
    "httpfoo",
    "http:",
    "//evil.example/a.jpg",
    "javascript:alert(1)",
    "data:image/svg+xml;base64,AAAA",
    "/a b.jpg",
    "",
    "https://a b/c.jpg",
  ])("rechaza %j", (url) => {
    expect(imageUrlSchema.safeParse(url).success).toBe(false);
  });

  it("se aplica a heroImage, author.avatar y section.image", () => {
    for (const mutate of [
      (a: any) => (a.heroImage = "http://x.example/a.jpg"),
      (a: any) => (a.heroImage = "//evil.example/a.jpg"),
      (a: any) => (a.author.avatar = "javascript:alert(1)"),
      (a: any) => (a.content.sections[0].image = "data:image/png;base64,AAAA"),
    ]) {
      const article = valid();
      mutate(article);
      fails(article);
    }
  });

  it("httpUrlSchema acepta http y https", () => {
    expect(httpUrlSchema.safeParse("http://a.example").success).toBe(true);
    expect(httpUrlSchema.safeParse("https://a.example/b?c=d").success).toBe(true);
    expect(httpUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });
});

describe("topes de longitud (medidos contra los 11 artículos de código, los 6 de write-ia-articles.js y los 13 solo-BD)", () => {
  const cases: [string, (a: any) => void, string][] = [
    ["título > 200", (a) => (a.title = "t".repeat(201)), "title"],
    ["categoría > 80", (a) => (a.category = "c".repeat(81)), "category"],
    ["readTime > 180", (a) => (a.readTime = 181), "readTime"],
    ["etiqueta > 40", (a) => (a.tags[0] = "x".repeat(41)), "tags"],
    ["introducción > 10000", (a) => (a.content.introduction = "i".repeat(10_001)), "content.introduction"],
    ["sección > 20000", (a) => (a.content.sections[0].content = "s".repeat(20_001)), "content.sections.0.content"],
    ["más de 60 secciones", (a) => (a.content.sections = Array.from({ length: 61 }, (_, i) => ({ ...a.content.sections[0], id: `s-${i}` }))), "content.sections"],
    ["bio de autor > 500", (a) => (a.author.bio = "b".repeat(501)), "author.bio"],
    ["callout > 4000", (a) => (a.content.sections[0].callout = { type: "info", title: "t", content: "c".repeat(4_001) }), "callout"],
  ];

  it.each(cases)("rechaza %s", (_label, mutate, path) => {
    const article = valid();
    mutate(article);
    fails(article, path);
  });

  it("las etiquetas siguen siendo 3-7 (ADR-0015): el contrato NO cambia ese límite", () => {
    const article = valid();
    article.tags = ["a", "b"];
    fails(article, "tags");
    article.tags = ["a", "b", "c", "d", "e", "f", "g", "h"];
    fails(article, "tags");
    article.tags = ["a", "b", "c"];
    expect(blogArticleSchema.safeParse(article).success).toBe(true);
    article.tags = ["a", "b", "c", "d", "e", "f", "g"];
    expect(blogArticleSchema.safeParse(article).success).toBe(true);
  });
});

describe("blogArticleBaseSchema permite derivar subesquemas", () => {
  it("pick() funciona (el esquema con refinamiento no lo permitiría en Zod 4)", () => {
    const tagsOnly = blogArticleBaseSchema.pick({ tags: true });
    expect(tagsOnly.safeParse({ tags: ["a", "b", "c"] }).success).toBe(true);
    expect(tagsOnly.safeParse({ tags: ["a"] }).success).toBe(false);
  });
});
