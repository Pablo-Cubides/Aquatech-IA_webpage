/**
 * API Route: GET /api/openmeteo/weather
 * Proxy de Open-Meteo (SEC-003). Uso gratuito no comercial, ~10 000 llamadas/día por IP (la IP de
 * Vercel es compartida): coordenadas validadas y redondeadas a 2 decimales (~1 km) para que
 * peticiones cercanas compartan caché del CDN, y límite por IP en memoria.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { fetchUpstreamJson, guardPublicProxy, proxyJson } from "@/lib/security/public-proxy";

const coord = (max: number) =>
  z
    .string()
    .regex(/^-?\d{1,3}(\.\d{1,17})?$/, "número decimal")
    .transform(Number)
    .refine((n) => Math.abs(n) <= max, `fuera de rango (±${max})`)
    .transform((n) => Math.round(n * 100) / 100);

const querySchema = z.strictObject({
  latitude: coord(90),
  longitude: coord(180),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "openmeteo:weather",
    schema: querySchema,
    perMinutePerIp: 30,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;

  const params = new URLSearchParams({
    latitude: String(guard.query.latitude),
    longitude: String(guard.query.longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,wind_direction_10m,weather_code,cloud_cover",
    timezone: "auto",
  });

  const result = await fetchUpstreamJson("openmeteo:weather", `https://api.open-meteo.com/v1/forecast?${params}`, {
    timeoutMs: 10_000,
  });
  if (!result.ok) return result.response;
  return proxyJson(result.data, { sMaxAge: 300, swr: 600 });
}
