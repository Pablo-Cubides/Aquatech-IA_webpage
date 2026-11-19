// Utilidades para calcular el índice IRCA (Índice de Riesgo de la Calidad del Agua)
// Resolución 2115 de 2007 (arts. 13-15). Constantes: @/lib/normativa (fuente canónica).

import type {
  WaterSample,
  WaterParameter,
  IndexResult,
  IndexDetail,
  IRCAParameter,
  IRCAScope,
} from "../types";
import { IRCA_PARAMETERS, getIRCARiskCategory } from "../data/irca-parameters";
import { IRCA_SCOPE_REMINDER } from "../data/irca-scope";
import {
  SUSTANCIAS_ART5,
  PLAGUICIDAS_SUMA_MAX_MG_L,
} from "@/lib/normativa";

/**
 * Normaliza nombres de parámetros para mejor coincidencia
 */
export function normalizeParameterName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Remover acentos
    .replace(/[^a-z0-9]/g, ""); // Solo letras y números
}

type Compliance = "cumple" | "no-cumple" | "indeterminado";

function numberComplies(value: number, p: IRCAParameter): boolean {
  if (p.minValue !== undefined && value < p.minValue) return false;
  if (p.maxValue !== undefined && value > p.maxValue) return false;
  return true;
}

/**
 * Evalúa cumplimiento. Un resultado censurado ("<L", ">L") no es un número: solo se
 * decide cuando TODO el intervalo posible cae a un lado del valor normativo; si no,
 * es "indeterminado" y la característica se excluye del cálculo (y se informa).
 */
export function evaluateCompliance(param: WaterParameter, p: IRCAParameter): Compliance {
  if (!param.censored) {
    return numberComplies(param.value, p) ? "cumple" : "no-cumple";
  }
  const L = param.value;
  const { minValue: min, maxValue: max } = p;

  if (param.censored === "<") {
    // Microbiología (Cuadro 5, art. 11): "< 1 microorganismo en 100 cm³" es el valor
    // aceptable para la técnica de enzima-sustrato; equivale a ausencia.
    if (max === 0) return L <= 1 ? "cumple" : "indeterminado";
    // Valores posibles: [0, L)
    const todosCumplen = (max === undefined || L <= max) && (min === undefined || min <= 0);
    if (todosCumplen) return "cumple";
    const ninguno = min !== undefined && L <= min;
    return ninguno ? "no-cumple" : "indeterminado";
  }
  // ">" : valores posibles (L, ∞)
  if (max !== undefined && L >= max) return "no-cumple";
  if (max === undefined && (min === undefined || L >= min)) return "cumple";
  return "indeterminado";
}

/** Índice de alias → característica del Cuadro 6. */
function buildAliasIndex(): Map<string, IRCAParameter> {
  const idx = new Map<string, IRCAParameter>();
  for (const p of IRCA_PARAMETERS) {
    for (const alias of [p.name, ...(p.synonyms ?? [])]) {
      idx.set(normalizeParameterName(alias), p);
    }
  }
  return idx;
}
const ALIAS_INDEX = buildAliasIndex();

function matchIrcaParameter(name: string): IRCAParameter | undefined {
  const n = normalizeParameterName(name);
  const exact = ALIAS_INDEX.get(n);
  if (exact) return exact;
  // Respaldo: el encabezado contiene el nombre canónico (p. ej. "Hierro total disuelto").
  return IRCA_PARAMETERS.find((p) => {
    const c = normalizeParameterName(p.name);
    if ((c.includes("nitrato") && n.includes("nitrito")) || (c.includes("nitrito") && n.includes("nitrato"))) {
      return false;
    }
    return n.includes(c);
  });
}

const ART5_INDEX = (() => {
  const m = new Map<string, (typeof SUSTANCIAS_ART5)[number]>();
  for (const s of SUSTANCIAS_ART5) {
    for (const a of [s.nombre, ...s.sinonimos]) m.set(normalizeParameterName(a), s);
  }
  return m;
})();

const PLAGUICIDAS_ALIASES = new Set(
  ["Plaguicidas", "Plaguicidas totales", "Suma de plaguicidas", "Plaguicidas (suma total)"].map(normalizeParameterName),
);
const GIARDIA_ALIASES = new Set(["Giardia", "Giardia spp", "Quistes de Giardia"].map(normalizeParameterName));
const CRYPTO_ALIASES = new Set(
  ["Cryptosporidium", "Criptosporidium", "Cryptosporidium spp", "Ooquistes de Cryptosporidium"].map(normalizeParameterName),
);

interface Override {
  motivo: string;
  cita: string;
}

