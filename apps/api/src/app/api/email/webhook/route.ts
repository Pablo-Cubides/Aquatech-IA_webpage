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

function validateBrevoWebhookSignature(
  body: string,
  signature: string,
): boolean {
  const secret = process.env.BREVO_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const normalizedSignature = signature.startsWith("sha256=")
    ? signature.slice(7)
    : signature;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (normalizedSignature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(normalizedSignature, "utf8"),
    Buffer.from(expectedSignature, "utf8"),
  );
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
    const signature =
      request.headers.get("x-brevo-signature") ||
      request.headers.get("x-mailin-signature") ||
      "";

    if (!validateBrevoWebhookSignature(rawBody, signature)) {
      await logger.warn("Invalid Brevo webhook signature", {
        endpoint: "/api/email/webhook",
      });
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
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
