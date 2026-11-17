import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";

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

const SECRET = "brevo-bearer-token-test-value";
const payload = { event: "delivered", "message-id": "m-1" };

const makeRequest = (headers: Record<string, string>, body: unknown = payload) =>
  new NextRequest("http://localhost/api/email/webhook", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

// Brevo no firma sus webhooks (doc oficial "Secure webhook calls"): autentica con el token Bearer
// que se registra en el webhook (auth: {type: "bearer", token}).
describe("/api/email/webhook", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.BREVO_WEBHOOK_SECRET = SECRET;
    const { checkRateLimit, acquireWebhookReplayLock } = await import("../../../../lib/rate-limit");
    vi.mocked(acquireWebhookReplayLock).mockResolvedValue("acquired");
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: new Date(),
    });
  });

  const post = async (req: NextRequest) => {
    const { POST } = await import("./route");
    return POST(req);
  };
  const handled = async () => {
    const { emailService } = await import("../../../../lib/email");
    return vi.mocked(emailService.handleWebhookEvent);
  };

  it("procesa un evento con el token Bearer correcto (lo que Brevo realmente envia)", async () => {
    const response = await post(makeRequest({ authorization: `Bearer ${SECRET}` }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(await handled()).toHaveBeenCalledWith(payload);
  });

  it.each([
    ["token incorrecto", { authorization: "Bearer otro-token" }],
    ["sin cabecera Authorization", {}],
    ["esquema distinto de Bearer", { authorization: `Basic ${SECRET}` }],
    ["Bearer vacio", { authorization: "Bearer " }],
    ["token con prefijo del correcto", { authorization: `Bearer ${SECRET}x` }],
    ["token truncado", { authorization: `Bearer ${SECRET.slice(0, -1)}` }],
  ])("401: %s", async (_label, headers) => {
    const response = await post(makeRequest(headers));
    expect(response.status).toBe(401);
    expect(await handled()).not.toHaveBeenCalled();
  });

  it("RECHAZA el esquema anterior: HMAC del cuerpo en x-brevo-signature / x-mailin-signature", async () => {
    const hmac = crypto.createHmac("sha256", SECRET).update(JSON.stringify(payload)).digest("hex");
    const variants: Record<string, string>[] = [
      { "x-brevo-signature": hmac },
      { "x-mailin-signature": hmac },
      { "x-brevo-signature": `sha256=${hmac}` },
    ];
    for (const headers of variants) {
      const response = await post(makeRequest(headers));
      expect(response.status).toBe(401);
    }
    expect(await handled()).not.toHaveBeenCalled();
  });

  it("sin BREVO_WEBHOOK_SECRET deniega aunque se envie un Bearer", async () => {
    delete process.env.BREVO_WEBHOOK_SECRET;
    const response = await post(makeRequest({ authorization: "Bearer cualquiera" }));
    expect(response.status).toBe(401);
    expect(await handled()).not.toHaveBeenCalled();
  });

  it("no registra el token recibido al rechazar", async () => {
    const { logger } = await import("../../../../lib/logger");
    await post(makeRequest({ authorization: "Bearer token-equivocado-123" }));
    const logged = JSON.stringify([...vi.mocked(logger.warn).mock.calls, ...vi.mocked(logger.error).mock.calls]);
    expect(logged).not.toContain("token-equivocado-123");
    expect(logged).not.toContain(SECRET);
  });

  it("repeticion: la segunda entrega identica se ignora como duplicada", async () => {
    const { acquireWebhookReplayLock } = await import("../../../../lib/rate-limit");
    vi.mocked(acquireWebhookReplayLock).mockResolvedValueOnce("acquired").mockResolvedValueOnce("duplicate");
    const headers = { authorization: `Bearer ${SECRET}` };
    expect(await (await post(makeRequest(headers))).json()).toEqual({ success: true });
    expect(await (await post(makeRequest(headers))).json()).toEqual({ success: true, duplicate: true });
    expect(await handled()).toHaveBeenCalledTimes(1);
  });
});