/**
 * Art. 13, parágrafo: IRCA = 100 si un RESULTADO de los arts. 5 u 8 excede el máximo
 * aceptable, o si hay PRESENCIA de Giardia o Cryptosporidium. Se activa solo ante un
 * resultado ingresado; nunca porque una sustancia "deba medirse".
 */
function detectOverrides(
  params: WaterParameter[],
  indeterminate: string[],
): { overrides: Override[]; recognized: Set<WaterParameter> } {
  const overrides: Override[] = [];
  const recognized = new Set<WaterParameter>();

  for (const p of params) {
    const n = normalizeParameterName(p.name);

    const art5 = ART5_INDEX.get(n);
    if (art5) {
      recognized.add(p);
      const asParam = { name: art5.nombre, unit: art5.unidad, riskScore: 0, maxValue: art5.max, referenceNorm: "" } as IRCAParameter;
      const c = evaluateCompliance(p, asParam);
      if (c === "no-cumple") {
        overrides.push({
          motivo: `${art5.nombre} (${p.censored ?? ""}${p.value} mg/L) supera el máximo aceptable de ${art5.max} mg/L`,
          cita: "Res. 2115/2007, art. 5 (Cuadro 2) y art. 13, parágrafo",
        });
      } else if (c === "indeterminado") {
        indeterminate.push(`${art5.nombre} (${p.censored}${p.value})`);
      }
      continue;
    }

    if (PLAGUICIDAS_ALIASES.has(n)) {
      recognized.add(p);
      const asParam = { name: "Plaguicidas", unit: "mg/L", riskScore: 0, maxValue: PLAGUICIDAS_SUMA_MAX_MG_L, referenceNorm: "" } as IRCAParameter;
      const c = evaluateCompliance(p, asParam);
      if (c === "no-cumple") {
        overrides.push({
          motivo: `La suma de plaguicidas (${p.censored ?? ""}${p.value} mg/L) supera el máximo aceptable de ${PLAGUICIDAS_SUMA_MAX_MG_L} mg/L`,
          cita: "Res. 2115/2007, art. 8, parágrafo 2 y art. 13, parágrafo",
        });
      } else if (c === "indeterminado") {
        indeterminate.push(`Plaguicidas (${p.censored}${p.value})`);
      }
      continue;
    }

    const isGiardia = GIARDIA_ALIASES.has(n);
    const isCrypto = CRYPTO_ALIASES.has(n);
    if (isGiardia || isCrypto) {
      recognized.add(p);
      const nombre = isGiardia ? "Giardia" : "Cryptosporidium";
      // Valor aceptable = 0 (art. 11, parágrafo 3). "<1" = no se detectó.
      const presencia = p.censored === "<" ? false : p.censored === ">" ? true : p.value > 0;
      if (presencia) {
        overrides.push({
          motivo: `Presencia de ${nombre}`,
          cita: "Res. 2115/2007, art. 11 (parágrafo 3) y art. 13, parágrafo",
        });
      }
    }
  }
  return { overrides, recognized };
}

/**
 * Calcula el índice IRCA para una muestra de agua (art. 14: IRCA por muestra).
 */
