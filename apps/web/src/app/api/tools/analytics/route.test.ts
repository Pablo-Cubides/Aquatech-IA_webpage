import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { getServerSessionMock, prismaMock, rateLimitMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  prismaMock: {
    toolAnalytics: {
      create: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
  rateLimitMock: vi.fn(),
}));

vi.mock("next-auth/next", () => ({ getServerSession: getServerSessionMock }));
vi.mock("@/lib/auth", () => ({ authOptions: { marker: "authOptions" } }));
vi.mock("@ia-next/database", () => ({ prisma: prismaMock }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));
vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIP: () => "203.0.113.7",
}));

import { GET, POST } from "./route";

const post = (body: unknown, raw = false) =>
  new NextRequest("http://localhost/api/tools/analytics", {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "vitest" },
    body: raw ? (body as string) : JSON.stringify(body),
  });

const valid = { tool: "visor-difusion", eventName: "generate_image", eventData: { steps: 20, cached: true } };

describe("/api/tools/analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rateLimitMock.mockResolvedValue({ success: true, limit: 60, remaining: 59, reset: Date.now() + 60_000 });
    getServerSessionMock.mockResolvedValue(null);
    prismaMock.toolAnalytics.create.mockResolvedValue({ id: "evt1" });
  });

  describe("POST", () => {
    it("pasa authOptions a getServerSession (antes lo llamaba sin opciones)", async () => {
      await POST(post(valid));
      expect(getServerSessionMock).toHaveBeenCalledWith({ marker: "authOptions" });
    });

    it("guarda el evento anónimo sin correo ni IP", async () => {
      const response = await POST(post(valid));

      expect(response.status).toBe(200);
      const { data } = prismaMock.toolAnalytics.create.mock.calls[0][0];
      expect(data.ipAddress).toBeNull();
      expect(data.userId).toBeNull();
      expect(JSON.stringify(data)).not.toContain("203.0.113.7");
    });

    it("con sesión guarda el id opaco del usuario, nunca el correo", async () => {
      getServerSessionMock.mockResolvedValue({ user: { id: "cuid_123", email: "ana@example.com" } });

      await POST(post(valid));

      const { data } = prismaMock.toolAnalytics.create.mock.calls[0][0];
      expect(data.userId).toBe("cuid_123");
      expect(JSON.stringify(data)).not.toContain("ana@example.com");
    });

    it("aplica límite de tasa y no escribe si no hay almacén (cerrado)", async () => {
      rateLimitMock.mockResolvedValue({
        success: false, limit: 60, remaining: 0, reset: Date.now(), reason: "backend-unavailable",
      });

      const response = await POST(post(valid));

      expect(response.status).toBe(503);
      expect(prismaMock.toolAnalytics.create).not.toHaveBeenCalled();
      expect(rateLimitMock).toHaveBeenCalledWith(
        "analytics:203.0.113.7",
        expect.objectContaining({ failureMode: "closed" }),
      );
    });

    it("responde 429 al superar el límite", async () => {
      rateLimitMock.mockResolvedValue({ success: false, limit: 60, remaining: 0, reset: Date.now(), reason: "limit-exceeded" });
      expect((await POST(post(valid))).status).toBe(429);
    });

    it.each([
      ["campos desconocidos (esquema cerrado)", { ...valid, ipAddress: "1.2.3.4" }],
      ["email en el cuerpo", { ...valid, email: "x@y.co" }],
      ["tool con caracteres inválidos", { ...valid, tool: "Visor Difusión!" }],
      ["eventName vacío", { ...valid, eventName: "" }],
      ["eventData anidado", { ...valid, eventData: { a: { b: 1 } } }],
      ["eventData como array", { ...valid, eventData: [1, 2] }],
      ["valor de eventData demasiado largo", { ...valid, eventData: { a: "x".repeat(201) } }],
      ["más de 20 claves en eventData", { ...valid, eventData: Object.fromEntries(Array.from({ length: 21 }, (_, i) => [`k${i}`, i])) }],
      ["faltan campos", { tool: "visor-difusion" }],
    ])("rechaza %s con 400", async (_label, body) => {
      const response = await POST(post(body));

      expect(response.status).toBe(400);
      expect(prismaMock.toolAnalytics.create).not.toHaveBeenCalled();
    });

    it("rechaza JSON inválido con 400 y cuerpos de más de 4 KB con 413", async () => {
      expect((await POST(post("{no json", true))).status).toBe(400);
      expect((await POST(post(JSON.stringify({ ...valid, eventData: { a: "x".repeat(200) }, pad: "y".repeat(5000) }), true))).status).toBe(413);
      expect(prismaMock.toolAnalytics.create).not.toHaveBeenCalled();
    });
  });

  describe("GET", () => {
    it("pasa authOptions y responde 401 sin sesión", async () => {
      const response = await GET();

      expect(getServerSessionMock).toHaveBeenCalledWith({ marker: "authOptions" });
      expect(response.status).toBe(401);
    });

    it("un usuario sin rol ADMIN recibe 404", async () => {
      getServerSessionMock.mockResolvedValue({ user: { id: "u1", role: "USER" } });
      expect((await GET()).status).toBe(404);
      expect(prismaMock.toolAnalytics.count).not.toHaveBeenCalled();
    });

    it("un ADMIN recibe las estadísticas agregadas", async () => {
      getServerSessionMock.mockResolvedValue({ user: { id: "a1", role: "ADMIN" } });
      prismaMock.toolAnalytics.count.mockResolvedValue(42);
      prismaMock.toolAnalytics.groupBy.mockResolvedValue([{ userId: "a" }, { userId: "b" }]);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.stats).toMatchObject({ recentEvents: 42, uniqueUsers: 2 });
    });
  });
});
