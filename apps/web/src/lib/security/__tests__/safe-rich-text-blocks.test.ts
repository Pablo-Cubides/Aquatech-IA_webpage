import { describe, expect, it } from "vitest";
import { renderSafeRichText } from "@/lib/security/safe-rich-text";
import { toPlainText } from "@/lib/text/plain-text";

/**
 * SEC-005b: bloques de código, código en línea, tablas y cursiva pegada. Por cada construcción:
 * (1) que se renderiza, (2) que NO abre una vía de inyección, (3) que `toPlainText` (FAQ JSON-LD,
 * llms-full.txt) la limpia con la misma regla.
 */
const render = (markdown: string) => renderSafeRichText(markdown, "font-bold");
const hasTag = (html: string, tag: string) => new RegExp(`<${tag}[\\s>/]`, "i").test(html);

describe("bloques de código ```", () => {
  it("se renderiza como <pre><code> con el lenguaje y el contenido escapado", () => {
    const html = render("Antes\n```ts\nconst a = '<script>alert(1)</script>';\n```\nDespués");
    expect(html).toContain('<code class="language-ts">');
    expect(html).toContain("<pre ");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(hasTag(html, "script")).toBe(false);
  });

  it("el contenido es OPACO: ni Markdown, ni enlaces, ni formato", () => {
    const html = render("```\n**no negrita** [x](javascript:alert(1)) *no* [y](https://a.com)\n```");
    expect(html).toContain("**no negrita**");
    expect(hasTag(html, "strong")).toBe(false);
    expect(hasTag(html, "a")).toBe(false);
    expect(hasTag(html, "em")).toBe(false);
  });

  it.each([
    ['ts" onclick="alert(1)'],
    ['"><img src=x onerror=alert(1)>'],
    ["ts onload=alert(1)"],
    ["<script>"],
    ["a".repeat(50)],
  ])("la información tras la cerca no puede salirse del atributo class: %s", (info) => {
    const html = render("```" + info + "\ncode\n```");
    expect(hasTag(html, "img")).toBe(false);
    expect(hasTag(html, "script")).toBe(false);
    expect(html).not.toContain("onclick=");
    expect(html).not.toContain("onerror=");
    expect(html).not.toMatch(/<code class="language-[^"]*[^A-Za-z0-9_+"-]/);
  });

  it("una cerca sin cierre no es un bloque: queda como texto escapado", () => {
    const html = render("```\n<b>x</b> sin cerrar");
    expect(hasTag(html, "pre")).toBe(false);
    expect(hasTag(html, "b")).toBe(false);
    expect(html).toContain("&lt;b&gt;");
  });

  it("no deja saltos de línea pegados al bloque", () => {
    const html = render("intro\n```\ncodigo\n```\noutro");
    expect(html).not.toContain("<br><pre");
    expect(html).not.toContain("</pre><br>");
    expect(html).toContain("intro");
    expect(html).toContain("outro");
  });

  it("los marcadores internos no pueden venir del texto (NUL)", () => {
    const html = render("a \u0000B0\u0000 b \u00000\u0000 c");
    expect(html).not.toContain("\u0000");
    expect(html).toBe("a B0 b 0 c");
  });
});

describe("código en línea `x`", () => {
  it("se renderiza como <code> con el contenido escapado y opaco", () => {
    const html = render("Usa `<img src=x onerror=alert(1)>` y `[x](https://a.com)` y `**b**`");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(hasTag(html, "img")).toBe(false);
    expect(hasTag(html, "a")).toBe(false);
    expect(hasTag(html, "strong")).toBe(false);
    expect((html.match(/<code /g) ?? []).length).toBe(3);
  });

  it("dentro del texto de un enlace no rompe el enlace", () => {
    const html = render("[usa `npm i`](https://example.com/x)");
    expect(html).toContain('<a href="https://example.com/x"');
    expect(html).toContain("<code ");
    expect(html).not.toContain("\u0000");
  });
});

describe("tablas con pipes", () => {
  const TABLE = "| Parámetro | Límite |\n|---|:---:|\n| pH | 6,5-9,0 |\n| Turbiedad | 2 UNT |";

  it("se renderiza con cabecera y filas", () => {
    const html = render(`Antes\n${TABLE}\nDespués`);
    expect(hasTag(html, "table")).toBe(true);
    expect((html.match(/<th /g) ?? []).length).toBe(2);
    expect((html.match(/<td /g) ?? []).length).toBe(4);
    expect(html).toContain("6,5-9,0");
    expect(html).not.toContain("<br><div");
  });

  it("las celdas se escapan y pasan por la lista blanca de enlaces", () => {
    const html = render(
      "| a | b |\n|---|---|\n| <script>alert(1)</script> | **negrita** |\n| [mal](javascript:alert(1)) | [bien](https://example.com/x) |",
    );
    expect(hasTag(html, "script")).toBe(false);
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("<strong");
    expect(html).not.toContain("javascript:");
    expect(html).toContain('href="https://example.com/x"');
  });

  it("filas desiguales se rellenan a las columnas de la cabecera; el exceso se descarta", () => {
    const html = render("| a | b |\n|---|---|\n| 1 |\n| 1 | 2 | 3 |");
    expect((html.match(/<td /g) ?? []).length).toBe(4);
  });

  it("acota columnas y filas (HTML desproporcionado)", () => {
    const cols = Array.from({ length: 30 }, (_, i) => `c${i}`).join(" | ");
    const wide = render(`| ${cols} |\n|${"---|".repeat(30)}\n| ${cols} |`);
    expect((wide.match(/<th /g) ?? []).length).toBe(12);
    const rows = Array.from({ length: 400 }, (_, i) => `| ${i} | x |`).join("\n");
    const tall = render(`| a | b |\n|---|---|\n${rows}`);
    expect((tall.match(/<tr>/g) ?? []).length).toBeLessThanOrEqual(201);
  });

  it("texto con pipes pero sin fila separadora NO es tabla", () => {
    const html = render("a | b | c\nsolo texto | con pipes");
    expect(hasTag(html, "table")).toBe(false);
    expect(html).toContain("a | b | c");
  });
});

describe("cursiva solo cuando los asteriscos están pegados al texto", () => {
  it.each([
    ["2 * 3 * 4", false],
    ["a * b y c * d", false],
    ["a*b*c", false],
    ["* viñeta * otra", false],
    ["*palabra*", true],
    ["una *frase corta* aquí", true],
  ])("%j -> cursiva: %s", (input, expected) => {
    expect(/<em>/.test(render(input))).toBe(expected);
  });

  it("la negrita y la negrita-cursiva siguen igual", () => {
    expect(render("**fuerte**")).toContain('<strong class="font-bold">fuerte</strong>');
    expect(render("***ambas***")).toContain("<strong");
  });
});

describe("toPlainText limpia cada construcción (misma regla que el renderizador)", () => {
  it("bloque de código: quita las cercas y conserva el código", () => {
    const md = "Antes\n```python\nprint('hola')\n```\nDespués";
    expect(toPlainText(md)).not.toContain("`");
    expect(toPlainText(md)).toContain("print('hola')");
    // toPlainText conserva una línea en blanco tras el código: es cosmético, el contenido es el mismo.
    expect(toPlainText(md, { multiline: true }).replace(/\n{2,}/g, "\n")).toBe("Antes\nprint('hola')\nDespués");
  });

  it("código en línea: quita los backticks", () => {
    expect(toPlainText("Usa `npm install` ahora")).toBe("Usa npm install ahora");
  });

  it("tabla: sin fila separadora ni pipes de borde", () => {
    const plain = toPlainText("| Parámetro | Límite |\n|---|:---:|\n| pH | 6,5-9,0 |", { multiline: true });
    expect(plain).not.toContain("---");
    expect(plain).not.toMatch(/^\|/m);
    expect(plain).toContain("Parámetro | Límite");
    expect(plain).toContain("pH | 6,5-9,0");
  });

  it.each(["2 * 3 * 4", "a*b*c", "*palabra*", "una *frase corta* aquí", "a * b y c * d"])(
    "cursiva: renderizador y texto plano coinciden en %j",
    (input) => {
      const rendersItalic = /<em>/.test(render(input));
      const plainStripped = !toPlainText(input).includes("*");
      expect(plainStripped).toBe(rendersItalic);
    },
  );
});
