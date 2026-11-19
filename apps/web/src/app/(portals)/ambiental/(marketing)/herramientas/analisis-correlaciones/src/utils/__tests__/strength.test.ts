import { describe, expect, it } from "vitest";
import { STRENGTH_LEGEND, STRENGTH_THRESHOLDS, classifyStrength, type CorrelationStrength } from "../correlations";
import { getStrengthColor } from "../../../components/CorrelationTable";
import { getColor } from "../../../components/CorrelationHeatmap";
import { getSummaryColor } from "../../../app/ResultsSection";

/**
 * CONT-008: la escala de fuerza de una correlación vive UNA vez (STRENGTH_THRESHOLDS en correlations.ts) y la
 * usan la tabla, el mapa de calor, el resumen, el PDF y la página "acerca de". Esta prueba falla si alguno
 * clasifica distinto un mismo valor.
 */

const FROM_TABLE: Record<string, CorrelationStrength> = {
  "text-blue-600": "strong",
  "text-yellow-600": "moderate",
  "text-red-600": "weak",
};
const FROM_HEATMAP: Record<string, CorrelationStrength> = {
  "bg-blue-400 text-white": "strong",
  "bg-yellow-300 text-gray-900": "moderate",
  "bg-red-300 text-gray-900": "weak",
};
// El resumen tiene tres estados: fuerte en verde, débil en gris, moderada neutra.
const FROM_SUMMARY: Record<string, CorrelationStrength> = {
  "text-green-600": "strong",
  "text-gray-700": "moderate",
  "text-gray-400": "weak",
};

describe("classifyStrength: una sola escala", () => {
  it("usa los umbrales exportados (fuerte > 0.75, moderada >= 0.4)", () => {
    expect(STRENGTH_THRESHOLDS).toEqual({ strong: 0.75, moderate: 0.4 });
  });

  it("clasifica los casos de referencia, con signo y en las fronteras", () => {
    expect(classifyStrength(0.72)).toBe("moderate");
    expect(classifyStrength(0.35)).toBe("weak");
    expect(classifyStrength(0.75)).toBe("moderate"); // "> 0.75": la frontera no es fuerte
    expect(classifyStrength(0.7501)).toBe("strong");
    expect(classifyStrength(0.4)).toBe("moderate");
    expect(classifyStrength(0.3999)).toBe("weak");
    expect(classifyStrength(-0.9)).toBe("strong");
    expect(classifyStrength(-0.5)).toBe("moderate");
    expect(classifyStrength(-0.1)).toBe("weak");
    expect(classifyStrength(0)).toBe("weak");
    expect(classifyStrength(1)).toBe("strong");
  });

  it("un coeficiente no definido (null, undefined, NaN) cuenta como débil, como antes (|| 0)", () => {
    expect(classifyStrength(null)).toBe("weak");
    expect(classifyStrength(undefined)).toBe("weak");
    expect(classifyStrength(Number.NaN)).toBe("weak");
  });

  it("las leyendas se generan de la misma constante", () => {
    expect(STRENGTH_LEGEND.strong).toBe("Fuerte (> 0.75)");
    expect(STRENGTH_LEGEND.moderate).toBe("Moderada (0.4–0.75)");
    expect(STRENGTH_LEGEND.weak).toBe("Débil (< 0.4)");
  });
});

describe("tabla, mapa de calor y resumen clasifican igual el mismo valor", () => {
  const values = [-1, -0.9, -0.76, -0.75, -0.72, -0.5, -0.4, -0.3999, -0.35, -0.1, 0, 0.1, 0.29, 0.3, 0.35, 0.3999, 0.4, 0.5, 0.69, 0.7, 0.72, 0.74, 0.75, 0.7501, 0.76, 0.9, 1];

  it.each(values)("%s", (value) => {
    const expected = classifyStrength(value);
    expect(FROM_TABLE[getStrengthColor(value)], "tabla").toBe(expected);
    expect(FROM_HEATMAP[getColor(value)], "mapa de calor").toBe(expected);
    expect(FROM_SUMMARY[getSummaryColor(value)], "resumen").toBe(expected);
  });
});
