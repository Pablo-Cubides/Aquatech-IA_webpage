// Utilidades para calcular el NSF Water Quality Index (WQI)

import type { WaterSample, IndexResult, IndexDetail } from "../types";
import {
  WQI_PARAMETERS,
  interpolateQi,
  getWQICategory,
} from "../data/wqi-parameters";

/**
 * Calcula el índice WQI (NSF) para una muestra de agua
 */
export function calculateWQI(sample: WaterSample): IndexResult | null {
  const details: IndexDetail[] = [];
  let totalWeight = 0;
  let weightedSum = 0;
  const missingParameters: string[] = [];

  // Iterar sobre los parámetros WQI
  for (const wqiParam of WQI_PARAMETERS) {
    // Buscar si este parámetro fue medido
    const measuredParam = sample.parameters.find(
      (p) =>
        p.name.toLowerCase() === wqiParam.name.toLowerCase() ||
        p.name.toLowerCase().includes(wqiParam.name.toLowerCase()) ||
        (wqiParam.name === "DBO5" && p.name.toUpperCase().includes("DBO"))
    );

    if (measuredParam) {
      // Calcular Qi usando interpolación de curvas
      const qi = interpolateQi(wqiParam.name, measuredParam.value);

      // Acumular peso y suma ponderada
      totalWeight += wqiParam.weight;
      weightedSum += wqiParam.weight * qi;

      details.push({
        parameter: wqiParam.name,
        measuredValue: measuredParam.value,
        unit: wqiParam.unit,
        complies: qi >= 50, // Arbitrario: Qi >= 50 es "aceptable"
        qi: Math.round(qi * 100) / 100,
        weight: wqiParam.weight,
      });
    } else {
      missingParameters.push(wqiParam.name);
    }
  }

  // Si no hay parámetros medidos, no se puede calcular
  if (totalWeight === 0) {
    return null;
  }

  // Calcular WQI normalizado
  const wqiValue = weightedSum / totalWeight;

  // Obtener categoría
  const category = getWQICategory(wqiValue);

  return {
    value: Math.round(wqiValue * 100) / 100,
    category: category.category,
    riskLevel: category.description,
    details: details.sort((a, b) => (b.weight || 0) - (a.weight || 0)), // Ordenar por peso
    missingParameters:
      missingParameters.length > 0 ? missingParameters : undefined,
    calculationDate: new Date(),
  };
}

/**
 * Genera un resumen textual del resultado WQI
 */
export function getWQISummary(result: IndexResult): string {
  const parametersCount = result.details.length;
  const totalParams = WQI_PARAMETERS.length;

  if (parametersCount === totalParams) {
    return `Índice WQI calculado con los ${totalParams} parámetros NSF estándar.`;
  }

  return `Índice WQI calculado con ${parametersCount} de ${totalParams} parámetros NSF. ${result.missingParameters ? `Faltan: ${result.missingParameters.slice(0, 3).join(", ")}${result.missingParameters.length > 3 ? "..." : ""}.` : ""}`;
}

/**
 * Exporta los datos del cálculo para propósitos educativos
 */
export function explainWQICalculation(
  sample: WaterSample,
  result: IndexResult
): string {
  const lines: string[] = [];

  lines.push("=== CÁLCULO DEL ÍNDICE WQI ===\n");
  lines.push("NSF Water Quality Index (Índice de Calidad del Agua NSF)");
  lines.push("Método de suma ponderada con 9 parámetros\n");

  lines.push(`Muestra: ${sample.location}`);
  lines.push(`Fecha: ${sample.date.toLocaleDateString()}\n`);

  lines.push("Fórmula:");
  lines.push("WQI = Σ(Wi × Qi) / ΣWi");
  lines.push(
    "donde Wi = peso del parámetro, Qi = subíndice de calidad (0-100)\n"
  );

  lines.push("Parámetros medidos:");

  let totalWeight = 0;
  let weightedSum = 0;

  for (const detail of result.details) {
    totalWeight += detail.weight || 0;
    weightedSum += (detail.weight || 0) * (detail.qi || 0);

    lines.push(
      `  ${detail.parameter}: ${detail.measuredValue} ${detail.unit}`
    );
    lines.push(`    → Qi = ${detail.qi?.toFixed(2)} (peso = ${detail.weight})`);
    lines.push(
      `    → Contribución: ${detail.weight} × ${detail.qi?.toFixed(2)} = ${((detail.weight || 0) * (detail.qi || 0)).toFixed(2)}`
    );
  }

  lines.push(`\nSuma de pesos (ΣWi): ${totalWeight.toFixed(3)}`);
  lines.push(
    `Suma ponderada (Σ(Wi × Qi)): ${weightedSum.toFixed(2)}`
  );
  lines.push(
    `\nWQI = ${weightedSum.toFixed(2)} / ${totalWeight.toFixed(3)} = ${result.value}`
  );
  lines.push(`\nCategoría: ${result.category}`);
  lines.push(`Descripción: ${result.riskLevel}`);

  if (result.missingParameters && result.missingParameters.length > 0) {
    lines.push(
      `\nParámetros no medidos (${result.missingParameters.length}):`
    );
    lines.push(`  ${result.missingParameters.join(", ")}`);
    lines.push(
      "\nNOTA: El WQI fue normalizado usando solo los parámetros disponibles."
    );
  }

  return lines.join("\n");
}
