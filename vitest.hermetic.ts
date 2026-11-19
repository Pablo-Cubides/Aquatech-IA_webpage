/**
 * Entorno HERMÉTICO de los tests (OPS-001). Lo importan vitest.config.ts de apps/web y apps/api.
 *
 * Un test no debe poder hablar con nada de fuera: ni la base de datos, ni Sentry, ni Upstash,
 * ni escribir en archivos del repositorio. Antes, que una suite alcanzara una base real
 * dependía de si quien la corría tenía `DATABASE_URL` rellena en su shell o en las variables
 * de Windows (turbo.json la pasa tal cual): el resultado de "pnpm test" dependía de la máquina.
 *
 * Aquí se fija, para TODO el proceso de test, un entorno que no depende del exterior. Quien
 * necesite algo distinto en un test lo pide con `vi.stubEnv(...)`, de forma explícita.
 */

import os from "node:os";
import path from "node:path";

/**
 * Destino que rechaza la conexión al instante: loopback y puerto 1 (nadie escucha).
 * Con 5432 un Postgres local del desarrollador sí respondería.
 */
export const HERMETIC_DATABASE_URL = "postgresql://hermetic:hermetic@127.0.0.1:1/hermetic";

/** Directorio temporal del proceso de test: aquí caen las escrituras que antes iban al repo. */
export const HERMETIC_TMP_DIR = path.join(os.tmpdir(), `aquatech-vitest-${process.pid}`);

export const HERMETIC_BLOG_ARTICLES_FILE = path.join(HERMETIC_TMP_DIR, "articles.json");

/** Valores de `test.env`. Cadena vacía = "no definida" para el código (`if (!process.env.X)`). */
export const hermeticTestEnv: Record<string, string> = {
  // Base de datos: inalcanzable y sin posibilidad de TLS relajado ni de CA real.
  DATABASE_URL: HERMETIC_DATABASE_URL,
  DIRECT_URL: HERMETIC_DATABASE_URL,
  DATABASE_SSL_CA: "",
  DATABASE_SSL_ALLOW_UNVERIFIED: "",
  DATABASE_SSL_REJECT_UNAUTHORIZED: "",
  NODE_TLS_REJECT_UNAUTHORIZED: "",
  // Observabilidad y limitador externo: nada sale hacia fuera.
  SENTRY_DSN: "",
  NEXT_PUBLIC_SENTRY_DSN: "",
  UPSTASH_REDIS_REST_URL: "",
  UPSTASH_REDIS_REST_TOKEN: "",
  // Servicios con efectos reales.
  BREVO_API_KEY: "",
  // Caché de artículos en disco: temporal, nunca el archivo versionado.
  BLOG_ARTICLES_FILE: HERMETIC_BLOG_ARTICLES_FILE,
};
