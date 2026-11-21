/**
 * VIS-007: llms-full.txt y el .md conservan la URL de los enlaces del texto de los artículos (y solo de los artículos).
 */
import { describe, expect, it } from "vitest";
import { getStaticArticles, type BlogArticle } from "@/lib/blog-articles";
import { renderArticle, renderTool } from "../llms";
import { getToolsByPortal } from "@/lib/services/tools-registry";

const BASE = "https://aquatechia.com";
const base = getStaticArticles("ia")[0];
const withIntro = (introduction: string): BlogArticle => ({ ...base, content: { ...base.content, introduction, sections: [] } }) as BlogArticle;

describe("renderArticle conserva los destinos citables", () => {
  it("un enlace externo sale como `texto (url)`", () => {
    const out = renderArticle(withIntro("Referencia del estudio: [Repositorio UTadeo](https://expeditiorepositorio.utadeo.edu.co/entities/publication/110fcfae)"), "ambiental", BASE);
    expect(out).toContain("Referencia del estudio: Repositorio UTadeo (https://expeditiorepositorio.utadeo.edu.co/entities/publication/110fcfae)");
  });

  it("una ruta del sitio sale absoluta con la base", () => {
    const out = renderArticle(withIntro("Usa la [calculadora](/ambiental/herramientas/indice-calidad-agua)."), "ambiental", BASE);
    expect(out).toContain("calculadora (https://aquatechia.com/ambiental/herramientas/indice-calidad-agua)");
  });

  it("los destinos peligrosos o no citables solo dejan el texto", () => {
    const out = renderArticle(withIntro("[a](javascript:alert) [b](&#106;avascript:alert) [c](mailto:x@y.co) [d](#ancla)"), "ia", BASE);
    expect(out).toContain("a b c d");
    expect(out).not.toMatch(/javascript|mailto|#ancla/);
  });

  it("cada artículo de código: todo destino que aparece entre paréntesis tras un texto es http(s) sin espacios", () => {
    for (const portal of ["ia", "ambiental"] as const) {
      for (const article of getStaticArticles(portal)) {
        const out = renderArticle(article, portal, BASE);
        expect(out, article.slug).not.toMatch(/\]\(/); // ningún Markdown de enlace sin resolver
        for (const match of out.matchAll(/ \((https?:[^)\s]*)\)/g)) expect(match[1], article.slug).toMatch(/^https?:\/\/[^\s()<>"']+$/);
      }
    }
  });

  it("el artículo de la borra de café (con su enlace a la revista) lo lleva en el texto", () => {
    const article = getStaticArticles("ambiental").find((item) => item.slug === "superpoder-borra-cafe-limpiar-agua");
    expect(article).toBeTruthy();
    if (!article) return;
    expect(renderArticle(article, "ambiental", BASE)).toContain("(https://revistas.utadeo.edu.co/index.php/mutis/article/view/953)");
  });
});

describe("las herramientas NO usan keepLinks", () => {
  it("renderTool no añade URLs entre paréntesis a las guías", () => {
    for (const portal of ["ia", "ambiental"] as const) {
      for (const tool of getToolsByPortal(portal)) {
        const out = renderTool(tool, BASE);
        expect(out, tool.slug).not.toMatch(/\S \(https?:\/\/[^\s)]+\)/);
      }
    }
  });
});
