/**
 * Salud del sitio (OPS-001).
 *
 * Qué es CRÍTICO (si falla, el sitio no puede dar un servicio que promete → 503):
 *   - database: login, registro, medición de uso, límites de tasa (PostgreSQL) y
 *     artículos del blog guardados en la base.
 * Qué es OPCIONAL (si falla o no está configurado, el sitio funciona → 200):
 *   - upstash: solo cuenta si hay credenciales completas; es un almacén
 *     alternativo del limitador. No estar configurado NO es un fallo.
 *
 * El contenido público (artículos en código, herramientas) se sirve sin base de
 * datos, por eso la caída de la base degrada pero no se confunde con "sitio caído"
 * para el contenido; el código HTTP, sin embargo, avisa a un monitor de que hay
 * una dependencia crítica fuera.
 */

import { prisma } from "@ia-next/database";
import { Redis } from "@upstash/redis";

export type CheckStatus = "pass" | "fail" | "skipped";
export type HealthStatus = "ok" | "degraded" | "down";

export type CheckResult = {
  status: CheckStatus;
  critical: boolean;
  responseTimeMs?: number;
  /** Solo nombre del error, nunca el mensaje (puede traer host o usuario de la base). */
  error?: string;
};

export type HealthReport = {
  status: HealthStatus;
  timestamp: string;
  checks: Record<string, CheckResult>;
};

const CHECK_TIMEOUT_MS = 3000;
const CACHE_TTL_MS = 10_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function timed(
  critical: boolean,
  run: () => Promise<unknown>,
): Promise<CheckResult> {
  const start = Date.now();
  try {
    await withTimeout(run(), CHECK_TIMEOUT_MS);
    return { status: "pass", critical, responseTimeMs: Date.now() - start };
  } catch (error) {
    return {
      status: "fail",
      critical,
      responseTimeMs: Date.now() - start,
      error: error instanceof Error ? error.name : "Error",
    };
  }
}

function upstashCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  return url && token ? { url, token } : null;
}

export function summarize(checks: Record<string, CheckResult>): HealthStatus {
  const results = Object.values(checks);
  if (results.some((c) => c.critical && c.status === "fail")) return "down";
  if (results.some((c) => c.status === "fail")) return "degraded";
  return "ok";
}

export async function runHealthChecks(): Promise<HealthReport> {
  const credentials = upstashCredentials();

  const [database, upstash] = await Promise.all([
    timed(true, () => prisma.$queryRaw`SELECT 1`),
    credentials
      ? timed(false, () => new Redis(credentials).ping())
      : Promise.resolve<CheckResult>({ status: "skipped", critical: false }),
  ]);

  const checks = { database, upstash };
  return { status: summarize(checks), timestamp: new Date().toISOString(), checks };
}

let cached: { at: number; report: HealthReport } | null = null;

/** Evita que un monitor (o un abuso) convierta /api/health en una carga constante sobre la base. */
export async function getHealthReport(now = Date.now()): Promise<HealthReport> {
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.report;
  const report = await runHealthChecks();
  cached = { at: now, report };
  return report;
}

export function resetHealthCacheForTests(): void {
  cached = null;
}
