import { describe, it, expect, vi, afterEach } from "vitest";
vi.mock("./logger", () => ({ logger: { error: vi.fn(), warn: vi.fn() } }));
import * as rateLimitModule from "./rate-limit";
import { checkRateLimit } from "./rate-limit";

afterEach(() => vi.unstubAllEnvs());

function withoutStore(env: string) {
  vi.stubEnv("NODE_ENV", env);
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
}

describe("política de fallo del limitador de apps/api (SEC-002, criterio único con apps/web)", () => {
  it.each(["payment", "email", "auth", "tool"] as const)(
    "%s falla CERRADO cuando el almacén no está disponible (también en desarrollo)",
    async (type) => {
      withoutStore("development");
      expect((await checkRateLimit(type, "x")).success).toBe(false);
      withoutStore("production");
      expect((await checkRateLimit(type, "x")).success).toBe(false);
    },
  );

  it("api es la única excepción declarada como abierta", async () => {
    withoutStore("production");
    expect((await checkRateLimit("api", "x")).success).toBe(true);
  });

  it("el modo no depende del texto del identificador", async () => {
    withoutStore("production");
    expect((await checkRateLimit("payment", "lectura-publica")).success).toBe(false);
    expect((await checkRateLimit("api", "payment:auth:admin:delete")).success).toBe(true);
  });

  it("las funciones de replay que fallaban abiertas y nadie usaba ya no existen", () => {
    expect("hasProcessedWebhookEvent" in rateLimitModule).toBe(false);
    expect("markWebhookEventProcessed" in rateLimitModule).toBe(false);
    expect("acquireWebhookReplayLock" in rateLimitModule).toBe(true);
  });
});
