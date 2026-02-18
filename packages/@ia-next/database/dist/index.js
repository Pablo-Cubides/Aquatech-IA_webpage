// Prebuilt runtime entry for @ia-next/database
// This file mirrors the logic in src/index.ts but is plain JS so bundlers
// and Next/Turbopack can resolve the package at runtime without requiring
// TypeScript compilation in node_modules.

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Global singleton to avoid multiple Prisma instances in development
const globalForPrisma = globalThis;

const setQueryParam = (url, key, value) => {
  const pattern = new RegExp(`([?&])${key}=[^&]*`);
  if (pattern.test(url)) {
    return url.replace(pattern, `$1${key}=${value}`);
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${key}=${value}`;
};

const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  const strictSsl = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true";
  if (!url) {
    return "postgresql://postgres:postgres@localhost:5432/postgres";
  }

  if (url.includes("pooler.supabase.com") && url.includes(":5432")) {
    url = url.replace(":5432", ":6543");
  }

  if (url.includes(":6543") && !url.includes("pgbouncer=true")) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}pgbouncer=true`;
  }

  url = setQueryParam(url, "sslmode", strictSsl ? "require" : "no-verify");
  url = setQueryParam(url, "connect_timeout", "30");
  url = setQueryParam(url, "pool_timeout", "60");

  return url;
};

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  ssl: (() => {
    const url = getDatabaseUrl();
    const isLocalDatabase =
      !url ||
      url.includes("localhost") ||
      url.includes("127.0.0.1") ||
      url.includes("@postgres:");
    if (isLocalDatabase) {
      return undefined;
    }
    return {
      rejectUnauthorized:
        process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true",
    };
  })(),
});

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
};
