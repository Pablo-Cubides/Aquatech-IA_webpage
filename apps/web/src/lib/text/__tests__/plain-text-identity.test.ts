/**
 * VIS-007: `toPlainText` con la opción `keepLinks` apagada produce EXACTAMENTE la misma salida que antes.
 *
 * Esta prueba congela la salida de la función SIN `keepLinks` sobre todos los textos de los artículos de código
 * y de `guidesData`, en sus cuatro modos, más un corpus sintético con enlaces seguros e inseguros.
 *
 * HASH CALCULADO ANTES DE TOCAR `plain-text.ts`, sobre el commit de `main` 731f06d6bb39 (merge del PR #16, CONT-010).
 * Si cambia el CONTENIDO de un artículo o de una guía, el hash cambia sin que la función haya cambiado: en ese caso
 * se recalcula con `git stash` del cambio de `plain-text.ts` (o comprobando que la salida de la función sigue siendo la
 * de este commit) y se anota aquí el nuevo commit. Para recalcular: ejecutar esta prueba, copiar el hash que imprime
 * el fallo y actualizar la constante, dejando constancia del commit.
 */
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { getStaticArticles } from "@/lib/blog-articles";
import { guidesData } from "@/lib/guides-data";
import { toPlainText, type PlainTextOptions } from "../plain-text";

const EXPECTED_SHA256 = "39b681060156dc7403513a2c986d1fdfa5aa4bde31b100a925572dc0a7436098";

const MODES: PlainTextOptions[] = [{}, { multiline: true }, { keepHeadings: true }, { multiline: true, keepHeadings: true }];

function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const item of value) collectStrings(item, out);
  else if (value && typeof value === "object") for (const item of Object.values(value)) collectStrings(item, out);
}

/** Enlaces seguros e inseguros, entidades y casos límite que `keepLinks` va a tocar. */
const SYNTHETIC = [
  "Mira [la norma](https://example.org/norma) y [otra](/ia/blog/x) y [ancla](#id) y [rel](ruta/x).",
  "[correo](mailto:a@b.co) [js](javascript:alert(1)) [data](data:text/html,x) [vb](vbscript:x) [file](file:///etc/passwd)",
  "[ent](&#106;avascript:alert(1)) [hex](&#x6a;avascript:alert(1)) [tab](java&#9;script:alert(1)) [mayus](JaVaScRiPt:1)",
  "[paren](https://example.org/a_(b)) [espacio](https://example.org/a b) [lt](https://example.org/<x>) [amp](https://example.org/?a=1&amp;b=2)",
  "![imagen](https://example.org/i.png) y ![otra](/img/o.png) con **negrita** y *cursiva* y `codigo`.",
  "[multi\nlinea](https://example.org/m) [vacio]() [sin cierre](https://example.org/x",
  "<p>HTML con <a href=\"https://example.org/h\">enlace html</a> y &nbsp; entidades &amp; mas</p>",
  "## Titulo\n\n- uno [a](https://example.org/1)\n- dos\n\n| a | b |\n|---|---|\n| [c](/d) | e |",
];

describe("toPlainText sin keepLinks: salida congelada", () => {
  it("coincide con el hash fijado sobre todos los artículos de código, guidesData y el corpus sintético", () => {
    const inputs: string[] = [];
    for (const portal of ["ia", "ambiental"] as const) collectStrings(getStaticArticles(portal), inputs);
    collectStrings(guidesData, inputs);
    inputs.push(...SYNTHETIC);

    const hash = createHash("sha256");
    let count = 0;
    for (const input of inputs) {
      for (const mode of MODES) {
        const output = toPlainText(input, mode);
        hash.update(`${output.length}:${output}\u0000`);
        count += 1;
      }
    }
    const digest = hash.digest("hex");
    // Un mínimo de entradas para que la prueba no se vacíe sin que nadie lo note.
    expect(inputs.length).toBeGreaterThan(500);
    expect(count).toBe(inputs.length * MODES.length);
    expect(digest).toBe(EXPECTED_SHA256);
  });
});
