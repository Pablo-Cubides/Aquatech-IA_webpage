import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "../../../../lib/payment";
import { logger } from "../../../../lib/logger";
import {
  checkRateLimit,
  getClientIP,
  acquireWebhookReplayLock,
} from "../../../../lib/rate-limit";
import { InvalidWebhookSignatureError, WebhookSignatureValidator } from "mercadopago";

// Force Node.js runtime
export const runtime = "nodejs";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

// Tolerancia del `ts` firmado: protege de la repeticion de una notificacion capturada aunque
// el almacen anti-repeticion (Redis) no este disponible. 5 minutos cubre el desfase de reloj.
const SIGNATURE_TOLERANCE_SECONDS = 300;

type SignatureCheck =
  | { ok: true; signedDataId: string | null }
  | { ok: false; status: 401 | 503; reason: string; requestId?: string };

/**
 * Valida `x-signature` con el protocolo REAL de MercadoPago (SEC-004).
 *
 * MercadoPago no firma el cuerpo: firma el manifiesto
 *   id:{data.id de la QUERY, en minusculas};request-id:{x-request-id};ts:{ts};
 * (el par cuyo valor falta se omite) con HMAC-SHA256 hexadecimal y la clave secreta de la
 * integracion, y envia `x-signature: ts=...,v1=...`. La version anterior de esta funcion hacia
 * el HMAC del cuerpo y esperaba un prefijo `sha256=` (convencion de GitHub): rechazaba toda
 * notificacion real y solo aceptaba firmas fabricadas por nuestras propias pruebas.
 *
 * Se usa el validador del SDK oficial (`mercadopago`, WebhookSignatureValidator): comparacion en
 * tiempo constante, parseo de `ts`/`vN` y ventana de tolerancia del `ts`.
 */
function checkSignature(request: NextRequest): SignatureCheck {
  const secret = process.env.MP_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return { ok: false, status: 503, reason: "MP_WEBHOOK_SECRET not configured" };
  }

  const signedDataId = request.nextUrl.searchParams.get("data.id");
  const requestId = request.headers.get("x-request-id") ?? undefined;

  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get("x-signature"),
      xRequestId: requestId,
      dataId: signedDataId,
      secret,
      toleranceSeconds: SIGNATURE_TOLERANCE_SECONDS,
    });
    return { ok: true, signedDataId: signedDataId?.trim() || null };
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      return { ok: false, status: 401, reason: error.reason, requestId };
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const rateLimitResult = await checkRateLimit(
      "payment",
      `mp-webhook:${getClientIP(request)}`,
      {
        endpoint: "/api/mp/webhook",
      },
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many webhook requests" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toISOString(),
          },
        },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 415 },
      );
    }

    // Firma: ver checkSignature. La firma NO cubre el cuerpo, solo data.id (query), x-request-id y ts.
    const rawBody = await request.text();
    const signature = checkSignature(request);
    if (!signature.ok) {
      if (signature.status === 503) {
        await logger.error("MercadoPago webhook: secreto de firma no configurado");
        return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
      }
      // Solo el motivo y el request-id: nunca la firma ni el secreto.
      await logger.error("Invalid MercadoPago webhook signature", {
        reason: signature.reason,
        requestId: signature.requestId,
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsedBody = body as {
      type?: string;
      action?: string;
      data?: { id?: string | number };
    };
    const eventType = parsedBody?.type;
    const eventDataId = parsedBody?.data?.id;

    if (!eventType || eventDataId === undefined || eventDataId === null) {
      await logger.warn("MercadoPago webhook missing required event fields", {
        endpoint: "/api/mp/webhook",
      });
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    // La firma autentica el data.id de la QUERY, no el del cuerpo: sin esta comprobacion, una
    // notificacion legitima capturada (valida durante la ventana del ts) podria reenviarse con
    // otro payment id en el cuerpo, que es el que se consulta a MercadoPago.
    if (
      !signature.signedDataId ||
      signature.signedDataId.toLowerCase() !== String(eventDataId).toLowerCase()
    ) {
      await logger.warn("MercadoPago webhook: data.id de la query no coincide con el cuerpo", {
        endpoint: "/api/mp/webhook",
      });
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const webhookEventId = `${eventType}:${String(eventDataId)}`;

    const replayLockResult = await acquireWebhookReplayLock(
      "mercadopago",
      webhookEventId,
    );

    if (replayLockResult === "duplicate") {
      await logger.warn("Duplicate MercadoPago webhook ignored", {
        eventId: webhookEventId,
      });
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (replayLockResult === "error") {
      await logger.error(
        "MercadoPago webhook replay lock infrastructure error",
        {
          eventId: webhookEventId,
        },
      );
      return NextResponse.json(
        { error: "Webhook lock unavailable" },
        { status: 503 },
      );
    }

    // Process MercadoPago webhook
    await paymentService.handleWebhook(parsedBody);

    const duration = Date.now() - startTime;
    await logger.request("POST", "/api/mp/webhook", 200, duration, {
      type: eventType,
      action: parsedBody?.action,
      dataId: String(eventDataId),
    });

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = getErrorMessage(error);
    await logger.request("POST", "/api/mp/webhook", 500, duration, {
      error: errorMessage,
    });

    await logger.error("MercadoPago webhook failed", {
      error: errorMessage,
    });

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
