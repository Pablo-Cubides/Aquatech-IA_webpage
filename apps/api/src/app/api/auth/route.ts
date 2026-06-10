import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "../../../lib/rate-limit";

// Force Node.js runtime
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rateLimitResult = await checkRateLimit(
    "auth",
    `auth:${getClientIP(request)}`,
    {
      endpoint: "/api/auth",
      method: "POST",
    },
  );

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        message: "Too many auth attempts. Try again later.",
        authenticated: false,
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

  // Firebase ID token validation pendiente de implementación (SPEC futura).
  // Hasta entonces el endpoint responde 501 explícito en lugar de un
  // placeholder ambiguo que aparente autenticación.
  return NextResponse.json(
    { error: "Not implemented", authenticated: false },
    { status: 501 },
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}
