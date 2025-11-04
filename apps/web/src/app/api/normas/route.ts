import path from "path";
import fs from "fs";

export const runtime = "nodejs";

const VALID_DOMAINS = ["agua", "calidad-aire", "residuos-solidos", "vertimientos"];

// Cache con TTL simple
const cache = new Map<string, { data: unknown; expiry: number }>();

function getCacheKey(dominio: string, pais: string, sector: string): string {
  return `${dominio}:${pais}:${sector}`;
}

function getFromCache(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setInCache(key: string, data: unknown, ttlMs = 15 * 60 * 1000): void {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dominio = url.searchParams.get("dominio");
  const pais = url.searchParams.get("pais");
  const sector = url.searchParams.get("sector");

  if (!dominio || !pais) {
    return Response.json(
      { error: "Parámetros requeridos: dominio, pais (sector es opcional)" },
      { status: 400 }
    );
  }

  if (!VALID_DOMAINS.includes(dominio)) {
    return Response.json(
      { error: `Dominio inválido. Opciones: ${VALID_DOMAINS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const cacheKey = getCacheKey(dominio, pais, sector || "all");
    const cached = getFromCache(cacheKey);
    if (cached) {
      return Response.json({
        success: true,
        cached: true,
        ...cached,
      });
    }

    const countryFile = path.join(
      process.cwd(),
      "data",
      "json",
      dominio,
      `${pais}.json`
    );

    if (!fs.existsSync(countryFile)) {
      return Response.json(
        { error: `País no encontrado: ${pais}` },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(countryFile, "utf-8");
    const data = JSON.parse(content);

    let resultSectors = data.sectors;

    // Si se especifica un sector, devolver solo ese
    if (sector && data.sectors[sector]) {
      resultSectors = {
        [sector]: data.sectors[sector],
      };
    } else if (sector) {
      return Response.json(
        { error: `Sector no encontrado: ${sector}` },
        { status: 404 }
      );
    }

    const response = {
      dominio,
      pais,
      normativeReference_es: data.normativeReference_es,
      sectors: resultSectors,
    };

    setInCache(cacheKey, response);

    return Response.json({
      success: true,
      cached: false,
      ...response,
    });
  } catch (error) {
    console.error("Error reading norms:", error);
    return Response.json(
      { error: "Error al leer normas" },
      { status: 500 }
    );
  }
}
