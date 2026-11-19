export type DatabaseSslMode =
  | "local"
  | "verify"
  | "verify-custom-ca"
  | "unverified";

export interface DatabaseSslOptions {
  rejectUnauthorized: boolean;
  ca?: string;
}

export interface DatabaseSslSettings {
  connectionString: string | undefined;
  ssl: DatabaseSslOptions | undefined;
  mode: DatabaseSslMode;
  warnings: string[];
}

export declare function isLocalDatabaseUrl(url: string | undefined): boolean;
export declare function stripSslParams(url: string): string;
export declare function parseCaCertificate(raw: string): string;
export declare function resolveDatabaseSsl(
  url: string | undefined,
  env: Record<string, string | undefined>,
): DatabaseSslSettings;
