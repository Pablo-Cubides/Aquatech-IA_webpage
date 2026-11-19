import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * CANARIO (OPS-001): si alguien rellena DATABASE_URL, mete una CA real o quita el entorno
 * hermético de vitest.config.ts, esta suite FALLA en el acto. Es la guarda que impide que
 * `pnpm test` hable con la base de producción (antes dependía de la máquina de quien lo corría).
 */
describe("entorno hermético de los tests", () => {
  it("DATABASE_URL y DIRECT_URL apuntan a loopback", () => {
    for (const name of ["DATABASE_URL", "DIRECT_URL"] as const) {
      const value = process.env[name];
      expect(value, `${name} debe estar definida (hermética)`).toBeTruthy();
      const host = new URL(value as string).hostname;
      expect(["127.0.0.1", "localhost", "::1", "[::1]"], `${name} apunta a ${host}`).toContain(host);
    }
  });

  it("no hay CA real ni TLS relajado para la base", () => {
    expect(process.env.DATABASE_SSL_CA ?? "").toBe("");
    expect(process.env.DATABASE_SSL_ALLOW_UNVERIFIED ?? "").toBe("");
    expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED ?? "").toBe("");
  });

  it("ni Sentry, ni Upstash, ni Brevo están configurados", () => {
    for (const name of [
      "SENTRY_DSN",
      "NEXT_PUBLIC_SENTRY_DSN",
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "BREVO_API_KEY",
    ]) {
      expect(process.env[name] ?? "", name).toBe("");
    }
  });

  it("el caché de artículos en disco es un temporal, nunca el archivo versionado", () => {
    const file = process.env.BLOG_ARTICLES_FILE ?? "";
    expect(file).not.toBe("");
    expect(path.resolve(file).startsWith(path.resolve(os.tmpdir()))).toBe(true);
    expect(file.replace(/\\/g, "/")).not.toMatch(/content\/blog\/articles\.json$/);
  });
});
