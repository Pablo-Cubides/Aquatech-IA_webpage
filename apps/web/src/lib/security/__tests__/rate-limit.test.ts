import { beforeEach, describe, expect, it, vi } from "vitest";

const redisMock = vi.hoisted(() => ({
  set: vi.fn(),
  incr: vi.fn(),
  ttl: vi.fn(),
  expire: vi.fn(),
}));

const pgMock = vi.hoisted(() => ({ incrementWindow: vi.fn() }));

vi.mock("@/lib/security/rate-limit-postgres", () => pgMock);
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
  pgMock.incrementWindow.mockReset();
  // Sin Redis configurado el almacén es PostgreSQL; aquí simulamos que no responde.
  pgMock.incrementWindow.mockRejectedValue(new Error("db down"));
  vi.stubEnv("UPSTASH_REDIS_REST_URL", withRedis ? "https://redis.example" : "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", withRedis ? "test-token" : "");
  return import("@/lib/security/rate-limit");
}

describe("rateLimit sin almacén (PostgreSQL no responde)", () => {
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

describe("rateLimit con PostgreSQL (almacén por defecto, OPS-001)", () => {
  it("sin variables de Upstash usa PostgreSQL y permite hasta el límite", async () => {
    const { rateLimit, selectRateLimitBackend } = await load(false);
    expect(selectRateLimitBackend()).toBe("postgres");

    pgMock.incrementWindow.mockResolvedValueOnce({ hits: 1, resetAt: 123 });
    expect(await rateLimit("a", config)).toMatchObject({ success: true, remaining: 4, reset: 123 });
    expect(pgMock.incrementWindow).toHaveBeenCalledWith("rate-limit:a", 60_000, 5);
  });

  it("rechaza al superar el límite con reason limit-exceeded", async () => {
    const { rateLimit } = await load(false);
    pgMock.incrementWindow.mockResolvedValueOnce({ hits: 6, resetAt: 999 });
    expect(await rateLimit("a", config)).toMatchObject({
      success: false,
      remaining: 0,
      reason: "limit-exceeded",
    });
  });

  it("RATE_LIMIT_BACKEND=postgres gana aunque Upstash esté configurado", async () => {
    const { selectRateLimitBackend } = await load(true);
    expect(selectRateLimitBackend()).toBe("upstash");
    vi.stubEnv("RATE_LIMIT_BACKEND", "postgres");
    expect(selectRateLimitBackend()).toBe("postgres");
  });

  it("variables vacías o con espacios cuentan como no definidas", async () => {
    const { selectRateLimitBackend } = await load(false);
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "   ");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "  ");
    expect(selectRateLimitBackend()).toBe("postgres");
  });

  it("con solo una de las dos credenciales de Upstash usa PostgreSQL", async () => {
    const { selectRateLimitBackend } = await load(false);
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect(selectRateLimitBackend()).toBe("postgres");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "tok");
    expect(selectRateLimitBackend()).toBe("postgres");
  });

  it("RATE_LIMIT_BACKEND=upstash sin credenciales completas no deja sin almacén: usa PostgreSQL", async () => {
    const { selectRateLimitBackend } = await load(false);
    vi.stubEnv("RATE_LIMIT_BACKEND", " Upstash ");
    expect(selectRateLimitBackend()).toBe("postgres");
  });
});
