/**
 * API Route: GET /api/eonet/categories
 * Proxy para NASA EONET Categories API
 */

export async function GET(request: Request) {
  try {
    const eonetUrl = 'https://eonet.gsfc.nasa.gov/api/v3/categories';

    const response = await fetch(eonetUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('EONET API error:', response.status, error);
      return Response.json(
        { error: `EONET API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    });
  } catch (error) {
    console.error('Error fetching EONET categories:', error);
    return Response.json(
      { error: 'Failed to fetch EONET categories' },
      { status: 500 }
    );
  }
}
