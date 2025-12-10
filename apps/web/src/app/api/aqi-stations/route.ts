/**
 * AQI Stations API Route
 * Search for air quality monitoring stations
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  searchLocations, 
  getLatestByCountry,
  getCountries 
} from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/lib/openaq-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'search';
    
    switch (action) {
      case 'countries': {
        const countries = await getCountries();
        return NextResponse.json({ countries });
      }
      
      case 'latest': {
        const country = searchParams.get('country');
        if (!country) {
          return NextResponse.json(
            { error: 'Se requiere el parámetro country' },
            { status: 400 }
          );
        }
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const measurements = await getLatestByCountry(country, limit);
        return NextResponse.json({ measurements });
      }
      
      case 'search':
      default: {
        const country = searchParams.get('country');
        const city = searchParams.get('city');
        const limit = parseInt(searchParams.get('limit') || '100', 10);
        
        const stations = await searchLocations({
          country: country || undefined,
          city: city || undefined,
          limit,
        });
        
        return NextResponse.json({ stations });
      }
    }
  } catch (error) {
    console.error('Error in AQI stations API:', error);
    return NextResponse.json(
      { error: 'Error al buscar estaciones de monitoreo' },
      { status: 500 }
    );
  }
}
