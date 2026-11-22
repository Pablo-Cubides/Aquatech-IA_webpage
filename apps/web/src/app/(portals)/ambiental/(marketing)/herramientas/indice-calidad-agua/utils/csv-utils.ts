// Utilidades para procesar archivos CSV/Excel de datos de calidad de agua

import type { WaterSample, Country } from "../types";
import { parseLabValue } from "./parse-value";
import { parseCalendarDate } from "@/lib/dates/calendar-date";

// Función para generar IDs únicos
function generateId(): string {
  return `sample-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface CSVRow {
  [key: string]: string | number;
}

/**
 * Divide una línea CSV respetando comillas ("0,5" es UN campo) y comillas escapadas ("").
 */
function splitCSVLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((v) => v.trim());
}

/**
 * Parsea un archivo CSV a array de objetos.
 * Delimitador: coma, o punto y coma si la cabecera lo usa más (exportación de Excel en
 * configuración regional con decimal coma). Los campos con comas deben ir entre comillas.
 */
export function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) return [];

  const delimiter =
    (lines[0].match(/;/g) ?? []).length > (lines[0].match(/,/g) ?? []).length ? ";" : ",";

  const headers = splitCSVLine(lines[0], delimiter);
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i], delimiter);
    const row: CSVRow = {};
    headers.forEach((header, index) => {
      // Mantener como string (no convertir a número aquí)
      row[header] = values[index] ?? "";
    });
    rows.push(row);
  }

  return rows;
}

export interface CsvValueIssue {
  /** Número de fila en el archivo (la cabecera es la 1). */
  line: number;
  location: string;
  parameter: string;
  raw: string;
  reason: string;
}

export interface CsvConversionResult {
  samples: WaterSample[];
  /** Valores que no se pudieron leer. Esos parámetros NO se incluyen en la muestra (nunca se vuelven 0). */
  issues: CsvValueIssue[];
}

/**
 * Convierte filas CSV a muestras de agua y reporta los valores ilegibles.
 * Formato esperado del CSV:
 * fecha,ubicacion,pais,parametro,valor,unidad
 * 2024-01-15,Planta Norte,Colombia,pH,7.2,unidades
 * 2024-01-15,Planta Norte,Colombia,Turbiedad,1.5,UNT
 * Valores: ver utils/parse-value.ts (decimal coma/punto, censurados "<0,1", inválidos).
 */
export function csvToWaterSamplesDetailed(
  rows: CSVRow[],
  country: Country = "Internacional"
): CsvConversionResult {
  const samplesMap = new Map<string, WaterSample>();
  const issues: CsvValueIssue[] = [];

  rows.forEach((row, rowIndex) => {
    const dateStr = String(row.fecha || row.date || row.Fecha || "");
    const location = String(
      row.ubicacion || row.location || row.Ubicación || row.lugar || ""
    );
    const paramName = String(
      row.parametro || row.parameter || row.Parámetro || ""
    );
    const valueStr = String(row.valor ?? row.value ?? row.Valor ?? "");
    const unit = String(row.unidad || row.unit || row.Unidad || "");

    // Validar datos mínimos
    if (!location || !paramName || !dateStr) return;

    // Crear clave única por muestra (fecha + ubicación)
    const sampleKey = `${dateStr}_${location}`;

    let sample = samplesMap.get(sampleKey);
    if (!sample) {
      sample = {
        id: generateId(),
        sampleDate: dateStr, // Formato string para compatibilidad
        // Un dia suelto YYYY-MM-DD se lee como dia de calendario (mediodia local), no como medianoche UTC.
        date: dateStr ? (parseCalendarDate(dateStr) ?? new Date(dateStr)) : new Date(),
        location,
        country,
        dataSource: "csv", // Para tests
        source: "csv", // Para uso interno
        parameters: [],
      };
      samplesMap.set(sampleKey, sample);
    }

    const parsed = parseLabValue(valueStr);
    if (parsed.kind === "invalid") {
      issues.push({
        line: rowIndex + 2,
        location,
        parameter: paramName,
        raw: parsed.raw,
        reason: parsed.reason,
      });
      return;
    }

    if (parsed.kind === "censored") {
      sample.parameters.push({
        name: paramName,
        value: parsed.limit,
        unit,
        censored: parsed.operator,
      });
    } else {
      sample.parameters.push({ name: paramName, value: parsed.value, unit });
    }
  });

  return { samples: Array.from(samplesMap.values()), issues };
}

/**
 * Compatibilidad: devuelve solo las muestras. Los valores ilegibles se OMITEN (no se
 * convierten en 0); para conocerlos use csvToWaterSamplesDetailed.
 */
export function csvToWaterSamples(
  rows: CSVRow[],
  country: Country = "Internacional"
): WaterSample[] {
  return csvToWaterSamplesDetailed(rows, country).samples;
}

/**
 * Genera un CSV de ejemplo para IRCA (Colombia - Resolución 2115 de 2007)
 */
export function generateIRCAExampleCSV(): string {
  const headers = "fecha,ubicacion,parametro,valor,unidad";
  const rows = [
    "2024-12-09,Acueducto Municipal,pH,7.2,unidades",
    "2024-12-09,Acueducto Municipal,Turbiedad,1.5,UNT",
    "2024-12-09,Acueducto Municipal,Color aparente,10,UPC",
    "2024-12-09,Acueducto Municipal,Cloro residual libre,0.8,mg/L",
    "2024-12-09,Acueducto Municipal,Coliformes totales,0,UFC/100mL",
    "2024-12-09,Acueducto Municipal,Escherichia coli,0,UFC/100mL",
    "2024-12-09,Acueducto Municipal,Nitratos,5,mg/L",
    "2024-12-09,Acueducto Municipal,Nitritos,0.02,mg/L",
    "2024-12-09,Acueducto Municipal,Aluminio,0.1,mg/L",
    "2024-12-09,Acueducto Municipal,Hierro total,0.2,mg/L",
    "2024-12-09,Acueducto Municipal,Dureza total,150,mg/L CaCO3",
    "2024-12-09,Acueducto Municipal,Alcalinidad total,120,mg/L CaCO3",
    "2024-12-09,Acueducto Municipal,Sulfatos,80,mg/L",
    "2024-12-09,Acueducto Municipal,Cloruros,50,mg/L",
    "2024-12-09,Acueducto Municipal,Fluoruros,0.5,mg/L",
    "2024-12-09,Acueducto Municipal,Calcio,40,mg/L",
    "2024-12-09,Acueducto Municipal,Magnesio,20,mg/L",
  ];
  return [headers, ...rows].join("\n");
}

/**
 * Genera un CSV de ejemplo para WQI (NSF Water Quality Index)
 */
export function generateWQIExampleCSV(): string {
  const headers = "fecha,ubicacion,parametro,valor,unidad";
  const rows = [
    "2024-12-09,Rio Principal,pH,7.5,unidades",
    "2024-12-09,Rio Principal,Turbiedad,15,NTU",
    "2024-12-09,Rio Principal,Oxígeno disuelto,85,%",
    "2024-12-09,Rio Principal,DBO5,3,mg/L",
    "2024-12-09,Rio Principal,Coliformes fecales,200,UFC/100mL",
    "2024-12-09,Rio Principal,Nitratos,8,mg/L",
    "2024-12-09,Rio Principal,Fósforo total,0.3,mg/L",
    "2024-12-09,Rio Principal,Sólidos totales,250,mg/L",
    "2024-12-09,Rio Principal,Cambio de temperatura,2,°C",
  ];
  return [headers, ...rows].join("\n");
}

/**
 * Genera un CSV de ejemplo para DWQI (Drinking Water Quality Index - OMS)
 */
export function generateDWQIExampleCSV(): string {
  const headers = "fecha,ubicacion,parametro,valor,unidad";
  const rows = [
    "2024-12-09,Pozo Profundo,pH,7.0,unidades",
    "2024-12-09,Pozo Profundo,Turbiedad,2,NTU",
    "2024-12-09,Pozo Profundo,Color,5,UC",
    "2024-12-09,Pozo Profundo,TDS,350,mg/L",
    "2024-12-09,Pozo Profundo,Dureza total,200,mg/L CaCO3",
    "2024-12-09,Pozo Profundo,Alcalinidad,150,mg/L CaCO3",
    "2024-12-09,Pozo Profundo,Cloruros,100,mg/L",
    "2024-12-09,Pozo Profundo,Sulfatos,120,mg/L",
    "2024-12-09,Pozo Profundo,Nitratos,20,mg/L",
    "2024-12-09,Pozo Profundo,Fosfatos,0.5,mg/L",
    "2024-12-09,Pozo Profundo,Hierro,0.15,mg/L",
    "2024-12-09,Pozo Profundo,Conductividad,600,µS/cm",
    "2024-12-09,Pozo Profundo,Cloro residual,0.6,mg/L",
    "2024-12-09,Pozo Profundo,Calcio,50,mg/L",
    "2024-12-09,Pozo Profundo,Magnesio,25,mg/L",
    "2024-12-09,Pozo Profundo,Fluoruros,0.8,mg/L",
    "2024-12-09,Pozo Profundo,Aluminio,0.05,mg/L",
  ];
  return [headers, ...rows].join("\n");
}

/**
 * Genera un CSV de ejemplo combinado (compatibilidad con función anterior)
 */
export function generateExampleCSV(): string {
  return generateIRCAExampleCSV();
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
    "fecha,ubicacion,parametro,valor,unidad",
  ];

  for (const sample of samples) {
    const dateStr = sample.sampleDate || 
      (sample.date ? sample.date.toISOString().split("T")[0] : "N/A");
    
    for (const param of sample.parameters) {
      const paramName = param.name.includes(",") ? `"${param.name}"` : param.name;
      
      lines.push(
        [
          dateStr,
          sample.location,
          paramName,
          param.censored ? `${param.censored}${param.value}` : param.value,
          param.unit,
        ].join(",")
      );
    }
  }

  return lines.join("\n");
}

/**
 * Valida que una muestra tenga datos mínimos
 * @throws Error si la validación falla
 */
export function validateSample(sample: WaterSample): void {
  const errors: string[] = [];

  const dateStr = sample.sampleDate || (sample.date ? sample.date.toISOString() : "");
  if (!dateStr || dateStr.trim() === "") {
    errors.push("La fecha es requerida");
  }

  if (!sample.location || sample.location.trim() === "") {
    errors.push("La ubicación es requerida");
  }

  if (!sample.parameters || sample.parameters.length === 0) {
    errors.push("Debe haber al menos un parámetro medido");
  }

  for (const param of sample.parameters) {
    if (!param.name || param.name.trim() === "") {
      errors.push(`Parámetro sin nombre encontrado`);
    }
    if (param.value < 0) {
      errors.push(`Valor negativo inválido para parámetro ${param.name}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors[0]); // Lanzar el primer error
  }
}
