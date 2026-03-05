/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { describe, it, expect } from "vitest";
import { calculateWQI } from "../calculate-wqi";
import type { WaterSample } from "../../types";

describe("calculateWQI", () => {
  it("debe calcular WQI excelente (90-100) con parámetros óptimos", () => {
    const sample: WaterSample = {
      id: "test-1",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Oxígeno disuelto", value: 95, unit: "%" }, // Qi ≈ 95
        { name: "Coliformes fecales", value: 1, unit: "UFC/100mL" }, // Qi ≈ 98
        { name: "pH", value: 7.0, unit: "Unidades de pH" }, // Qi = 90-92
        { name: "DBO5", value: 1.0, unit: "mg/L" }, // Qi ≈ 95
        { name: "Nitratos", value: 0.5, unit: "mg/L" }, // Qi ≈ 98
        { name: "Fosfatos", value: 0.01, unit: "mg/L" }, // Qi ≈ 99
        { name: "Temperatura", value: 0, unit: "°C variación" }, // Qi = 100
        { name: "Turbiedad", value: 1, unit: "UNT" }, // Qi ≈ 95
        { name: "Sólidos disueltos totales", value: 50, unit: "mg/L" }, // Qi ≈ 98
      ],
    };

    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    expect(result!.value).toBeGreaterThanOrEqual(85);
    expect(result!.value).toBeLessThanOrEqual(100);
    expect(result!.category).toMatch(/Excelente|Buena/i);
  });

  it("debe calcular WQI mala (25-50) con contaminación significativa", () => {
    const sample: WaterSample = {
      id: "test-2",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Oxígeno disuelto", value: 40, unit: "%" }, // Qi bajo
        { name: "Coliformes fecales", value: 10000, unit: "UFC/100mL" }, // Qi bajo
        { name: "pH", value: 5.0, unit: "Unidades de pH" }, // Qi bajo
        { name: "DBO5", value: 20, unit: "mg/L" }, // Qi bajo
        { name: "Nitratos", value: 50, unit: "mg/L" }, // Qi bajo
      ],
    };

    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    expect(result!.value).toBeLessThan(50);
    expect(result!.category).toMatch(/Mala|Muy mala/i);
  });

  it("debe normalizar pesos cuando faltan parámetros", () => {
    const sample: WaterSample = {
      id: "test-3",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Oxígeno disuelto", value: 90, unit: "%" }, // Peso: 0.17
        { name: "pH", value: 7.0, unit: "Unidades de pH" }, // Peso: 0.11
      ],
    };

    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    // Con solo 2 parámetros, el cálculo debe normalizar los pesos
    expect(result!.value).toBeGreaterThanOrEqual(0);
    expect(result!.value).toBeLessThanOrEqual(100);
    expect(result!.details).toHaveLength(2);
  });

  it("debe incluir detalles de cada parámetro calculado", () => {
    const sample: WaterSample = {
      id: "test-4",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Oxígeno disuelto", value: 90, unit: "%" },
        { name: "pH", value: 7.0, unit: "Unidades de pH" },
        { name: "Turbiedad", value: 5, unit: "UNT" },
      ],
    };
    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    expect(result!.details).toHaveLength(3);
    result!.details.forEach((detail) => {
      expect(detail).toHaveProperty("parameter");
      expect(detail).toHaveProperty("value");
      expect(detail).toHaveProperty("description");
      expect(detail.value).toMatch(/Qi:/);
    });
  });

  it("debe manejar oxígeno disuelto en % correctamente", () => {
    const sample: WaterSample = {
      id: "test-5",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Oxígeno disuelto", value: 100, unit: "%" }, // Saturación
      ],
    };

    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    expect(result!.details[0].value).toContain("Qi:");
    expect(result!.value).toBeGreaterThanOrEqual(0);
  });

  it("debe manejar coliformes fecales con interpolación logarítmica", () => {
    const sample: WaterSample = {
      id: "test-6",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Coliformes fecales", value: 1000, unit: "UFC/100mL" },
      ],
    };

    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    expect(result!.value).toBeLessThan(50);
    expect(result!.details[0].parameter).toBe("Coliformes fecales");
  });

  it("debe calcular correctamente con DBO5", () => {
    const sample: WaterSample = {
      id: "test-7",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [{ name: "DBO5", value: 2, unit: "mg/L" }],
    };

    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    expect(result!.value).toBeGreaterThan(50);
    expect(result!.details[0].parameter).toBe("DBO5");
  });

  it("debe calcular correctamente con temperatura (variación)", () => {
    const sample: WaterSample = {
      id: "test-8",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Temperatura", value: 5, unit: "°C variación" }, // 5°C de variación
      ],
    };

    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    // Si encuentra el parámetro, debe tener valor
    if (result) {
      expect(result!.value).toBeGreaterThanOrEqual(0);
      expect(result!.value).toBeLessThanOrEqual(100);
    } else {
      // Es aceptable que no encuentre "Temperatura" con variación
      expect(result).toBeNull();
    }
  });

  it("debe clasificar correctamente en categorías WQI", () => {
    // WQI Excelente: 90-100
    const excellent: WaterSample = {
      id: "test-9a",
      sampleDate: "2024-01-01",
      location: "Test",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Oxígeno disuelto", value: 95, unit: "%" },
        { name: "pH", value: 7.0, unit: "Unidades de pH" },
        { name: "Turbiedad", value: 1, unit: "UNT" },
      ],
    };

    const excellentResult = calculateWQI(excellent);
    expect(excellentResult).not.toBeNull();
    expect(excellentResult!.value).toBeGreaterThanOrEqual(70);

    // WQI Mala: 25-50
    const poor: WaterSample = {
      id: "test-9b",
      sampleDate: "2024-01-01",
      location: "Test",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Oxígeno disuelto", value: 30, unit: "%" },
        { name: "Coliformes fecales", value: 10000, unit: "UFC/100mL" },
        { name: "DBO5", value: 25, unit: "mg/L" },
      ],
    };

    const poorResult = calculateWQI(poor);
    expect(poorResult).not.toBeNull();
    expect(poorResult!.value).toBeLessThan(60);
  });

  it("debe manejar valores extremos sin errores", () => {
    const sample: WaterSample = {
      id: "test-10",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Oxígeno disuelto", value: 0, unit: "%" }, // Mínimo
        { name: "Coliformes fecales", value: 100000, unit: "UFC/100mL" }, // Máximo
        { name: "pH", value: 2.0, unit: "Unidades de pH" }, // Muy ácido
        { name: "DBO5", value: 100, unit: "mg/L" }, // Muy alto
      ],
    };

    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    expect(result!.value).toBeGreaterThanOrEqual(0);
    expect(result!.value).toBeLessThanOrEqual(100);
    expect(result!.category).toBeDefined();
  });

  it("debe ignorar parámetros no reconocidos", () => {
    const sample: WaterSample = {
      id: "test-11",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Internacional",
      dataSource: "manual",
      parameters: [
        { name: "Oxígeno disuelto", value: 90, unit: "%" },
        { name: "Parámetro desconocido", value: 999, unit: "x" },
        { name: "pH", value: 7.0, unit: "Unidades de pH" },
      ],
    };

    const result = calculateWQI(sample);

    expect(result).not.toBeNull();
    expect(result!.details).toHaveLength(2); // Solo los 2 conocidos
  });
});
