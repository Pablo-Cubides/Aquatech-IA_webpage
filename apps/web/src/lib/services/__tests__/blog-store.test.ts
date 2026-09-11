import { describe, it, expect } from "vitest";
import {
  parseMarkdownToSections,
  slugify,
  createStoredArticle,
  deleteStoredArticle,
} from "../blog-store";
import { getArticle, getAllArticles } from "../../blog-articles";

describe("Blog Store & Scheduling Logic", () => {
  it("slugify creates url-safe lowercase slugs without accents", () => {
    expect(slugify("¿Cómo funciona la Inteligencia Artificial?")).toBe(
      "como-funciona-la-inteligencia-artificial"
    );
  });

  it("parseMarkdownToSections extracts introduction, headings, and conclusion", () => {
    const markdown = `# Título Principal
Esta es la introducción del post.

## Primera Sección
Contenido de la primera sección.

## Conclusión
Resumen final del artículo.`;

    const parsed = parseMarkdownToSections(markdown);
    expect(parsed.introduction).toBe("Esta es la introducción del post.");
    expect(parsed.sections).toHaveLength(1);
    expect(parsed.sections[0].title).toBe("Primera Sección");
    expect(parsed.conclusion).toBe("Resumen final del artículo.");
  });

  it("assigns SCHEDULED status when publishedAt is in the future", async () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(); // 1 year ahead
    const article = await createStoredArticle({
      portal: "ia",
      title: "Artículo Futuro 2099",
      excerpt: "Prueba futura",
      content: "Contenido",
      publishedAt: futureDate,
      // Note: status is omitted, letting the function decide
    });

    expect(article.status).toBe("SCHEDULED");
    await deleteStoredArticle(article.id);
  });

  it("assigns SCHEDULED status even if status was accidentally sent as PUBLISHED for a future date", async () => {
    const futureDate = "2099-01-01T00:00:00.000Z";
    const article = await createStoredArticle({
      portal: "ia",
      title: "Artículo Futuro Forzado 2099",
      excerpt: "Prueba futura",
      content: "Contenido",
      publishedAt: futureDate,
      status: "PUBLISHED",
    });

    expect(article.status).toBe("SCHEDULED");
    await deleteStoredArticle(article.id);
  });

  it("hides future-dated articles from public getArticle and getAllArticles", async () => {
    const futureDate = "2099-12-31T23:59:59.000Z";
    const created = await createStoredArticle({
      portal: "ia",
      title: "Post Secreto Futuro 2099",
      excerpt: "Oculto para el público",
      content: "No debe verse públicamente",
      publishedAt: futureDate,
    });

    try {
      // 1. Public lookup by slug must return null (404)
      const publicResult = await getArticle("ia", created.slug);
      expect(publicResult).toBeNull();

      // 2. Admin lookup with includeUnpublished=true must find it
      const adminResult = await getArticle("ia", created.slug, true);
      expect(adminResult).not.toBeNull();
      expect(adminResult?.title).toBe("Post Secreto Futuro 2099");

      // 3. Public list must not contain the future article
      const publicList = await getAllArticles("ia");
      const foundInPublicList = publicList.some((a) => a.slug === created.slug);
      expect(foundInPublicList).toBe(false);

      // 4. Admin list with includeUnpublished=true must contain it
      const adminList = await getAllArticles("ia", true);
      const foundInAdminList = adminList.some((a) => a.slug === created.slug);
      expect(foundInAdminList).toBe(true);
    } finally {
      await deleteStoredArticle(created.id);
    }
  });
});

