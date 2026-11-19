import { describe, expect, it } from "vitest";
import article from "@/lib/articles/ia/tokens-en-espanol-medicion-reproducible";
import { renderSafeRichText } from "@/lib/security/safe-rich-text";

const render = (markdown: string) => renderSafeRichText(markdown, "font-bold");

const textoPlano = (markdown: string) =>
  markdown
    .replace(/\*\*|\*|`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

const palabras = () => {
  const { introduction, sections, conclusion } = article.content;
  let total = textoPlano(introduction).split(" ").length + textoPlano(conclusion ?? "").split(" ").length;
  for (const s of sections) {
    total += textoPlano(s.title).split(" ").length + textoPlano(s.content).split(" ").length;
    if (s.callout) total += textoPlano(s.callout.title).split(" ").length + textoPlano(s.callout.content).split(" ").length;
    for (const t of s.subsections ?? []) total += textoPlano(t.title).split(" ").length + textoPlano(t.content).split(" ").length;
  }
  return total;
};

describe("artículo: tokens en español (medición reproducible)", () => {
  it("el readTime es ceil(palabras / 200), dentro de ±20 %", () => {
    const esperado = Math.ceil(palabras() / 200);
    expect(Math.abs(article.readTime - esperado) / esperado).toBeLessThanOrEqual(0.2);
  });

  it("enlaza a la herramienta como-funcionan-llm y a un artículo existente", () => {
    const todo = JSON.stringify(article.content);
    expect(todo).toContain("/ia/herramientas/como-funcionan-llm");
    expect(todo).toContain("/ia/blog/que-es-un-modelo-de-lenguaje");
  });

  it("los bloques de código se muestran sin cursivas ni enlaces fantasma", () => {
    const seccion = article.content.sections.find((s) => s.id === "como-repetirlo");
    expect(seccion).toBeDefined();
    const bloques = seccion!.content.split("\n\n").filter((p) => /import |tiktoken\./.test(p));
    expect(bloques.length).toBeGreaterThanOrEqual(3);
    for (const bloque of bloques) {
      // safe-rich-text interpreta * como cursiva y [x](y) como enlace: el código no debe contener ni uno ni otro.
      expect(bloque).not.toContain("*");
      expect(bloque).not.toMatch(/\]\(/);
      const html = render(bloque);
      expect(html).not.toContain("<em>");
      expect(html).not.toContain("<a ");
    }
  });

  it("los hashes de los textos fuente y los conteos esperados están en el artículo", () => {
    const seccion = article.content.sections.find((s) => s.id === "como-repetirlo")!.content;
    for (const hash of [
      "e99b5319f10122cbf007fd4ba57876b333be65d96e1ee81100eff907640432c2",
      "42afc6d9006789c91000a2453b464d590106b4de3a5752b27caf1e351317469f",
      "848e26527f8e44af3d1c45c5ec8d1d56b69ba15df6834fce6b03c4f51d18db58",
      "56da119f153923989e3e5e4fad66f1282c782bb5164714e26f2ecd13f6901e62",
    ]) {
      expect(seccion).toContain(hash);
    }
    expect(seccion).toContain("cl100k_base es: 2879 en: 1971");
    expect(seccion).toContain("cl100k_base es: 3244 en: 1840");
  });

  it("no cita precios ni afirma nada sobre otros modelos", () => {
    const todo = JSON.stringify(article.content).toLowerCase();
    expect(todo).not.toMatch(/\bprecio de\b|usd|us\$|dólares por/);
    expect(todo).not.toContain("claude");
  });
});
