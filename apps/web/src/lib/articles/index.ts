/**
 * Registro de artículos en código (un archivo por artículo) — SPEC-100, ADR-0008, ARQ-007.
 *
 * Este archivo SOLO registra: exporta las dos listas que `getStaticArticleMap()` (en
 * ../blog-articles.ts) usa como única fuente estática. Cada archivo valida su artículo contra
 * `blogArticleSchema` al cargarse: un incumplimiento rompe el build, a propósito.
 *
 * Fuentes de artículos, de MENOR a MAYOR precedencia (si un slug se repite, gana la última):
 *   1. este registro               (articles/ia/*.ts y articles/ambiental/*.ts)
 *   2. PostgreSQL (BlogPost)       sustituye al artículo en código con el mismo slug
 *
 * ORDEN: dentro de un mismo portal, el orden de estas listas es el desempate de los artículos con
 * la misma fecha (ver composeArticles en ../blog-articles.ts). Añade los nuevos al FINAL y no
 * reordenes los existentes: cambiaría el orden en que se ven los listados.
 *
 * Para añadir un artículo:
 *   1. pnpm content:new <portal> <slug>
 *   2. Rellena todos los campos [REQUIRED] del archivo generado
 *   3. Impórtalo y añádelo al final de la lista de su portal más abajo
 *
 * Nota: este archivo NO importa ../blog-articles (lo importa a él): así no hay ciclo.
 */

import type { BlogArticle } from "@ia-next/contracts";

import iaDifusionStableDiffusion from "./ia/difusion-stable-diffusion";
import iaTokensEnEspanol from "./ia/tokens-en-espanol-medicion-reproducible";

import ambientalCalculadoraIrcaCalidadAgua from "./ambiental/calculadora-irca-calidad-agua";
import ambientalIndicesCalidadAireAqiIca from "./ambiental/indices-calidad-aire-aqi-ica";
import ambientalMatricesEiaLeopoldConesa from "./ambiental/matrices-eia-leopold-conesa";
import ambientalNavegadorNormasAmbientales from "./ambiental/navegador-normas-ambientales";
import ambientalCerebroDigitalGestionAmbientalEsg from "./ambiental/cerebro-digital-gestion-ambiental-esg";
import ambientalDesafioAguaAmericaLatinaRuralEstadisticas from "./ambiental/desafio-agua-america-latina-rural-estadisticas";
import ambientalDesafiosMecanismosTratamientoAguasRiego from "./ambiental/desafios-mecanismos-tratamiento-aguas-riego";
import ambientalSuperpoderBorraCafeLimpiarAgua from "./ambiental/superpoder-borra-cafe-limpiar-agua";
import ambientalParadojaAguaValleMedioMagdalenaProyectoMegia from "./ambiental/paradoja-agua-valle-medio-magdalena-proyecto-megia";

// ─── Portal IA ───────────────────────────────────────────────────────────────

export const NEW_IA_ARTICLES_V2: BlogArticle[] = [
  iaDifusionStableDiffusion,
  iaTokensEnEspanol,
  // Añade aquí los nuevos artículos IA generados con: pnpm content:new ia <slug>
];

// ─── Portal Ambiental ────────────────────────────────────────────────────────

export const NEW_AMBIENTAL_ARTICLES_V2: BlogArticle[] = [
  ambientalCalculadoraIrcaCalidadAgua,
  ambientalIndicesCalidadAireAqiIca,
  ambientalMatricesEiaLeopoldConesa,
  ambientalNavegadorNormasAmbientales,
  ambientalCerebroDigitalGestionAmbientalEsg,
  ambientalDesafioAguaAmericaLatinaRuralEstadisticas,
  ambientalDesafiosMecanismosTratamientoAguasRiego,
  ambientalSuperpoderBorraCafeLimpiarAgua,
  ambientalParadojaAguaValleMedioMagdalenaProyectoMegia,
  // Añade aquí los nuevos artículos Ambiental generados con: pnpm content:new ambiental <slug>
];
