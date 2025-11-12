import type { PrismaClient } from "@prisma/client";

export declare const prisma: PrismaClient;
export declare const getDb: () => PrismaClient;
export declare const checkDbConnection: () => Promise<boolean>;
export declare const disconnectDb: () => Promise<void>;
export { PrismaClient } from "@prisma/client";
