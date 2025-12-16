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
  const lines = csvText
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0); // Filtrar líneas vacías
  
  if (lines.length < 2) return [];

  // Parsear header removiendo comillas
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));
  
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Saltar líneas vacías
    
    const values = lines[i].split(",");
    const row: CSVRow = {};

    headers.forEach((header, index) => {
      let value = values[index]?.trim() || "";
      // Remover comillas si existen
      value = value.replace(/^"|"$/g, "");
      // Mantener como string (no convertir a número aquí)
      row[header] = value;
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
export function csvToWaterSamples(
  rows: CSVRow[],
  country: Country = "Internacional"
): WaterSample[] {
  const samplesMap = new Map<string, WaterSample>();

  for (const row of rows) {
    // Extraer datos básicos
    const dateStr = String(row.fecha || row.date || row.Fecha || "");
    const location = String(
      row.ubicacion || row.location || row.Ubicación || row.lugar || ""
    );
    const paramName = String(
      row.parametro || row.parameter || row.Parámetro || ""
    );
    const valueStr = String(row.valor || row.value || "0");
    const value = parseFloat(valueStr) || 0;
    const unit = String(row.unidad || row.unit || row.Unidad || "");

    // Validar datos mínimos
    if (!location || !paramName || !dateStr) continue;

    // Crear clave única por muestra (fecha + ubicación)
    const sampleKey = `${dateStr}_${location}`;

    // Obtener o crear muestra
    let sample = samplesMap.get(sampleKey);
    if (!sample) {
      sample = {
        id: generateId(),
        sampleDate: dateStr, // Formato string para compatibilidad
        date: dateStr ? new Date(dateStr) : new Date(),
        location,
        country,
        dataSource: "csv", // Para tests
        source: "csv", // Para uso interno
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
