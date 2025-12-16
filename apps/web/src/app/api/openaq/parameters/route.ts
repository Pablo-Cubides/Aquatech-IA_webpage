/**
 * API Route: GET /api/openaq/parameters
 * Proxy para OpenAQ API para evitar problemas de CORS
 */

export async function GET() {
  try {
    const apiKey = process.env.OPENAQ_API_KEY;
    
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    // Agregar API key si está disponible
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const response = await fetch('https://api.openaq.org/v3/parameters', {
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAQ API error:', response.status, error);
      return Response.json(
        { error: `OpenAQ API error: ${response.status}` },
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
    console.error('Error fetching OpenAQ parameters:', error);
    return Response.json(
      { error: 'Failed to fetch OpenAQ parameters' },
      { status: 500 }
    );
  }
}
