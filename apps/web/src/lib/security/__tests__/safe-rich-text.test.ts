import { describe, expect, it } from "vitest";
import { isSafeLinkUrl, renderSafeRichText } from "@/lib/security/safe-rich-text";

const render = (markdown: string) => renderSafeRichText(markdown, "font-bold");

/** href de cada <a>, con las entidades del atributo decodificadas una vez. */
const hrefsOf = (html: string): string[] =>
  [...html.matchAll(/<a href="([^"]*)"/g)].map((match) =>
    match[1]
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&"),
  );

describe("renderSafeRichText: enlaces", () => {
  it("un enlace http normal sigue funcionando", () => {
    const html = render("Lee [la guía](http://example.com/guia?a=1&b=2) hoy");
    expect(html).toContain(
      '<a href="http://example.com/guia?a=1&amp;b=2" class="text-blue-400',
    );
    expect(html).toContain('target="_blank" rel="noopener noreferrer">la guía</a>');
  });

  it.each([
    ["https", "[x](https://aquatechia.com/ia/blog)", 'href="https://aquatechia.com/ia/blog"'],
    ["mailto", "[x](mailto:hola@example.com)", 'href="mailto:hola@example.com"'],
    ["ruta relativa", "[x](/ia/herramientas)", 'href="/ia/herramientas"'],
    ["ancla", "[x](#seccion)", 'href="#seccion"'],
    ["relativa con ./", "[x](./otra)", 'href="./otra"'],
    ["HTTPS en mayúsculas", "[x](HTTPS://example.com)", 'href="HTTPS://example.com"'],
  ])("permite %s", (_label, markdown, expected) => {
    expect(render(markdown)).toContain(expected);
  });

  it.each([
    ["javascript: simple", "[clic](javascript:alert(1))"],
    ["JaVaScRiPt: en mayúsculas mezcladas", "[clic](JaVaScRiPt:alert(1))"],
    ["java<TAB>script:", "[clic](java\tscript:alert(1))"],
    ["tabulador al final del esquema", "[clic](javascript\t:alert(1))"],
    ["espacio inicial", "[clic]( javascript:alert(1))"],
    ["carácter de control inicial", "[clic](\u0001javascript:alert(1))"],
    ["control en medio", "[clic](java\u0000script:alert(1))"],
    ["espacio de ancho cero", `[clic](java${String.fromCharCode(0x200b)}script:alert(1))`],
    ["data:text/html", "[clic](data:text/html,<script>alert(1)</script>)"],
    ["data:text/html base64", "[clic](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)"],
    ["vbscript:", "[clic](vbscript:msgbox(1))"],
    ["file:", "[clic](file:///etc/passwd)"],
    ["blob:", "[clic](blob:https://example.com/uuid)"],
    ["esquema desconocido", "[clic](foo:bar)"],
    ["destino vacío tras limpiar", "[clic]( \t )"],
  ])("rechaza %s y lo degrada a texto plano", (_label, markdown) => {
    const html = render(markdown);
    expect(html).not.toContain("<a");
    expect(html).not.toContain("href");
    expect(html).toContain("clic");
  });

  it("las entidades HTML no pueden reconstruir un esquema peligroso", () => {
    for (const payload of [
      "[x](&#106;avascript:alert(1))",
      "[x](java&#x09;script:alert(1))",
      "[x](javascript&colon;alert(1))",
      "[x](&#x6A;avascript&#58;alert(1))",
    ]) {
      // Oráculo: lo que el navegador entiende. Se decodifica el atributo UNA vez
      // (como hace el parser HTML) y se interpreta con el parser de URL estándar.
      for (const href of hrefsOf(render(payload))) {
        expect(["http:", "https:", "mailto:"]).toContain(new URL(href, "https://site.test").protocol);
      }
    }
  });

  it("el HTML del texto sigue escapado", () => {
    const html = render('[<img src=x onerror=alert(1)>](https://example.com)');
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("una comilla en la URL no puede cerrar el atributo href", () => {
    const html = render('[x](https://example.com" onmouseover="alert(1))');
    expect(html).not.toMatch(/onmouseover="alert/);
    expect(html).toContain("&quot;");
  });

  it("el formato Markdown dentro de la URL no altera el atributo href", () => {
    const html = render("[x](https://example.com/*a*) y *cursiva*");
    expect(html).toContain('href="https://example.com/*a*"');
    expect(html).toContain("<em>cursiva</em>");
  });

  it("no se pueden fabricar marcadores internos desde el texto", () => {
    const html = render("[x](https://example.com) \u00000\u0000 y \u00005\u0000");
    expect(html.match(/<a /g)?.length).toBe(1);
  });

  it("conserva negrita y cursiva dentro del texto del enlace y fuera de él", () => {
    const html = render("**fuerte** [**aquí**](https://example.com)");
    expect(html).toContain('<strong class="font-bold">fuerte</strong>');
    expect(html).toContain('>' + '<strong class="font-bold">aquí</strong></a>');
  });
});

describe("isSafeLinkUrl", () => {
  it("lista blanca de esquemas", () => {
    expect(isSafeLinkUrl("https://a.example")).toBe(true);
    expect(isSafeLinkUrl("http://a.example")).toBe(true);
    expect(isSafeLinkUrl("mailto:a@b.co")).toBe(true);
    expect(isSafeLinkUrl("/ruta")).toBe(true);
    expect(isSafeLinkUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeLinkUrl("java\nscript:alert(1)")).toBe(false);
    expect(isSafeLinkUrl("data:text/html,x")).toBe(false);
    expect(isSafeLinkUrl("")).toBe(false);
  });

  it("un ':' dentro de la query o del path de una ruta relativa no la bloquea", () => {
    expect(isSafeLinkUrl("/buscar?q=a:b")).toBe(true);
    expect(isSafeLinkUrl("#a:b")).toBe(true);
  });
});
