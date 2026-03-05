/**
 * API Route: GET /api/openaq/locations
 * Proxy para OpenAQ API locations endpoint
 */

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams();
    const country = url.searchParams.get("country");
    const countriesId = url.searchParams.get("countries_id");
    const city = url.searchParams.get("city");
    const coordinates = url.searchParams.get("coordinates");
    const parameter = url.searchParams.get("parameter");
    const locationId = url.searchParams.get("location_id");

    // Forward query parameters with validation
    if (country) queryParams.append("country", country);
    if (countriesId) queryParams.append("countries_id", countriesId);
    if (city) queryParams.append("city", city);
    if (coordinates) queryParams.append("coordinates", coordinates);

    // Validate and cap radius to 25000 meters (API maximum)
    const radiusStr = url.searchParams.get("radius");
    if (radiusStr) {
      const radius = parseInt(radiusStr, 10);
      if (!isNaN(radius)) {
        const cappedRadius = Math.min(Math.max(radius, 0), 25000);
        queryParams.append("radius", cappedRadius.toString());
      }
    }

    if (parameter) queryParams.append("parameter", parameter);

    // Validate and cap limit to 10000 (API maximum)
    const limitStr = url.searchParams.get("limit");
    if (limitStr) {
      const limit = parseInt(limitStr, 10);
      if (!isNaN(limit)) {
        const cappedLimit = Math.min(Math.max(limit, 1), 10000);
        queryParams.append("limit", cappedLimit.toString());
      }
    }

    // Note: order_by only accepts 'id' for /locations, don't pass other values
    if (locationId) queryParams.append("location_id", locationId);

    const openaqUrl = `https://api.openaq.org/v3/locations?${queryParams.toString()}`;
    console.log("OpenAQ locations request:", openaqUrl);

    const apiKey = process.env.OPENAQ_API_KEY;
    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch(openaqUrl, {
      headers,
    });

    console.log("OpenAQ locations response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAQ API error:", response.status, error);
      return Response.json(
        { error: `OpenAQ API error: ${response.status}`, details: error },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching OpenAQ locations:", error);
    return Response.json(
      { error: "Failed to fetch OpenAQ locations" },
      { status: 500 },
    );
  }
}
