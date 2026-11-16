/**
 * Registro de artículos nuevos (un archivo por artículo) — SPEC-100, ADR-0008.
 *
 * Este archivo SOLO registra: exporta las dos listas que `getStaticArticleMap()` (en
 * ../blog-articles.ts) fusiona con el resto de fuentes. La fusión y su orden de
 * precedencia viven allí, en un solo sitio, y no aquí.
 *
 * Fuentes de artículos, de MENOR a MAYOR precedencia (si un slug se repite, gana la última):
 *   1. blog-articles.ts            (IA_ARTICLES / AMBIENTAL_ARTICLES, heredados)
 *   2. new-blog-articles.ts y new-ambiental-articles.ts
 *   3. este registro               (articles/ia/*.ts y articles/ambiental/*.ts)
 *   4. PostgreSQL (BlogPost)       sustituye a cualquiera de las anteriores con el mismo slug
 *
 * Para añadir un artículo:
 *   1. pnpm content:new <portal> <slug>
 *   2. Rellena todos los campos [REQUIRED] del archivo generado
 *   3. Impórtalo y añádelo a la lista de su portal más abajo
 *
 * Nota: este archivo NO importa ../blog-articles (lo importa a él): así no hay ciclo.
 */

import type { BlogArticle } from "@ia-next/contracts";

// ─── Artículos nuevos del portal IA ──────────────────────────────────────────
import iaTokensEnEspanol from "./ia/tokens-en-espanol-medicion-reproducible";

export const NEW_IA_ARTICLES_V2: BlogArticle[] = [
  iaTokensEnEspanol,
  // Añade aquí los nuevos artículos IA generados con: pnpm content:new ia <slug>
];

// ─── Artículos nuevos del portal Ambiental ───────────────────────────────────
// import ambientalArticleExample from "./ambiental/example-slug";

export const NEW_AMBIENTAL_ARTICLES_V2: BlogArticle[] = [
  // Añade aquí los nuevos artículos Ambiental generados con: pnpm content:new ambiental <slug>
];
