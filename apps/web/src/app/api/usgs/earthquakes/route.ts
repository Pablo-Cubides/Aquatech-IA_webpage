/**
 * API Route: GET /api/usgs/earthquakes
 * Proxy for USGS Earthquake API to avoid client-side fetches.
 */

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "week";
    const minMag = url.searchParams.get("minMagnitude") || "2.5";

    const usgsUrl = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${minMag}_${period}.geojson`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(usgsUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in USGS proxy:", error);
    return Response.json(
      { error: "Failed to fetch earthquake data" },
      { status: 500 }
    );
  }
}
