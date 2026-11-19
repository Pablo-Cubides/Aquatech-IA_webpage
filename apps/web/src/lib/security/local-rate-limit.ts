/**
 * Límite de tasa EN MEMORIA, por instancia (SEC-002).
 *
 * No toca ninguna base de datos ni servicio externo. Es un control grueso y de
 * mejor esfuerzo: cada instancia serverless cuenta por su cuenta, así que el
 * límite global real es (límite x nº de instancias). Úsalo SOLO donde el
 * control principal sea otro (p. ej. respuesta cacheable en el CDN + validación
 * estricta de entrada) y no se quiera una escritura en la base de datos por
 * petición. Para autenticación, escritura o coste, usa `rateLimit` (almacén
 * compartido, falla cerrado).
 */

type Entry = { hits: number; resetAt: number };

const MAX_KEYS = 10_000;
const buckets = new Map<string, Entry>();

function purgeExpired(now: number): void {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export function localRateLimit(
  key: string,
  limit: number,
  intervalMs: number,
  now: number = Date.now(),
): { success: boolean; remaining: number; reset: number } {
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) {
      purgeExpired(now);
      // Memoria acotada: si sigue lleno, se descarta el más antiguo.
      if (buckets.size >= MAX_KEYS) {
        const oldest = buckets.keys().next().value;
        if (oldest !== undefined) buckets.delete(oldest);
      }
    }
    const resetAt = now + intervalMs;
    buckets.set(key, { hits: 1, resetAt });
    return { success: true, remaining: limit - 1, reset: resetAt };
  }

  current.hits += 1;
  return {
    success: current.hits <= limit,
    remaining: Math.max(limit - current.hits, 0),
    reset: current.resetAt,
  };
}

/** Solo para pruebas. */
export function resetLocalRateLimitForTests(): void {
  buckets.clear();
}
