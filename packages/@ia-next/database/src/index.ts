// Database utilities and Prisma client re-export
import { PrismaClient } from "@prisma/client";

// Global singleton to avoid multiple Prisma instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Optimize connection pool for pgbouncer
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection pool optimization
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
