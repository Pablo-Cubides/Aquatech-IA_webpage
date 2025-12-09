import { describe, it, expect } from "vitest";
import {
  parseCSV,
  csvToWaterSamples,
  generateExampleCSV,
  waterSamplesToCSV,
  validateSample,
} from "../csv-utils";

describe("parseCSV", () => {
  it("debe parsear CSV simple correctamente", () => {
    const csv = `nombre,valor,unidad
pH,7.0,Unidades de pH
Turbiedad,1.5,UNT`;

    const result = parseCSV(csv);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      nombre: "pH",
      valor: "7.0",
      unidad: "Unidades de pH",
    });
    expect(result[1]).toEqual({
      nombre: "Turbiedad",
      valor: "1.5",
      unidad: "UNT",
    });
  });

  it("debe manejar CSV con comillas", () => {
    const csv = `nombre,valor,unidad
"pH",7.0,"Unidades de pH"
"Turbiedad","1.5","UNT"`;

    const result = parseCSV(csv);

    expect(result).toHaveLength(2);
    expect(result[0].nombre).toBe("pH");
  });

  it("debe manejar líneas vacías", () => {
    const csv = `nombre,valor,unidad

pH,7.0,Unidades de pH

Turbiedad,1.5,UNT

`;

    const result = parseCSV(csv);

    expect(result).toHaveLength(2);
  });

  it("debe retornar array vacío para CSV vacío", () => {
    const result = parseCSV("");
    expect(result).toEqual([]);

    const result2 = parseCSV("   \n  \n  ");
    expect(result2).toEqual([]);
  });
});

describe("csvToWaterSamples", () => {
  it("debe convertir CSV a WaterSamples correctamente", () => {
    const csvData = [
      {
        fecha: "2024-01-01",
        ubicacion: "Río Bogotá",
        parametro: "pH",
        valor: "7.0",
        unidad: "Unidades de pH",
      },
      {
        fecha: "2024-01-01",
        ubicacion: "Río Bogotá",
        parametro: "Turbiedad",
        valor: "1.5",
        unidad: "UNT",
      },
    ];

    const result = csvToWaterSamples(csvData, "Colombia");

    expect(result).toHaveLength(1);
    expect(result[0].sampleDate).toBe("2024-01-01");
    expect(result[0].location).toBe("Río Bogotá");
    expect(result[0].country).toBe("Colombia");
    expect(result[0].parameters).toHaveLength(2);
    expect(result[0].parameters[0].name).toBe("pH");
    expect(result[0].parameters[0].value).toBe(7.0);
    expect(result[0].parameters[1].name).toBe("Turbiedad");
    expect(result[0].parameters[1].value).toBe(1.5);
  });

  it("debe agrupar múltiples muestras por fecha y ubicación", () => {
    const csvData = [
      {
        fecha: "2024-01-01",
        ubicacion: "Río A",
        parametro: "pH",
        valor: "7.0",
        unidad: "Unidades de pH",
      },
      {
        fecha: "2024-01-01",
        ubicacion: "Río B",
        parametro: "pH",
        valor: "6.5",
        unidad: "Unidades de pH",
      },
      {
        fecha: "2024-01-02",
        ubicacion: "Río A",
        parametro: "pH",
        valor: "7.5",
        unidad: "Unidades de pH",
      },
    ];

    const result = csvToWaterSamples(csvData, "Colombia");

    expect(result).toHaveLength(3); // 3 muestras diferentes
  });

  it("debe manejar valores numéricos con decimales", () => {
    const csvData = [
      {
        fecha: "2024-01-01",
        ubicacion: "Test",
        parametro: "DBO5",
        valor: "2.35",
        unidad: "mg/L",
      },
    ];

    const result = csvToWaterSamples(csvData, "Colombia");

    expect(result[0].parameters[0].value).toBe(2.35);
  });

  it("debe omitir filas con datos faltantes", () => {
    const csvData = [
      {
        fecha: "2024-01-01",
        ubicacion: "Test",
        parametro: "pH",
        valor: "7.0",
        unidad: "Unidades de pH",
      },
      {
        fecha: "",
        ubicacion: "Test",
        parametro: "Turbiedad",
        valor: "1.5",
        unidad: "UNT",
      },
      {
        fecha: "2024-01-01",
        ubicacion: "",
        parametro: "DBO5",
        valor: "2.0",
        unidad: "mg/L",
      },
      {
        fecha: "2024-01-01",
        ubicacion: "Test",
        parametro: "",
        valor: "5.0",
        unidad: "mg/L",
      },
    ];

    const result = csvToWaterSamples(csvData, "Colombia");

    expect(result).toHaveLength(1);
    expect(result[0].parameters).toHaveLength(1);
    expect(result[0].parameters[0].name).toBe("pH");
  });

  it("debe manejar valores no numéricos como 0", () => {
    const csvData = [
      {
        fecha: "2024-01-01",
        ubicacion: "Test",
        parametro: "pH",
        valor: "no disponible",
        unidad: "Unidades de pH",
      },
    ];

    const result = csvToWaterSamples(csvData, "Colombia");

    expect(result[0].parameters[0].value).toBe(0);
  });

  it("debe generar IDs únicos para cada muestra", () => {
    const csvData = [
      {
        fecha: "2024-01-01",
        ubicacion: "Río A",
        parametro: "pH",
        valor: "7.0",
        unidad: "Unidades de pH",
      },
      {
        fecha: "2024-01-02",
        ubicacion: "Río B",
        parametro: "pH",
        valor: "7.5",
        unidad: "Unidades de pH",
      },
    ];

    const result = csvToWaterSamples(csvData, "Colombia");

    expect(result[0].id).toBeDefined();
    expect(result[1].id).toBeDefined();
    expect(result[0].id).not.toBe(result[1].id);
  });
});

