import { NextRequest } from "next/server";
import { z } from "zod";
import {
  fetchUpstreamJson,
  guardPublicProxy,
  proxyError,
  proxyJson,
  queryInt,
} from "@/lib/security/public-proxy";

/**
 * Hugging Face Trending Models API
 *
 * Modelos en tendencia del Hub de Hugging Face.
 * @param period - 'week' (likes7d) o 'month' (likes30d)
 * @param limit - número de modelos (5-50)
 * @param category - filtro opcional por pipeline_tag
 *
 * SEC-003:
 *  - SIN datos de respaldo: si el Hub falla se responde 502/503/504. Antes se devolvía una lista
 *    FIJA de siete modelos de 2019-2024 con la forma de la respuesta real y `source: "...(mock)"`:
 *    una lista "en tendencia" que es por definición vieja y que la interfaz mostraba como actual.
 *  - La caché en memoria guarda SOLO respuestas reales previas (el campo `cached` ya se informa)
 *    y se usa únicamente como primera barrera, nunca como sustituto de un fallo.
 *  - Límite: la clave HUGGINGFACE_API_KEY (opcional) identifica la cuenta => almacén compartido,
 *    cerrado, más un presupuesto global bajo el límite documentado del Hub para la API
 *    (500 peticiones / 5 min por IP anónima; Vercel comparte IP entre muchas instancias).
 */

const HF_API_BASE = "https://huggingface.co/api/models";
const CACHE_DURATION = 3600; // 1 hora en segundos

interface CacheEntry {
  data: HFModel[];
  timestamp: number;
}

const cache: Map<string, CacheEntry> = new Map();
const MAX_CACHE_ENTRIES = 200;

export interface HFModel {
  id: string;
  modelId: string;
  author: string;
  likes: number;
  downloads: number;
  trendingScore: number;
  pipeline_tag?: string;
  tags: string[];
  createdAt: string;
  lastModified?: string;
  library_name?: string;
  private: boolean;
}

const rawModelSchema = z.object({
  id: z.string().min(1),
  modelId: z.string().optional(),
  likes: z.number().optional(),
  downloads: z.number().optional(),
  trendingScore: z.number().optional(),
  pipeline_tag: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  lastModified: z.string().optional(),
  library_name: z.string().optional(),
  private: z.boolean().optional(),
});

const querySchema = z.strictObject({
  period: z.enum(["week", "month"]).default("week"),
  limit: queryInt(5, 50).default(20),
  // "all" o un pipeline_tag del Hub (p. ej. "text-generation").
  category: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]{0,49}$/, "categoría inválida")
    .default("all"),
});

function isValidCache(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION * 1000;
}

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "huggingface:trending",
    schema: querySchema,
    perMinutePerIp: 30,
    limiter: "shared",
    upstreamBudget: { max: 300, intervalMs: 5 * 60_000 },
  });
  if (!guard.ok) return guard.response;
  const { period, limit, category } = guard.query;

  const cacheKey = `${period}-${limit}-${category}`;
  const cached = cache.get(cacheKey);
  if (cached && isValidCache(cached)) {
    return proxyJson(
      { models: cached.data, cached: true, period, limit, category },
      { sMaxAge: CACHE_DURATION },
    );
  }

  const params = new URLSearchParams({
    direction: "-1",
    limit: String(limit),
    sort: period === "week" ? "likes7d" : "likes30d",
  });
  if (category !== "all") params.set("pipeline_tag", category);

  const headers: Record<string, string> = { Accept: "application/json" };
  const apiKey = process.env.HUGGINGFACE_API_KEY?.trim();
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const result = await fetchUpstreamJson("huggingface:trending", `${HF_API_BASE}?${params.toString()}`, {
    headers,
    timeoutMs: 10_000,
  });
  if (!result.ok) return result.response;

  const parsed = z.array(rawModelSchema).safeParse(result.data);
  if (!parsed.success) {
    return proxyError(502, "upstream_invalid", "Respuesta inválida del proveedor de datos.");
  }

  const models: HFModel[] = parsed.data.map((model) => ({
    id: model.id,
    modelId: model.modelId || model.id,
    author: model.id.split("/")[0] || "unknown",
    likes: model.likes ?? 0,
    downloads: model.downloads ?? 0,
    trendingScore: model.trendingScore ?? 0,
    pipeline_tag: model.pipeline_tag,
    tags: model.tags ?? [],
    createdAt: model.createdAt ?? "",
    lastModified: model.lastModified,
    library_name: model.library_name,
    private: model.private ?? false,
  }));

  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(cacheKey, { data: models, timestamp: Date.now() });

  return proxyJson(
    { models, cached: false, period, limit, category, source: "huggingface.co" },
    { sMaxAge: CACHE_DURATION },
  );
}
