/**
 * AQI Calculator API Route
 * POST: Calculate AQI from measurement data
 *
 * SEC-003: cuerpo validado con Zod (antes se confiaba en el tipo TypeScript: cualquier JSON
 * llegaba a la calculadora), tamaño acotado y límite en memoria (cálculo local, sin coste de
 * terceros).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { AQIResult } from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/types';
import type { AirQualityMeasurement } from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/types';
import { calculateAQI } from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/utils/calculate-aqi';
import { calculateWHOIndex } from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/utils/calculate-who';
import { getIndexProfile } from '@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/data/index-profiles';
import { readBoundedJson } from '@/lib/schemas/blog-article.zod';
import { guardPublicProxy, proxyError } from '@/lib/security/public-proxy';

// SEC-005a: el cuerpo es el CSV COMPLETO que sube la persona. Una serie horaria de un año son 8 760
// filas y, con 6 contaminantes, ~3,3 MB de JSON (ver la prueba): 500 filas / 300 KB rechazaba el uso
// real. Cálculo local barato => 20 000 filas y 5 MB solo en esta ruta (Vercel corta en 4,5 MB).
const MAX_MEASUREMENTS = 20_000;
const MAX_BODY_BYTES = 5 * 1024 * 1024;

const measurementSchema = z.object({
  stationId: z.string().max(100).optional(),
  stationName: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  datetime: z.string().max(40),
  pollutants: z
    .array(
      z.object({
        pollutantId: z.enum(['pm25', 'pm10', 'o3', 'no2', 'so2', 'co']),
        value: z.number().finite().min(0).max(1_000_000),
        unit: z.enum(['µg/m³', 'mg/m³', 'ppm', 'ppb']),
        averagingPeriod: z.number().finite().min(0).max(8760).optional(),
      }),
    )
    .max(20),
  source: z.enum(['manual', 'csv', 'openaq', 'airnow', 'eea']),
});

const requestSchema = z.object({
  measurements: z.array(measurementSchema).min(1).max(MAX_MEASUREMENTS),
  profileId: z.enum(['us-aqi', 'ica-colombia', 'iboca-bogota', 'eaqi-europe', 'who-index']),
});

export async function POST(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: 'aqi:calculator',
    schema: z.strictObject({}),
    perMinutePerIp: 60,
    limiter: 'memory',
  });
  if (!guard.ok) return guard.response;

  const raw = await readBoundedJson(request, MAX_BODY_BYTES);
  if (!raw.ok) {
    return proxyError(raw.status, raw.status === 413 ? 'payload_too_large' : 'invalid_json', 'Cuerpo inválido.');
  }
  const parsed = requestSchema.safeParse(raw.value);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'invalid_body',
        message: 'Se requiere al menos una medición válida y un perfil de índice conocido.',
        issues: parsed.error.issues.slice(0, 5).map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  const { measurements, profileId } = parsed.data;

  try {
    const results: AQIResult[] = [];

    for (const measurement of measurements as AirQualityMeasurement[]) {
      if (profileId === 'who-index') {
        results.push(calculateWHOIndex(measurement));
      } else {
        const profile = getIndexProfile(profileId);
        if (!profile) {
          return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 400 });
        }
        results.push(calculateAQI(measurement, profile));
      }
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
      { status: 500 },
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
