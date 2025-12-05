import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { rateLimitByIP } from "@/lib/security/rate-limit";
import { normasCache } from "@/lib/cache/redis-cache";
import {
  validateDomain,
  validateCountry,
  validateSector,
  sanitizeFilename,
} from "@/lib/constants";
import { SECTOR_NORMALIZATION_MAP } from "@/lib/types";
import { parsePagination } from "@/lib/pagination";

// Global declarations for Node.js types
declare const URL: typeof globalThis.URL;
declare const process: typeof globalThis.process;

// Narrower types to avoid `any` throughout this file
type AnyRecord = Record<string, unknown>;
type MatchedSource = { name: string; url: string; description?: string };

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

/**
 * Country-specific sector name mappings
 * When a normalized sector name needs to map to different raw names per country
 */
const COUNTRY_SECTOR_OVERRIDES: Record<string, Record<string, string>> = {
  argentina: {
    recreacion: "actividades_recreativas",
    "vida-acuatica": "proteccion_vida_acuatica",
  },
  // Add more country-specific overrides as needed
};

/**
 * Desnormalize a sector ID from normalized form (with hyphens) to raw form (with underscores)
 * E.g., "agua-potable" -> "agua_potable" or "riego" -> "uso_agricola"
 * Strategy:
 * 1. Check country-specific overrides first
 * 2. Look for inverse mapping in SECTOR_NORMALIZATION_MAP
 * 3. Fall back to simple hyphen -> underscore replacement
 */
function _denormalizeSector(normalizedSector: string, country?: string): string {
  // Strategy 1: Country-specific overrides
  if (country && COUNTRY_SECTOR_OVERRIDES[country]?.[normalizedSector]) {
    const override = COUNTRY_SECTOR_OVERRIDES[country][normalizedSector];
    return override;
  }

  // Strategy 2: Look for an explicit inverse mapping
  for (const [raw, normalized] of Object.entries(SECTOR_NORMALIZATION_MAP)) {
    if (normalized === normalizedSector) {
      // Prefer raw names that use underscores (the actual JSON keys)
      if (raw.includes("_") && !raw.includes("-")) {
        return raw;
      }
    }
  }

  // Strategy 3: Simple replacement (fallback: agua-potable -> agua_potable)
  const simpleReplacement = normalizedSector.replace(/-/g, "_");
  return simpleReplacement;
}

/**
 * Normalize response format so frontend doesn't need domain-specific logic
 * - For AGUA: convert sectors object into flat records with sector info
 * - For other domains: keep records as-is
 * - Filter by sector if provided
 */
function normalizeResponseFormat(
  domain: string,
  records: AnyRecord,
  sector?: string,
): AnyRecord[] {
  if (domain === "agua" && typeof records === "object" && records !== null) {
    // AGUA structure: { sector_name: [records] }
    const normalized: AnyRecord[] = [];
    for (const [sectorKey, recs] of Object.entries(records)) {
      const sectorName = SECTOR_NORMALIZATION_MAP[sectorKey] || sectorKey;
      if (sector && sectorName !== sector) {
        continue; // Skip if filtering by sector
      }
      if (Array.isArray(recs)) {
        for (const rec of recs) {
          normalized.push({
            sector: sectorName,
            ...rec,
          });
        }
      }
    }
    return normalized;
  }

  // For other domains: flatten if needed
  if (Array.isArray(records)) {
    return records as AnyRecord[];
  }
  if (typeof records === "object" && records !== null) {
    return Object.values(records).flat() as AnyRecord[];
  }
  return [];
}

/**
 * Load normas data from public/data/ directory
 */
async function loadNormasData(
  domain: string,
  country: string,
): Promise<AnyRecord | null> {
  try {
    const sanitizedCountry = sanitizeFilename(country);
    const dataPath = `/data/${domain}/${sanitizedCountry}.json`;
    
    const response = await fetch(`${BASE_URL}${dataPath}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      logger.warn(
        `[normas] Data not found for domain=${domain}, country=${country}`,
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error(
      `[normas] Error loading data for domain=${domain}, country=${country}:`,
      error,
    );
    return null;
  }
}

/**
 * GET /api/normas?domain=agua&country=colombia[&sector=...&search=...&limit=...&offset=...]
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    const rateLimitResult = await rateLimitByIP(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const country = searchParams.get("country");
    const sectorParam = searchParams.get("sector");
    const searchTerm = searchParams.get("search");
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    // Validate domain and country
    if (!domain) {
      return NextResponse.json(
        { error: "domain parameter is required" },
        { status: 400 },
      );
    }

    if (!validateDomain(domain)) {
      return NextResponse.json(
        { error: `Invalid domain: ${domain}` },
        { status: 400 },
      );
    }

    if (!country) {
      return NextResponse.json(
        { error: "country parameter is required" },
        { status: 400 },
      );
    }

    if (!validateCountry(country)) {
      return NextResponse.json(
        { error: `Invalid country: ${country}` },
        { status: 400 },
      );
    }

    // Validate sector if provided
    if (sectorParam && !validateSector(sectorParam)) {
      return NextResponse.json(
        { error: `Invalid sector: ${sectorParam}` },
        { status: 400 },
      );
    }

    // Try cache first
    const cacheKey = `normas:${domain}:${country}`;
    const cached = await normasCache.get(cacheKey);
    if (cached) {
      logger.debug(`[normas] Cache hit for ${cacheKey}`);
    }

    // Load data
    const data = cached || (await loadNormasData(domain, country));

    if (!data) {
      return NextResponse.json(
        { error: `No data found for domain=${domain}, country=${country}` },
        { status: 404 },
      );
    }

    // Cache if not already cached
    if (!cached) {
      await normasCache.set(cacheKey, data, 3600); // 1 hour TTL
    }

    // Normalize format
    const records = normalizeResponseFormat(domain, data as AnyRecord, sectorParam);

    // Search filter
    let filteredRecords = records;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredRecords = records.filter((rec) =>
        JSON.stringify(rec).toLowerCase().includes(searchLower),
      );
    }

    // Pagination
    const paginationParams = parsePagination({
      page: limitParam || undefined,
      limit: offsetParam || undefined,
    });
    const total = filteredRecords.length;
    const paginated = filteredRecords.slice(paginationParams.skip, paginationParams.skip + paginationParams.take);

    return NextResponse.json({
      domain,
      country,
      sector: sectorParam,
      total,
      limit: paginationParams.limit,
      page: paginationParams.page,
      records: paginated,
    });
  } catch (error) {
    logger.error("[normas] GET request error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
