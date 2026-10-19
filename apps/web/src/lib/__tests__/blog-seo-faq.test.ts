import { describe, expect, it } from "vitest";
import { extractFaqs, generateArticleSchema, generateFaqSchema } from "../blog-seo";
import { fitTitle } from "../seo-title";
import type { BlogArticle } from "../blog-articles";

const article = (sections: BlogArticle["content"]["sections"], extra: Partial<BlogArticle> = {}): BlogArticle => ({
  slug: "a",
  title: "Titulo",
  category: "x",
  date: "2026-10-12",
  readTime: 5,
  excerpt: "Resumen",
  heroImage: "https://res.cloudinary.com/x/y.jpg",
  author: { name: "Pablo Cubides", avatar: "" },
  content: { introduction: "Intro", sections },
  tags: ["a"],
  ...extra,
});

describe("extractFaqs", () => {
  it("lee las preguntas de la seccion Preguntas frecuentes a partir del markdown del agente", () => {
    const faqs = extractFaqs(
      article([
        { id: "uno", title: "Uno", content: "texto" },
        {
          id: "preguntas-frecuentes",
          title: "Preguntas frecuentes",
          content: "### ¿Que es el IRCA?\n\nEs el indice de riesgo de la calidad del agua para consumo humano.\n\n### ¿Quien lo calcula?\n\nLa autoridad sanitaria de cada municipio con los resultados de laboratorio.",
        },
      ]),
    );
    expect(faqs).toHaveLength(2);
    expect(faqs[0].question).toBe("¿Que es el IRCA?");
    expect(faqs[1].answer).toContain("autoridad sanitaria");
    expect(generateFaqSchema(faqs)["@type"]).toBe("FAQPage");
  });

  it("sin seccion de preguntas no inventa nada", () => {
    expect(extractFaqs(article([{ id: "uno", title: "Uno", content: "texto" }]))).toEqual([]);
  });
});

describe("generateArticleSchema", () => {
  it("dateModified nunca queda antes de datePublished", () => {
    const schema = generateArticleSchema(article([], { date: "2026-10-12" }), "ia", "https://aquatechia.com");
    expect(schema.dateModified).toBe("2026-10-12");
    expect(schema.author.url).toBe("https://aquatechia.com/ia/autor");
  });
});

describe("fitTitle", () => {
  it("deja los titulos cortos y acorta los largos sin cortar palabras", () => {
    expect(fitTitle("Que es un modelo de lenguaje")).toBe("Que es un modelo de lenguaje");
    const long = fitTitle("Cuanta agua consume la inteligencia artificial en los centros de datos y como reducir su huella hidrica");
    expect(long.length).toBeLessThanOrEqual(60);
    expect(long.endsWith(" ")).toBe(false);
  });
  it("prefiere cortar en dos puntos cuando deja un titulo con sentido", () => {
    expect(fitTitle("Matriz de Leopold y Conesa: como evaluar el impacto ambiental de un proyecto paso a paso con ejemplos")).toBe("Matriz de Leopold y Conesa");
    // un encabezado demasiado corto (<25) no se usa solo: se corta por palabra completa
    expect(fitTitle("Calculadora IRCA: como medir la calidad del agua potable segun la normativa colombiana vigente")).toBe("Calculadora IRCA: como medir la calidad del agua potable");
  });
});
