import { describe, expect, it } from "vitest";
import { getAllArticles } from "../blog-articles";
import { getAllCategorySlugs, getArticlesByCategory, mapArticleCategoryToSeoCategory } from "../blog-seo";

describe("mapArticleCategoryToSeoCategory", () => {
  it("reconoce el slug de la categoria SEO que envia la API", () => {
    expect(mapArticleCategoryToSeoCategory("ia", "fundamentos-inteligencia-artificial")?.slug).toBe(
      "fundamentos-inteligencia-artificial",
    );
    expect(mapArticleCategoryToSeoCategory("ambiental", "nuevas-tecnologias-ambientales")?.slug).toBe(
      "nuevas-tecnologias-ambientales",
    );
  });

  it("asigna categorias sueltas a la categoria SEO que corresponde", () => {
    expect(mapArticleCategoryToSeoCategory("ia", "LLMs")?.slug).toBe("modelos-lenguaje-asistentes-llm");
    expect(mapArticleCategoryToSeoCategory("ambiental", "Normatividad Ambiental")?.slug).toBe(
      "normatividad-ambiental",
    );
  });

  it("nunca devuelve una categoria oculta (noindex)", () => {
    for (const label of ["Agentes de IA", "Visión por Computadora", "Seguridad", "Desarrollo Web", "algo raro"]) {
      const category = mapArticleCategoryToSeoCategory("ia", label);
      expect(category, label).not.toBeNull();
      expect(category?.noindex, label).toBeFalsy();
    }
  });

  it("deja el mapeo antiguo intacto", () => {
    expect(mapArticleCategoryToSeoCategory("ia", "Computer Vision")?.slug).toBe(
      "generadores-imagenes-contenido-creativo-ia",
    );
  });

  it("cada articulo publicado cae en una categoria y las categorias indexables suman todos los articulos", async () => {
    for (const portal of ["ia", "ambiental"] as const) {
      const all = await getAllArticles(portal);
      let counted = 0;
      for (const slug of getAllCategorySlugs(portal)) {
        counted += (await getArticlesByCategory(portal, slug)).length;
      }
      expect(counted, portal).toBe(all.length);
    }
  });
});
