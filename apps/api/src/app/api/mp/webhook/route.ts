import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "../../../../lib/payment";
import { logger } from "../../../../lib/logger";
import { checkRateLimit, getClientIP } from "../../../../lib/rate-limit";
import crypto from "crypto";

// Force Node.js runtime
export const runtime = "nodejs";

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

    // Get raw body for signature validation
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";

    // Validate webhook signature
    if (!validateWebhookSignature(rawBody, signature)) {
      await logger.error("Invalid MercadoPago webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Process MercadoPago webhook
    await paymentService.handleWebhook(body);

    const duration = Date.now() - startTime;
    await logger.request("POST", "/api/mp/webhook", 200, duration, {
      type: body?.type,
      action: body?.action,
      dataId: body?.data?.id,
    });

    return NextResponse.json({ received: true });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    await logger.request("POST", "/api/mp/webhook", 500, duration, {
      error: error.message,
    });

    await logger.error("MercadoPago webhook failed", {
      error: error.message,
    });

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
