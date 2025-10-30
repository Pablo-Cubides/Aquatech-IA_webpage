import { z } from "zod";

/**
 * Reusable Zod schemas for API validation
 * Ensures type safety and security across all API routes
 */

// ============================================================================
// DATASET SCHEMAS
// ============================================================================

export const datasetCreateSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  owner_id: z.string().uuid("owner_id debe ser un UUID válido"),
  column_mapping: z.record(z.string(), z.string()),
  available_dates: z.array(z.string()).optional(),
  parameters: z.array(z.string()).optional(),
  units: z.record(z.string(), z.string()).optional(),
  max_points_per_day: z.number().positive().optional(),
});

export type DatasetCreateInput = z.infer<typeof datasetCreateSchema>;

export const datasetUpdateSchema = datasetCreateSchema.partial();

export type DatasetUpdateInput = z.infer<typeof datasetUpdateSchema>;

export const datasetDeleteSchema = z.object({
  id: z.string().uuid("Dataset ID debe ser un UUID válido"),
});

export type DatasetDeleteInput = z.infer<typeof datasetDeleteSchema>;

// ============================================================================
// ANALYTICS SCHEMAS
// ============================================================================

export const analyticsEventSchema = z.object({
  eventName: z
    .string()
    .min(1, "El nombre del evento es requerido")
    .max(100, "El nombre del evento no puede exceder 100 caracteres"),
  tool: z
    .string()
    .min(1, "El nombre de la herramienta es requerido")
    .max(100, "El nombre de la herramienta no puede exceder 100 caracteres"),
  eventData: z.record(z.string(), z.unknown()).optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

// ============================================================================
// MATRIX SCHEMAS (EIA)
// ============================================================================

export const matrixProjectSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del proyecto es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres"),
  description: z
    .string()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional(),
  matrix_type: z.enum(["leopold", "conesa", "battelle"]),
  owner_id: z.string().uuid("owner_id debe ser un UUID válido"),
  data: z.record(z.string(), z.unknown()).optional(),
});

export type MatrixProjectInput = z.infer<typeof matrixProjectSchema>;

export const matrixExportSchema = z.object({
  data: z
    .array(z.record(z.string(), z.unknown()))
    .min(1, "Se debe incluir al menos una fila de datos")
    .max(10000, "No se pueden exportar más de 10,000 filas"),
  format: z.enum(["xlsx", "csv", "json"]),
});

export type MatrixExportInput = z.infer<typeof matrixExportSchema>;

// ============================================================================
// GEOJSON SCHEMAS
// ============================================================================

export const geoJSONFeatureSchema = z.object({
  type: z.literal("Feature"),
  properties: z.record(z.string(), z.unknown()).optional(),
  geometry: z.object({
    type: z.enum(["Point", "LineString", "Polygon", "MultiPolygon"]),
    coordinates: z.array(z.unknown()),
  }),
});

export const geoJSONCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(geoJSONFeatureSchema),
});

export type GeoJSONFeature = z.infer<typeof geoJSONFeatureSchema>;
export type GeoJSONCollection = z.infer<typeof geoJSONCollectionSchema>;

// ============================================================================
// NORMAS (STANDARDS) SCHEMAS
// ============================================================================

export const normasQuerySchema = z.object({
  pais: z.string().optional(),
  categoria: z.enum(["agua", "aire", "residuos", "vertimientos"]).optional(),
  search: z.string().max(100, "Búsqueda muy larga").optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export type NormasQueryInput = z.infer<typeof normasQuerySchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safe JSON parse with validation
 */
export function parseJSON<T>(json: string, schema?: z.ZodSchema<T>): T | null {
  try {
    const parsed = JSON.parse(json);
    if (schema) {
      return schema.parse(parsed);
    }
    return parsed as T;
  } catch {
    return null;
  }
}

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 1000) // Limit length
    .replace(/[<>]/g, ""); // Remove potential HTML/script tags
}

/**
 * Create a safe response error
 */
export function createValidationErrorResponse(
  error: z.ZodError,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const key = issue.path.join(".");
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(issue.message);
  });

  return result;
}
