/**
 * API Route: GET /api/gbif/search
 * Proxy para GBIF API occurrence search
 */

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams();

    // Forward all query parameters
    const forwardParams = [
      "hasCoordinate",
      "country",
      "year",
      "taxonKey",
      "scientificName",
      "basisOfRecord",
      "geometry",
      "limit",
      "offset",
    ];

    forwardParams.forEach((param) => {
      const value = url.searchParams.get(param);
      if (value) {
        queryParams.append(param, value);
      }
    });

    const gbifUrl = `https://api.gbif.org/v1/occurrence/search?${queryParams.toString()}`;

    const response = await fetch(gbifUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("GBIF API error:", response.status, error);
      return Response.json(
        { error: `GBIF API error: ${response.status}` },
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
    console.error("Error fetching GBIF data:", error);
    return Response.json(
      { error: "Failed to fetch GBIF data" },
      { status: 500 },
    );
  }
}
