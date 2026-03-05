import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("../../../../lib/email", () => ({
  emailService: {
    handleWebhookEvent: vi.fn(),
  },
}));

vi.mock("../../../../lib/logger", () => ({
  logger: {
    request: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("../../../../lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  getClientIP: vi.fn(() => "127.0.0.1"),
  acquireWebhookReplayLock: vi.fn(),
}));

describe("/api/email/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BREVO_WEBHOOK_SECRET = "brevo-secret";
  });

  it("returns 401 when Brevo signature is invalid", async () => {
    const { checkRateLimit, acquireWebhookReplayLock } = await import(
      "../../../../lib/rate-limit"
    );
    vi.mocked(acquireWebhookReplayLock).mockResolvedValue("acquired");
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: new Date(),
    });

    const { POST } = await import("./route");

    const request = new NextRequest("http://localhost/api/email/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-brevo-signature": "invalid",
      },
      body: JSON.stringify({ event: "delivered", "message-id": "m-1" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("processes webhook when signature is valid", async () => {
    const { checkRateLimit, acquireWebhookReplayLock } = await import(
      "../../../../lib/rate-limit"
    );
    vi.mocked(acquireWebhookReplayLock).mockResolvedValue("acquired");
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: new Date(),
    });

    const payload = JSON.stringify({ event: "delivered", "message-id": "m-1" });
    const crypto = await import("crypto");
    const signature = crypto
      .createHmac("sha256", process.env.BREVO_WEBHOOK_SECRET as string)
      .update(payload)
      .digest("hex");

    const { emailService } = await import("../../../../lib/email");
    const { POST } = await import("./route");

    const request = new NextRequest("http://localhost/api/email/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-brevo-signature": signature,
      },
      body: payload,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(vi.mocked(emailService.handleWebhookEvent)).toHaveBeenCalledWith({
      event: "delivered",
      "message-id": "m-1",
    });
  });
});
