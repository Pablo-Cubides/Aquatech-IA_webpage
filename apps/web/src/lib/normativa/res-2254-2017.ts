/**
 * Resolución 2254 de 2017 (Ministerio de Ambiente y Desarrollo Sostenible) —
 * norma de calidad del aire ambiente. Diario Oficial No. 50.415 de 12-nov-2017;
 * rige desde el 1-ene-2018 (art. 26), deroga las Res. 601/2006 y 610/2010.
 *
 * Textos consultados (verificado 2026-11-17):
 *  - Gestor Normativo CRA (texto): https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_2254_2017.htm
 *  - Alcaldía de Bogotá, SISJUR (texto y tablas): https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=82634
 * La Tabla 6 (puntos de corte del ICA) está publicada como imagen; se leyó de la
 * imagen y se contrastó con la Tabla 4 (coinciden los cortes de CO, SO2, NO2, O3 y
 * PM2.5) y con la continuidad de cada columna. PENDIENTE: cotejo con el PDF del
 * Diario Oficial.
 */
import type { NormCitation } from "./types";

const URL_SISJUR = "https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=82634";

function cita(articulo: string, vigenteDesde: string): NormCitation {
  return {
    norma: "Resolución 2254 de 2017 (MADS)",
    articulo,
    vigenteDesde,
    publicacion: "Diario Oficial No. 50.415 de 12 de noviembre de 2017",
    url: URL_SISJUR,
    verificado: "2026-11-17",
  };
}

export type ContaminanteAire = "PM10" | "PM2.5" | "SO2" | "NO2" | "O3" | "CO";
export type TiempoExposicion = "anual" | "24 horas" | "8 horas" | "1 hora";

export interface LimiteAire {
  contaminante: ContaminanteAire;
  tiempo: TiempoExposicion;
  /** µg/m³ a condiciones de referencia. */
  valor: number;
  /** Fecha desde la que rige este valor (ISO). */
  vigenteDesde: string;
  cita: NormCitation;
}

const T1 = cita("art. 2, Tabla 1", "2018-01-01");
const T1_PM24 = cita("art. 2, parágrafo 1 (PM10 y PM2.5, 24 h, desde 1-jul-2018)", "2018-07-01");
const T2 = cita("art. 3, Tabla 2", "2030-01-01");

/** Tabla 1 (rige desde 2018-01-01). Los PM de 24 h de la Tabla 1 (100 y 50) fueron sustituidos el 1-jul-2018 por el parágrafo 1. */
export const TABLA_1_LIMITES_2018: readonly LimiteAire[] = [
  { contaminante: "PM10", tiempo: "anual", valor: 50, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "PM10", tiempo: "24 horas", valor: 100, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "PM2.5", tiempo: "anual", valor: 25, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "PM2.5", tiempo: "24 horas", valor: 50, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "SO2", tiempo: "24 horas", valor: 50, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "SO2", tiempo: "1 hora", valor: 100, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "NO2", tiempo: "anual", valor: 60, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "NO2", tiempo: "1 hora", valor: 200, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "O3", tiempo: "8 horas", valor: 100, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "CO", tiempo: "8 horas", valor: 5000, vigenteDesde: "2018-01-01", cita: T1 },
  { contaminante: "CO", tiempo: "1 hora", valor: 35000, vigenteDesde: "2018-01-01", cita: T1 },
];

/** Art. 2, parágrafo 1: desde el 1-jul-2018, PM10 y PM2.5 a 24 h pasan a 75 y 37 µg/m³. */
export const PM_24H_DESDE_2018_07_01: readonly LimiteAire[] = [
  { contaminante: "PM10", tiempo: "24 horas", valor: 75, vigenteDesde: "2018-07-01", cita: T1_PM24 },
  { contaminante: "PM2.5", tiempo: "24 horas", valor: 37, vigenteDesde: "2018-07-01", cita: T1_PM24 },
];

/**
 * Tabla 2 (art. 3): SOLO estos cuatro valores rigen desde 1-ene-2030. Para los demás
 * contaminantes y tiempos de exposición se mantiene la Tabla 1 (art. 3, parágrafo).
 */
export const TABLA_2_LIMITES_2030: readonly LimiteAire[] = [
  { contaminante: "PM10", tiempo: "anual", valor: 30, vigenteDesde: "2030-01-01", cita: T2 },
  { contaminante: "PM2.5", tiempo: "anual", valor: 15, vigenteDesde: "2030-01-01", cita: T2 },
  { contaminante: "SO2", tiempo: "24 horas", valor: 20, vigenteDesde: "2030-01-01", cita: T2 },
  { contaminante: "NO2", tiempo: "anual", valor: 40, vigenteDesde: "2030-01-01", cita: T2 },
];

/** Límite que rige en `fecha` (ISO yyyy-mm-dd) para un contaminante y tiempo; el de vigencia más reciente ≤ fecha. */
export function limiteAireVigente(
  contaminante: ContaminanteAire,
  tiempo: TiempoExposicion,
  fecha: string,
): LimiteAire | undefined {
  const todos = [...TABLA_1_LIMITES_2018, ...PM_24H_DESDE_2018_07_01, ...TABLA_2_LIMITES_2030];
  return todos
    .filter((l) => l.contaminante === contaminante && l.tiempo === tiempo && l.vigenteDesde <= fecha)
    .sort((a, b) => (a.vigenteDesde < b.vigenteDesde ? 1 : -1))[0];
}

