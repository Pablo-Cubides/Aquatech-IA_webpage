import { describe, expect, it } from "vitest";

/**
 * CANARIO (OPS-001): la suite de apps/api tampoco puede hablar con nada de fuera.
 * Ver vitest.hermetic.ts en la raíz del repositorio.
 */
describe("entorno hermético de los tests de apps/api", () => {
  it("DATABASE_URL y DIRECT_URL apuntan a loopback", () => {
    for (const name of ["DATABASE_URL", "DIRECT_URL"] as const) {
      const value = process.env[name];
      expect(value, `${name} debe estar definida (hermética)`).toBeTruthy();
      expect(["127.0.0.1", "localhost", "::1", "[::1]"]).toContain(new URL(value as string).hostname);
    }
  });

  it("no hay CA real, Sentry, Upstash ni Brevo configurados", () => {
    for (const name of [
      "DATABASE_SSL_CA",
      "DATABASE_SSL_ALLOW_UNVERIFIED",
      "SENTRY_DSN",
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "BREVO_API_KEY",
    ]) {
      expect(process.env[name] ?? "", name).toBe("");
    }
  });
});
