/**
 * AQI Calculation Engine
 * Generic engine for calculating Air Quality Index using breakpoint interpolation
 */

import type {
  PollutantId,
  AirQualityMeasurement,
  Breakpoint,
  AQIResult,
  IndexProfile,
  Category,
  PollutantBreakpoints,
  SubIndexResult,
} from "../types";
import { POLLUTANTS } from "../types";

/**
 * Find the appropriate breakpoint range for a concentration value
 */
export function findBreakpoint(
  concentration: number,
  breakpoints: Breakpoint[],
): Breakpoint | null {
  for (const bp of breakpoints) {
    if (concentration >= bp.bpLo && concentration <= bp.bpHi) {
      return bp;
    }
  }

  // If concentration is above all breakpoints, use the last one
  if (concentration > breakpoints[breakpoints.length - 1].bpHi) {
    return breakpoints[breakpoints.length - 1];
  }

  return null;
}

/**
 * Calculate sub-index using linear interpolation
 * Formula: Ip = Ilo + ((Ihi - Ilo) / (BPhi - BPlo)) * (Cp - BPlo)
 *
 * @param concentration Measured concentration
 * @param breakpoint Breakpoint range to use
 * @returns Calculated sub-index
 */
export function calculateSubIndex(
  concentration: number,
  breakpoint: Breakpoint,
): number {
  const { bpLo, bpHi, iLo, iHi } = breakpoint;

  // Handle case where breakpoint range is a single point (EAQI style)
  if (bpHi === bpLo) {
    return iLo;
  }

  // Linear interpolation formula
  const subIndex = iLo + ((iHi - iLo) / (bpHi - bpLo)) * (concentration - bpLo);

  // Round to nearest integer
  return Math.round(subIndex);
}

/**
 * Get the category for a given index value
 */
export function getCategory(index: number, categories: Category[]): Category {
  for (const category of categories) {
    if (index >= category.min && index <= category.max) {
      return category;
    }
  }
  // Return last category if index is above all ranges
  return categories[categories.length - 1];
}

/**
 * Calculate sub-index for a single pollutant
 */
export function calculatePollutantSubIndex(
  pollutantId: PollutantId,
  concentration: number,
  pollutantBreakpoints: PollutantBreakpoints[],
  categories: Category[],
): SubIndexResult | null {
  const bpConfig = pollutantBreakpoints.find(
    (bp) => bp.pollutantId === pollutantId,
  );

  if (!bpConfig) {
    return null;
  }

  const breakpoint = findBreakpoint(concentration, bpConfig.breakpoints);

  if (!breakpoint) {
    return null;
  }

  const subIndex = calculateSubIndex(concentration, breakpoint);
  const category = getCategory(subIndex, categories);
  const pollutant = POLLUTANTS[pollutantId];

  return {
    pollutantId,
    pollutantName: pollutant.name,
    concentration,
    unit: pollutant.unit,
    subIndex,
    category,
    breakpointUsed: breakpoint,
  };
}

/**
 * Calculate AQI for a measurement using a specific index profile
 */
export function calculateAQI(
  measurement: AirQualityMeasurement,
  profile: IndexProfile,
): AQIResult {
  const subIndices: SubIndexResult[] = [];
  const missingPollutants: PollutantId[] = [];

  // Calculate sub-index for each pollutant in the profile
  for (const bpConfig of profile.pollutantBreakpoints) {
    const pollutantMeasurement = measurement.pollutants.find(
      (p) => p.pollutantId === bpConfig.pollutantId,
    );

    if (
      !pollutantMeasurement ||
      pollutantMeasurement.value === null ||
      pollutantMeasurement.value === undefined
    ) {
      missingPollutants.push(bpConfig.pollutantId);
      continue;
    }

    // Convert units if necessary
    let concentration = pollutantMeasurement.value;

    // Handle CO unit conversion (µg/m³ to mg/m³)
    if (
      bpConfig.pollutantId === "co" &&
      pollutantMeasurement.unit === "µg/m³"
    ) {
      concentration = concentration / 1000;
    }

    const result = calculatePollutantSubIndex(
      bpConfig.pollutantId,
      concentration,
      profile.pollutantBreakpoints,
      profile.categories,
    );

    if (result) {
      subIndices.push(result);
    }
  }

  // If no valid sub-indices, return error result
  if (subIndices.length === 0) {
    const fallbackCategory = profile.categories[0];
    return {
      profileId: profile.id,
      profileName: profile.name,
      index: -1,
      category: {
        ...fallbackCategory,
        name: "Sin datos suficientes",
        shortName: "N/D",
      },
      criticalPollutant: "pm25" as PollutantId,
      criticalPollutantName: "N/D",
      subIndices: [],
      missingPollutants,
      measurement,
      calculatedAt: new Date().toISOString(),
    };
  }

  // Find the maximum sub-index (critical pollutant)
  const maxSubIndex = subIndices.reduce((max, current) =>
    current.subIndex > max.subIndex ? current : max,
  );

  // Final index is the maximum sub-index
  const finalIndex = maxSubIndex.subIndex;
  const category = getCategory(finalIndex, profile.categories);

  return {
    profileId: profile.id,
    profileName: profile.name,
    index: finalIndex,
    category,
    criticalPollutant: maxSubIndex.pollutantId,
    criticalPollutantName: maxSubIndex.pollutantName,
    subIndices,
    missingPollutants,
    measurement,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate AQI for multiple measurements (time series or stations)
 */
export function calculateAQIBatch(
  measurements: AirQualityMeasurement[],
  profile: IndexProfile,
): AQIResult[] {
  return measurements.map((m) => calculateAQI(m, profile));
}

/**
 * Compare results across different index profiles for the same measurement
 */
export function compareAcrossProfiles(
  measurement: AirQualityMeasurement,
  profiles: IndexProfile[],
): AQIResult[] {
  return profiles.map((profile) => calculateAQI(measurement, profile));
}
