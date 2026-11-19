// Prebuilt runtime mirror of src/ssl-config.ts (plain CommonJS, no compilation needed).
// Keep both files in sync: apps/web tests run the same case table against each.
// See src/ssl-config.ts for the rules and the rationale.

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "postgres"]);

const SSL_QUERY_PARAMS = new Set([
  "sslmode",
  "ssl",
  "sslcert",
  "sslkey",
  "sslrootcert",
  "sslaccept",
  "uselibpqcompat",
]);

function isLocalDatabaseUrl(url) {
  if (!url) return true;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return LOCAL_HOSTS.has(host) || host.endsWith(".localhost");
  } catch {
    return false;
  }
}

function stripSslParams(url) {
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

function parseCaCertificate(raw) {
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

function resolveDatabaseSsl(url, env) {
  const warnings = [];
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

module.exports = {
  isLocalDatabaseUrl,
  stripSslParams,
  parseCaCertificate,
  resolveDatabaseSsl,
};
