import type { PrismaClient } from "@prisma/client";

export declare const prisma: PrismaClient;
export declare const getDb: () => PrismaClient;
export declare const checkDbConnection: () => Promise<boolean>;
export declare const disconnectDb: () => Promise<void>;
export { PrismaClient, Prisma } from "@prisma/client";
export type {
  User,
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
