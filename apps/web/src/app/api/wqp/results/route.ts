import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const siteid = url.searchParams.get('siteid');
    
    if (!siteid) {
      return NextResponse.json({ error: 'Missing siteid parameter' }, { status: 400 });
    }

    const queryParams = new URLSearchParams();
    queryParams.append('siteid', siteid);
    queryParams.append('mimeType', 'json');
    queryParams.append('zip', 'no');

    const wqpUrl = `https://www.waterqualitydata.us/data/Result/search?${queryParams.toString()}`;
    
    // WQP API can be slow, set a longer timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(wqpUrl, {
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `WQP API error: ${response.status}`, details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error fetching WQP results:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch WQP results', details: errorMessage },
      { status: 500 }
    );
  }
}
