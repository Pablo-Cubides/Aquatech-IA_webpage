/**
 * Degradaciones silenciosas (OPS-001).
 *
 * Hay rutas que, si la base de datos falla, "se las arreglan" devolviendo solo el
 * contenido que viene en el código (p. ej. `getStoredArticles` → artículos de
 * disco). El sitio sigue en pie pero con MENOS contenido: llms.txt, sitemap y
 * listados pierden artículos durante horas (revalidate de 1-6 h) sin que nadie
 * lo note. Aquí se deja señal visible: log de error + evento en Sentry.
 *
 * Se limita a un aviso cada 10 min por tipo y por instancia para no inundar la
 * cuota de Sentry si la base cae un rato largo.
 */

import * as Sentry from "@sentry/nextjs";
import { logger } from "@/lib/logger";

export type DegradationKind = "blog-store-db-fallback" | "blog-articles-fallback";

const THROTTLE_MS = 10 * 60 * 1000;

type State = { count: number; firstAt: string; lastAt: string; lastReportedAt: number };
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

  const iso = new Date(now).toISOString();
  const previous = states.get(kind);
  const state: State = previous
    ? { ...previous, count: previous.count + 1, lastAt: iso }
    : { count: 1, firstAt: iso, lastAt: iso, lastReportedAt: -Infinity };

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

/** Para el detalle autenticado de /api/health: qué degradaciones ha visto esta instancia. */
export function getDegradationSnapshot(): Record<string, Omit<State, "lastReportedAt">> {
  return Object.fromEntries(
    [...states].map(([kind, { count, firstAt, lastAt }]) => [kind, { count, firstAt, lastAt }]),
  );
}

export function resetDegradationForTests(): void {
  states.clear();
}
