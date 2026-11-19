/**
 * Configuración TLS de la conexión a PostgreSQL (SEC-001).
 *
 * Reglas:
 *  - Por defecto SE VERIFICA el certificado del servidor.
 *  - Única excepción automática: base de datos local (host localhost/127.0.0.1/::1
 *    o el servicio `postgres` de docker-compose), que va sin TLS.
 *  - Si el proveedor firma con una CA que Node no trae (Supabase usa
 *    "Supabase Root 2021 CA"), se aporta en DATABASE_SSL_CA (PEM o PEM en base64).
 *  - Saltarse la verificación solo es posible con DATABASE_SSL_ALLOW_UNVERIFIED=true,
 *    queda acotado al pool de Postgres y emite una advertencia en cada arranque.
 *
 * Nunca se toca NODE_TLS_REJECT_UNAUTHORIZED: es una variable de ámbito de
 * proceso que desactivaría la verificación de TODAS las llamadas HTTPS salientes.
 *
 * Este archivo tiene un espejo en dist/ssl-config.js (el runtime real del
 * paquete). Ambos se prueban con la misma tabla de casos.
 */

export type DatabaseSslMode =
  | "local"
  | "verify"
  | "verify-custom-ca"
  | "unverified";

export interface DatabaseSslOptions {
  rejectUnauthorized: boolean;
  ca?: string;
}

export interface DatabaseSslSettings {
  /** URL sin parámetros ssl* (para que no pisen la opción `ssl` de pg). */
  connectionString: string | undefined;
  ssl: DatabaseSslOptions | undefined;
  mode: DatabaseSslMode;
  warnings: string[];
}

type Env = Record<string, string | undefined>;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "postgres"]);

/** Parámetros de la URL que pg interpreta como configuración TLS. */
const SSL_QUERY_PARAMS = new Set([
  "sslmode",
  "ssl",
  "sslcert",
  "sslkey",
  "sslrootcert",
  "sslaccept",
  "uselibpqcompat",
]);

/**
 * Decide si la URL apunta a una base local mirando SOLO el host. No se usa
 * `url.includes("localhost")`: una contraseña o un parámetro con esa palabra
 * apagaría TLS contra un servidor remoto.
 */
export function isLocalDatabaseUrl(url: string | undefined): boolean {
  if (!url) return true;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return LOCAL_HOSTS.has(host) || host.endsWith(".localhost");
  } catch {
    return false;
  }
}

/** Quita los parámetros ssl* de la query sin tocar usuario ni contraseña. */
export function stripSslParams(url: string): string {
  const queryStart = url.indexOf("?");
  if (queryStart === -1) return url;

  const base = url.slice(0, queryStart);
  const kept = url
    .slice(queryStart + 1)
    .split("&")
    .filter((pair) => {
      if (!pair) return false;
      const name = decodeURIComponent(pair.split("=")[0] ?? "").toLowerCase();
      return !SSL_QUERY_PARAMS.has(name);
    });

  return kept.length ? `${base}?${kept.join("&")}` : base;
}

/** Acepta PEM literal, PEM con "\n" escapados o PEM en base64. */
export function parseCaCertificate(raw: string): string {
  let value = raw.trim().replace(/\\n/g, "\n");

  if (!value.includes("-----BEGIN")) {
    value = Buffer.from(value, "base64").toString("utf8").trim();
  }

  if (!/-----BEGIN CERTIFICATE-----[\s\S]+-----END CERTIFICATE-----/.test(value)) {
    throw new Error(
      "DATABASE_SSL_CA está definida pero no contiene un certificado PEM válido",
    );
  }

  return value;
}

export function resolveDatabaseSsl(
  url: string | undefined,
  env: Env,
): DatabaseSslSettings {
  const warnings: string[] = [];
  const connectionString = url ? stripSslParams(url) : undefined;

  if (env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false") {
    warnings.push(
      "DATABASE_SSL_REJECT_UNAUTHORIZED=false ya no se respeta. Usa DATABASE_SSL_CA " +
        "(recomendado) o, de forma explícita y temporal, DATABASE_SSL_ALLOW_UNVERIFIED=true.",
    );
  }

  if (isLocalDatabaseUrl(url)) {
    return { connectionString, ssl: undefined, mode: "local", warnings };
  }

  const rawCa = env.DATABASE_SSL_CA?.trim();
  const allowUnverified = env.DATABASE_SSL_ALLOW_UNVERIFIED === "true";

  if (rawCa) {
    if (allowUnverified) {
      warnings.push(
        "DATABASE_SSL_ALLOW_UNVERIFIED se ignora porque DATABASE_SSL_CA está definida: se verifica con esa CA.",
      );
    }
    return {
      connectionString,
      ssl: { rejectUnauthorized: true, ca: parseCaCertificate(rawCa) },
      mode: "verify-custom-ca",
      warnings,
    };
  }

  if (allowUnverified) {
    warnings.push(
      "SEGURIDAD: DATABASE_SSL_ALLOW_UNVERIFIED=true — la conexión a PostgreSQL NO verifica el " +
        "certificado del servidor (vulnerable a intermediario). Define DATABASE_SSL_CA y retira esta variable.",
    );
    return {
      connectionString,
      ssl: { rejectUnauthorized: false },
      mode: "unverified",
      warnings,
    };
  }

  return {
    connectionString,
    ssl: { rejectUnauthorized: true },
    mode: "verify",
    warnings,
  };
}
