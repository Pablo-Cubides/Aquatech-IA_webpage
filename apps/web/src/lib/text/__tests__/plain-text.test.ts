import { describe, expect, it } from "vitest";
import { guidesData } from "@/lib/guides-data";
import { inlineMarkdownToHtml, toPlainText, truncateAtSentence } from "../plain-text";

describe("toPlainText", () => {
  it("quita negrita, cursiva, codigo y enlaces de Markdown", () => {
    expect(toPlainText("El **IRCA** es el estándar de la **Resolución 2115 de 2007**.")).toBe(
      "El IRCA es el estándar de la Resolución 2115 de 2007.",
    );
    expect(toPlainText("Usa *cursiva*, _otra_ y `codigo` con [enlace](https://aquatechia.com/x).")).toBe(
      "Usa cursiva, otra y codigo con enlace.",
    );
    expect(toPlainText("![mapa](/a.png) ***fuerte***")).toBe("mapa fuerte");
  });

  it("no toca asteriscos aritmeticos ni guiones bajos de identificadores", () => {
    expect(toPlainText("Calcula 5 * 3 y usa snake_case_name.")).toBe("Calcula 5 * 3 y usa snake_case_name.");
  });

  it("quita HTML y decodifica entidades", () => {
    expect(toPlainText("<p>Calidad&nbsp;del <strong>agua</strong> &amp; aire</p>")).toBe("Calidad del agua & aire");
  });

  it("no trata '<25' ni '>50' como etiquetas (clasificacion Conesa de guides-data)", () => {
    expect(toPlainText("clasificando como Moderado (<25), Severo (25-50) o Crítico (>50).")).toBe(
      "clasificando como Moderado (<25), Severo (25-50) o Crítico (>50).",
    );
  });

  it("convierte listas HTML en frases separadas en una linea", () => {
    const html = '<ul><li><strong>Agua:</strong> consumo humano.</li><li>Aire: contaminantes criterio</li><li>Residuos.</li></ul>';
    expect(toPlainText(html)).toBe("Agua: consumo humano. Aire: contaminantes criterio. Residuos.");
  });

  it("modo multiline conserva parrafos y viñetas", () => {
    const md = "# Titulo\n\nPrimer **parrafo**.\n\n- uno\n- dos\n\n1. tres";
    expect(toPlainText(md, { multiline: true })).toBe("Titulo\n\nPrimer parrafo.\n\n- uno\n- dos\n\n1. tres");
  });

  it("keepHeadings conserva la jerarquia y las tablas pierden el marcado", () => {
    expect(toPlainText("## Seccion\n\n### Sub\n\ntexto", { multiline: true, keepHeadings: true })).toBe("## Seccion\n\n### Sub\n\ntexto");
    expect(toPlainText("| a | b |\n|---|---|\n| 1 | 2 |", { multiline: true })).toBe("a | b\n\n1 | 2");
  });

  it("es idempotente", () => {
    const once = toPlainText("**a** <b>b</b> [c](d)");
    expect(toPlainText(once)).toBe(once);
  });

  it("ningun texto de guides-data conserva marcado", () => {
    for (const guide of Object.values(guidesData)) {
      for (const section of guide.sections) {
        const plain = toPlainText(section.content);
        expect(plain, `${guide.slug} / ${section.title}`).not.toMatch(/\*\*|<[a-z/]|&[a-z]+;|\]\(/i);
      }
    }
  });
});

describe("truncateAtSentence", () => {
  it("no corta frases: devuelve las completas que caben", () => {
    const text = "Primera frase completa. Segunda frase completa. Tercera frase que ya no cabe en el limite.";
    expect(truncateAtSentence(text, 50)).toBe("Primera frase completa. Segunda frase completa.");
  });

  it("si la primera frase excede el limite, la devuelve entera", () => {
    const text = "Una sola frase bastante mas larga que el limite pedido. Otra.";
    expect(truncateAtSentence(text, 20)).toBe("Una sola frase bastante mas larga que el limite pedido.");
  });

  it("no confunde EE.UU., decimales ni 5.1% con fin de frase", () => {
    const text = "La EPA de EE.UU. define el índice en 5.1% para PM2.5 en ciertos casos. Luego otra frase mucho mas larga que no entra.";
    expect(truncateAtSentence(text, 90)).toBe("La EPA de EE.UU. define el índice en 5.1% para PM2.5 en ciertos casos.");
  });

  it("cierra con punto cuando el texto no trae puntuacion final", () => {
    expect(truncateAtSentence("Sin punto final", 100)).toBe("Sin punto final.");
  });
});

describe("inlineMarkdownToHtml", () => {
  it("convierte negrita y deja el HTML existente intacto", () => {
    expect(inlineMarkdownToHtml('<li class="a">El **IRCA** y <strong>otro</strong></li>')).toBe(
      '<li class="a">El <strong>IRCA</strong> y <strong>otro</strong></li>',
    );
  });
});
