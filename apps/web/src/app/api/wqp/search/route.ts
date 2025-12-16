/**
 * API Route: GET /api/wqp/search
 * Proxy para Water Quality Portal API
 */

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams();

    // Forward all query parameters
    const forwardParams = [
      'bBox', 'countrycode', 'statecode', 'countycode', 'characteristicName',
      'characteristicType', 'siteType', 'startDateLo', 'startDateHi', 'providers'
    ];
    
    // Default result limit to prevent overwhelming responses
    const DEFAULT_RESULT_LIMIT = 5000;

    forwardParams.forEach(param => {
      const value = url.searchParams.get(param);
      if (value) {
        // Handle array parameters like providers
        if (param === 'providers') {
          url.searchParams.getAll(param).forEach(v => queryParams.append(param, v));
        } else {
          queryParams.append(param, value);
        }
      }
    });

    // Always return GeoJSON
    queryParams.append('mimeType', 'geojson');
    queryParams.append('zip', 'no');

    const wqpUrl = `https://www.waterqualitydata.us/data/Station/search?${queryParams.toString()}`;
    console.log('WQP request URL:', wqpUrl);
    
    // WQP API can be slow, set a longer timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    const response = await fetch(wqpUrl, {
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    console.log('WQP response status:', response.status);
    console.log('WQP response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.text();
      console.error('WQP API error:', response.status, error);
      return Response.json(
        { error: `WQP API error: ${response.status}`, details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Apply result limit to prevent overwhelming the client
    const resultLimit = parseInt(url.searchParams.get('resultLimit') || DEFAULT_RESULT_LIMIT.toString());
    if (data.features && data.features.length > resultLimit) {
      console.log(`WQP returned ${data.features.length} features, limiting to ${resultLimit}`);
      data.features = data.features.slice(0, resultLimit);
    }
    
    console.log('WQP returned features:', data.features?.length || 0);
    
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching WQP data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: 'Failed to fetch WQP data', details: errorMessage },
      { status: 500 }
    );
  }
}
