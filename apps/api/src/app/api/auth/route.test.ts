import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("../../../lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  getClientIP: vi.fn(() => "127.0.0.1"),
}));

describe("/api/auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 429 when auth rate limit is exceeded", async () => {
    const { checkRateLimit } = await import("../../../lib/rate-limit");
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: new Date("2030-01-01T00:00:00.000Z"),
    });

    const { POST } = await import("./route");
    const request = new NextRequest("http://localhost/api/auth", {
      method: "POST",
      body: JSON.stringify({ token: "abc" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(429);
  });

  it("returns placeholder auth response when rate limit allows", async () => {
    const { checkRateLimit } = await import("../../../lib/rate-limit");
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: new Date(),
    });

    const { POST } = await import("./route");
    const request = new NextRequest("http://localhost/api/auth", {
      method: "POST",
      body: JSON.stringify({ token: "abc" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      message: "Auth endpoint placeholder",
      authenticated: false,
    });
  });
});
