/**
 * API Route: GET /api/openaq/measurements
 * Proxy para OpenAQ API measurements endpoint
 */

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams();

    // Forward all query parameters that might be needed
    const allowedParams = [
      'country', 'city', 'location_id', 'parameter', 'coordinates', 'radius',
      'date_from', 'date_to', 'limit', 'order_by', 'sort'
    ];

    allowedParams.forEach(param => {
      const value = url.searchParams.get(param);
      if (value) {
        queryParams.append(param, value);
      }
    });

    const openaqUrl = `https://api.openaq.org/v3/measurements?${queryParams.toString()}`;
    console.log('OpenAQ request URL:', openaqUrl);
    console.log('Query params:', Object.fromEntries(queryParams));
    
    const apiKey = process.env.OPENAQ_API_KEY;
    
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    // Agregar API key si está disponible
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
      console.log('API Key present:', apiKey.substring(0, 10) + '...');
    } else {
      console.warn('No OPENAQ_API_KEY environment variable found');
    }
    
    const response = await fetch(openaqUrl, {
      headers,
    });

    console.log('OpenAQ response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAQ API error:', response.status, error);
      return Response.json(
        { error: `OpenAQ API error: ${response.status}`, details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching OpenAQ measurements:', error);
    return Response.json(
      { error: 'Failed to fetch OpenAQ measurements' },
      { status: 500 }
    );
  }
}
