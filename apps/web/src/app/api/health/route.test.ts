import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const prismaMock = vi.hoisted(() => ({ $queryRaw: vi.fn() }));
const redisMock = vi.hoisted(() => ({ ping: vi.fn() }));
const adminMock = vi.hoisted(() => ({ getAdminSession: vi.fn() }));

vi.mock("@ia-next/database", () => ({ prisma: prismaMock }));
vi.mock("@upstash/redis", () => ({
  Redis: class {
    ping = redisMock.ping;
  },
}));
vi.mock("@/lib/security/admin-session", () => adminMock);

async function call(headers: Record<string, string> = {}) {
  vi.resetModules();
  const { GET } = await import("@/app/api/health/route");
  const response = await GET(new NextRequest("http://localhost/api/health", { headers }));
  return { status: response.status, body: await response.json() };
}

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    vi.stubEnv("HEALTH_CHECK_TOKEN", "token-de-monitor");
    prismaMock.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);
    adminMock.getAdminSession.mockResolvedValue(null);
  });

  it("200 y ok en un entorno sano SIN Upstash (no estar configurado no es un fallo)", async () => {
    const { status, body } = await call();
    expect(status).toBe(200);
    expect(body.status).toBe("ok");
  });

  it("anónimo: solo status y timestamp, sin infraestructura", async () => {
    const { body } = await call();
    expect(Object.keys(body).sort()).toEqual(["status", "timestamp"]);
  });

  it("503 si falla la base de datos (crítica), aunque nadie esté autenticado", async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error("password authentication failed for user postgres at db.example.supabase.co"));
    const { status, body } = await call();
    expect(status).toBe(503);
    expect(body.status).toBe("down");
    expect(JSON.stringify(body)).not.toContain("supabase");
  });

  it("200 degraded si falla Upstash configurado (opcional)", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "tok");
    redisMock.ping.mockRejectedValue(new Error("ECONNREFUSED"));
    const { status, body } = await call();
    expect(status).toBe(200);
    expect(body.status).toBe("degraded");
  });

  it("con el token del monitor ve el detalle, sin mensajes de error de la base", async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error("connect ECONNREFUSED 10.0.0.5:6543"));
    const { body } = await call({ authorization: "Bearer token-de-monitor" });
    expect(body.checks.database).toMatchObject({ status: "fail", critical: true, error: "Error" });
    expect(body.checks.upstash.status).toBe("skipped");
    expect(JSON.stringify(body)).not.toContain("10.0.0.5");
  });

  it("un token incorrecto no da detalle", async () => {
    const { body } = await call({ authorization: "Bearer otro" });
    expect(body.checks).toBeUndefined();
  });

  it("un ADMIN con sesión ve el detalle", async () => {
    adminMock.getAdminSession.mockResolvedValue({ user: { role: "ADMIN" } });
    const { body } = await call();
    expect(body.checks.database.status).toBe("pass");
  });

  it("sin HEALTH_CHECK_TOKEN definido ningún Bearer da detalle", async () => {
    vi.stubEnv("HEALTH_CHECK_TOKEN", "");
    const { body } = await call({ authorization: "Bearer " });
    expect(body.checks).toBeUndefined();
  });
});
