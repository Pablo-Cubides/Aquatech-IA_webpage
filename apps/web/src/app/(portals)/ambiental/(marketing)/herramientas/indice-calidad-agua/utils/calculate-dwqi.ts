// Utilidades para calcular el Drinking Water Quality Index (DWQI)
// Método WA-WQI (Weighted Arithmetic Water Quality Index)

import type { WaterSample, IndexResult, IndexDetail } from "../types";
import {
  DWQI_PARAMETERS,
  getDWQICategory,
} from "../data/dwqi-parameters";

/**
 * Calcula el subíndice Qi para un parámetro DWQI
 */
function calculateQi(
  measuredValue: number,
  standard: number,
  idealValue: number
): number {
  // Si el valor ideal es 0 (mayoría de contaminantes)
  if (idealValue === 0 || idealValue === undefined) {
    return (measuredValue / standard) * 100;
  }

  // Para parámetros con valor ideal distinto de 0 (pH, cloro residual)
  // Qi = [(Ci - Vi) / (Si - Vi)] × 100
  if (measuredValue <= idealValue) {
    return 0; // Si está por debajo del ideal, calidad perfecta
  }

  return ((measuredValue - idealValue) / (standard - idealValue)) * 100;
}

/**
 * Calcula el índice DWQI para una muestra de agua
 */
export function calculateDWQI(sample: WaterSample): IndexResult | null {
  const details: IndexDetail[] = [];
  const missingParameters: string[] = [];
  
  // Paso 1: Identificar parámetros medidos y calcular Qi
  const measuredParams: Array<{
    name: string;
    value: number;
    unit: string;
    standard: number;
    idealValue: number;
    qi: number;
  }> = [];

  for (const dwqiParam of DWQI_PARAMETERS) {
    const measuredParam = sample.parameters.find(
      (p) =>
        p.name.toLowerCase() === dwqiParam.name.toLowerCase() ||
        p.name.toLowerCase().includes(dwqiParam.name.toLowerCase())
    );

    if (measuredParam) {
      const qi = calculateQi(
        measuredParam.value,
        dwqiParam.standard,
        dwqiParam.idealValue
      );

      measuredParams.push({
        name: dwqiParam.name,
        value: measuredParam.value,
        unit: dwqiParam.unit,
        standard: dwqiParam.standard,
        idealValue: dwqiParam.idealValue,
        qi,
      });
    } else {
      missingParameters.push(dwqiParam.name);
    }
  }

  // Si no hay parámetros medidos
  if (measuredParams.length === 0) {
    return null;
  }

  // Paso 2: Calcular constante K
  // K = 1 / Σ(1/Si)
  const sumInverseStandards = measuredParams.reduce(
    (sum, p) => sum + 1 / p.standard,
    0
  );
  const K = 1 / sumInverseStandards;

  // Paso 3: Calcular pesos Wi
  // Wi = K / Si
  const paramsWithWeights = measuredParams.map((p) => ({
    ...p,
    weight: K / p.standard,
  }));

  // Verificar que los pesos sumen aproximadamente 1
  const totalWeight = paramsWithWeights.reduce((sum, p) => sum + p.weight, 0);

  // Paso 4: Calcular DWQI
  // DWQI = Σ(Qi × Wi) / ΣWi
  const weightedSum = paramsWithWeights.reduce(
    (sum, p) => sum + p.qi * p.weight,
    0
  );
  const dwqiValue = weightedSum / totalWeight;

  // Paso 5: Preparar detalles
  for (const p of paramsWithWeights) {
    details.push({
      parameter: p.name,
      measuredValue: p.value,
      unit: p.unit,
      standard: p.standard,
      complies: p.value <= p.standard,
      qi: Math.round(p.qi * 100) / 100,
      weight: Math.round(p.weight * 10000) / 10000, // 4 decimales
      contribution: Math.round(p.qi * p.weight * 100) / 100,
    });
  }

  // Obtener categoría
  const category = getDWQICategory(dwqiValue);

  return {
    value: Math.round(dwqiValue * 100) / 100,
    category: category.category,
    riskLevel: category.description,
    details: details.sort((a, b) => (b.qi || 0) - (a.qi || 0)), // Ordenar por Qi descendente
    missingParameters:
      missingParameters.length > 0 ? missingParameters : undefined,
    calculationDate: new Date(),
  };
}

