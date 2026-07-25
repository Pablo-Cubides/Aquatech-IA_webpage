// Utilidades para calcular el NSF Water Quality Index (WQI)

import type { WaterSample, IndexResult, IndexDetail } from "../types";
import {
  WQI_PARAMETERS,
  interpolateQi,
  getWQICategory,
} from "../data/wqi-parameters";

/**
 * Normaliza nombres de parámetros para mejor coincidencia
 */
function normalizeParameterName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9]/g, ""); // Solo letras y números
}

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
    const normalizedWqiName = normalizeParameterName(wqiParam.name);
    const measuredParam = sample.parameters.find(
      (p) => {
        const normalizedParamName = normalizeParameterName(p.name);
        
        // Prevent mismatch between Nitratos and Nitritos
        if (
          (normalizedWqiName.includes("nitrato") && normalizedParamName.includes("nitrito")) ||
          (normalizedWqiName.includes("nitrito") && normalizedParamName.includes("nitrato"))
        ) {
          return false;
        }

        // Matching exacto o por inclusión
        if (normalizedParamName === normalizedWqiName) return true;
        if (normalizedParamName.includes(normalizedWqiName)) return true;
        if (normalizedWqiName.includes(normalizedParamName)) return true;
        // Casos especiales
        if (wqiParam.name === "DBO5" && normalizedParamName.includes("dbo")) return true;
        if (wqiParam.name === "Temperatura" && normalizedParamName.includes("temp")) return true;
        return false;
      }
    );

    if (measuredParam) {
      // Calcular Qi usando interpolación de curvas
      const qi = interpolateQi(wqiParam.name, measuredParam.value);
      
      // Si el Qi es 0 o negativo, saltar este parámetro
      if (qi <= 0) continue;
      
      // Si el Qi es 0 o negativo, saltar este parámetro
      if (qi <= 0) continue;

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
        value: `Qi: ${Math.round(qi * 100) / 100}`,
        description: `Valor medido: ${measuredParam.value} ${wqiParam.unit}, Índice de calidad: ${Math.round(qi * 100) / 100}, Peso: ${wqiParam.weight}`,
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
  const dateStr = sample.sampleDate || (sample.date ? sample.date.toLocaleDateString() : "N/A");
  lines.push(`Fecha: ${dateStr}\n`);

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
