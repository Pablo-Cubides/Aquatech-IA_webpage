import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "../../../../lib/payment";
import { logger } from "../../../../lib/logger";
import {
  checkRateLimit,
  getClientIP,
  acquireWebhookReplayLock,
} from "../../../../lib/rate-limit";
import crypto from "crypto";

// Force Node.js runtime
export const runtime = "nodejs";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

// Validate MercadoPago webhook signature
function validateWebhookSignature(body: string, signature: string): boolean {
  if (!process.env.MP_WEBHOOK_SECRET) {
    throw new Error("MP_WEBHOOK_SECRET not configured");
  }

  if (!signature) {
    return false;
  }

  const normalizedSignature = signature.startsWith("sha256=")
    ? signature.slice(7)
    : signature;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.MP_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (normalizedSignature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(normalizedSignature, "utf8"),
    Buffer.from(expectedSignature),
  );
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

    // Get raw body for signature validation
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";

    // Validate webhook signature
    if (!validateWebhookSignature(rawBody, signature)) {
      await logger.error("Invalid MercadoPago webhook signature");
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
