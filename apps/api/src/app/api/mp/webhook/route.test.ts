import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";

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
  acquireWebhookReplayLock: vi.fn(),
}));

const SECRET = "test-secret-not-a-real-one";
const REQUEST_ID = "bb56a2f1-6aae-46ac-982e-9dcd3581d08e";
const NOW = 1742505638683; // ts de ejemplo de la documentacion oficial de MercadoPago

/**
 * Firma segun el protocolo DOCUMENTADO por MercadoPago, calculada aqui de forma independiente
 * (sin el SDK): HMAC-SHA256 hexadecimal del manifiesto
 *   id:{data.id en minusculas};request-id:{x-request-id};ts:{ts};
 * donde el par cuyo valor falta se omite.
 */
function sign(opts: { dataId?: string; requestId?: string; ts: number; secret?: string }): string {
  const parts: string[] = [];
  if (opts.dataId) parts.push(`id:${opts.dataId.toLowerCase()}`);
  if (opts.requestId) parts.push(`request-id:${opts.requestId}`);
  parts.push(`ts:${opts.ts}`);
  const manifest = parts.join(";") + ";";
  const v1 = crypto.createHmac("sha256", opts.secret ?? SECRET).update(manifest).digest("hex");
  return `ts=${opts.ts},v1=${v1}`;
}

