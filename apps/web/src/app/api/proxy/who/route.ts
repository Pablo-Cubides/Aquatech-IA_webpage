
import { NextRequest, NextResponse } from 'next/server';

const WHO_API_BASE = "https://ghoapi.azureedge.net/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  // Para OData de WHO, a veces hay filtros complejos en la URL
  // Vamos a pasar todo lo que recibamos
  const queryParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== 'path') {
      queryParams.append(key, value);
    }
  });

  // Manejo especial para OData $filter que puede venir encodeado o no
  // Next.js automáticamente decodifica searchParams, así que al reconstruir debería estar bien
  
  const queryString = queryParams.toString();
  const targetUrl = `${WHO_API_BASE}/${path}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `WHO API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy WHO Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error fetching from WHO' },
      { status: 500 }
    );
  }
}
