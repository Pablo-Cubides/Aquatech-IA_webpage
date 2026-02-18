// Database utilities and Prisma client re-export
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Global singleton to avoid multiple Prisma instances in development
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

  url = setQueryParam(url, "sslmode", strictSsl ? "require" : "no-verify");
  url = setQueryParam(url, "connect_timeout", "30");
  url = setQueryParam(url, "pool_timeout", "60");

  return url;
};

const databaseUrl = getDatabaseUrl();
const isLocalDatabase =
  !databaseUrl ||
  databaseUrl.includes("localhost") ||
  databaseUrl.includes("127.0.0.1") ||
  databaseUrl.includes("@postgres:");
const rejectUnauthorized =
  process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true";

// Debug connection (Safe Log)
if (databaseUrl) {
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

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Database connection helper
export const getDb = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return prisma;
};

// Helper to check database connectivity
export const checkDbConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};

// Graceful shutdown helper
export const disconnectDb = async (): Promise<void> => {
  await prisma.$disconnect();
};

// Re-export Prisma types for convenience
export type {
  User,
  CreditLog,
  Tool,
  Payment,
  AdminLog,
  ToolUsage,
  Content,
  EditorSection,
} from "@prisma/client";

// Re-export the Prisma client
export { PrismaClient } from "@prisma/client";
