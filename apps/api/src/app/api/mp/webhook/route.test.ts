import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("../../../../lib/payment", () => ({
  paymentService: {
    handleWebhook: vi.fn(),
  },
}));

vi.mock("../../../../lib/logger", () => ({
  logger: {
    request: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("../../../../lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  getClientIP: vi.fn(() => "127.0.0.1"),
}));

describe("/api/mp/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MP_WEBHOOK_SECRET = "test-secret";
  });

  it("returns 401 when signature is invalid", async () => {
    const { checkRateLimit } = await import("../../../../lib/rate-limit");
    const checkRateLimitMock = vi.mocked(checkRateLimit);
    checkRateLimitMock.mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: new Date(),
    });

    const { POST } = await import("./route");

    const request = new NextRequest("http://localhost/api/mp/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": "invalid-signature",
      },
      body: JSON.stringify({ type: "payment", data: { id: "123" } }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("processes webhook when signature and rate limit are valid", async () => {
    const { checkRateLimit } = await import("../../../../lib/rate-limit");
    const checkRateLimitMock = vi.mocked(checkRateLimit);
    checkRateLimitMock.mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: new Date(),
    });

    const payload = JSON.stringify({ type: "payment", data: { id: "123" } });
    const crypto = await import("crypto");
    const signature = crypto
      .createHmac("sha256", process.env.MP_WEBHOOK_SECRET as string)
      .update(payload)
      .digest("hex");

    const { paymentService } = await import("../../../../lib/payment");
    const { POST } = await import("./route");

    const request = new NextRequest("http://localhost/api/mp/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": signature,
      },
      body: payload,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ received: true });
    expect(vi.mocked(paymentService.handleWebhook)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(paymentService.handleWebhook)).toHaveBeenCalledWith({
      type: "payment",
      data: { id: "123" },
    });
  });
});
