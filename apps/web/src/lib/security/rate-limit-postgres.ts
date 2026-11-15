/**
 * Almacén PostgreSQL del limitador de tasa (OPS-001).
 *
 * Es el BACKEND de almacenamiento; la POLÍTICA cuando falla (abrir/cerrar) vive
 * en `rate-limit.ts` y es del cargo SEC. Este módulo solo cuenta, y si no puede
 * contar (base caída, lenta, tabla sin proteger) LANZA: el llamador decide.
 *
 * Diseño (mismo que ADR-0013, generalizado a cualquier ventana):
 *  - Un contador atómico por cubo: `INSERT ... ON CONFLICT DO UPDATE`, una sola
 *    sentencia; dos peticiones concurrentes nunca leen el mismo valor.
 *  - Ventana fija que arranca en el primer golpe y vive `intervalMs`; los intentos
 *    rechazados no la alargan. Usa el reloj de la base, no el de la lambda.
 *  - La clave es un HMAC (con una subclave derivada) del identificador: la tabla
 *    no guarda IP, correo ni dato personal, y sin el secreto no se puede invertir.
 *    Rotar NEXTAUTH_SECRET reinicia todos los contadores (benigno).
 *  - Límite de tiempo duro: con la base lenta no se cuelga la petición 30-60 s
 *    (connect_timeout/pool_timeout de la URL) antes de aplicar el failureMode.
 *  - La tabla DEBE tener RLS activo: está en el esquema `public` y Supabase la
 *    expone por PostgREST; sin RLS cualquiera con la anon key podría borrar
 *    filas y resetear los contadores. Se verifica y, si no, se falla cerrado.
 *  - Acceso a la base solo mediante `@ia-next/database`.
 */

import { createHmac } from "node:crypto";
import { prisma } from "@ia-next/database";

export type WindowCount = { hits: number; resetAt: number };

/** Tiempo máximo que se espera al almacén antes de darlo por no disponible. */
export const STORE_TIMEOUT_MS = 1800;

const CLEANUP_PROBABILITY = 0.02;
const CLEANUP_BATCH = 1000;
const KEY_DOMAIN = "rate-limit:v1";

let tableReady: Promise<void> | null = null;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Timeout del almacén del limitador")),
      ms,
    );
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

/** undefined = la tabla no existe; true/false = RLS activo o no. */
async function tableRls(): Promise<boolean | undefined> {
  const rows = await prisma.$queryRaw<Array<{ rls: boolean }>>`
    SELECT c.relrowsecurity AS rls FROM pg_class c
    WHERE c.oid = to_regclass('public.rate_limit_windows')`;
  return rows[0]?.rls;
}

/**
 * Garantiza, una vez por instancia, que la tabla existe Y tiene RLS activo.
 *
 * Camino normal: la migración manual `20261115_rate_limit_windows.sql` (PRERREQUISITO
 * de despliegue) ya está aplicada → una consulta de catálogo, sin DDL.
 * Red de seguridad: si falta, se intenta crear; `CREATE TABLE IF NOT EXISTS` puede
 * fallar con unique_violation si dos instancias lo hacen a la vez, así que se
 * vuelve a comprobar antes de rendirse. Tras crear o encontrar la tabla se exige RLS
 * activo; si no se puede activar (el rol no es dueño) se LANZA: una tabla expuesta a
 * PostgREST es un bypass del limitador, peor que no contar.
 */
function ensureTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      let rls = await tableRls();

      if (rls === undefined) {
        try {
          await prisma.$executeRawUnsafe(
            `CREATE TABLE IF NOT EXISTS public.rate_limit_windows (
              bucket TEXT PRIMARY KEY,
              hits INTEGER NOT NULL CHECK (hits >= 0),
              "expiresAt" TIMESTAMPTZ(6) NOT NULL
            )`,
          );
        } catch (error) {
          if ((await tableRls().catch(() => undefined)) === undefined) throw error;
        }
        await prisma
          .$executeRawUnsafe(
            `CREATE INDEX IF NOT EXISTS rate_limit_windows_expiry_idx ON public.rate_limit_windows ("expiresAt")`,
          )
          .catch(() => undefined); // solo rendimiento de la limpieza
        rls = await tableRls();
      }

      if (rls !== true) {
        await prisma
          .$executeRawUnsafe(`ALTER TABLE public.rate_limit_windows ENABLE ROW LEVEL SECURITY`)
          .catch(() => undefined); // exige ser dueño: se verifica abajo
        rls = await tableRls();
      }

      if (rls !== true) {
        throw new Error(
          "rate_limit_windows sin RLS: aplicar la migración manual 20261115_rate_limit_windows.sql con el rol dueño",
        );
      }
    })().catch((error) => {
      tableReady = null; // reintentar en la próxima petición
      throw error;
    });
  }
  return tableReady;
}

function bucketFor(identifier: string): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Falta NEXTAUTH_SECRET: no se pueden cifrar las claves del limitador.");
  }
  // Subclave de dominio: el secreto de sesión no se usa directamente como clave.
  const key = createHmac("sha256", secret).update(KEY_DOMAIN).digest();
  return createHmac("sha256", key).update(identifier).digest("hex");
}

/** Borra por lotes las filas vencidas hace más de una hora. Mejor esfuerzo. */
async function cleanupExpired(): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(
      `DELETE FROM public.rate_limit_windows WHERE ctid IN (
         SELECT ctid FROM public.rate_limit_windows
         WHERE "expiresAt" < CURRENT_TIMESTAMP - interval '1 hour'
         LIMIT ${CLEANUP_BATCH})`,
    );
  } catch {
    // un fallo de limpieza nunca invalida el conteo
  }
}

/** La limpieza no debe retrasar la respuesta: `after()` si hay petición, si no, sin esperar. */
async function scheduleCleanup(): Promise<void> {
  try {
    const { after } = await import("next/server");
    after(cleanupExpired);
  } catch {
    void cleanupExpired();
  }
}

async function increment(identifier: string, intervalMs: number, limit: number): Promise<WindowCount> {
  const bucket = bucketFor(identifier);
  await ensureTable();

  const rows = await prisma.$queryRaw<Array<{ hits: number; reset_ms: number }>>`
    INSERT INTO public.rate_limit_windows (bucket, hits, "expiresAt")
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

  if (Math.random() < CLEANUP_PROBABILITY) await scheduleCleanup();

  return { hits: Number(row.hits), resetAt: Number(row.reset_ms) };
}

/**
 * Suma un golpe a la ventana de `identifier` y devuelve el total y cuándo vence.
 * Lanza si la base no responde en STORE_TIMEOUT_MS, no hay secreto o la tabla no
 * está protegida con RLS.
 */
export function incrementWindow(
  identifier: string,
  intervalMs: number,
  limit: number,
  timeoutMs: number = STORE_TIMEOUT_MS,
): Promise<WindowCount> {
  return withTimeout(increment(identifier, intervalMs, limit), timeoutMs);
}

/** Para pruebas: olvida que la tabla ya se verificó. */
export function resetRateLimitPostgresForTests(): void {
  tableReady = null;
}
