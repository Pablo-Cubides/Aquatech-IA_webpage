import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

const { rateLimitMock, getClientIPMock } = vi.hoisted(() => ({
  rateLimitMock: vi.fn(),
  getClientIPMock: vi.fn(),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIP: getClientIPMock,
}));

describe("/api/proxy/who", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getClientIPMock.mockReturnValue("127.0.0.1");
  });

  it("returns 429 when rate limit is exceeded", async () => {
    rateLimitMock.mockResolvedValue({
      success: false,
      limit: 60,
      remaining: 0,
      reset: Date.now() + 60_000,
    });

    const request = new NextRequest(
      "http://localhost/api/proxy/who?path=Indicator",
    );
    const response = await GET(request);

    expect(response.status).toBe(429);
    const body = await response.json();
    expect(body.error).toBe("Demasiadas solicitudes");
  });

  it("returns 400 for invalid path parameter", async () => {
    rateLimitMock.mockResolvedValue({
      success: true,
      limit: 60,
      remaining: 59,
      reset: Date.now() + 60_000,
    });

    const request = new NextRequest(
      "http://localhost/api/proxy/who?path=https://evil.example",
    );
    const response = await GET(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid path parameter");
  });
});
