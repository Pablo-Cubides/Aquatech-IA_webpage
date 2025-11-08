import path from "path";
import fs from "fs";

export const runtime = "nodejs";

const VALID_DOMAINS = [
  "agua",
  "calidad-aire",
  "residuos-solidos",
  "vertimientos",
];

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
      { status: 400 },
    );
  }

  if (!VALID_DOMAINS.includes(dominio)) {
    return Response.json(
      { error: `Dominio inválido. Opciones: ${VALID_DOMAINS.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    // Enable cache for better performance
    const cacheKey = getCacheKey(dominio, pais, sector || "all");
    const cached = getFromCache(cacheKey);
    if (cached) {
      return Response.json({
        success: true,
        cached: true,
        ...cached,
      });
    }

    // Use apps/web/data/json as the source of truth
    const jsonDir = path.join(process.cwd(), "data", "json");

    if (!fs.existsSync(jsonDir)) {
      return Response.json(
        { error: "Data directory not found" },
        { status: 500 },
      );
    }

    // Normalize country filename to lower-case slug
    const countrySlug = String(pais).toLowerCase();
    const countryFile = path.join(jsonDir, dominio, `${countrySlug}.json`);

    if (!fs.existsSync(countryFile)) {
      return Response.json(
        { error: `País no encontrado: ${pais}` },
        { status: 404 },
      );
    }

    const content = fs.readFileSync(countryFile, "utf-8");
    const data = JSON.parse(content);

    let resultSectors = data.sectors;
    let filterRecordsBySector = false;
    let foundKey: string | null = null;

    // If sector provided, filter records but keep all sectors for normative URLs
    if (sector) {
      // client may send hyphenated ids (e.g. 'agua-potable'), normalize to keys used in JSON (underscores)
      const sectorStr = String(sector);

      // Generate comprehensive variants including mixed case patterns (e.g., clase_I, clase_II)
      const baseVariants = [
        sectorStr,
        sectorStr.replace(/-/g, "_"),
        sectorStr.replace(/_/g, "-"),
        sectorStr.toLowerCase(),
        sectorStr.toLowerCase().replace(/-/g, "_"),
        sectorStr.toLowerCase().replace(/_/g, "-"),
        sectorStr.toUpperCase(),
        sectorStr.toUpperCase().replace(/-/g, "_"),
        sectorStr.toUpperCase().replace(/_/g, "-"),
      ];

      // Special handling for Roman numerals and mixed case (e.g., clase_I, clase_II, classe_III)
      // Also handle letter+number patterns (e.g., A1, D1, E1 for Peru)
      // Pattern examples:
      //   "aguas-superficiales-clase-i" → "aguas_superficiales_clase_I"
      //   "produccion-agua-potable-a1" → "produccion_agua_potable_A1"
      //   "riego-vegetales-bebida-animales-d1" → "riego_vegetales_bebida_animales_D1"
      const romanNumeralPatterns = [
        // Replace ending patterns with uppercase Roman numerals (I, II, III, IV, V)
        sectorStr.replace(/[-_]i$/i, "_I"),
        sectorStr.replace(/[-_]ii$/i, "_II"),
        sectorStr.replace(/[-_]iii$/i, "_III"),
        sectorStr.replace(/[-_]iv$/i, "_IV"),
        sectorStr.replace(/[-_]v$/i, "_V"),
        // Convert all separators to underscores, then uppercase the Roman numeral
        sectorStr.replace(/-/g, "_").replace(/_i$/i, "_I"),
        sectorStr.replace(/-/g, "_").replace(/_ii$/i, "_II"),
        sectorStr.replace(/-/g, "_").replace(/_iii$/i, "_III"),
        sectorStr.replace(/-/g, "_").replace(/_iv$/i, "_IV"),
        sectorStr.replace(/-/g, "_").replace(/_v$/i, "_V"),
        // Handle letter+number patterns (A1, B1, C1, D1, E1, etc.)
        // "produccion-agua-potable-a1" → "produccion_agua_potable_A1"
        sectorStr
          .replace(/-/g, "_")
          .replace(
            /_([a-e])(\d+)$/i,
            (match, letter, num) => `_${letter.toUpperCase()}${num}`,
          ),
        sectorStr.replace(
          /[-_]([a-e])(\d+)$/i,
          (match, letter, num) => `_${letter.toUpperCase()}${num}`,
        ),
      ];

      const tryKeys = [...new Set([...baseVariants, ...romanNumeralPatterns])];

      for (const k of tryKeys) {
        if (data.sectors && data.sectors[k]) {
          foundKey = k;
          break;
        }
      }

      if (foundKey) {
        filterRecordsBySector = true;
        // Keep all sectors for normative URL access, but we'll filter records later
      } else {
        console.error(
          `[normas] Sector "${sector}" no encontrado. Claves disponibles:`,
          Object.keys(data.sectors || {}),
        );
        console.error(`[normas] Intentados:`, tryKeys.slice(0, 10));
        return Response.json(
          { error: `Sector no encontrado: ${sector}` },
          { status: 404 },
        );
      }
    }

    const response = {
      dominio,
      pais,
      normativeReference_es: data.normativeReference_es,
      normativeReference_url: data.normativeReference_url, // Include URL if present
      sectors: resultSectors,
      _sectors: resultSectors, // Also expose as _sectors for frontend compatibility
    };

    // Normalize sectors/records into flat records for frontend
    const records: any[] = [];

    // Case 1: Domain with sectors (e.g., agua)
    if (resultSectors && typeof resultSectors === "object") {
      for (const [sectorId, sectorData] of Object.entries(resultSectors)) {
        // If filtering by sector, only include records from the requested sector
        if (filterRecordsBySector && sectorId !== foundKey) {
          continue;
        }

        const sector = sectorData as any;
        if (sector.parameters && Array.isArray(sector.parameters)) {
          sector.parameters.forEach((param: any) => {
            records.push({
              parameter: param.parameter || param.parametro,
              limit: param.limit || param.limite,
              unit: param.unit || param.unidad,
              notes: param.notes || param.notas,
              _sector: sectorId,
              _sectorName: sector.name || sectorId,
            });
          });
        }
      }
    }
    // Case 2: Domain without sectors (e.g., calidad-aire, residuos-solidos)
    // Data has flat "registros" array directly
    else if (data.registros && Array.isArray(data.registros)) {
      data.registros.forEach((registro: any) => {
        records.push({
          parameter: registro.parameter || registro.parametro,
          limit: registro.limit || registro.limite,
          unit: registro.unit || registro.unidad,
          notes: registro.notes || registro.notas,
          categoria: registro.categoria, // For residuos-solidos grouping
          referencia: registro.referencia, // For regulatory references
          _sector: "general", // Mark as general sector
          _sectorName: "General",
        });
      });
    }

    const fullResponse = {
      ...response,
      records,
      registros: records,
    };

    // Re-enable cache now that data source is correct
    setInCache(cacheKey, fullResponse);

    return Response.json({
      success: true,
      cached: false,
      ...fullResponse,
    });
  } catch (error) {
    console.error("Error reading norms:", error);
    return Response.json({ error: "Error al leer normas" }, { status: 500 });
  }
}
