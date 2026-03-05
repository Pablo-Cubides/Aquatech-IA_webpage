/**
 * OpenAQ API Client
 * Connects to OpenAQ v3 API for real-time air quality data
 * Reference: https://api.openaq.org/docs
 */

import type {
  PollutantId,
  AirQualityMeasurement,
  PollutantMeasurement,
  OpenAQStation,
} from "../types";

const OPENAQ_BASE_URL = "https://api.openaq.org/v3";

/**
 * Map OpenAQ parameter names to our internal pollutant IDs
 */
const PARAMETER_MAP: Record<string, PollutantId> = {
  pm25: "pm25",
  "pm2.5": "pm25",
  pm10: "pm10",
  o3: "o3",
  ozone: "o3",
  no2: "no2",
  so2: "so2",
  co: "co",
};

/**
 * Normalize OpenAQ parameter name to our internal pollutant ID
 */
function normalizeParameter(parameter: string): PollutantId | null {
  const normalized = parameter.toLowerCase().replace(/[^a-z0-9.]/g, "");
  return PARAMETER_MAP[normalized] || null;
}

/**
 * Search for stations/locations in OpenAQ
 */
export async function searchLocations(params: {
  country?: string;
  city?: string;
  limit?: number;
}): Promise<OpenAQStation[]> {
  const searchParams = new URLSearchParams();

  if (params.country) {
    searchParams.set("countries_id", params.country);
  }
  if (params.city) {
    searchParams.set("city", params.city);
  }
  searchParams.set("limit", String(params.limit || 100));

  try {
    const response = await fetch(
      `${OPENAQ_BASE_URL}/locations?${searchParams.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform to our format
    return (data.results || []).map(
      (loc: {
        id: number;
        name: string;
        city?: string;
        country?: { code: string };
        coordinates?: { latitude: number; longitude: number };
        parameters?: Array<{ parameter: string }>;
      }) => ({
        id: loc.id,
        name: loc.name,
        city: loc.city,
        country: loc.country?.code || "",
        coordinates: {
          latitude: loc.coordinates?.latitude || 0,
          longitude: loc.coordinates?.longitude || 0,
        },
        parameters: (loc.parameters || [])
          .map((p: { parameter: string }) => normalizeParameter(p.parameter))
          .filter((p: PollutantId | null): p is PollutantId => p !== null),
      }),
    );
  } catch (error) {
    console.error("Error fetching OpenAQ locations:", error);
    throw error;
  }
}

/**
 * Get measurements for a specific location
 */
export async function getMeasurements(params: {
  locationId: number;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<AirQualityMeasurement[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("location_id", String(params.locationId));

  if (params.dateFrom) {
    searchParams.set("date_from", params.dateFrom);
  }
  if (params.dateTo) {
    searchParams.set("date_to", params.dateTo);
  }
  searchParams.set("limit", String(params.limit || 1000));

  try {
    const response = await fetch(
      `${OPENAQ_BASE_URL}/measurements?${searchParams.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();

    // Group measurements by datetime
    const grouped = new Map<string, PollutantMeasurement[]>();
    let locationName = "";
    let locationCity = "";
    let locationCountry = "";

    for (const m of data.results || []) {
      const datetime = m.date?.utc || m.datetime;
      const pollutantId = normalizeParameter(m.parameter);

      if (!pollutantId) continue;

      locationName = m.location || locationName;
      locationCity = m.city || locationCity;
      locationCountry = m.country || locationCountry;

      if (!grouped.has(datetime)) {
        grouped.set(datetime, []);
      }

      const measurementsAtDatetime = grouped.get(datetime);
      if (!measurementsAtDatetime) {
        continue;
      }
      measurementsAtDatetime.push({
        pollutantId,
        value: m.value,
        unit:
          m.unit === "µg/m³" || m.unit === "ug/m3"
            ? "µg/m³"
            : m.unit === "mg/m³" || m.unit === "mg/m3"
              ? "mg/m³"
              : "µg/m³",
      });
    }

    // Convert to our format
    const measurements: AirQualityMeasurement[] = [];

    for (const [datetime, pollutants] of grouped) {
      measurements.push({
        stationId: String(params.locationId),
        stationName: locationName,
        location: `${locationCity}, ${locationCountry}`.replace(/^, |, $/g, ""),
        datetime,
        pollutants,
        source: "openaq",
      });
    }

    // Sort by datetime descending
    measurements.sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
    );

    return measurements;
  } catch (error) {
    console.error("Error fetching OpenAQ measurements:", error);
    throw error;
  }
}

/**
 * Get latest measurements for multiple locations in a country
 */
export async function getLatestByCountry(
  countryCode: string,
  limit = 50,
): Promise<AirQualityMeasurement[]> {
  try {
    const response = await fetch(
      `${OPENAQ_BASE_URL}/latest?countries_id=${countryCode}&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform to our format
    return (data.results || []).map(
      (loc: {
        id: number;
        name: string;
        city?: string;
        country?: string;
        measurements: Array<{
          parameter: string;
          value: number;
          unit: string;
          lastUpdated: string;
        }>;
      }) => {
        const pollutants: PollutantMeasurement[] = [];
        let latestDatetime = "";

        for (const m of loc.measurements || []) {
          const pollutantId = normalizeParameter(m.parameter);
          if (!pollutantId) continue;

          pollutants.push({
            pollutantId,
            value: m.value,
            unit:
              m.unit === "µg/m³" || m.unit === "ug/m3"
                ? "µg/m³"
                : m.unit === "mg/m³" || m.unit === "mg/m3"
                  ? "mg/m³"
                  : "µg/m³",
          });

          if (!latestDatetime || m.lastUpdated > latestDatetime) {
            latestDatetime = m.lastUpdated;
          }
        }

        return {
          stationId: String(loc.id),
          stationName: loc.name,
          location: `${loc.city || ""}, ${loc.country || ""}`.replace(
            /^, |, $/g,
            "",
          ),
          datetime: latestDatetime,
          pollutants,
          source: "openaq" as const,
        };
      },
    );
  } catch (error) {
    console.error("Error fetching OpenAQ latest data:", error);
    throw error;
  }
}

/**
 * Get list of countries available in OpenAQ
 */
export async function getCountries(): Promise<
  Array<{ code: string; name: string; count: number }>
> {
  try {
    const response = await fetch(`${OPENAQ_BASE_URL}/countries?limit=200`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.results || []).map(
      (c: { code: string; name: string; locations: number }) => ({
        code: c.code,
        name: c.name,
        count: c.locations || 0,
      }),
    );
  } catch (error) {
    console.error("Error fetching OpenAQ countries:", error);
    throw error;
  }
}
