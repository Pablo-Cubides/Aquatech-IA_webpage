/**
 * Serializa datos para un <script type="application/ld+json"> sin que el contenido
 * pueda cerrar el script ni romper el parseo.
 *
 * JSON.stringify NO escapa "<": un título con `</script><script>alert(1)</script>`
 * cerraba el bloque y ejecutaba código (XSS almacenado vía artículos dinámicos).
 * Aquí se escapan < > & (HTML) y U+2028 / U+2029 (terminadores de línea que algunos
 * motores no admiten en literales). El resultado sigue siendo JSON válido y
 * equivalente al original.
 *
 * Modo de fallo: si no se puede serializar (ciclos, BigInt, toJSON que lanza,
 * resultado undefined) se registra el error y se devuelve "{}": un JSON-LD vacío
 * cuesta posicionamiento; un <script> roto puede romper la página.
 *
 * Los caracteres especiales se construyen con códigos numéricos para que el
 * fuente no contenga caracteres invisibles.
 */
const SPECIAL = new RegExp(
  "[<>&" + String.fromCharCode(0x2028) + String.fromCharCode(0x2029) + "]",
  "g",
);

const escapeChar = (char: string): string =>
  "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0");

export function safeJsonLd(data: unknown): string {
  try {
    const json = JSON.stringify(data);
    if (typeof json !== "string") {
      console.error("[safeJsonLd] el dato no es serializable a JSON");
      return "{}";
    }
    return json.replace(SPECIAL, escapeChar);
  } catch (error) {
    console.error("[safeJsonLd] no se pudo serializar el JSON-LD", error);
    return "{}";
  }
}
