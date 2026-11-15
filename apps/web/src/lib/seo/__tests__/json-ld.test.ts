import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it } from "vitest";
import { ToolStructuredData, WebPageStructuredData } from "@/components/seo/StructuredData";
import { generateArticleSchema, extractFaqs } from "@/lib/blog-seo";
import { AMBIENTAL_ARTICLES } from "@/lib/blog-articles";

const jsonLd = (element: React.ReactElement) => {
  const html = renderToStaticMarkup(element);
  const raw = html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? "{}";
  return JSON.parse(raw.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'"));
};

describe("JSON-LD sin fechas inventadas", () => {
  it("WebPage y SoftwareApplication omiten las fechas si no se pasan", () => {
    const page = jsonLd(React.createElement(WebPageStructuredData, { description: "d", url: "https://aquatechia.com/x" }));
    const tool = jsonLd(React.createElement(ToolStructuredData, { name: "n", description: "d", url: "https://aquatechia.com/x" }));
    for (const data of [page, tool]) {
      expect(data).not.toHaveProperty("datePublished");
      expect(data).not.toHaveProperty("dateModified");
    }
  });

  it("emiten la fecha cuando es real", () => {
    const page = jsonLd(React.createElement(WebPageStructuredData, { description: "d", url: "https://aquatechia.com/x", dateModified: "2026-01-02" }));
    expect(page.dateModified).toBe("2026-01-02");
  });
});

describe("Article JSON-LD", () => {
  const article = Object.values(AMBIENTAL_ARTICLES)[0];

  it("la imagen es URL absoluta", () => {
    const schema = generateArticleSchema(article, "ambiental", "https://aquatechia.com");
    expect(schema.image).toMatch(/^https:\/\/aquatechia\.com\//);
  });

  it("las respuestas de FAQ salen sin Markdown", () => {
    for (const faq of extractFaqs(article)) expect(faq.answer).not.toMatch(/\*\*|\]\(/);
  });
});
