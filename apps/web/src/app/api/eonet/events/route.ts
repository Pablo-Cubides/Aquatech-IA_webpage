/**
 * API Route: GET /api/eonet/events
 * Proxy para NASA EONET API
 */

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams();

    // Forward query parameters
    const forwardParams = ['status', 'limit', 'days', 'start', 'end'];
    const category = url.searchParams.get('category');

    forwardParams.forEach(param => {
      const value = url.searchParams.get(param);
      if (value) {
        queryParams.append(param, value);
      }
    });

    // Build EONET URL based on category
    let eonetUrl = 'https://eonet.gsfc.nasa.gov/api/v3/events';
    if (category) {
      eonetUrl = `https://eonet.gsfc.nasa.gov/api/v3/categories/${category}`;
    }

    // Append query parameters
    if (queryParams.toString()) {
      eonetUrl += `?${queryParams.toString()}`;
    }

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
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error fetching EONET data:', error);
    return Response.json(
      { error: 'Failed to fetch EONET data' },
      { status: 500 }
    );
  }
}
