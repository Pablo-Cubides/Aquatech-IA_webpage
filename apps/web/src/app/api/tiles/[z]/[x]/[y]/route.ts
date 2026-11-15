import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getClientIP, rateLimit } from "@/lib/security/rate-limit";

const MAX_ZOOM = 19;

// Enteros decimales canónicos (sin signo, sin ceros a la izquierda, sin 1e3/0x1).
const integerString = z.string().regex(/^(0|[1-9]\d{0,7})$/);

const tileParamsSchema = z
  .object({ z: integerString, x: integerString, y: integerString })
  .transform(({ z: zoom, x, y }) => ({ z: Number(zoom), x: Number(x), y: Number(y) }))
  .refine(({ z: zoom }) => zoom <= MAX_ZOOM, "zoom fuera de rango")
  .refine(({ z: zoom, x, y }) => x < 2 ** zoom && y < 2 ** zoom, "tile fuera de rango");

/**
 * Proxy de teselas de OpenStreetMap.
 *
 * - z, x, y se validan como enteros dentro del rango del esquema XYZ antes de
 *   construir la URL de salida (no se interpolan valores del cliente sin validar).
 * - Sin cabecera Access-Control-Allow-Origin propia: el mapa carga las teselas
 *   desde el mismo origen. Los orígenes propios los permite src/proxy.ts para
 *   /api/*; un origen ajeno no recibe CORS.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ z: string; x: string; y: string }> },
) {
  const parsed = tileParamsSchema.safeParse(await params);
  if (!parsed.success) {
    return new NextResponse("Invalid tile coordinates", { status: 400 });
  }
  const { z: zoom, x, y } = parsed.data;

  // failureMode "open" (decisión SEC-001): ruta pública de solo lectura, sin
  // datos de usuario ni base de datos; la respuesta es cacheable en el CDN. Con
  // "closed", sin almacén de límites los dos visores de mapas se quedarían sin
  // teselas. Un mapa pide muchas teselas por vista: límite holgado.
  const limit = await rateLimit(`tiles:${getClientIP(request.headers)}`, {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 1500,
    failureMode: "open",
  });

  if (!limit.success) {
    return new NextResponse("Too many requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  try {
    const response = await fetch(`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`, {
      headers: { "User-Agent": "IA-Next/1.0 (Map Viewer)" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return new NextResponse("Tile not found", { status: response.status === 404 ? 404 : 502 });
    }

    return new NextResponse(await response.arrayBuffer(), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        // Navegador 1 día; CDN 7 días (la política de OSM pide cachear las teselas).
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error fetching tile:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
