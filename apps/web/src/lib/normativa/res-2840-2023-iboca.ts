/**
 * Resolución Conjunta 2840 de 2023 (Secretaría Distrital de Ambiente y Secretaría
 * Distrital de Salud de Bogotá) — Índice Bogotano de Calidad del Aire y Riesgo en
 * Salud (IBOCA). Expedida 15-dic-2023, vigente desde 16-dic-2023, Registro
 * Distrital No. 7885.4 del 18-dic-2023. Deroga la Res. Conjunta 868 de 2021 (art. 19).
 *
 * Texto: https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?dt=S&i=152203
 * Verificado 2026-11-17.
 *
 * NOTA: la Tabla 1 de la Res. 868/2021 (derogada) traía PM2.5 12,1-35,4 / 35,5-55,4 /
 * 55,5-150,4 / 150,5-250,4 / 250,5-500,4. Esos cortes son los que usaba la
 * herramienta hasta DOM-001; ya no rigen para PM2.5 de 24 h (ahora PM2.5 va a 12 h NowCast
 * con 12,1-35,4 / 35,5-55,4 / 55,5-151,2 / 151,3-250,4 / 250,5-500,4).
 */
import type { NormCitation } from "./types";

export const CITA_IBOCA: NormCitation = {
  norma: "Resolución Conjunta 2840 de 2023 (SDA-SDS Bogotá)",
  articulo: "art. 4, Tabla 1",
  vigenteDesde: "2023-12-16",
  publicacion: "Registro Distrital No. 7885.4 de 18 de diciembre de 2023",
  url: "https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?dt=S&i=152203",
  verificado: "2026-11-17",
};

export interface CorteIBOCA {
  ibocaRango: readonly [number, number];
  color: string;
  nivelRiesgo: string;
  nivelActuacion: string;
  /** µg/m³. PM2.5 y PM10: media móvil ponderada (NowCast) de 12 h. Gases: media móvil (O3 8 h, NO2 1 h, SO2 1 h, CO 8 h). */
  pm25_12h_nowcast: readonly [number, number];
  pm10_12h_nowcast: readonly [number, number];
  o3_8h: readonly [number, number];
  no2_1h: readonly [number, number];
  so2_1h: readonly [number, number];
  co_8h: readonly [number, number];
}

export const TABLA_1_CORTES_IBOCA: readonly CorteIBOCA[] = [
  { ibocaRango: [0, 50], color: "Verde", nivelRiesgo: "Bajo", nivelActuacion: "Prevención", pm25_12h_nowcast: [0, 12.0], pm10_12h_nowcast: [0, 27.2], o3_8h: [0, 72], no2_1h: [0, 28.5], so2_1h: [0, 9.6], co_8h: [0, 2549] },
  { ibocaRango: [51, 100], color: "Amarillo", nivelRiesgo: "Moderado", nivelActuacion: "Prevención", pm25_12h_nowcast: [12.1, 35.4], pm10_12h_nowcast: [27.3, 63.8], o3_8h: [73, 107], no2_1h: [28.6, 84.1], so2_1h: [9.7, 38.5], co_8h: [2550, 5022] },
  { ibocaRango: [101, 150], color: "Naranja", nivelRiesgo: "Regular", nivelActuacion: "Alerta Fase 1", pm25_12h_nowcast: [35.5, 55.4], pm10_12h_nowcast: [63.9, 95.5], o3_8h: [108, 137], no2_1h: [84.2, 132.2], so2_1h: [38.6, 63.5], co_8h: [5023, 7165] },
  { ibocaRango: [151, 200], color: "Rojo", nivelRiesgo: "Alto", nivelActuacion: "Alerta Fase 2", pm25_12h_nowcast: [55.5, 151.2], pm10_12h_nowcast: [95.6, 246.7], o3_8h: [138, 281], no2_1h: [132.3, 361.9], so2_1h: [63.6, 182.7], co_8h: [7166, 17384] },
  { ibocaRango: [201, 300], color: "Morado", nivelRiesgo: "Peligroso", nivelActuacion: "Emergencia", pm25_12h_nowcast: [151.3, 250.4], pm10_12h_nowcast: [246.8, 405.2], o3_8h: [282, 432], no2_1h: [362.0, 602.6], so2_1h: [182.8, 307.7], co_8h: [17385, 28099] },
  { ibocaRango: [301, 500], color: "Morado", nivelRiesgo: "Peligroso", nivelActuacion: "Emergencia", pm25_12h_nowcast: [250.5, 500.4], pm10_12h_nowcast: [405.3, 800.4], o3_8h: [433, 809], no2_1h: [602.7, 1202.6], so2_1h: [307.8, 619.2], co_8h: [28100, 54802] },
];
