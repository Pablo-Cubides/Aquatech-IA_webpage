import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // Placeholder for Firebase auth validation
  // TODO: Implement Firebase ID token validation

  return NextResponse.json({
    message: "Auth endpoint placeholder",
    authenticated: false,
  });
}

export async function GET() {
  return NextResponse.json({
    message: "Auth status endpoint placeholder",
  });
}