/**
 * Genera un resumen textual del resultado DWQI
 */
export function getDWQISummary(result: IndexResult): string {
  const exceededParams = result.details.filter(
    (d) => (d.qi || 0) > 100
  );

  if (exceededParams.length === 0) {
    return `Todos los ${result.details.length} parámetros están dentro de los límites aceptables.`;
  }

  return `${exceededParams.length} de ${result.details.length} parámetros exceden el estándar: ${exceededParams.map((d) => d.parameter).join(", ")}.`;
}

/**
 * Exporta los datos del cálculo para propósitos educativos
 */
export function explainDWQICalculation(
  sample: WaterSample,
  result: IndexResult
): string {
  const lines: string[] = [];

  lines.push("=== CÁLCULO DEL ÍNDICE DWQI ===\n");
  lines.push(
    "Drinking Water Quality Index (Índice de Calidad de Agua Potable)"
  );
  lines.push("Método WA-WQI (Weighted Arithmetic Water Quality Index)\n");

  lines.push(`Muestra: ${sample.location}`);
  lines.push(`Fecha: ${sample.date.toLocaleDateString()}\n`);

  lines.push("Fórmula:");
  lines.push("DWQI = Σ(Qi × Wi) / ΣWi");
  lines.push("donde:");
  lines.push("  Qi = [(Ci - Vi) / (Si - Vi)] × 100 (calidad relativa)");
  lines.push("  Wi = K / Si (peso relativo)");
  lines.push("  K = 1 / Σ(1/Si) (constante de proporcionalidad)");
  lines.push("  Ci = concentración medida");
  lines.push("  Si = valor estándar (límite)");
  lines.push("  Vi = valor ideal\n");

  // Calcular K
  const sumInverseStandards = result.details.reduce(
    (sum, d) => sum + 1 / (d.standard || 1),
    0
  );
  const K = 1 / sumInverseStandards;

  lines.push(`Constante K = 1 / Σ(1/Si) = ${K.toFixed(6)}\n`);

  lines.push("Parámetros medidos:");

  let totalWeight = 0;
  let weightedSum = 0;

  for (const detail of result.details) {
    totalWeight += detail.weight || 0;
    weightedSum += detail.contribution || 0;

    lines.push(`\n  ${detail.parameter}:`);
    lines.push(`    Medido (Ci) = ${detail.measuredValue} ${detail.unit}`);
    lines.push(`    Estándar (Si) = ${detail.standard} ${detail.unit}`);
    lines.push(`    Qi = ${detail.qi?.toFixed(2)}`);
    lines.push(`    Wi = ${detail.weight?.toFixed(6)}`);
    lines.push(
      `    Contribución = Qi × Wi = ${detail.contribution?.toFixed(2)}`
    );
    lines.push(
      `    Estado: ${detail.complies ? "✓ Dentro del límite" : "✗ Excede el límite"}`
    );
  }

  lines.push(`\nSuma de pesos (ΣWi): ${totalWeight.toFixed(6)}`);
  lines.push(
    `Suma ponderada (Σ(Qi × Wi)): ${weightedSum.toFixed(2)}`
  );
  lines.push(
    `\nDWQI = ${weightedSum.toFixed(2)} / ${totalWeight.toFixed(6)} = ${result.value}`
  );
  lines.push(`\nCategoría: ${result.category}`);
  lines.push(`Descripción: ${result.riskLevel}`);

  if (result.missingParameters && result.missingParameters.length > 0) {
    lines.push(
      `\nParámetros no medidos (${result.missingParameters.length}):`
    );
    lines.push(`  ${result.missingParameters.join(", ")}`);
  }

  return lines.join("\n");
}
