
import { NextRequest, NextResponse } from 'next/server';

const WB_API_BASE = "https://api.worldbank.org/v2";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  // Reconstruir la URL de destino
  // Eliminamos 'path' de los parámetros para enviarlos a la API externa
  const queryParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== 'path') {
      queryParams.append(key, value);
    }
  });

  const targetUrl = `${WB_API_BASE}/${path}?${queryParams.toString()}`;

  try {
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `WorldBank API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy WorldBank Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error fetching from WorldBank' },
      { status: 500 }
    );
  }
}