export function calculateIRCA(sample: WaterSample): IndexResult | null {
  // Verificar que sea Colombia
  if (sample.country !== "Colombia") {
    return null;
  }

  const details: IndexDetail[] = [];
  let totalRiskScore = 0; // Suma de puntajes de parámetros analizados
  let nonCompliantRiskScore = 0; // Suma de puntajes de parámetros que NO cumplen
  const missingParameters: string[] = [];
  const indeterminate: string[] = [];
  const used = new Set<WaterParameter>();

  // Primero, los resultados que activan el parágrafo del art. 13
  const { overrides, recognized } = detectOverrides(sample.parameters, indeterminate);
  recognized.forEach((p) => used.add(p));

  // Asignar cada parámetro de la muestra a lo sumo a una característica del Cuadro 6
  const assigned = new Map<string, WaterParameter>();
  for (const p of sample.parameters) {
    if (used.has(p)) continue;
    const ircaParam = matchIrcaParameter(p.name);
    if (!ircaParam) continue;
    const key = ircaParam.id ?? ircaParam.name;
    if (!assigned.has(key)) {
      assigned.set(key, p);
      used.add(p);
    }
  }

  for (const ircaParam of IRCA_PARAMETERS) {
    const measuredParam = assigned.get(ircaParam.id ?? ircaParam.name);

    if (!measuredParam) {
      missingParameters.push(ircaParam.name);
      continue;
    }

    const compliance = evaluateCompliance(measuredParam, ircaParam);
    const shown = `${measuredParam.censored ?? ""}${measuredParam.value}`;

    if (compliance === "indeterminado") {
      // No se puede decidir: fuera del numerador y del denominador, y se informa.
      indeterminate.push(`${ircaParam.name} (${shown} ${ircaParam.unit})`);
      missingParameters.push(ircaParam.name);
      continue;
    }

    totalRiskScore += ircaParam.riskScore;
    const complies = compliance === "cumple";
    if (!complies) {
      nonCompliantRiskScore += ircaParam.riskScore;
    }

    const standardDisplay =
      ircaParam.minValue !== undefined && ircaParam.maxValue !== undefined
        ? `${ircaParam.minValue} - ${ircaParam.maxValue}`
        : ircaParam.maxValue !== undefined
          ? `≤ ${ircaParam.maxValue}`
          : ircaParam.minValue !== undefined
            ? `≥ ${ircaParam.minValue}`
            : "—";

    details.push({
      parameter: ircaParam.name,
      measuredValue: measuredParam.value,
      unit: ircaParam.unit,
      standard: ircaParam.maxValue ?? ircaParam.minValue,
      standardDisplay,
      complies,
      contribution: ircaParam.riskScore,
      value: complies ? "Cumple" : "No cumple",
      description: complies
        ? `${shown} ${ircaParam.unit} cumple con la norma`
        : `${shown} ${ircaParam.unit} NO cumple con la norma`,
    });
  }

  const unrecognized = sample.parameters.filter((p) => !used.has(p)).map((p) => p.name);
  // Un duplicado de una característica ya asignada tampoco se usa: se informa igual.

  // Si no se midió ningún parámetro IRCA ni hay override, no se puede calcular
  if (totalRiskScore === 0 && overrides.length === 0) {
    return null;
  }

  // %IRCA (art. 14) y parágrafo del art. 13
  const formulaValue = totalRiskScore === 0 ? 0 : (nonCompliantRiskScore / totalRiskScore) * 100;
  const ircaValue = overrides.length > 0 ? 100 : formulaValue;

  const category = getIRCARiskCategory(ircaValue);

  const scope: IRCAScope = {
    calculatedOn: details.length,
    totalCharacteristics: IRCA_PARAMETERS.length,
    analyzedScore: totalRiskScore,
    notAnalyzed: missingParameters,
    unrecognized,
    indeterminate,
    overrides,
    formulaValue: Math.round(formulaValue * 100) / 100,
    reminder: IRCA_SCOPE_REMINDER,
  };

  return {
    value: Math.round(ircaValue * 100) / 100, // 2 decimales
    category: category.category,
    riskLevel: category.description,
    details: details.sort((a, b) => {
      // Ordenar: primero los que no cumplen
      if (!a.complies && b.complies) return -1;
      if (a.complies && !b.complies) return 1;
      return 0;
    }),
    missingParameters:
      missingParameters.length > 0 ? missingParameters : undefined,
    calculationDate: new Date(),
    scope,
  };
}

/** Texto de una línea sobre qué características sustentan el resultado. */
export function describeIRCAScope(scope: IRCAScope): string {
  return `Calculado sobre ${scope.calculatedOn} de las ${scope.totalCharacteristics} características del Cuadro 6 (suma de puntajes analizados: ${scope.analyzedScore} de 100).`;
}

export interface MonthlyIRCA {
  /** yyyy-mm */
  month: string;
  /** Art. 14: Σ IRCA por muestra / número de muestras del mes. */
  value: number;
  category: string;
  riskLevel?: string;
  /** Muestras con IRCA calculable que entraron al promedio. */
  sampleCount: number;
  /** Muestras del mes que no pudieron calcularse (sin ninguna característica reconocible) y no entran. */
  excludedSamples: number;
  perSample: Array<{ id: string; location: string; date: string; irca: number }>;
}

/**
 * IRCA mensual (art. 14): promedio simple de los IRCA de las muestras realizadas en el mes.
 * El llamador debe pasar las muestras de UN sistema de suministro. Agrupa por mes de
 * `sampleDate` (yyyy-mm-dd) o `date`.
 */
