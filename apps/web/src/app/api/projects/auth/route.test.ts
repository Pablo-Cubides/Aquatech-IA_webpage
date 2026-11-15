import { beforeEach, describe, expect, it, vi } from "vitest";

const { rateLimitMock } = vi.hoisted(() => ({ rateLimitMock: vi.fn() }));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));
vi.mock("@/lib/security/rate-limit", () => ({
  rateLimitByIP: rateLimitMock,
  getClientIP: () => "203.0.113.7",
}));

import { POST } from "./route";

const post = (body: unknown) =>
  new Request("http://localhost/api/projects/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/projects/auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    rateLimitMock.mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: Date.now() + 1000 });
  });

  it("sin ADMIN_PASSWORD falla con 500: el valor por defecto antiguo ya no abre nada", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");

    const response = await POST(post({ password: "aquatech2026" }));

    expect(response.status).toBe(500);
  });

  it("con la variable definida acepta solo la contraseña correcta", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "valor-de-prueba-largo");

    expect((await POST(post({ password: "valor-de-prueba-largo" }))).status).toBe(200);
    expect((await POST(post({ password: "otra" }))).status).toBe(401);
    expect((await POST(post({ password: 123 }))).status).toBe(400);
  });

  it("aplica límite de tasa", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "valor-de-prueba-largo");
    rateLimitMock.mockResolvedValue({ success: false, limit: 10, remaining: 0, reset: Date.now() + 1000 });

    expect((await POST(post({ password: "valor-de-prueba-largo" }))).status).toBe(429);
  });
});
