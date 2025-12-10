/**
 * AQI Calculator API Route
 * POST: Calculate AQI from measurement data
 */

import { NextRequest, NextResponse } from 'next/server';
import type { 
  AirQualityMeasurement, 
  IndexProfileId, 
  AQIResult 
} from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/types';
import { calculateAQI } from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/utils/calculate-aqi';
import { calculateWHOIndex } from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/utils/calculate-who';
import { getIndexProfile } from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/data/index-profiles';

interface CalculateRequest {
  measurements: AirQualityMeasurement[];
  profileId: IndexProfileId;
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculateRequest = await request.json();
    
    const { measurements, profileId } = body;
    
    if (!measurements || !Array.isArray(measurements) || measurements.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos una medición' },
        { status: 400 }
      );
    }
    
    if (!profileId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del perfil de índice' },
        { status: 400 }
      );
    }
    
    const results: AQIResult[] = [];
    
    for (const measurement of measurements) {
      let result: AQIResult;
      
      if (profileId === 'who-index') {
        // Use WHO-specific calculation
        result = calculateWHOIndex(measurement);
      } else {
        // Use standard AQI calculation
        const profile = getIndexProfile(profileId);
        
        if (!profile) {
          return NextResponse.json(
            { error: `Perfil no encontrado: ${profileId}` },
            { status: 400 }
          );
        }
        
        result = calculateAQI(measurement, profile);
      }
      
      results.push(result);
    }
    
    return NextResponse.json({
      success: true,
      profileId,
      count: results.length,
      results,
    });
    
  } catch (error) {
    console.error('Error calculating AQI:', error);
    return NextResponse.json(
      { error: 'Error al calcular el índice de calidad del aire' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available profiles
  const profiles = [
    { id: 'us-aqi', name: 'US AQI (EPA)', country: 'Estados Unidos' },
    { id: 'ica-colombia', name: 'ICA Colombia', country: 'Colombia' },
    { id: 'iboca-bogota', name: 'IBOCA', country: 'Bogotá, Colombia' },
    { id: 'eaqi-europe', name: 'EAQI', country: 'Unión Europea' },
    { id: 'who-index', name: 'Índice OMS', country: 'Global' },
  ];
  
  return NextResponse.json({
    profiles,
    pollutants: ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'],
  });
}
