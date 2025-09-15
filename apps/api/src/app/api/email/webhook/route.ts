import { NextRequest, NextResponse } from "next/server";
import { emailService } from "../../../../lib/email";
import { logger } from "../../../../lib/logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

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
