// Utilidades para calcular el índice IRCA (Índice de Riesgo de la Calidad del Agua)
// Basado en la Resolución 2115 de 2007 - Colombia

import type { WaterSample, IndexResult, IndexDetail } from "../types";
import {
  IRCA_PARAMETERS,
  getIRCARiskCategory,
  type IRCAParameter,
} from "../data/irca-parameters";

/**
 * Verifica si un parámetro cumple con la norma IRCA
 */
function parameterComplies(
  value: number,
  parameter: IRCAParameter
): boolean {
  // Si tiene mínimo y máximo (como pH)
  if (parameter.minValue !== undefined && parameter.maxValue !== undefined) {
    return value >= parameter.minValue && value <= parameter.maxValue;
  }

  // Si solo tiene máximo
  if (parameter.maxValue !== undefined) {
    return value <= parameter.maxValue;
  }

  // Si solo tiene mínimo
  if (parameter.minValue !== undefined) {
    return value >= parameter.minValue;
  }

  return true;
}

/**
 * Calcula el índice IRCA para una muestra de agua
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

  // Iterar sobre todos los parámetros IRCA
  for (const ircaParam of IRCA_PARAMETERS) {
    // Buscar si este parámetro fue medido en la muestra
    const measuredParam = sample.parameters.find(
      (p) =>
        p.name.toLowerCase() === ircaParam.name.toLowerCase() ||
        p.name.toLowerCase().includes(ircaParam.name.toLowerCase())
    );

    if (measuredParam) {
      // El parámetro fue analizado
      totalRiskScore += ircaParam.riskScore;

      const complies = parameterComplies(measuredParam.value, ircaParam);

      if (!complies) {
        // No cumple, suma al numerador
        nonCompliantRiskScore += ircaParam.riskScore;
      }

      details.push({
        parameter: ircaParam.name,
        measuredValue: measuredParam.value,
        unit: ircaParam.unit,
        standard: ircaParam.maxValue || ircaParam.minValue,
        complies,
        contribution: ircaParam.riskScore,
      });
    } else {
      // Parámetro no fue medido
      missingParameters.push(ircaParam.name);
    }
  }

  // Si no se midió ningún parámetro IRCA, no se puede calcular
  if (totalRiskScore === 0) {
    return null;
  }

  // Calcular %IRCA
  const ircaValue = (nonCompliantRiskScore / totalRiskScore) * 100;

  // Obtener categoría de riesgo
  const category = getIRCARiskCategory(ircaValue);

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
  };
}

/**
 * Genera un resumen textual del resultado IRCA
 */
export function getIRCASummary(result: IndexResult): string {
  const nonCompliant = result.details.filter((d) => !d.complies);

  if (nonCompliant.length === 0) {
    return `Agua apta para consumo humano. Todos los ${result.details.length} parámetros analizados cumplen con la norma.`;
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
  lines.push("Resolución 2115 de 2007 - Colombia\n");

  lines.push(`Muestra: ${sample.location}`);
  lines.push(`Fecha: ${sample.date.toLocaleDateString()}\n`);

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
      `  ${detail.parameter}: ${detail.measuredValue} ${detail.unit} (Norma: ${detail.standard} ${detail.unit}) - ${status} [${detail.contribution} puntos]`
    );
  }

  lines.push(`\nTotal puntajes analizados: ${totalScore}`);
  lines.push(`Total puntajes NO conformes: ${nonCompliantScore}`);
  lines.push(
    `\n%IRCA = (${nonCompliantScore} / ${totalScore}) × 100 = ${result.value}%`
  );
  lines.push(`\nCategoría: ${result.category}`);
  lines.push(`Descripción: ${result.riskLevel}`);

  if (result.missingParameters && result.missingParameters.length > 0) {
    lines.push(
      `\nParámetros no analizados (${result.missingParameters.length}):`
    );
    lines.push(`  ${result.missingParameters.join(", ")}`);
  }

  return lines.join("\n");
}
