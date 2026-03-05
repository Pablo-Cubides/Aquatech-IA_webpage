/**
 * API Route: GET /api/openaq/sensors/[id]/measurements
 * Proxy para OpenAQ API sensor measurements endpoint
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const queryParams = new URLSearchParams();

    // Forward query parameters with validation
    const limitStr = url.searchParams.get("limit");
    if (limitStr) {
      const limit = parseInt(limitStr, 10);
      if (!isNaN(limit)) {
        const cappedLimit = Math.min(Math.max(limit, 1), 1000);
        queryParams.append("limit", cappedLimit.toString());
      }
    }

    const page = url.searchParams.get("page");
    if (page) {
      queryParams.append("page", page);
    }

    const openaqUrl = `https://api.openaq.org/v3/sensors/${id}/measurements?${queryParams.toString()}`;
    console.log("OpenAQ sensor measurements request:", openaqUrl);

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

    console.log("OpenAQ sensor measurements response status:", response.status);

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
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching OpenAQ sensor measurements:", error);
    return Response.json(
      { error: "Failed to fetch OpenAQ sensor measurements" },
      { status: 500 },
    );
  }
}
