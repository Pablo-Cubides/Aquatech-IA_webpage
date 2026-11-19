// Prebuilt runtime entry for @ia-next/database
// This file mirrors the logic in src/index.ts but is plain JS so bundlers
// and Next/Turbopack can resolve the package at runtime without requiring
// TypeScript compilation in node_modules.

const { PrismaClient, Prisma } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Global singleton to avoid multiple Prisma instances in development
const globalForPrisma = globalThis;

const { resolveDatabaseSsl } = require("./ssl-config");

// Placeholder used when DATABASE_URL is not set (e.g. `next build` collecting
// page data). The pool is lazy, so no connection is attempted.
const BUILD_TIME_FALLBACK_URL =
  "postgresql://postgres:postgres@localhost:5432/postgres";

const setQueryParam = (url, key, value) => {
  const pattern = new RegExp(`([?&])${key}=[^&]*`);
  if (pattern.test(url)) {
    return url.replace(pattern, `$1${key}=${value}`);
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${key}=${value}`;
};

// TLS is NOT decided here: see ./ssl-config (certificates are verified by default).
const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  if (!url) return BUILD_TIME_FALLBACK_URL;

  if (url.includes("pooler.supabase.com") && url.includes(":5432")) {
    console.log(
      "[DB-Init] Auto-correcting DATABASE_URL: Switching 5432 -> 6543 (Transaction Mode)",
    );
    url = url.replace(":5432", ":6543");
  }

  if (url.includes(":6543") && !url.includes("pgbouncer=true")) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}pgbouncer=true`;
  }

  url = setQueryParam(url, "connect_timeout", "30");
  url = setQueryParam(url, "pool_timeout", "60");

  return url;
};

const { connectionString, ssl, mode, warnings } = resolveDatabaseSsl(
  getDatabaseUrl(),
  process.env,
);

for (const warning of warnings) {
  console.warn(`[DB-Init] ${warning}`);
}

// Debug connection (Safe Log: never prints credentials)
if (connectionString && mode !== "local") {
  try {
    const parsed = new URL(connectionString);
    console.log(
      `[DB-Init] Connecting to: ${parsed.hostname}:${parsed.port}${parsed.pathname} (tls: ${mode})`,
    );
  } catch {
    console.log("[DB-Init] Failed to parse URL");
  }
}

// TLS is scoped to this pool only. Never set NODE_TLS_REJECT_UNAUTHORIZED:
// it disables certificate verification for every outbound HTTPS call.
const pool = new Pool({ connectionString, ssl });

const adapter = new PrismaPg(pool);

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const getDb = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return prisma;
};

const checkDbConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};

const disconnectDb = async () => {
  await prisma.$disconnect();
};

module.exports = {
  prisma,
  getDb,
  checkDbConnection,
  disconnectDb,
  PrismaClient,
  Prisma,
};
