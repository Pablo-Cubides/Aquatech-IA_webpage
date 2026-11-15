// Database utilities and Prisma client re-export
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { resolveDatabaseSsl } from "./ssl-config";

// Global singleton to avoid multiple Prisma instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Placeholder used when DATABASE_URL is not set (e.g. `next build` collecting
// page data). The pool is lazy, so no connection is attempted.
const BUILD_TIME_FALLBACK_URL =
  "postgresql://postgres:postgres@localhost:5432/postgres";

const setQueryParam = (url: string, key: string, value: string) => {
  const pattern = new RegExp(`([?&])${key}=[^&]*`);
  if (pattern.test(url)) {
    return url.replace(pattern, `$1${key}=${value}`);
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${key}=${value}`;
};

// Helper to ensure we use Transaction Mode (Port 6543).
// TLS is NOT decided here: see ./ssl-config (certificates are verified by default).
const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  if (!url) return BUILD_TIME_FALLBACK_URL;

  // Fix: Vercel Integration often forces port 5432 (Session Mode) which hits limits.
  // We force port 6543 (Transaction Mode) for stability.
  if (url.includes("pooler.supabase.com") && url.includes(":5432")) {
    console.log(
      "[DB-Init] Auto-correcting DATABASE_URL: Switching 5432 -> 6543 (Transaction Mode)",
    );
    url = url.replace(":5432", ":6543");
  }

  // Transaction mode requires pgbouncer=true for Prisma
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
    const url = new URL(connectionString);
    console.log(
      `[DB-Init] Connecting to: ${url.hostname}:${url.port}${url.pathname} (tls: ${mode})`,
    );
  } catch {
    console.log("[DB-Init] Failed to parse URL");
  }
}

// TLS is scoped to this pool only. Never set NODE_TLS_REJECT_UNAUTHORIZED:
// it disables certificate verification for every outbound HTTPS call.
const pool = new Pool({ connectionString, ssl });

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
  UserRole,
  CreditLog,
  Tool,
  Payment,
  AdminLog,
  ToolUsage,
  Content,
  EditorSection,
  BlogPost,
  BlogPostStatus,
} from "@prisma/client";

// Re-export the Prisma client and namespace
export { PrismaClient, Prisma } from "@prisma/client";
