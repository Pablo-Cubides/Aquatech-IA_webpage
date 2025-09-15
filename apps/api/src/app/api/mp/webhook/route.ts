import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "../../../../lib/payment";
import { logger } from "../../../../lib/logger";
import crypto from "crypto";

// Force Node.js runtime
export const runtime = "nodejs";

// Validate MercadoPago webhook signature
function validateWebhookSignature(body: string, signature: string): boolean {
  if (!process.env.MP_WEBHOOK_SECRET) {
    throw new Error("MP_WEBHOOK_SECRET not configured");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.MP_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
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
