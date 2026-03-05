import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { paisesCache } from "@/lib/cache/redis-cache";
import { validateDomain } from "@/lib/constants";

// Global declarations for Node.js environment
declare const URL: typeof globalThis.URL;

/**
 * Get available countries for a given domain
 * Scans through all JSON files in /data/{domain}/
 */
async function getCountriesForDomain(domain: string): Promise<string[]> {
  try {
    const domains = [
      "agua",
      "calidad-aire",
      "residuos-solidos",
      "vertimientos",
    ];

    if (!domains.includes(domain)) {
      return [];
    }

    // List of countries based on available JSON files
    // This should match the files in public/data/{domain}/
    const commonCountries = [
      "argentina",
      "brasil",
      "chile",
      "china",
      "colombia",
      "el-salvador",
      "estados-unidos",
      "mexico",
      "peru",
      "union-europea",
    ];

    // OMS is only in calidad-aire
    if (domain === "calidad-aire") {
      commonCountries.push("oms");
    }

    // Ecuador is only in residuos-solidos
    if (domain === "residuos-solidos") {
      commonCountries.push("ecuador");
    }

    return commonCountries;
  } catch (error) {
    logger.error(
      `[paises] Error getting countries for domain ${domain}:`,
      error,
    );
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domainParam = searchParams.get("dominio");

  // SECURITY: Validate domain parameter
  const domain = validateDomain(domainParam);

  const cacheKey = `countries:${domain || "all"}`;

  // Check Redis cache first (PERFORMANCE BOOST)
  const cached = await paisesCache.get<unknown>(cacheKey);
  if (cached) {
    logger.info("countries:cache_hit", {
      domain: domain || "all",
    });

    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        "X-Cache-Status": "HIT",
      },
    });
  }

  try {
    let countries: Record<string, string[]>;

    if (domain) {
      // Get countries for specific domain
      const countryList = await getCountriesForDomain(domain);
      countries = {
        [domain]: countryList,
      };
    } else {
      // Get countries for all domains
      const domains = [
        "agua",
        "calidad-aire",
        "residuos-solidos",
        "vertimientos",
      ];
      countries = {};

      for (const d of domains) {
        countries[d] = await getCountriesForDomain(d);
      }
    }

    // Store in cache (1 hour TTL)
    await paisesCache.set(cacheKey, countries, 3600);

    return NextResponse.json(countries, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        "X-Cache-Status": "MISS",
      },
    });
  } catch (error) {
    logger.error("[paises] GET request error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