describe("generateExampleCSV", () => {
  it("debe generar CSV con header correcto", () => {
    const csv = generateExampleCSV();

    expect(csv).toContain("fecha,ubicacion,parametro,valor,unidad");
  });

  it("debe incluir múltiples parámetros de ejemplo", () => {
    const csv = generateExampleCSV();

    expect(csv).toContain("pH");
    expect(csv).toContain("Turbiedad");
    expect(csv).toContain("Oxígeno disuelto");
    expect(csv).toContain("DBO5");
  });

  it("debe incluir valores de ejemplo realistas", () => {
    const csv = generateExampleCSV();

    expect(csv).toContain("7.0");
    expect(csv).toContain("1.5");
    expect(csv).toContain("Unidades de pH");
    expect(csv).toContain("UNT");
  });

  it("debe tener formato válido de CSV", () => {
    const csv = generateExampleCSV();
    const lines = csv.split("\n").filter((line) => line.trim());

    expect(lines.length).toBeGreaterThan(1); // Header + al menos 1 fila
    expect(lines[0].split(",")).toHaveLength(5); // 5 columnas
  });
});

describe("waterSamplesToCSV", () => {
  it("debe exportar WaterSamples a CSV correctamente", () => {
    const samples = [
      {
        id: "test-1",
        sampleDate: "2024-01-01",
        location: "Río Test",
        country: "Colombia" as const,
        dataSource: "manual" as const,
        parameters: [
          { name: "pH", value: 7.0, unit: "Unidades de pH" },
          { name: "Turbiedad", value: 1.5, unit: "UNT" },
        ],
      },
    ];

    const csv = waterSamplesToCSV(samples);

    expect(csv).toContain("fecha,ubicacion,parametro,valor,unidad");
    expect(csv).toContain("2024-01-01");
    expect(csv).toContain("Río Test");
    expect(csv).toContain("pH");
    expect(csv).toContain("7");
    expect(csv).toContain("Turbiedad");
    expect(csv).toContain("1.5");
  });

  it("debe exportar múltiples muestras correctamente", () => {
    const samples = [
      {
        id: "test-1",
        sampleDate: "2024-01-01",
        location: "Río A",
        country: "Colombia" as const,
        dataSource: "manual" as const,
        parameters: [{ name: "pH", value: 7.0, unit: "Unidades de pH" }],
      },
      {
        id: "test-2",
        sampleDate: "2024-01-02",
        location: "Río B",
        country: "Colombia" as const,
        dataSource: "manual" as const,
        parameters: [{ name: "Turbiedad", value: 2.0, unit: "UNT" }],
      },
    ];

    const csv = waterSamplesToCSV(samples);

    const lines = csv.split("\n").filter((line) => line.trim());
    expect(lines).toHaveLength(3); // Header + 2 filas
  });

  it("debe manejar parámetros con comas en el nombre", () => {
    const samples = [
      {
        id: "test-1",
        sampleDate: "2024-01-01",
        location: "Test",
        country: "Colombia" as const,
        dataSource: "manual" as const,
        parameters: [
          { name: "Parámetro, con comas", value: 5.0, unit: "mg/L" },
        ],
      },
    ];

    const csv = waterSamplesToCSV(samples);

    // Debe escapar con comillas
    expect(csv).toContain('"Parámetro, con comas"');
  });
});

