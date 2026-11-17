import { NextRequest, NextResponse } from "next/server";
import { emailService } from "../../../../lib/email";
import { logger } from "../../../../lib/logger";
import {
  checkRateLimit,
  getClientIP,
  acquireWebhookReplayLock,
} from "../../../../lib/rate-limit";
import crypto from "crypto";

export const runtime = "nodejs";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

/**
 * Autentica la llamada de Brevo (SEC-004).
 *
 * Brevo NO firma sus webhooks: segun su documentacion oficial ("Secure webhook calls") no existe
 * ninguna cabecera de firma ni HMAC (ni `x-brevo-signature` ni `x-mailin-signature`). Los
 * mecanismos documentados son: usuario:clave en la URL, un token Bearer (objeto `auth` con
 * type "bearer" al crear el webhook), cabeceras personalizadas y lista blanca de IP. El codigo
 * anterior esperaba un HMAC del cuerpo en una cabecera que Brevo nunca envia: rechazaba todo
 * evento real.
 *
 * Aqui se exige `Authorization: Bearer <BREVO_WEBHOOK_SECRET>`; el webhook debe registrarse en
 * Brevo con auth {type:"bearer", token:<mismo valor>}. Comparacion en tiempo constante sobre
 * digests SHA-256 (sin filtrar la longitud). Sin secreto configurado: se deniega.
 */
function validateBrevoWebhookAuth(authorization: string | null): boolean {
  const secret = process.env.BREVO_WEBHOOK_SECRET?.trim();

  if (!secret || !authorization) {
    return false;
  }

  const match = /^Bearer\s+(\S+)$/i.exec(authorization.trim());
  if (!match) {
    return false;
  }

  const digest = (value: string) => crypto.createHash("sha256").update(value).digest();
  return crypto.timingSafeEqual(digest(match[1]), digest(secret));
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const rateLimitResult = await checkRateLimit(
      "email",
      `email-webhook:${getClientIP(request)}`,
      {
        endpoint: "/api/email/webhook",
      },
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many webhook requests" },
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
        { success: false, error: "Invalid content type" },
        { status: 415 },
      );
    }

    const rawBody = await request.text();

    if (!validateBrevoWebhookAuth(request.headers.get("authorization"))) {
      await logger.warn("Invalid Brevo webhook authorization", {
        endpoint: "/api/email/webhook",
      });
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const parsedBody = body as { event?: string; [key: string]: unknown };
    const eventType = parsedBody?.event;
    const messageId = parsedBody?.["message-id"];

    if (!eventType || !messageId) {
      await logger.warn("Brevo webhook missing required event fields", {
        endpoint: "/api/email/webhook",
      });
      return NextResponse.json(
        { success: false, error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    const webhookEventId = `${eventType}:${String(messageId)}`;

    const replayLockResult = await acquireWebhookReplayLock(
      "brevo",
      webhookEventId,
    );

    if (replayLockResult === "duplicate") {
      await logger.warn("Duplicate Brevo webhook ignored", {
        eventId: webhookEventId,
      });
      return NextResponse.json({ success: true, duplicate: true });
    }

    if (replayLockResult === "error") {
      await logger.error("Brevo webhook replay lock infrastructure error", {
        eventId: webhookEventId,
      });
      return NextResponse.json(
        { success: false, error: "Webhook lock unavailable" },
        { status: 503 },
      );
    }

    // Process email webhook event
    await emailService.handleWebhookEvent(parsedBody);

    const duration = Date.now() - startTime;
    await logger.request("POST", "/api/email/webhook", 200, duration, {
      event: eventType,
      messageId: String(messageId),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    await logger.request("POST", "/api/email/webhook", 500, duration, {
      error: getErrorMessage(error),
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
