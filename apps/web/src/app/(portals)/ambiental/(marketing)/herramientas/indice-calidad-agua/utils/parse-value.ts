// Lectura de valores de laboratorio. Criterio documentado (DOM-001, B2):
//
//  1. Decimal con coma o con punto: "0,5" y "0.5" → 0.5. Si aparecen ambos separadores, el
//     ÚLTIMO es el decimal ("1.234,5" y "1,234.5" → 1234.5). Con un solo separador, ese es
//     el decimal ("1,234" → 1.234, convención del laboratorio colombiano). Un mismo
//     separador repetido ("1.2.3") es ambiguo → inválido.
//  2. Valores censurados ("<0,1", "< 0,1", ">10"): NO son números. Se devuelven como
//     censurados con su límite; quien calcula decide si basta para concluir
//     cumplimiento (ver calculate-irca.ts). Nunca se convierten en 0 ni en el límite.
//  3. Todo lo demás ("abc", "ND", "n/d", vacío) es INVÁLIDO. Nunca se convierte en 0: el
//     llamador debe mostrar el error al usuario.

export type ParsedLabValue =
  | { kind: "number"; value: number }
  | { kind: "censored"; operator: "<" | ">"; limit: number }
  | { kind: "invalid"; raw: string; reason: string };

const NUMBER_RE = /^[+-]?[\d.,]*\d[\d.,]*(e[+-]?\d+)?$/i;

function parsePlainNumber(text: string): number | null {
  let t = text.trim();
  if (!t || !NUMBER_RE.test(t)) return null;

  const commas = (t.match(/,/g) ?? []).length;
  const dots = (t.match(/\./g) ?? []).length;

  if (commas > 0 && dots > 0) {
    // El último separador es el decimal; el otro es de miles.
    const lastComma = t.lastIndexOf(",");
    const lastDot = t.lastIndexOf(".");
    const decimalIsComma = lastComma > lastDot;
    const thousands = decimalIsComma ? "." : ",";
    const decimal = decimalIsComma ? "," : ".";
    if (t.split(decimal).length > 2) return null;
    t = t.split(thousands).join("").replace(decimal, ".");
  } else if (commas > 1 || dots > 1) {
    return null;
  } else {
    t = t.replace(",", ".");
  }

  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function parseLabValue(raw: string | number | null | undefined): ParsedLabValue {
  if (typeof raw === "number") {
    return Number.isFinite(raw)
      ? { kind: "number", value: raw }
      : { kind: "invalid", raw: String(raw), reason: "no es un número finito" };
  }
  const text = (raw ?? "").toString().trim();
  if (text === "") {
    return { kind: "invalid", raw: text, reason: "valor vacío" };
  }

  const censored = /^([<>])\s*(.+)$/.exec(text);
  if (censored) {
    const limit = parsePlainNumber(censored[2]);
    if (limit === null || limit < 0) {
      return { kind: "invalid", raw: text, reason: "valor censurado con límite no numérico" };
    }
    return { kind: "censored", operator: censored[1] as "<" | ">", limit };
  }

  const n = parsePlainNumber(text);
  if (n === null) {
    return { kind: "invalid", raw: text, reason: "no se reconoce como número" };
  }
  return { kind: "number", value: n };
}
