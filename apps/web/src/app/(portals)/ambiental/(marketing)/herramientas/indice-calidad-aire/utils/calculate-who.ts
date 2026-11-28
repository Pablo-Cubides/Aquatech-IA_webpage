/**
 * WHO Index Calculation
 * Calculates percentage over WHO Air Quality Guidelines 2021
 */

import type {
  PollutantId,
  AirQualityMeasurement,
  WHOResult,
  AQIResult,
  Category,
} from "../types";
import { POLLUTANTS } from "../types";
import {
  WHO_GUIDELINES,
  WHO_INDEX_CATEGORIES,
  WHO_CATEGORY_IDS,
  getWHOGuideline,
  getWHOCategory,
  calculateWHOPercentage,
} from "../data/breakpoints/who-guidelines";
import { WHO_INDEX_PROFILE } from "../data/index-profiles";

/**
 * Calculate WHO result for a single pollutant
 */
export function calculateWHOPollutant(
  pollutantId: PollutantId,
  concentration: number,
  period: "annual" | "daily" | "8hour" | "1hour" = "daily",
): WHOResult | null {
  const guideline = getWHOGuideline(pollutantId, period);

  if (guideline === undefined) {
    return null;
  }

  const percentage = calculateWHOPercentage(concentration, guideline);
  const category = getWHOCategory(percentage);
  // Porcentaje no numérico o negativo (concentración inválida): no hay categoría que dar.
  if (!category) return null;
  const pollutant = POLLUTANTS[pollutantId];

  return {
    pollutantId,
    pollutantName: pollutant.name,
    concentration,
    guideline,
    percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
    category: WHO_CATEGORY_IDS[WHO_INDEX_CATEGORIES.indexOf(category)],
    categoryName: category.name,
    color: category.color,
  };
}

/**
 * Calculate WHO index for all pollutants in a measurement
 */
export function calculateWHOIndex(
  measurement: AirQualityMeasurement,
): AQIResult {
  const subIndices: AQIResult["subIndices"] = [];
  const missingPollutants: PollutantId[] = [];
  const whoResults: WHOResult[] = [];
  const categories: Category[] = []; // misma posición que whoResults

  // Process each pollutant
  for (const guideline of WHO_GUIDELINES) {
    const pollutantMeasurement = measurement.pollutants.find(
      (p) => p.pollutantId === guideline.pollutantId,
    );

    if (
      !pollutantMeasurement ||
      pollutantMeasurement.value === null ||
      pollutantMeasurement.value === undefined
    ) {
      missingPollutants.push(guideline.pollutantId);
      continue;
    }

    // Determine the appropriate period based on available data
    const period = guideline.daily24hGuideline
      ? "daily"
      : guideline.eightHourGuideline
        ? "8hour"
        : "annual";

    const result = calculateWHOPollutant(
      guideline.pollutantId,
      pollutantMeasurement.value,
      period,
    );

    if (result) {
      // Convert to SubIndexResult format
      const category = getWHOCategory(result.percentage);
      if (!category) continue; // sin categoría no se publica el contaminante
      whoResults.push(result);
      categories.push(category);
      subIndices.push({
        pollutantId: result.pollutantId,
        pollutantName: result.pollutantName,
        concentration: result.concentration,
        unit: POLLUTANTS[result.pollutantId].unit,
        subIndex: Math.round(result.percentage),
        category,
      });
    }
  }

  // If no valid results, return error
  if (whoResults.length === 0) {
    const fallbackCategory = WHO_INDEX_CATEGORIES[0];
    return {
      profileId: "who-index",
      profileName: "Índice OMS",
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

  // Find the pollutant with highest percentage over guideline
  const maxIndex = whoResults.reduce(
    (best, current, i) => (current.percentage > whoResults[best].percentage ? i : best),
    0,
  );
  const maxResult = whoResults[maxIndex];

  const finalCategory = categories[maxIndex];

  return {
    profileId: "who-index",
    profileName: WHO_INDEX_PROFILE.name,
    index: Math.round(maxResult.percentage),
    category: finalCategory,
    criticalPollutant: maxResult.pollutantId,
    criticalPollutantName: maxResult.pollutantName,
    subIndices,
    missingPollutants,
    measurement,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Get WHO compliance summary for a measurement
 * Returns how many pollutants comply vs exceed guidelines
 */
export function getWHOComplianceSummary(measurement: AirQualityMeasurement): {
  total: number;
  compliant: number;
  nonCompliant: number;
  results: WHOResult[];
} {
  const results: WHOResult[] = [];

  for (const guideline of WHO_GUIDELINES) {
    const pollutantMeasurement = measurement.pollutants.find(
      (p) => p.pollutantId === guideline.pollutantId,
    );

    if (!pollutantMeasurement || pollutantMeasurement.value === null) {
      continue;
    }

    const period = guideline.daily24hGuideline
      ? "daily"
      : guideline.eightHourGuideline
        ? "8hour"
        : "annual";

    const result = calculateWHOPollutant(
      guideline.pollutantId,
      pollutantMeasurement.value,
      period,
    );

    if (result) {
      results.push(result);
    }
  }

  const compliant = results.filter((r) => r.percentage <= 100).length;

  return {
    total: results.length,
    compliant,
    nonCompliant: results.length - compliant,
    results,
  };
}
