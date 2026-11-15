import { beforeAll, describe, expect, it, vi } from "vitest";

// Sin base de datos en pruebas: solo los articulos publicados en codigo.
vi.mock("@/lib/services/blog-store", () => ({
  getStoredArticles: async () => [],
  getStoredArticlesSync: () => [],
}));

import { getAllArticles } from "@/lib/blog-articles";
import { getToolsByPortal } from "@/lib/services/tools-registry";
import { toPlainText } from "@/lib/text/plain-text";
import { TOOL_SPECS } from "../tool-specs";
import { buildLlmsFullTxt, buildLlmsTxt } from "../llms";

const BASE = "https://aquatechia.com";

describe("llms.txt y llms-full.txt", () => {
  let full = "";
  let index = "";
  let started = 0;
  let elapsedMs = 0;

  beforeAll(async () => {
    started = performance.now();
    full = await buildLlmsFullTxt(BASE);
    elapsedMs = performance.now() - started;
    index = await buildLlmsTxt(BASE);
  });

  it("genera llms-full.txt en menos de 2 s y de un tamaño de decenas a cientos de KB", () => {
    expect(elapsedMs).toBeLessThan(2000);
    expect(Buffer.byteLength(full)).toBeGreaterThan(80_000);
  });

  it("incluye cada articulo con titulo, URL canonica, fechas, autor y portal", async () => {
    for (const portal of ["ia", "ambiental"] as const) {
      for (const article of await getAllArticles(portal)) {
        expect(full, article.slug).toContain(`- URL canónica: ${BASE}/${portal}/blog/${article.slug}`);
        expect(full, article.slug).toContain(`### ${toPlainText(article.title)}`);
        expect(full, article.slug).toContain(`- Publicado: ${article.date}`);
        expect(full, article.slug).toContain(`- Autor: ${article.author.name}`);
      }
    }
  });

  it("lleva el cuerpo completo: cada seccion y subseccion de cada articulo aparece con su texto", async () => {
    const flat = full.replace(/\s+/g, " ");
    for (const portal of ["ia", "ambiental"] as const) {
      for (const article of await getAllArticles(portal)) {
        for (const section of article.content.sections) {
          expect(full, `${article.slug}: ${section.title}`).toContain(toPlainText(section.title));
          const firstLine = toPlainText(section.content, { multiline: true }).split("\n").find((line) => line.trim().length > 20) ?? "";
          const probe = firstLine.replace(/\s+/g, " ").slice(0, 60);
          if (probe) expect(flat, `${article.slug}: ${section.title}`).toContain(probe);
        }
      }
    }
  });

  it("no contiene HTML, negritas ni enlaces Markdown sueltos", () => {
    expect(full).not.toMatch(/\*\*/);
    expect(full).not.toMatch(/<\/?(p|div|ul|li|strong|em|a|span|br|h\d)[ >/]/i);
    expect(full).not.toMatch(/\]\(https?:/);
    expect(full).not.toMatch(/&(nbsp|amp|lt|gt|quot);/);
  });

  it("describe las herramientas del registro con URL canonica, qué calcula, metodologia y datos", () => {
    const tools = [...getToolsByPortal("ia"), ...getToolsByPortal("ambiental")];
    expect(tools.length).toBeGreaterThanOrEqual(12);
    for (const tool of tools) {
      expect(TOOL_SPECS[tool.slug], `ficha de ${tool.slug}`).toBeDefined();
      expect(full).toContain(`- URL canónica: ${BASE}${tool.url}`);
    }
    expect(full).toContain("Resolución 2115 de 2007");
    expect(full).toContain("- Norma o metodología que implementa:");
    expect(full).toContain("- Datos que necesita:");
  });

  it("llms.txt es un indice breve que apunta a llms-full.txt", () => {
    expect(index).toContain(`${BASE}/llms-full.txt`);
    expect(Buffer.byteLength(index)).toBeLessThan(12_000);
    expect(index).toMatch(/^# AquatechIA/);
  });
});
