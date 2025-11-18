import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { logger } from "@/lib/logger";
import { paisesCache } from "@/lib/cache/redis-cache";
import { validateDomain } from "@/lib/constants";

// Global declarations for Node.js environment
declare const URL: typeof globalThis.URL;
declare const process: typeof globalThis.process;

// ISO 3166-1 alpha-2 country codes (subset for Latin America and relevant countries)
// Note: Currently not used but kept for future validation
// const VALID_ISO_CODES = new Set([
//   'ar', 'bo', 'br', 'cl', 'co', 'cr', 'cu', 'do', 'ec', 'sv', 'gt', 'hn', 'mx', 'ni', 'pa', 'py', 'pe', 'uy', 've',
//   'us', 'ca', 'es', 'pt', 'it', 'fr', 'de', 'gb', 'jp', 'cn', 'in', 'au', 'nz'
// ]);

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
    // Primary data directory
    const jsonDir = path.join(process.cwd(), "data", "json");

    if (!fs.existsSync(jsonDir)) {
      // No data directory found - fail early so the caller gets a clear error
      throw new Error(`data/json directory not found in ${process.cwd()}`);
    }

    const domains = domain
      ? [domain]
      : fs
          .readdirSync(jsonDir, { withFileTypes: true })
          .filter(
            (dirent) => dirent.isDirectory() && !dirent.name.startsWith("_"),
          )
          .map((dirent) => dirent.name);

    const countriesMap: Record<string, string> = {};

    for (const d of domains) {
      const dir = path.join(jsonDir, d);
      if (!fs.existsSync(dir)) continue;

      const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

      for (const f of files) {
        const base = f.replace(/\.json$/i, "");
        const code = base.toLowerCase();
        try {
          const txt = fs.readFileSync(path.join(dir, f), "utf8");
          const obj = JSON.parse(txt);
          const countryName = obj.country || obj.pais;
          if (
            obj &&
            typeof countryName === "string" &&
            countryName.length > 0
          ) {
            countriesMap[code] = countryName.trim() || code;
          }
        } catch {
          // skip files we can't parse as JSON
        }
      }
    }

    const countries = Object.keys(countriesMap).map((code) => ({
      code,
      name: countriesMap[code],
    }));

    // Sort alphabetically by name
    countries.sort((a, b) => a.name.localeCompare(b.name));

    const result = { countries };

    // Store in cache with hit tracking
    await paisesCache.set(cacheKey, result);
    logger.info("countries:cache_set", {
      domain: domain || "all",
      count: countries.length,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        "X-Cache-Status": "MISS",
      },
    });
  } catch (e) {
    logger.error("Error listing countries", {
      domain: domain || "all",
      error: String(e),
    });
    return NextResponse.json({ countries: [] }, { status: 500 });
  }
}
