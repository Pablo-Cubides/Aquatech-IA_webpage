/**
 * Degradaciones silenciosas (OPS-001).
 *
 * Hay rutas que, si la base de datos falla, "se las arreglan" devolviendo solo el
 * contenido que viene en el código (p. ej. `getStoredArticles` → artículos de
 * disco). El sitio sigue en pie pero con MENOS contenido: llms.txt, sitemap y
 * listados pierden artículos durante horas (revalidate de 1-6 h) sin que nadie
 * lo note. Aquí se deja señal visible: log de error + evento en Sentry.
 *
 * Dos horizontes, para que un monitor distinga "degradado AHORA" de "se degradó
 * una vez hace horas":
 *  - `recent`: solo lo ocurrido en los últimos DEGRADATION_WINDOW_MS. Es lo que
 *    puede poner `/api/health` en `degraded`, y caduca solo.
 *  - `sinceInstanceStart`: acumulado de la instancia, etiquetado como tal; nunca
 *    decide el estado.
 *
 * Se limita a un aviso a Sentry cada 10 min por tipo y por instancia para no
 * inundar la cuota si la base cae un rato largo.
 */

import * as Sentry from "@sentry/nextjs";
import { logger } from "@/lib/logger";

export type DegradationKind =
  | "blog-store-db-fallback"
  | "blog-articles-fallback"
  | "indexable-articles-incomplete";

const THROTTLE_MS = 10 * 60 * 1000;
/** Cuánto tiempo una degradación cuenta como "actual". */
export const DEGRADATION_WINDOW_MS = 10 * 60 * 1000;
const MAX_TIMESTAMPS = 200;

type State = {
  count: number;
  firstAt: number;
  lastAt: number;
  lastReportedAt: number;
  /** Marcas de tiempo recientes (acotadas) para calcular la ventana. */
  recent: number[];
};
const states = new Map<DegradationKind, State>();

/** Solo el nombre del error: el mensaje puede traer host o usuario de la base. */
function errorName(error: unknown): string {
  return error instanceof Error ? error.name : typeof error;
}

export function reportDegradation(
  kind: DegradationKind,
  error: unknown,
  context: Record<string, string | number | boolean> = {},
  now = Date.now(),
): void {
  // En `next build` sin base el fallback a disco es lo esperado; su vigilancia es de ARQ-004.
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const previous = states.get(kind);
  const state: State = previous
    ? {
        ...previous,
        count: previous.count + 1,
        lastAt: now,
        recent: [...previous.recent, now].slice(-MAX_TIMESTAMPS),
      }
    : { count: 1, firstAt: now, lastAt: now, lastReportedAt: -Infinity, recent: [now] };

  const shouldReport = now - state.lastReportedAt >= THROTTLE_MS;
  if (shouldReport) state.lastReportedAt = now;
  states.set(kind, state);
  if (!shouldReport) return;

  logger.error(`Degradación silenciosa: ${kind}`, undefined, {
    errorName: errorName(error),
    occurrences: state.count,
    ...context,
  });
  try {
    Sentry.captureMessage(`Degradación silenciosa: ${kind}`, {
      level: "error",
      tags: { degradation: kind },
      extra: { errorName: errorName(error), occurrences: state.count, ...context },
      fingerprint: ["degradation", kind],
    });
  } catch {
    // sin SDK activo no pasa nada
  }
}

function recentCount(state: State, now: number, windowMs: number): number {
  return state.recent.filter((at) => now - at < windowMs).length;
}

/** ¿Ha habido alguna degradación en la ventana? Es lo que baja `/api/health` a `degraded`. */
export function hasRecentDegradation(
  now = Date.now(),
  windowMs = DEGRADATION_WINDOW_MS,
): boolean {
  return [...states.values()].some((state) => recentCount(state, now, windowMs) > 0);
}

export type DegradationSnapshot = {
  windowMinutes: number;
  /** Lo ocurrido en la ventana; vacío cuando la instancia ya se recuperó. */
  recent: Record<string, { count: number; lastAt: string }>;
  /** Acumulado desde que arrancó la instancia. NO indica el estado actual. */
  sinceInstanceStart: Record<string, { count: number; firstAt: string; lastAt: string }>;
};

/** Para el detalle autenticado de /api/health. */
export function getDegradationSnapshot(
  now = Date.now(),
  windowMs = DEGRADATION_WINDOW_MS,
): DegradationSnapshot {
  const recent: DegradationSnapshot["recent"] = {};
  const sinceInstanceStart: DegradationSnapshot["sinceInstanceStart"] = {};

  for (const [kind, state] of states) {
    const inWindow = recentCount(state, now, windowMs);
    if (inWindow > 0) {
      recent[kind] = { count: inWindow, lastAt: new Date(state.lastAt).toISOString() };
    }
    sinceInstanceStart[kind] = {
      count: state.count,
      firstAt: new Date(state.firstAt).toISOString(),
      lastAt: new Date(state.lastAt).toISOString(),
    };
  }

  return { windowMinutes: Math.round(windowMs / 60_000), recent, sinceInstanceStart };
}

export function resetDegradationForTests(): void {
  states.clear();
}
