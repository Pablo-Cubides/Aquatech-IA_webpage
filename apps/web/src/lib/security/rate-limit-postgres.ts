/**
 * Almacén PostgreSQL del limitador de tasa (OPS-001).
 *
 * Es el BACKEND de almacenamiento; la POLÍTICA cuando falla (abrir/cerrar) vive
 * en `rate-limit.ts` y es del cargo SEC. Este módulo solo cuenta, y si no puede
 * contar LANZA: el llamador decide qué hacer.
 *
 * Diseño (mismo que ADR-0013, generalizado a cualquier ventana):
 *  - Un contador atómico por cubo: `INSERT ... ON CONFLICT DO UPDATE`. Dos
 *    peticiones concurrentes nunca leen el mismo valor.
 *  - Ventana fija que arranca en el primer golpe y vive `intervalMs`.
 *  - La clave es un HMAC del identificador: la tabla no guarda IP, correo ni
 *    ningún dato personal, y sin el secreto no se puede invertir.
 *  - Limpieza oportunista de filas vencidas (sin cron).
 *  - Acceso a la base solo mediante `@ia-next/database`.
 */

import { createHmac } from "node:crypto";
import { prisma } from "@ia-next/database";

export type WindowCount = { hits: number; resetAt: number };

const CLEANUP_PROBABILITY = 0.02;
const CLEANUP_GRACE = "1 hour";

let ensured: Promise<void> | null = null;

async function tableExists(): Promise<boolean> {
  const rows = await prisma.$queryRaw<Array<{ found: boolean }>>`
    SELECT to_regclass('public.rate_limit_windows') IS NOT NULL AS found`;
  return rows[0]?.found === true;
}

/**
 * Garantiza que la tabla exista, una vez por instancia.
 *
 * Camino normal (la migración manual `20261115_rate_limit_windows.sql` ya está
 * aplicada): una sola consulta de catálogo, sin DDL y sin necesitar permiso
 * CREATE. Solo si falta intenta crearla (red de seguridad): `CREATE TABLE IF NOT
 * EXISTS` puede fallar con unique_violation si dos instancias lo hacen a la vez,
 * así que tras un fallo se vuelve a comprobar antes de rendirse. Activar RLS es
 * de mejor esfuerzo (exige ser dueño de la tabla).
 */
function ensureTable(): Promise<void> {
  if (!ensured) {
    ensured = (async () => {
      if (await tableExists()) return;
      try {
        await prisma.$executeRawUnsafe(
          `CREATE TABLE IF NOT EXISTS rate_limit_windows (
            bucket TEXT PRIMARY KEY,
            hits INTEGER NOT NULL,
            "expiresAt" TIMESTAMPTZ(6) NOT NULL
          )`,
        );
      } catch (error) {
        if (!(await tableExists().catch(() => false))) throw error; // sin carrera: fallo real
      }
      await prisma
        .$executeRawUnsafe(
          `CREATE INDEX IF NOT EXISTS rate_limit_windows_expiry_idx ON rate_limit_windows ("expiresAt")`,
        )
        .catch(() => undefined);
      await prisma
        .$executeRawUnsafe(`ALTER TABLE rate_limit_windows ENABLE ROW LEVEL SECURITY`)
        .catch(() => undefined);
    })().catch((error) => {
      ensured = null; // reintentar en la próxima petición
      throw error;
    });
  }
  return ensured;
}

function bucketFor(identifier: string): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Falta NEXTAUTH_SECRET: no se pueden cifrar las claves del limitador.");
  }
  return createHmac("sha256", secret).update(identifier).digest("hex");
}

/**
 * Suma un golpe a la ventana de `identifier` y devuelve el total y cuándo
 * vence. Lanza si la base no responde o no hay secreto.
 */
export async function incrementWindow(
  identifier: string,
  intervalMs: number,
  limit: number,
): Promise<WindowCount> {
  const bucket = bucketFor(identifier);
  await ensureTable();

  const rows = await prisma.$queryRaw<Array<{ hits: number; reset_ms: number }>>`
    INSERT INTO rate_limit_windows (bucket, hits, "expiresAt")
    VALUES (${bucket}, 1, CURRENT_TIMESTAMP + (${intervalMs}::double precision * interval '1 millisecond'))
    ON CONFLICT (bucket) DO UPDATE SET
      hits = CASE
        WHEN rate_limit_windows."expiresAt" <= CURRENT_TIMESTAMP THEN 1
        ELSE LEAST(rate_limit_windows.hits + 1, ${limit}::int + 1)
      END,
      "expiresAt" = CASE
        WHEN rate_limit_windows."expiresAt" <= CURRENT_TIMESTAMP THEN EXCLUDED."expiresAt"
        ELSE rate_limit_windows."expiresAt"
      END
    RETURNING hits, (extract(epoch FROM "expiresAt") * 1000)::double precision AS reset_ms`;

  const row = rows[0];
  if (!row) throw new Error("El contador no devolvió resultado.");

  if (Math.random() < CLEANUP_PROBABILITY) {
    // Mejor esfuerzo: un fallo de limpieza nunca invalida el conteo.
    await prisma
      .$executeRawUnsafe(
        `DELETE FROM rate_limit_windows WHERE "expiresAt" < CURRENT_TIMESTAMP - interval '${CLEANUP_GRACE}'`,
      )
      .catch(() => undefined);
  }

  return { hits: Number(row.hits), resetAt: Number(row.reset_ms) };
}

/** Para pruebas: olvida que la tabla ya se verificó. */
export function resetRateLimitPostgresForTests(): void {
  ensured = null;
}
