/**
 * VIS-007: `keepLinks` conserva la URL de los enlaces del texto solo cuando es citable y segura.
 * La identidad con la opción apagada la fija `plain-text-identity.test.ts` (hash sobre todos los artículos y guías).
 */
import { describe, expect, it } from "vitest";
import { isSafeLinkUrl } from "@/lib/security/safe-rich-text";
import { toPlainText } from "../plain-text";

const BASE = "https://aquatechia.com";
const keep = (input: string, extra: object = {}) => toPlainText(input, { keepLinks: { baseUrl: BASE }, ...extra });

describe("keepLinks apagado", () => {
  it("ausente y undefined dan la misma salida que siempre: solo el texto del enlace", () => {
    const input = "Mira [la norma](https://example.org/norma) y [otra](/ia/blog/x).";
    expect(toPlainText(input)).toBe("Mira la norma y otra.");
    expect(toPlainText(input, { keepLinks: undefined })).toBe(toPlainText(input));
    expect(toPlainText(input, { multiline: true })).toBe("Mira la norma y otra.");
  });
});

describe("keepLinks: destinos citables", () => {
  it("http(s) absoluto -> `texto (url)`", () => {
    expect(keep("Ver [Repositorio UTadeo](https://expeditiorepositorio.utadeo.edu.co/entities/publication/110fcfae)")).toBe(
      "Ver Repositorio UTadeo (https://expeditiorepositorio.utadeo.edu.co/entities/publication/110fcfae)",
    );
    expect(keep("[sitio](http://example.org/a?x=1&y=2)")).toBe("sitio (http://example.org/a?x=1&y=2)");
  });

  it("ruta del sitio -> URL absoluta con la base", () => {
    expect(keep("[herramienta](/ia/herramientas/como-funcionan-llm)")).toBe(
      "herramienta (https://aquatechia.com/ia/herramientas/como-funcionan-llm)",
    );
  });

  it("también en modo multilínea con encabezados", () => {
    expect(keep("## Fuentes\n\n- [A](https://a.example/x)\n- [B](/b)", { multiline: true, keepHeadings: true })).toBe(
      "## Fuentes\n\n- A (https://a.example/x)\n- B (https://aquatechia.com/b)",
    );
  });

  it("el formato en línea posterior no altera la URL", () => {
    const url = "https://example.org/__init__/a_b_c/**x**/~~y~~/`z`";
    const out = keep(`[texto](${url})`);
    expect(out.startsWith("texto (https://example.org/")).toBe(true);
    expect(out).toContain("__init__/a_b_c/**x**/~~y~~/");
  });
});

describe("keepLinks: destinos que NO se escriben (solo texto)", () => {
  const cases: Array<[string, string]> = [
    ["mailto", "[correo](mailto:a@b.co)"],
    ["ancla", "[ancla](#id)"],
    ["relativo sin barra", "[rel](ruta/x)"],
    ["relativo con punto", "[rel](./x)"],
    ["javascript", "[js](javascript:alert(1))"],
    ["javascript en mayúsculas", "[js](JaVaScRiPt:alert(1))"],
    ["javascript con entidad decimal", "[js](&#106;avascript:alert(1))"],
    ["javascript con entidad hex", "[js](&#x6a;avascript:alert(1))"],
    ["javascript con tabulador por entidad", "[js](java&#9;script:alert(1))"],
    ["data", "[d](data:text/html,x)"],
    ["vbscript", "[v](vbscript:x)"],
    ["file", "[f](file:///etc/passwd)"],
    ["protocolo relativo", "[otro](//otro.example/x)"],
    ["barra y contrabarra (host distinto)", "[bs](/\\otro.example/x)"],
    ["credenciales en la URL", "[c](https://user:pass@example.org/x)"],
    ["vacío", "[v]()"],
  ];
  for (const [name, input] of cases) {
    it(name, () => {
      const out = keep(input);
      expect(out).not.toMatch(/\(https?:|javascript|data:|vbscript|file:|mailto|otro\.example|user:pass/i);
      expect(out).toBe(toPlainText(input));
    });
  }

  it("coherencia con el renderizador: lo que isSafeLinkUrl rechaza nunca sale con URL", () => {
    for (const url of ["javascript:alert(1)", "data:text/html,x", "vbscript:x", "file:///x", "blob:https://x/y", "JAVASCRIPT:1", "java\tscript:1"]) {
      expect(isSafeLinkUrl(url)).toBe(false);
      expect(keep(`[x](${url})`)).not.toContain("(");
    }
  });
});

describe("keepLinks: URL normalizada antes de escribirla", () => {
  it("un paréntesis, una comilla, un espacio, un <, un salto de línea no rompen el formato", () => {
    const hostile = [
      "[a](https://example.org/p_(x))",
      "[a](https://example.org/a b)",
      "[a](https://example.org/<x>)",
      "[a](https://example.org/a'b)",
      "[a](https://example.org/a\nb)",
      '[a](https://example.org/a"b)',
    ];
    for (const input of hostile) {
      const out = keep(input);
      // Lo que añade keepLinks tiene siempre la forma ` (https://sin-espacios-ni-parentesis-ni-<>)`.
      const added = out.match(/\(https?:\/\/[^\s()]*\)/g) ?? [];
      for (const piece of added) expect(piece).toMatch(/^\(https?:\/\/[^\s()<>"']+\)$/);
      expect(out).not.toMatch(/[<>"]/);
      expect(out.split("\n").length).toBeLessThanOrEqual(2);
    }
  });

  it("una URL truncada por un paréntesis no se cita (el enlace Markdown corta en el primer cierre)", () => {
    expect(keep("[a](https://example.org/p_(x)_y)")).not.toContain("https://");
    expect(keep("[a](https://example.org/p_(x))")).not.toContain("https://");
  });

  it("las comillas simples de la URL se codifican", () => {
    expect(keep("[a](https://example.org/it's)")).toContain("it%27s");
  });

  it("la entidad &amp; de la URL se decodifica a &", () => {
    expect(keep("[a](https://example.org/?a=1&amp;b=2)")).toBe("a (https://example.org/?a=1&b=2)");
  });

  it("las imágenes siguen descartando su URL", () => {
    expect(keep("![mapa](https://example.org/i.png) y ![otra](/img/o.png)")).toBe("mapa y otra");
  });

  it("los NUL del texto no pueden falsificar un marcador", () => {
    expect(keep("[a](https://example.org/x) \u0000L0\u0000 [b](https://example.org/y)")).toBe(
      "a (https://example.org/x) L0 b (https://example.org/y)",
    );
  });
});
