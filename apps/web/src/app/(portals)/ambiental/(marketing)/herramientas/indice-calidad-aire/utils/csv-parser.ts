/**
 * CSV Parser for Air Quality Data
 * Parses CSV files with pollutant concentrations
 */

import type {
  PollutantId,
  AirQualityMeasurement,
  PollutantMeasurement,
} from "../types";

/**
 * Map common column names to our pollutant IDs
 */
const COLUMN_MAP: Record<string, PollutantId> = {
  pm25: "pm25",
  "pm2.5": "pm25",
  pm2_5: "pm25",
  "pm 2.5": "pm25",
  pm10: "pm10",
  "pm 10": "pm10",
  o3: "o3",
  ozone: "o3",
  ozono: "o3",
  no2: "no2",
  "dioxido de nitrogeno": "no2",
  so2: "so2",
  "dioxido de azufre": "so2",
  co: "co",
  "monoxido de carbono": "co",
};

/**
 * Normalize a column name to a pollutant ID
 */
function normalizeColumnName(column: string): PollutantId | null {
  const normalized = column
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._ ]/g, "");
  return COLUMN_MAP[normalized] || null;
}

/**
 * Parse a CSV value to a number
 */
function parseValue(value: string): number | null {
  if (
    !value ||
    value.trim() === "" ||
    value === "N/A" ||
    value === "null" ||
    value === "-"
  ) {
    return null;
  }

  // Replace comma with dot for decimal
  const cleaned = value.replace(",", ".").replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);

  return isNaN(num) ? null : num;
}

/**
 * Parse CSV text to rows
 */
export function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const rows: string[][] = [];

  for (const line of lines) {
    // Handle both comma and semicolon as separators
    const separator = line.includes(";") ? ";" : ",";
    const cells = line
      .split(separator)
      .map((cell) => cell.trim().replace(/^"|"$/g, ""));
    rows.push(cells);
  }

  return rows;
}

/**
 * Result of CSV parsing
 */
export interface CSVParseResult {
  measurements: AirQualityMeasurement[];
  errors: string[];
  warnings: string[];
  columnsFound: string[];
  rowsProcessed: number;
}

/**
 * Parse CSV data to AirQualityMeasurement array
 *
 * Expected format:
 * Option 1 (wide format): date, station, pm25, pm10, o3, no2, so2, co
 * Option 2 (long format): date, station, parameter, value, unit
 */
export function csvToMeasurements(text: string): CSVParseResult {
  const result: CSVParseResult = {
    measurements: [],
    errors: [],
    warnings: [],
    columnsFound: [],
    rowsProcessed: 0,
  };

  const rows = parseCSV(text);

  if (rows.length < 2) {
    result.errors.push(
      "El archivo CSV debe tener al menos un encabezado y una fila de datos",
    );
    return result;
  }

  const headers = rows[0].map((h) => h.toLowerCase().trim());
  result.columnsFound = rows[0];

  // Detect format (wide vs long)
  const hasParameterColumn =
    headers.includes("parametro") || headers.includes("parameter");

  if (hasParameterColumn) {
    // Long format: date, station, parameter, value, unit
    return parseLongFormat(rows, headers, result);
  } else {
    // Wide format: date, station, pm25, pm10, o3, ...
    return parseWideFormat(rows, headers, result);
  }
}

/**
 * Parse wide format CSV (columns are pollutants)
 */
