import { NextRequest, NextResponse } from "next/server";
import { emailService } from "../../../../lib/email";
import { logger } from "../../../../lib/logger";
import { checkRateLimit, getClientIP } from "../../../../lib/rate-limit";
import crypto from "crypto";

export const runtime = "nodejs";

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

    const body = JSON.parse(rawBody);

    // Process email webhook event
    await emailService.handleWebhookEvent(body);

    const duration = Date.now() - startTime;
    await logger.request("POST", "/api/email/webhook", 200, duration, {
      event: body?.event,
      messageId: body?.["message-id"],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    await logger.request("POST", "/api/email/webhook", 500, duration, {
      error: error.message,
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
