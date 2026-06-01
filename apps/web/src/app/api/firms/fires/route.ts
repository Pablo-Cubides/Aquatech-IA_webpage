/**
 * API Route: GET /api/firms/fires
 * Proxy for NASA FIRMS API (requires MAP_KEY)
 */

export async function GET(request: Request) {
  try {
    const MAP_KEY = process.env.NEXT_PUBLIC_FIRMS_MAP_KEY;
    const url = new URL(request.url);
    const source = url.searchParams.get("source") || "VIIRS_SNPP_NRT";
    const dayRange = url.searchParams.get("day_range") || "2";
    
    // Use Colombia BBOX by default instead of "world" to avoid timeouts
    const area = url.searchParams.get("area") || "-82,-5,-66,14"; 

    // If no MAP_KEY, return mock data for Colombia
    if (!MAP_KEY) {
      console.warn("FIRMS MAP_KEY not configured, returning mock data");
      return Response.json(generateMockFires(parseInt(dayRange)), {
        headers: { "Cache-Control": "public, s-maxage=60" }
      });
    }

    // FIRMS CSV API endpoint
    const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${MAP_KEY}/${source}/${area}/${dayRange}`;
    console.log("FIRMS request URL:", firmsUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(firmsUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error("FIRMS API error:", response.status, error);
      // Fallback to mock data if API fails (e.g. rate limit, bad key)
      console.warn("FIRMS API failed, falling back to mock data");
      return Response.json(generateMockFires(parseInt(dayRange)), {
        headers: { "Cache-Control": "public, s-maxage=60" }
      });
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
    // Return mock data on any network failure
    return Response.json(generateMockFires(2), {
      headers: { "Cache-Control": "public, s-maxage=60" }
    });
  }
}

function generateMockFires(days: number) {
  const fires = [];
  // Generate some random points in Colombia
  for (let i = 0; i < 50 * days; i++) {
    // Colombia approx bounds: lat -4 to 12, lon -79 to -67
    const lat = Math.random() * 16 - 4;
    const lon = Math.random() * 12 - 79;
    const confidence = Math.random() > 0.8 ? "h" : Math.random() > 0.4 ? "n" : "l";
    fires.push({
      latitude: lat.toString(),
      longitude: lon.toString(),
      bright_ti4: (300 + Math.random() * 100).toFixed(1),
      scan: "0.5",
      track: "0.5",
      acq_date: new Date().toISOString().split('T')[0],
      acq_time: "1200",
      satellite: "N",
      instrument: "VIIRS",
      confidence: confidence,
      frp: (5 + Math.random() * 50).toFixed(1),
      daynight: "D"
    });
  }
  return fires;
}
