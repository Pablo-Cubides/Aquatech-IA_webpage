// Utilidades para procesar archivos CSV/Excel de datos de calidad de agua

import type { WaterSample, Country } from "../types";

// Función para generar IDs únicos
function generateId(): string {
  return `sample-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface CSVRow {
  [key: string]: string | number;
}

/**
 * Parsea un archivo CSV a array de objetos
 */
export function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row: CSVRow = {};

    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      // Intentar convertir a número
      row[header] = isNaN(Number(value)) ? value : Number(value);
    });

    rows.push(row);
  }

  return rows;
}

/**
 * Convierte filas CSV a muestras de agua
 * Formato esperado del CSV:
 * fecha,ubicacion,pais,parametro,valor,unidad
 * 2024-01-15,Planta Norte,Colombia,pH,7.2,unidades
 * 2024-01-15,Planta Norte,Colombia,Turbiedad,1.5,UNT
 */
export function csvToWaterSamples(rows: CSVRow[]): WaterSample[] {
  const samplesMap = new Map<string, WaterSample>();

  for (const row of rows) {
    // Extraer datos básicos
    const dateStr = String(row.fecha || row.date || row.Fecha || "");
    const location = String(
      row.ubicacion || row.location || row.Ubicación || row.lugar || ""
    );
    const country = String(
      row.pais || row.country || row.País || "Internacional"
    ) as Country;
    const paramName = String(
      row.parametro || row.parameter || row.Parámetro || ""
    );
    const value = Number(row.valor || row.value || 0);
    const unit = String(row.unidad || row.unit || row.Unidad || "");

    if (!location || !paramName) continue;

    // Crear clave única por muestra (fecha + ubicación)
    const sampleKey = `${dateStr}_${location}`;

    // Obtener o crear muestra
    let sample = samplesMap.get(sampleKey);
    if (!sample) {
      sample = {
        id: generateId(),
        date: dateStr ? new Date(dateStr) : new Date(),
        location,
        country,
        source: "csv",
        parameters: [],
      };
      samplesMap.set(sampleKey, sample);
    }

    // Agregar parámetro
    sample.parameters.push({
      name: paramName,
      value,
      unit,
    });
  }

  return Array.from(samplesMap.values());
}

/**
 * Genera un CSV de ejemplo para que el usuario lo descargue
 */
export function generateExampleCSV(): string {
  const headers = "fecha,ubicacion,pais,parametro,valor,unidad";
  const rows = [
    "2024-12-09,Planta de Tratamiento Norte,Colombia,pH,7.2,unidades",
    "2024-12-09,Planta de Tratamiento Norte,Colombia,Turbiedad,1.5,UNT",
    "2024-12-09,Planta de Tratamiento Norte,Colombia,Color aparente,10,UPC",
    "2024-12-09,Planta de Tratamiento Norte,Colombia,Cloro residual libre,0.5,mg/L",
    "2024-12-09,Planta de Tratamiento Norte,Colombia,Coliformes totales,0,UFC/100mL",
    "2024-12-09,Planta de Tratamiento Norte,Colombia,Escherichia coli,0,UFC/100mL",
    "2024-12-09,Planta de Tratamiento Norte,Colombia,Nitratos,5,mg/L NO₃⁻",
    "2024-12-09,Planta de Tratamiento Norte,Colombia,Hierro total,0.15,mg/L",
  ];

  return [headers, ...rows].join("\n");
}

/**
 * Descarga un archivo CSV
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exporta muestras a formato CSV
 */
export function waterSamplesToCSV(samples: WaterSample[]): string {
  const lines: string[] = [
    "fecha,ubicacion,pais,fuente,parametro,valor,unidad",
  ];

  for (const sample of samples) {
    for (const param of sample.parameters) {
      lines.push(
        [
          sample.date.toISOString().split("T")[0],
          sample.location,
          sample.country,
          sample.source,
          param.name,
          param.value,
          param.unit,
        ].join(",")
      );
    }
  }

  return lines.join("\n");
}

/**
 * Valida que una muestra tenga datos mínimos
 */
export function validateSample(sample: WaterSample): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!sample.location || sample.location.trim() === "") {
    errors.push("La ubicación es requerida");
  }

  if (!sample.date || isNaN(sample.date.getTime())) {
    errors.push("La fecha es inválida");
  }

  if (!sample.parameters || sample.parameters.length === 0) {
    errors.push("Debe haber al menos un parámetro medido");
  }

  for (const param of sample.parameters) {
    if (!param.name || param.name.trim() === "") {
      errors.push(`Parámetro sin nombre encontrado`);
    }
    if (param.value === null || param.value === undefined || isNaN(param.value)) {
      errors.push(`Valor inválido para parámetro ${param.name}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