function parseWideFormat(
  rows: string[][],
  headers: string[],
  result: CSVParseResult,
): CSVParseResult {
  // Find date and station columns
  const dateCol = headers.findIndex(
    (h) => h.includes("fecha") || h.includes("date") || h.includes("datetime"),
  );
  const stationCol = headers.findIndex(
    (h) =>
      h.includes("estacion") ||
      h.includes("station") ||
      h.includes("ubicacion") ||
      h.includes("location"),
  );

  if (dateCol === -1) {
    result.warnings.push(
      "No se encontró columna de fecha, usando fecha actual",
    );
  }

  // Map column indices to pollutant IDs
  const pollutantCols: Array<{ index: number; pollutantId: PollutantId }> = [];

  for (let i = 0; i < headers.length; i++) {
    const pollutantId = normalizeColumnName(headers[i]);
    if (pollutantId) {
      pollutantCols.push({ index: i, pollutantId });
    }
  }

  if (pollutantCols.length === 0) {
    result.errors.push(
      "No se encontraron columnas de contaminantes (pm25, pm10, o3, no2, so2, co)",
    );
    return result;
  }

  // Parse data rows
  for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];

    if (row.length < 2 || row.every((cell) => !cell.trim())) {
      continue; // Skip empty rows
    }

    const pollutants: PollutantMeasurement[] = [];

    for (const { index, pollutantId } of pollutantCols) {
      const value = parseValue(row[index] || "");
      if (value !== null && value >= 0) {
        pollutants.push({
          pollutantId,
          value,
          unit: pollutantId === "co" ? "mg/m³" : "µg/m³",
        });
      }
    }

    if (pollutants.length > 0) {
      result.measurements.push({
        stationName: stationCol >= 0 ? row[stationCol] : "Estación",
        datetime: dateCol >= 0 ? row[dateCol] : new Date().toISOString(),
        pollutants,
        source: "csv",
      });
      result.rowsProcessed++;
    }
  }

  return result;
}

/**
 * Parse long format CSV (one row per pollutant measurement)
 */
function parseLongFormat(
  rows: string[][],
  headers: string[],
  result: CSVParseResult,
): CSVParseResult {
  // Find required columns
  const dateCol = headers.findIndex(
    (h) => h.includes("fecha") || h.includes("date"),
  );
  const stationCol = headers.findIndex(
    (h) =>
      h.includes("estacion") ||
      h.includes("station") ||
      h.includes("ubicacion"),
  );
  const paramCol = headers.findIndex(
    (h) => h.includes("parametro") || h.includes("parameter"),
  );
  const valueCol = headers.findIndex(
    (h) =>
      h.includes("valor") || h.includes("value") || h.includes("concentracion"),
  );
  const unitCol = headers.findIndex(
    (h) => h.includes("unidad") || h.includes("unit"),
  );

  if (paramCol === -1 || valueCol === -1) {
    result.errors.push(
      "Formato largo requiere columnas: parametro/parameter, valor/value",
    );
    return result;
  }

  // Group by datetime and station
  const grouped = new Map<string, PollutantMeasurement[]>();
  const stationNames = new Map<string, string>();

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];

    if (row.length < 2 || row.every((cell) => !cell.trim())) {
      continue;
    }

    const datetime = dateCol >= 0 ? row[dateCol] : new Date().toISOString();
    const station = stationCol >= 0 ? row[stationCol] : "Estación";
    const parameter = row[paramCol];
    const value = parseValue(row[valueCol] || "");
    const unit = unitCol >= 0 ? row[unitCol] : "µg/m³";

    const pollutantId = normalizeColumnName(parameter);

    if (!pollutantId) {
      continue; // Skip unknown pollutants
    }

    if (value === null || value < 0) {
      continue;
    }

    const key = `${datetime}|${station}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
      stationNames.set(key, station);
    }

    const groupedMeasurements = grouped.get(key);
    if (!groupedMeasurements) {
      continue;
    }

    groupedMeasurements.push({
      pollutantId,
      value,
      unit: unit.includes("mg") ? "mg/m³" : "µg/m³",
    });
  }

  // Convert to measurements
  for (const [key, pollutants] of grouped) {
    const [datetime] = key.split("|");
    const stationName = stationNames.get(key) || "Estación";

    result.measurements.push({
      stationName,
      datetime,
      pollutants,
      source: "csv",
    });
    result.rowsProcessed++;
  }

  return result;
}

/**
 * Generate example CSV content
 */
export function generateExampleCSV(): string {
  return `fecha,estacion,pm25,pm10,o3,no2,so2,co
2024-12-09,Estación Centro,35.2,52.1,45.3,28.5,12.4,2.1
2024-12-09,Estación Norte,28.1,45.6,52.8,22.3,8.7,1.8
2024-12-09,Estación Sur,42.5,68.2,38.9,35.1,15.2,2.5`;
}

/**
 * Download string as CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
