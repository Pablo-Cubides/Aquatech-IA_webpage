import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Helper to ensure we use Transaction Mode (Port 6543)
const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // Fix: Vercel Integration often forces port 5432 (Session Mode) which hits limits.
  // We force port 6543 (Transaction Mode) for stability.
  if (url.includes('pooler.supabase.com') && url.includes(':5432')) {
    console.log('[DB-Init] 🔧 Auto-correcting DATABASE_URL: Switching 5432 -> 6543 (Transaction Mode)');
    url = url.replace(':5432', ':6543');
  }

  // Transaction mode requires pgbouncer=true for Prisma
  if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}pgbouncer=true`;
  }

  return url;
};

const databaseUrl = getDatabaseUrl();

// Debug connection (Safe Log)
if (databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    console.log(`[DB-Init] 🚀 Connecting to: ${url.hostname}:${url.port}${url.pathname}`);
  } catch (e) {
    console.log('[DB-Init] Failed to parse URL');
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