/** Tabla 3 (art. 4): contaminantes tóxicos del aire, µg/m³. */
export const TABLA_3_TOXICOS = [
  { contaminante: "Benceno", valor: 5, tiempo: "anual" },
  { contaminante: "Plomo y compuestos", valor: 0.5, tiempo: "anual" },
  { contaminante: "Cadmio", valor: 0.005, tiempo: "anual" },
  { contaminante: "Mercurio inorgánico (vapores)", valor: 1, tiempo: "anual" },
  { contaminante: "Tolueno", valor: 260, tiempo: "1 semana" },
  { contaminante: "Tolueno", valor: 1000, tiempo: "30 minutos" },
  { contaminante: "Níquel y sus compuestos", valor: 0.18, tiempo: "anual" },
  { contaminante: "HAP expresados como benzo(a)pireno", valor: 0.001, tiempo: "anual" },
] as const;
export const CITA_TABLA_3 = cita("art. 4, Tabla 3", "2018-01-01");

/** Tabla 4 (art. 10): rangos para declarar Prevención / Alerta / Emergencia, µg/m³. PM2.5 aplica desde 1-jul-2018. */
export const TABLA_4_NIVELES = [
  { contaminante: "PM10", tiempo: "24 horas", prevencion: [155, 254], alerta: [255, 354], emergenciaDesde: 355 },
  { contaminante: "PM2.5", tiempo: "24 horas", prevencion: [38, 55], alerta: [56, 150], emergenciaDesde: 151 },
  { contaminante: "O3", tiempo: "8 horas", prevencion: [139, 167], alerta: [168, 207], emergenciaDesde: 208 },
  { contaminante: "SO2", tiempo: "1 hora", prevencion: [198, 486], alerta: [487, 797], emergenciaDesde: 798 },
  { contaminante: "NO2", tiempo: "1 hora", prevencion: [190, 677], alerta: [678, 1221], emergenciaDesde: 1222 },
  { contaminante: "CO", tiempo: "8 horas", prevencion: [10820, 14254], alerta: [14255, 17688], emergenciaDesde: 17689 },
] as const;
export const CITA_TABLA_4 = cita("art. 10, Tabla 4", "2018-01-01");

/**
 * Tabla 6 (art. 20): puntos de corte del ICA. Cada fila = un rango del ICA.
 * Concentraciones en µg/m³ (CO también en µg/m³; aquí NO en mg/m³).
 * O3 1 h solo existe desde el rango 101-150 (nota (1): se calcula únicamente donde el
 * ICA de 1 h sea más precautorio, y se reporta el mayor de 8 h y 1 h). O3 8 h no se
 * calcula para concentraciones superiores a 394 µg/m³ (nota (2)); para valores mayores
 * se usa solo el ICA de O3 de 1 h.
 */
export interface CorteICA {
  ica: readonly [number, number];
  color: string;
  categoria: string;
  pm10_24h: readonly [number, number];
  pm25_24h: readonly [number, number];
  co_8h: readonly [number, number];
  so2_1h: readonly [number, number];
  no2_1h: readonly [number, number];
  o3_8h: readonly [number, number];
  o3_1h: readonly [number, number] | null;
}
export const TABLA_6_CORTES_ICA: readonly CorteICA[] = [
  { ica: [0, 50], color: "Verde", categoria: "Buena", pm10_24h: [0, 54], pm25_24h: [0, 12], co_8h: [0, 5094], so2_1h: [0, 93], no2_1h: [0, 100], o3_8h: [0, 106], o3_1h: null },
  { ica: [51, 100], color: "Amarillo", categoria: "Aceptable", pm10_24h: [55, 154], pm25_24h: [13, 37], co_8h: [5095, 10819], so2_1h: [94, 197], no2_1h: [101, 189], o3_8h: [107, 138], o3_1h: null },
  { ica: [101, 150], color: "Naranja", categoria: "Dañina a la salud de grupos sensibles", pm10_24h: [155, 254], pm25_24h: [38, 55], co_8h: [10820, 14254], so2_1h: [198, 486], no2_1h: [190, 677], o3_8h: [139, 167], o3_1h: [245, 323] },
  { ica: [151, 200], color: "Rojo", categoria: "Dañina a la salud", pm10_24h: [255, 354], pm25_24h: [56, 150], co_8h: [14255, 17688], so2_1h: [487, 797], no2_1h: [678, 1221], o3_8h: [168, 207], o3_1h: [324, 401] },
  { ica: [201, 300], color: "Púrpura", categoria: "Muy dañina a la salud", pm10_24h: [355, 424], pm25_24h: [151, 250], co_8h: [17689, 34862], so2_1h: [798, 1583], no2_1h: [1222, 2349], o3_8h: [208, 393], o3_1h: [402, 794] },
  { ica: [301, 500], color: "Marrón", categoria: "Peligrosa", pm10_24h: [425, 604], pm25_24h: [251, 500], co_8h: [34863, 57703], so2_1h: [1584, 2629], no2_1h: [2350, 3853], o3_8h: [394, 394], o3_1h: [795, 1185] },
];
export const CITA_TABLA_6 = cita("art. 20, Tabla 6 (puntos de corte del ICA)", "2018-01-01");
export const O3_8H_MAXIMO_CALCULABLE = 394;
