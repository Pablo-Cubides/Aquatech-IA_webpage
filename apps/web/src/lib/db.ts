import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const setQueryParam = (url: string, key: string, value: string) => {
  const pattern = new RegExp(`([?&])${key}=[^&]*`);
  if (pattern.test(url)) {
    return url.replace(pattern, `$1${key}=${value}`);
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${key}=${value}`;
};

// Helper to ensure we use Transaction Mode (Port 6543)
const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;
  const strictSsl = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true";

  // Fix: Vercel Integration often forces port 5432 (Session Mode) which hits limits.
  // We force port 6543 (Transaction Mode) for stability.
  if (url.includes("pooler.supabase.com") && url.includes(":5432")) {
    console.log(
      "[DB-Init] 🔧 Auto-correcting DATABASE_URL: Switching 5432 -> 6543 (Transaction Mode)",
    );
    url = url.replace(":5432", ":6543");
  }

  // Transaction mode requires pgbouncer=true for Prisma
  if (url.includes(":6543") && !url.includes("pgbouncer=true")) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}pgbouncer=true`;
  }

  // Enforce SSL mode (no-verify by default for managed self-signed chains)
  url = setQueryParam(url, "sslmode", strictSsl ? "require" : "no-verify");

  // Increase connection timeout to 30s to avoid flakes
  url = setQueryParam(url, "connect_timeout", "30");

  // Increase Prisma Pool timeout (default is 10s, which is too short for Serverless cold starts)
  url = setQueryParam(url, "pool_timeout", "60");

  return url;
};

const databaseUrl =
  getDatabaseUrl() || "postgresql://postgres:postgres@localhost:5432/postgres"; // Fallback for build time

const isLocalDatabase =
  databaseUrl.includes("localhost") ||
  databaseUrl.includes("127.0.0.1") ||
  databaseUrl.includes("@postgres:");
const rejectUnauthorized =
  process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true";

// Debug connection (Safe Log)
if (databaseUrl && !databaseUrl.includes("localhost")) {
  try {
    const url = new URL(databaseUrl);
    console.log(
      `[DB-Init] 🚀 Connecting to: ${url.hostname}:${url.port}${url.pathname}`,
    );
  } catch (e) {
    console.log("[DB-Init] Failed to parse URL");
  }
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalDatabase
    ? undefined
    : {
        rejectUnauthorized,
      },
});

const adapter = new PrismaPg(pool);

const prismaConfig: any = {
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaConfig);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
