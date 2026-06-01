/**
 * API Route: GET /api/openmeteo/weather
 * Proxy for Open-Meteo API to avoid client-side fetches and potential CORS/blocking issues.
 */

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lat = url.searchParams.get("latitude");
    const lon = url.searchParams.get("longitude");

    if (!lat || !lon) {
      return Response.json({ error: "Missing latitude or longitude" }, { status: 400 });
    }

    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,wind_direction_10m,weather_code,cloud_cover",
      timezone: "auto"
    });

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(openMeteoUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in Open-Meteo proxy:", error);
    return Response.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
