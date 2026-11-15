import { beforeEach, describe, expect, it, vi } from "vitest";

const redisMock = vi.hoisted(() => ({
  set: vi.fn(),
  incr: vi.fn(),
  ttl: vi.fn(),
  expire: vi.fn(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    set = redisMock.set;
    incr = redisMock.incr;
    ttl = redisMock.ttl;
    expire = redisMock.expire;
  },
}));
vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

const config = { interval: 60_000, uniqueTokenPerInterval: 5 };

async function load(withRedis: boolean) {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.stubEnv("UPSTASH_REDIS_REST_URL", withRedis ? "https://redis.example" : "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", withRedis ? "test-token" : "");
  return import("@/lib/security/rate-limit");
}

describe("rateLimit sin almacén (Redis no configurado)", () => {
  it("falla CERRADO por defecto, para cualquier identificador", async () => {
    const { rateLimit } = await load(false);

    for (const id of ["tiles:1.2.3.4", "proxy:who:1.2.3.4", "cualquier-cosa", "auth:login:x"]) {
      const result = await rateLimit(id, config);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.reason).toBe("backend-unavailable");
    }
  });

  it("sin config tampoco deja pasar (el valor por defecto es cerrado)", async () => {
    const { rateLimit } = await load(false);
    expect((await rateLimit("lectura-publica")).success).toBe(false);
  });

  it("el modo no depende del texto del identificador: 'payment' con open pasa, 'lectura' con closed no", async () => {
    const { rateLimit } = await load(false);

    expect((await rateLimit("payment:checkout", { ...config, failureMode: "open" })).success).toBe(true);
    expect((await rateLimit("lectura", { ...config, failureMode: "closed" })).success).toBe(false);
  });

  it("failureMode 'open' permite y deja constancia de que no hubo límite real", async () => {
    const { rateLimit } = await load(false);
    const result = await rateLimit("tiles:x", { ...config, failureMode: "open" });

    expect(result.success).toBe(true);
    expect(result.reason).toBe("backend-unavailable");
  });

  it("rateLimitByIP y rateLimitByUser heredan el valor por defecto cerrado", async () => {
    const { rateLimitByIP, rateLimitByUser } = await load(false);
    expect((await rateLimitByIP("1.2.3.4", config)).success).toBe(false);
    expect((await rateLimitByUser("u1", config)).success).toBe(false);
  });
});

describe("rateLimit con Redis", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cuenta y rechaza al superar el límite", async () => {
    const { rateLimit } = await load(true);

    redisMock.set.mockResolvedValueOnce("OK");
    expect(await rateLimit("a", config)).toMatchObject({ success: true, remaining: 4 });

    redisMock.set.mockResolvedValueOnce(null);
    redisMock.incr.mockResolvedValueOnce(6);
    redisMock.ttl.mockResolvedValueOnce(30);
    expect(await rateLimit("a", config)).toMatchObject({
      success: false,
      remaining: 0,
      reason: "limit-exceeded",
    });
  });

  it("si Redis lanza error, aplica failureMode (cerrado por defecto)", async () => {
    const { rateLimit } = await load(true);
    redisMock.set.mockRejectedValue(new Error("ECONNRESET"));

    expect((await rateLimit("lectura", config)).success).toBe(false);
    expect((await rateLimit("lectura", { ...config, failureMode: "open" })).success).toBe(true);
    // Un identificador con "auth" ya no cambia nada respecto al modo elegido:
    expect((await rateLimit("auth:x", { ...config, failureMode: "open" })).success).toBe(true);
  });
});
