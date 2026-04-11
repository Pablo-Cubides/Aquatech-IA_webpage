import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { sectoresCache } from "@/lib/cache/redis-cache";
import { SECTOR_NORMALIZATION_MAP } from "@/lib/types";
import {
  validateDomain,
  validateCountry,
  sanitizeFilename,
} from "@/lib/constants";

// Global declarations for Node.js environment
declare const URL: typeof globalThis.URL;
declare const process: typeof globalThis.process;

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

/**
 * Load sectors from a country's JSON file
 */
async function loadSectorsFromCountry(
  domain: string,
  country: string,
): Promise<string[]> {
  try {
    const sanitizedCountry = sanitizeFilename(country);
    const dataPath = `/data/${domain}/${sanitizedCountry}.json`;

    const response = await fetch(`${BASE_URL}${dataPath}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      logger.warn(`[sectores] Data not found for ${domain}/${country}`);
      return [];
    }

    const data = await response.json();

    // Extract sectors based on domain structure
    if (domain === "agua" && typeof data === "object" && data !== null) {
      // AGUA structure: { sector_name: [records] }
      return Object.keys(data).map(
        (key) => SECTOR_NORMALIZATION_MAP[key] || key
      );
    }

    // For other domains, sectors might be in different structure
    // Default: return empty and use domain-wide sectors
    return [];
  } catch (error) {
    logger.error(
      `[sectores] Error loading sectors from ${domain}/${country}:`,
      error
    );
    return [];
  }
}

/**
 * Get sectors for a domain
 */
function getSectorsForDomain(domain: string): string[] {
  // Define available sectors per domain
  const domainSectors: Record<string, string[]> = {
    agua: [
      "agua-potable",
      "riego",
      "recreacion",
      "uso-agricola",
      "industria",
      "vida-acuatica",
      "energia",
    ],
    "calidad-aire": [
      "industria",
      "transporte",
      "energia",
      "residencial",
      "agricultura",
      "quemadas",
    ],
    "residuos-solidos": [
      "residencial",
      "comercial",
      "industrial",
      "construccion",
      "biomedicos",
      "mineria",
    ],
    vertimientos: [
      "industria",
      "domestico",
      "ganaderia",
      "agricultura",
      "mineria",
    ],
  };

  return domainSectors[domain] || [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domainParam = searchParams.get("dominio") || "agua";
    const countryParam = searchParams.get("pais");

    // SECURITY: Validate input parameters
    const domain = validateDomain(domainParam);
    const country = countryParam ? validateCountry(countryParam) : null;

    if (!domain) {
      return NextResponse.json(
        { sectors: [], error: "Dominio no válido" },
        { status: 400 },
      );
    }

    const cacheKey = `sectors:${domain}:${country || "none"}`;

    // Check Redis cache first
    const cached = await sectoresCache.get<unknown>(cacheKey);
    if (cached) {
      logger.info("sectores:cache_hit", { cacheKey });

      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
          "X-Cache-Status": "HIT",
        },
      });
    }

    let sectors: string[] = [];

    // If country is specified, try to load sectors from that country's data
    if (country) {
      sectors = await loadSectorsFromCountry(domain, country);
    }

    // If no sectors found or country not specified, use domain-wide sectors
    if (sectors.length === 0) {
      sectors = getSectorsForDomain(domain);
    }

    const result = {
      dominio: domain,
      ...(country && { pais: country }),
      sectors,
    };

    // Store in cache (1 hour TTL)
    await sectoresCache.set(cacheKey, result, 3600);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        "X-Cache-Status": "MISS",
      },
    });
  } catch (error) {
    logger.error("[sectores] GET request error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