describe("validateSample", () => {
  it("debe validar muestra correcta", () => {
    const sample = {
      id: "test-1",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia" as const,
      dataSource: "manual" as const,
      parameters: [{ name: "pH", value: 7.0, unit: "Unidades de pH" }],
    };

    expect(() => validateSample(sample)).not.toThrow();
  });

  it("debe rechazar muestra sin parámetros", () => {
    const sample = {
      id: "test-1",
      sampleDate: "2024-01-01",
      location: "Test Location",
      country: "Colombia" as const,
      dataSource: "manual" as const,
      parameters: [],
    };

    expect(() => validateSample(sample)).toThrow();
  });

  it("debe rechazar muestra sin fecha", () => {
    const sample = {
      id: "test-1",
      sampleDate: "",
      location: "Test Location",
      country: "Colombia" as const,
      dataSource: "manual" as const,
      parameters: [{ name: "pH", value: 7.0, unit: "Unidades de pH" }],
    };

    expect(() => validateSample(sample)).toThrow();
  });

  it("debe rechazar muestra sin ubicación", () => {
    const sample = {
      id: "test-1",
      sampleDate: "2024-01-01",
      location: "",
      country: "Colombia" as const,
      dataSource: "manual" as const,
      parameters: [{ name: "pH", value: 7.0, unit: "Unidades de pH" }],
    };

    expect(() => validateSample(sample)).toThrow();
  });

  it("debe rechazar parámetro sin nombre", () => {
    const sample = {
      id: "test-1",
      sampleDate: "2024-01-01",
      location: "Test",
      country: "Colombia" as const,
      dataSource: "manual" as const,
      parameters: [{ name: "", value: 7.0, unit: "Unidades de pH" }],
    };

    expect(() => validateSample(sample)).toThrow();
  });

  it("debe rechazar valor numérico negativo", () => {
    const sample = {
      id: "test-1",
      sampleDate: "2024-01-01",
      location: "Test",
      country: "Colombia" as const,
      dataSource: "manual" as const,
      parameters: [{ name: "pH", value: -1, unit: "Unidades de pH" }],
    };

    expect(() => validateSample(sample)).toThrow();
  });

  it("debe aceptar valor 0 como válido", () => {
    const sample = {
      id: "test-1",
      sampleDate: "2024-01-01",
      location: "Test",
      country: "Colombia" as const,
      dataSource: "manual" as const,
      parameters: [{ name: "Escherichia coli", value: 0, unit: "UFC/100mL" }],
    };

    expect(() => validateSample(sample)).not.toThrow();
  });

  it("debe rechazar múltiples errores y reportar el primero", () => {
    const sample = {
      id: "test-1",
      sampleDate: "",
      location: "",
      country: "Colombia" as const,
      dataSource: "manual" as const,
      parameters: [],
    };

    expect(() => validateSample(sample)).toThrow();
  });
});
