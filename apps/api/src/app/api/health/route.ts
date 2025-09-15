import { NextResponse } from "next/server";

// Force Node.js runtime
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: "ia-next-api",
  });
}
