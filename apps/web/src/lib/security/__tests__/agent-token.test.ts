import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { getServerSessionMock, findUniqueMock, rateLimitMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  findUniqueMock: vi.fn(),
  rateLimitMock: vi.fn(),
}));

vi.mock("next-auth", () => ({ getServerSession: getServerSessionMock }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@ia-next/database", () => ({ prisma: { user: { findUnique: findUniqueMock } } }));
vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));
vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIP: () => "203.0.113.7",
}));

import { verifyAgentToken } from "@/lib/security/agent-token";
import { authorizeBlogAdmin } from "@/lib/security/blog-admin-auth";

const SECRET = "test-secret-not-a-real-credential";

describe("verifyAgentToken", () => {
  it("acepta el token correcto", () => {
    expect(verifyAgentToken(`Bearer ${SECRET}`, SECRET)).toBe("valid");
    expect(verifyAgentToken(`bearer   ${SECRET}`, SECRET)).toBe("valid");
  });

  it("rechaza token incorrecto, vacío, sin prefijo Bearer o ausente", () => {
    expect(verifyAgentToken("Bearer otro", SECRET)).toBe("invalid");
    expect(verifyAgentToken("Bearer ", SECRET)).toBe("invalid");
    expect(verifyAgentToken(SECRET, SECRET)).toBe("invalid");
    expect(verifyAgentToken(null, SECRET)).toBe("invalid");
  });

  it("sin variable definida no hay valor por defecto: not-configured", () => {
    expect(verifyAgentToken("Bearer aquatech-agent-key-2026", undefined)).toBe("not-configured");
    expect(verifyAgentToken("Bearer ", "")).toBe("not-configured");
  });
});

describe("authorizeBlogAdmin", () => {
  const request = (headers: Record<string, string> = {}) =>
    new NextRequest("http://localhost/api/admin/blog/articles", { headers });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    rateLimitMock.mockResolvedValue({ success: true, limit: 60, remaining: 59, reset: Date.now() + 60_000 });
    getServerSessionMock.mockResolvedValue(null);
  });

  it("sin BLOG_AGENT_API_KEY, un Bearer recibe 500 (no un valor por defecto)", async () => {
    vi.stubEnv("BLOG_AGENT_API_KEY", "");

    const result = await authorizeBlogAdmin(request({ authorization: "Bearer aquatech-agent-key-2026" }));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(500);
  });

  it("con la variable definida, el token correcto autoriza y el incorrecto da 401", async () => {
    vi.stubEnv("BLOG_AGENT_API_KEY", SECRET);

    const good = await authorizeBlogAdmin(request({ authorization: `Bearer ${SECRET}` }));
    expect(good).toEqual({ ok: true, via: "agent" });

    const bad = await authorizeBlogAdmin(request({ authorization: "Bearer nope" }));
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.response.status).toBe(401);
  });

  it("limita por tasa los intentos con token", async () => {
    vi.stubEnv("BLOG_AGENT_API_KEY", SECRET);
    rateLimitMock.mockResolvedValue({ success: false, limit: 60, remaining: 0, reset: Date.now() + 60_000 });

    const result = await authorizeBlogAdmin(request({ authorization: `Bearer ${SECRET}` }));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(429);
  });

  it("sin cabecera: solo una sesión ADMIN autoriza", async () => {
    vi.stubEnv("BLOG_AGENT_API_KEY", SECRET);

    getServerSessionMock.mockResolvedValue({ user: { id: "u1", role: "USER" } });
    findUniqueMock.mockResolvedValue({ role: "USER" });
    const user = await authorizeBlogAdmin(request());
    expect(user.ok).toBe(false);

    getServerSessionMock.mockResolvedValue({ user: { id: "a1", role: "ADMIN" } });
    findUniqueMock.mockResolvedValue({ role: "ADMIN" });
    const admin = await authorizeBlogAdmin(request());
    expect(admin).toEqual({ ok: true, via: "session" });
  });
});
