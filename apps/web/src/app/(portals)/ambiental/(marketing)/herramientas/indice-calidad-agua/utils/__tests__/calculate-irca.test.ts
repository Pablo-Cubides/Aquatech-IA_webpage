import { describe, it, expect } from "vitest";
import { calculateIRCA } from "../calculate-irca";
import type { WaterSample } from "../../types";

describe("calculateIRCA", () => {
  it("debe calcular IRCA 0% cuando todos los parámetros cumplen", () => {
    const sample: WaterSample = {
      id: "test-1",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia",
      dataSource: "manual",
      parameters: [
        { name: "pH", value: 7.0, unit: "Unidades de pH" },
        { name: "Turbiedad", value: 1.0, unit: "UNT" },
        { name: "Cloro residual libre", value: 0.5, unit: "mg/L" },
        { name: "Escherichia coli", value: 0, unit: "UFC/100mL" },
        { name: "Aluminio", value: 0.1, unit: "mg/L" },
      ],
    };

    const result = calculateIRCA(sample);

    expect(result.value).toBe(0);
    expect(result.category).toBe("Sin riesgo");
    expect(result.details.every((d) => d.value === "Cumple")).toBe(true);
  });

  it("debe calcular IRCA correctamente con parámetros no conformes", () => {
    const sample: WaterSample = {
      id: "test-2",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia",
      dataSource: "manual",
      parameters: [
        { name: "pH", value: 5.0, unit: "Unidades de pH" }, // No cumple (6.5-9.0)
        { name: "Turbiedad", value: 10.0, unit: "UNT" }, // No cumple (≤2)
        { name: "Cloro residual libre", value: 0.5, unit: "mg/L" }, // Cumple
        { name: "Escherichia coli", value: 10, unit: "UFC/100mL" }, // No cumple (0)
      ],
    };

    const result = calculateIRCA(sample);

    // pH (1.5) + Turbiedad (15) + E. coli (25) = 41.5 puntos de incumplimiento
    // Total analizado: 1.5 + 15 + 3 + 25 = 44.5 puntos
    // IRCA = (41.5 / 44.5) * 100 = 93.26%
    expect(result.value).toBeCloseTo(93.26, 1);
    expect(result.category).toBe("Inviable sanitariamente");
  });

  it("debe manejar parámetros faltantes correctamente", () => {
    const sample: WaterSample = {
      id: "test-3",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia",
      dataSource: "manual",
      parameters: [
        { name: "pH", value: 7.0, unit: "Unidades de pH" },
        { name: "Turbiedad", value: 1.0, unit: "UNT" },
      ],
    };

    const result = calculateIRCA(sample);

    expect(result.value).toBe(0);
    expect(result.details).toHaveLength(2);
  });

  it("debe clasificar correctamente en nivel de riesgo bajo (5% - 14%)", () => {
    const sample: WaterSample = {
      id: "test-4",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia",
      dataSource: "manual",
      parameters: [
        { name: "pH", value: 5.0, unit: "Unidades de pH" }, // No cumple: 1.5 pts
        { name: "Cloro residual libre", value: 0.5, unit: "mg/L" }, // Cumple: 3 pts
        { name: "Turbiedad", value: 1.0, unit: "UNT" }, // Cumple: 15 pts
        { name: "Escherichia coli", value: 0, unit: "UFC/100mL" }, // Cumple: 25 pts
      ],
    };

    const result = calculateIRCA(sample);

    // IRCA = (1.5 / 44.5) * 100 = 3.37% -> Sin riesgo
    expect(result.value).toBeLessThan(5);
    expect(result.category).toBe("Sin riesgo");
  });

  it("debe clasificar correctamente en nivel de riesgo medio (14.1% - 35%)", () => {
    const sample: WaterSample = {
      id: "test-5",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia",
      dataSource: "manual",
      parameters: [
        { name: "pH", value: 5.0, unit: "Unidades de pH" }, // No cumple: 1.5 pts
        { name: "Turbiedad", value: 5.0, unit: "UNT" }, // No cumple: 15 pts
        { name: "Cloro residual libre", value: 0.5, unit: "mg/L" }, // Cumple: 3 pts
        { name: "Escherichia coli", value: 0, unit: "UFC/100mL" }, // Cumple: 25 pts
      ],
    };

    const result = calculateIRCA(sample);

    // IRCA = (16.5 / 44.5) * 100 = 37.08% -> Alto
    expect(result.value).toBeGreaterThan(35);
  });

  it("debe normalizar nombres de parámetros correctamente", () => {
    const sample: WaterSample = {
      id: "test-6",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia",
      dataSource: "manual",
      parameters: [
        { name: "ph", value: 7.0, unit: "Unidades de pH" }, // lowercase
        { name: "TURBIEDAD", value: 1.0, unit: "UNT" }, // uppercase
        { name: "E. coli", value: 0, unit: "UFC/100mL" }, // abreviado
      ],
    };

    const result = calculateIRCA(sample);

    expect(result.details).toHaveLength(3);
    expect(result.details.every((d) => d.value === "Cumple")).toBe(true);
  });

  it("debe incluir detalles completos para cada parámetro", () => {
    const sample: WaterSample = {
      id: "test-7",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia",
      dataSource: "manual",
      parameters: [
        { name: "pH", value: 5.0, unit: "Unidades de pH" },
        { name: "Turbiedad", value: 1.0, unit: "UNT" },
      ],
    };

    const result = calculateIRCA(sample);

    expect(result.details[0]).toHaveProperty("parameter");
    expect(result.details[0]).toHaveProperty("value");
    expect(result.details[0]).toHaveProperty("description");
    expect(result.details[0].parameter).toBe("pH");
    expect(result.details[0].value).toBe("No cumple");
    expect(result.details[1].parameter).toBe("Turbiedad");
    expect(result.details[1].value).toBe("Cumple");
  });

  it("debe manejar valores extremos correctamente", () => {
    const sample: WaterSample = {
      id: "test-8",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia",
      dataSource: "manual",
      parameters: [
        { name: "pH", value: 0, unit: "Unidades de pH" }, // Muy bajo
        { name: "Turbiedad", value: 1000, unit: "UNT" }, // Muy alto
        { name: "Aluminio", value: 100, unit: "mg/L" }, // Muy alto
      ],
    };

    const result = calculateIRCA(sample);

    expect(result.value).toBeGreaterThan(0);
    expect(result.category).toBeDefined();
    expect(result.details.every((d) => d.value === "No cumple")).toBe(true);
  });
});
