import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ z: string; x: string; y: string }> },
) {
  try {
    const { z, x, y } = await params;

    // Validate parameters
    if (!z || !x || !y) {
      return new NextResponse("Missing parameters", { status: 400 });
    }

    // Construct OpenStreetMap tile URL
    const tileUrl = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

    // Fetch the tile from OpenStreetMap
    const response = await fetch(tileUrl, {
      headers: {
        "User-Agent": "IA-Next/1.0 (Map Viewer)",
      },
    });

    if (!response.ok) {
      return new NextResponse("Tile not found", { status: response.status });
    }

    // Get the tile data
    const tileData = await response.arrayBuffer();

    // Return the tile with proper headers
    return new NextResponse(tileData, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching tile:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