function makeRequest(opts: {
  query?: string;
  headers?: Record<string, string>;
  body?: unknown;
}) {
  return new NextRequest(`http://localhost/api/mp/webhook${opts.query ?? ""}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...opts.headers },
    body: JSON.stringify(opts.body ?? { type: "payment", data: { id: "123456" } }),
  });
}

describe("/api/mp/webhook", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    process.env.MP_WEBHOOK_SECRET = SECRET;
    const { checkRateLimit, acquireWebhookReplayLock } = await import("../../../../lib/rate-limit");
    vi.mocked(acquireWebhookReplayLock).mockResolvedValue("acquired");
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: new Date(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const post = async (req: NextRequest) => {
    const { POST } = await import("./route");
    return POST(req);
  };
  const handled = async () => {
    const { paymentService } = await import("../../../../lib/payment");
    return vi.mocked(paymentService.handleWebhook);
  };

  it("acepta una notificacion con el formato REAL de MercadoPago (x-signature ts=..,v1=.. sobre el manifiesto)", async () => {
    const res = await post(
      makeRequest({
        query: "?data.id=123456&type=payment",
        headers: { "x-signature": sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW }), "x-request-id": REQUEST_ID },
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
    expect(await handled()).toHaveBeenCalledWith({ type: "payment", data: { id: "123456" } });
  });

  it("data.id alfanumerico con mayusculas: el manifiesto lo usa en minusculas", async () => {
    const res = await post(
      makeRequest({
        query: "?data.id=ABC123",
        body: { type: "payment", data: { id: "ABC123" } },
        headers: { "x-signature": sign({ dataId: "ABC123", requestId: REQUEST_ID, ts: NOW }), "x-request-id": REQUEST_ID },
      }),
    );
    expect(res.status).toBe(200);
  });

  it("sin x-request-id el par se omite del manifiesto", async () => {
    const res = await post(
      makeRequest({
        query: "?data.id=123456",
        headers: { "x-signature": sign({ dataId: "123456", ts: NOW }) },
      }),
    );
    expect(res.status).toBe(200);
  });

  it("RECHAZA el esquema anterior (HMAC del cuerpo crudo, con o sin prefijo sha256=)", async () => {
    const payload = JSON.stringify({ type: "payment", data: { id: "123456" } });
    const bodyHmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    for (const header of [bodyHmac, `sha256=${bodyHmac}`, "invalid-signature"]) {
      const res = await post(
        makeRequest({ query: "?data.id=123456", headers: { "x-signature": header, "x-request-id": REQUEST_ID } }),
      );
      expect(res.status, header.slice(0, 12)).toBe(401);
    }
    expect(await handled()).not.toHaveBeenCalled();
  });

  it.each([
    ["firma con otro secreto", () => sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW, secret: "otro" }), "?data.id=123456", REQUEST_ID],
    ["data.id de la query alterado", () => sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW }), "?data.id=999999", REQUEST_ID],
    ["x-request-id alterado", () => sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW }), "?data.id=123456", "otro-request-id"],
    ["sin x-signature", () => "", "?data.id=123456", REQUEST_ID],
    ["ts caducado (6 min)", () => sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW - 6 * 60_000 }), "?data.id=123456", REQUEST_ID],
    ["ts del futuro (6 min)", () => sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW + 6 * 60_000 }), "?data.id=123456", REQUEST_ID],
    ["cabecera sin ts", () => "v1=abcdef", "?data.id=123456", REQUEST_ID],
  ])("401: %s", async (_label, header, query, requestId) => {
    const res = await post(
      makeRequest({ query, headers: { "x-signature": header(), "x-request-id": requestId } }),
    );
    expect(res.status).toBe(401);
    expect(await handled()).not.toHaveBeenCalled();
  });

  it("firma valida pero el data.id del CUERPO no es el que se firmo: 400 (no se consulta otro pago)", async () => {
    const res = await post(
      makeRequest({
        query: "?data.id=123456",
        body: { type: "payment", data: { id: "777777" } },
        headers: { "x-signature": sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW }), "x-request-id": REQUEST_ID },
      }),
    );
    expect(res.status).toBe(400);
    expect(await handled()).not.toHaveBeenCalled();
  });

  it("firma valida SIN data.id en la query: el id del cuerpo no esta autenticado => 400", async () => {
    const res = await post(
      makeRequest({
        headers: { "x-signature": sign({ requestId: REQUEST_ID, ts: NOW }), "x-request-id": REQUEST_ID },
      }),
    );
    expect(res.status).toBe(400);
    expect(await handled()).not.toHaveBeenCalled();
  });

  it("sin MP_WEBHOOK_SECRET: 503 y no se procesa nada (falla cerrado)", async () => {
    delete process.env.MP_WEBHOOK_SECRET;
    const res = await post(
      makeRequest({
        query: "?data.id=123456",
        headers: { "x-signature": sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW }), "x-request-id": REQUEST_ID },
      }),
    );
    expect(res.status).toBe(503);
    expect(await handled()).not.toHaveBeenCalled();
  });

  it("no registra la firma ni el secreto cuando rechaza", async () => {
    const { logger } = await import("../../../../lib/logger");
    const header = sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW - 6 * 60_000 });
    await post(makeRequest({ query: "?data.id=123456", headers: { "x-signature": header, "x-request-id": REQUEST_ID } }));
    const logged = JSON.stringify([
      ...vi.mocked(logger.error).mock.calls,
      ...vi.mocked(logger.warn).mock.calls,
    ]);
    expect(logged).not.toContain(SECRET);
    expect(logged).not.toContain(header.split("v1=")[1]);
    expect(logged).toContain("TimestampOutOfTolerance");
  });

  it("repeticion: la segunda entrega firmada identica se ignora como duplicada", async () => {
    const { acquireWebhookReplayLock } = await import("../../../../lib/rate-limit");
    vi.mocked(acquireWebhookReplayLock).mockResolvedValueOnce("acquired").mockResolvedValueOnce("duplicate");
    const mk = () =>
      makeRequest({
        query: "?data.id=123456",
        headers: { "x-signature": sign({ dataId: "123456", requestId: REQUEST_ID, ts: NOW }), "x-request-id": REQUEST_ID },
      });
    expect((await (await post(mk())).json())).toEqual({ received: true });
    expect((await (await post(mk())).json())).toEqual({ received: true, duplicate: true });
    expect(await handled()).toHaveBeenCalledTimes(1);
  });
});
