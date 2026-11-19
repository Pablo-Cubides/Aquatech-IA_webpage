/**
 * Coeficientes de correlación de la herramienta "análisis de correlaciones" (ARQ-010).
 *
 * Módulo PURO (sin React ni red) para poder probarlo contra valores de referencia independientes
 * (ver __tests__/correlations-math.test.ts). Antes vivía dentro de PageComponent.tsx y estaba mal:
 * el Spearman asignaba el rango por posición ya ordenada y devolvía 1,00 para cualquier par de datos.
 *
 * Convención: cada función devuelve `null` cuando el coeficiente NO está definido (menos de 2
 * observaciones o varianza cero en alguna serie), nunca `NaN`. La interfaz pinta `null` como "N/A".
 */
import { sampleCorrelation } from "simple-statistics";

/** Fuerza el resultado al intervalo [-1, 1]: el redondeo en coma flotante puede dar 1.0000000000000002. */
function clampUnit(value: number): number | null {
  if (!Number.isFinite(value)) return null;
  return Math.max(-1, Math.min(1, value));
}

/** True si las dos series sirven para calcular un coeficiente (misma longitud, al menos 2 datos, finitos). */
function usable(x: number[], y: number[]): boolean {
  return x.length === y.length && x.length >= 2 && x.every(Number.isFinite) && y.every(Number.isFinite);
}

/** Correlación de Pearson (relación lineal). `null` si no está definida (n < 2 o varianza cero). */
export function pearson(x: number[], y: number[]): number | null {
  if (!usable(x, y)) return null;
  try {
    return clampUnit(sampleCorrelation(x, y));
  } catch {
    return null;
  }
}

/**
 * Rangos 1..n con el PROMEDIO en los empates ("rangos fraccionarios"), asignados al índice ORIGINAL
 * de cada valor. Ejemplo: [10, 20, 20, 30] -> [1, 2.5, 2.5, 4].
 */
export function averageRanks(values: number[]): number[] {
  const order = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const ranks = new Array<number>(values.length);
  let start = 0;
  while (start < order.length) {
    let end = start;
    while (end + 1 < order.length && order[end + 1].value === order[start].value) end++;
    const rank = (start + 1 + (end + 1)) / 2; // promedio de las posiciones start+1..end+1
    for (let k = start; k <= end; k++) ranks[order[k].index] = rank;
    start = end + 1;
  }
  return ranks;
}

/** Correlación de Spearman: Pearson sobre los rangos promedio. `null` si no está definida. */
export function spearman(x: number[], y: number[]): number | null {
  if (!usable(x, y)) return null;
  return pearson(averageRanks(x), averageRanks(y));
}

/**
 * Tau-b de Kendall: (C - D) / sqrt((n0 - n1) * (n0 - n2)), con n0 = n(n-1)/2 pares, n1 los pares empatados
 * en x y n2 los empatados en y. Es la variante estándar con empates (la de scipy.stats.kendalltau): un par
 * empatado en una o en ambas series no es ni concordante ni discordante. `null` si no está definida
 * (n < 2 o una serie constante).
 */
export function kendallTauB(x: number[], y: number[]): number | null {
  if (!usable(x, y)) return null;
  const n = x.length;
  let concordant = 0;
  let discordant = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const product = Math.sign(x[j] - x[i]) * Math.sign(y[j] - y[i]);
      if (product > 0) concordant++;
      else if (product < 0) discordant++;
    }
  }
  const n0 = (n * (n - 1)) / 2;
  const n1 = tiedPairs(x);
  const n2 = tiedPairs(y);
  const denominator = Math.sqrt((n0 - n1) * (n0 - n2));
  if (denominator === 0) return null;
  return clampUnit((concordant - discordant) / denominator);
}

/** Pares (i < j) con el mismo valor dentro de una serie. */
function tiedPairs(values: number[]): number {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  let pairs = 0;
  for (const count of counts.values()) pairs += (count * (count - 1)) / 2;
  return pairs;
}

/**
 * Escala de fuerza de una correlación, DEFINIDA UNA SOLA VEZ (CONT-008). La usan la tabla, el mapa de calor,
 * los colores del resumen, el PDF y la página "acerca de". Se aplica al valor absoluto y es una convención de
 * esta herramienta, no un umbral universal. No cambies los números en otro archivo: cámbialos aquí.
 */
export const STRENGTH_THRESHOLDS = { strong: 0.75, moderate: 0.4 } as const;

export type CorrelationStrength = "strong" | "moderate" | "weak";

/** Fuerte si |v| > 0.75; moderada si |v| >= 0.4; débil (incluida la ausencia de correlación) en otro caso. */
export function classifyStrength(value: number | null | undefined): CorrelationStrength {
  const magnitude = Math.abs(value ?? 0);
  if (!Number.isFinite(magnitude)) return "weak";
  if (magnitude > STRENGTH_THRESHOLDS.strong) return "strong";
  if (magnitude >= STRENGTH_THRESHOLDS.moderate) return "moderate";
  return "weak";
}

/** Textos de leyenda generados desde STRENGTH_THRESHOLDS (los números nunca se escriben a mano en la interfaz). */
export const STRENGTH_LEGEND: Record<CorrelationStrength, string> = {
  strong: `Fuerte (> ${STRENGTH_THRESHOLDS.strong})`,
  moderate: `Moderada (${STRENGTH_THRESHOLDS.moderate}–${STRENGTH_THRESHOLDS.strong})`,
  weak: `Débil (< ${STRENGTH_THRESHOLDS.moderate})`,
};
