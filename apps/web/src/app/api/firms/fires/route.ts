/**
 * API Route: GET /api/firms/fires
 * Proxy for NASA FIRMS API (requires MAP_KEY)
 */

export async function GET(request: Request) {
  try {
    const MAP_KEY = process.env.NEXT_PUBLIC_FIRMS_MAP_KEY;
    if (!MAP_KEY) {
      return Response.json(
        { error: "FIRMS MAP_KEY not configured" },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const source = url.searchParams.get("source") || "VIIRS_SNPP_NRT";
    const dayRange = url.searchParams.get("day_range") || "2";
    const area = url.searchParams.get("area") || "world";

    // FIRMS CSV API endpoint
    const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${MAP_KEY}/${source}/${area}/${dayRange}`;
    console.log("FIRMS request URL:", firmsUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(firmsUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error("FIRMS API error:", response.status, error);
      return Response.json(
        { error: `FIRMS API error: ${response.status}`, details: error },
        { status: response.status }
      );
    }

    const csvText = await response.text();

    // Parse CSV to JSON
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      return Response.json([]);
    }

    const headers = lines[0].split(",").map(h => h.trim());
    const records = lines.slice(1).map(line => {
      const values = line.split(",");
      const record: Record<string, string> = {};
      headers.forEach((header, idx) => {
        record[header] = (values[idx] || "").trim();
      });
      return record;
    });

    // Limit to 5000 fire points for performance
    const limitedRecords = records.slice(0, 5000);

    console.log(`FIRMS returned ${records.length} fires, sending ${limitedRecords.length}`);

    return Response.json(limitedRecords, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching FIRMS data:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: "Failed to fetch FIRMS data", details: errorMessage },
      { status: 500 }
    );
  }
}
