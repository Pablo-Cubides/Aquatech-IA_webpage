import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { paymentService, CREDIT_PACKAGES } from "../../../lib/payment";
import { logger } from "../../../lib/logger";
import { checkRateLimit, getClientIP } from "../../../lib/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";

const createPaymentSchema = z.object({
  packageId: z.string().min(1),
});

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

export async function GET() {
  try {
    // Return available credit packages
    return NextResponse.json({
      success: true,
      packages: CREDIT_PACKAGES,
    });
  } catch (error: unknown) {
    await logger.error("Failed to get credit packages", {
      error: getErrorMessage(error),
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const clientIP = getClientIP(request);

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const rateLimitIdentifier = `payment:${session.user.id || clientIP}`;
    const rateLimitResult = await checkRateLimit(
      "payment",
      rateLimitIdentifier,
      {
        endpoint: "/api/payments",
        userId: session.user.id,
      },
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many payment attempts. Please try again later.",
        },
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

    // Parse and validate request body
    const body = await request.json();
    const { packageId } = createPaymentSchema.parse(body);

    // Validate package exists
    const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);
    if (!creditPackage) {
      return NextResponse.json(
        { success: false, error: "Invalid package ID" },
        { status: 400 },
      );
    }

    // Create payment preference
    const result = await paymentService.createPaymentPreference(
      session.user.id,
      packageId,
      session.user.email || undefined,
      session.user.name || undefined,
    );

    const duration = Date.now() - startTime;
    await logger.request("POST", "/api/payments", 200, duration, {
      userId: session.user.id,
      packageId,
      paymentId: result.paymentId,
    });

    return NextResponse.json({
      success: true,
      data: {
        preferenceId: result.preferenceId,
        paymentId: result.paymentId,
        checkoutUrl: result.checkoutUrl,
        package: creditPackage,
      },
    });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = getErrorMessage(error);
    await logger.request("POST", "/api/payments", 500, duration, {
      error: errorMessage,
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    await logger.error("Failed to create payment", {
      error: errorMessage,
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
