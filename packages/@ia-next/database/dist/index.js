// Prebuilt runtime entry for @ia-next/database
// This file mirrors the logic in src/index.ts but is plain JS so bundlers
// and Next/Turbopack can resolve the package at runtime without requiring
// TypeScript compilation in node_modules.

const { PrismaClient } = require("@prisma/client");

// Global singleton to avoid multiple Prisma instances in development
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
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