export function calculateMonthlyIRCA(samples: WaterSample[]): MonthlyIRCA[] {
  const byMonth = new Map<string, WaterSample[]>();
  for (const s of samples) {
    const d = s.sampleDate ?? (s.date ? s.date.toISOString().slice(0, 10) : "");
    const m = /^(\d{4})-(\d{2})/.exec(d);
    if (!m) continue;
    const key = `${m[1]}-${m[2]}`;
    byMonth.set(key, [...(byMonth.get(key) ?? []), s]);
  }

  const out: MonthlyIRCA[] = [];
  for (const [month, list] of [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const perSample: MonthlyIRCA["perSample"] = [];
    let excluded = 0;
    for (const s of list) {
      const r = calculateIRCA(s);
      if (!r) {
        excluded++;
        continue;
      }
      perSample.push({
        id: s.id,
        location: s.location,
        date: s.sampleDate ?? "",
        irca: r.value,
      });
    }
    if (perSample.length === 0) continue;
    const mean = perSample.reduce((acc, x) => acc + x.irca, 0) / perSample.length;
    const value = Math.round(mean * 100) / 100;
    const cat = getIRCARiskCategory(value);
    out.push({
      month,
      value,
      category: cat.category,
      riskLevel: cat.description,
      sampleCount: perSample.length,
      excludedSamples: excluded,
      perSample,
    });
  }
  return out;
}

/**
 * Genera un resumen textual del resultado IRCA
 */
export function getIRCASummary(result: IndexResult): string {
  const nonCompliant = result.details.filter((d) => !d.complies);

  if (result.scope && result.scope.overrides.length > 0) {
    return `IRCA = 100 por el parágrafo del art. 13 de la Res. 2115/2007: ${result.scope.overrides.map((o) => o.motivo).join("; ")}.`;
  }

  if (nonCompliant.length === 0) {
    return `Las ${result.details.length} características analizadas cumplen con los valores máximos aceptables (IRCA sobre ${result.details.length} de 22 características del Cuadro 6).`;
  }

  return `${nonCompliant.length} de ${result.details.length} parámetros no cumplen: ${nonCompliant.map((d) => d.parameter).join(", ")}.`;
}

/**
 * Exporta los datos del cálculo para propósitos educativos
 */
export function explainIRCACalculation(
  sample: WaterSample,
  result: IndexResult
): string {
  const lines: string[] = [];

  lines.push("=== CÁLCULO DEL ÍNDICE IRCA ===\n");
  lines.push(
    "IRCA (Índice de Riesgo de la Calidad del Agua para Consumo Humano)"
  );
  lines.push("Resolución 2115 de 2007 - Colombia (arts. 13-15)\n");

  lines.push(`Muestra: ${sample.location}`);
  const dateStr = sample.sampleDate || (sample.date ? sample.date.toLocaleDateString() : "N/A");
  lines.push(`Fecha: ${dateStr}\n`);

  lines.push("Fórmula:");
  lines.push(
    "%IRCA = (Σ puntajes NO conformes / Σ puntajes analizados) × 100\n"
  );

  lines.push("Parámetros analizados:");
  let totalScore = 0;
  let nonCompliantScore = 0;

  for (const detail of result.details) {
    totalScore += detail.contribution || 0;
    if (!detail.complies) {
      nonCompliantScore += detail.contribution || 0;
    }

    const status = detail.complies ? "✓ CUMPLE" : "✗ NO CUMPLE";
    lines.push(
      `  ${detail.parameter}: ${detail.measuredValue} ${detail.unit} (Norma: ${detail.standardDisplay || detail.standard} ${detail.unit}) - ${status} [${detail.contribution} puntos]`
    );
  }

  lines.push(`\nTotal puntajes analizados: ${totalScore}`);
  lines.push(`Total puntajes NO conformes: ${nonCompliantScore}`);
  lines.push(
    `\n%IRCA (fórmula) = (${nonCompliantScore} / ${totalScore}) × 100 = ${totalScore === 0 ? 0 : Math.round((nonCompliantScore / totalScore) * 10000) / 100}%`
  );

  if (result.scope && result.scope.overrides.length > 0) {
    lines.push("\nPARÁGRAFO DEL ART. 13: se asigna IRCA = 100 \"independientemente de los otros resultados\":");
    for (const o of result.scope.overrides) lines.push(`  • ${o.motivo} [${o.cita}]`);
  }
  lines.push(`\nIRCA = ${result.value}%`);
  lines.push(`Categoría: ${result.category}`);
  lines.push(`Descripción: ${result.riskLevel}`);

  if (result.scope) {
    lines.push(`\n${describeIRCAScope(result.scope)}`);
    if (result.scope.notAnalyzed.length > 0) {
      lines.push(`Características del Cuadro 6 no analizadas (${result.scope.notAnalyzed.length}): ${result.scope.notAnalyzed.join(", ")}`);
    }
    if (result.scope.indeterminate.length > 0) {
      lines.push(`Resultados censurados que no permiten decidir cumplimiento (excluidos del cálculo): ${result.scope.indeterminate.join(", ")}`);
    }
    if (result.scope.unrecognized.length > 0) {
      lines.push(`Parámetros del archivo que no se reconocieron y NO entraron al cálculo: ${result.scope.unrecognized.join(", ")}`);
    }
    lines.push(`\n${result.scope.reminder}`);
  }

  return lines.join("\n");
}
