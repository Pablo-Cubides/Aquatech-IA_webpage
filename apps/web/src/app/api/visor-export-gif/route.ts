import { NextRequest, NextResponse } from "next/server";

const CASES_PUBLIC_PATH = "/static/visor-cases";
const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("case_id");

    console.log(`[visor-export-gif] GET request for case: ${caseId}`);

    if (!caseId) {
      return NextResponse.json(
        { error: "case_id is required" },
        { status: 400 },
      );
    }

    // For now, return a simple placeholder GIF
    // In production, you would generate an actual GIF from the step images
    // This is a minimal 1x1 transparent PNG converted to GIF format
    const placeholderGif = Buffer.from([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00,
      0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x0a,
      0x00, 0x01, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x00, 0x02, 0x02, 0x4c, 0x01, 0x00, 0x3b,
    ]);

    console.log(
      `[visor-export-gif] Returning placeholder GIF for case: ${caseId}`,
    );

    return new NextResponse(placeholderGif, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Content-Disposition": `attachment; filename="diffusion_${caseId}.gif"`,
      },
    });
  } catch (error) {
    console.error("[visor-export-gif] Error in GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
