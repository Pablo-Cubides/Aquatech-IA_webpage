import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 Testing database connection...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("DATABASE_URL value:", process.env.DATABASE_URL);
    console.log("DIRECT_URL exists:", !!process.env.DIRECT_URL);
    console.log("DIRECT_URL value:", process.env.DIRECT_URL);
    console.log(
      "All env keys:",
      Object.keys(process.env).filter(
        (k) => k.includes("DATABASE") || k.includes("DIRECT"),
      ),
    );

    return NextResponse.json({
      success: true,
      hasDatabase: !!process.env.DATABASE_URL,
      hasDirect: !!process.env.DIRECT_URL,
      databaseLength: process.env.DATABASE_URL?.length || 0,
      databaseStart: process.env.DATABASE_URL?.substring(0, 30) || "NOT_FOUND",
    });
  } catch (error) {
    console.error("❌ Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
