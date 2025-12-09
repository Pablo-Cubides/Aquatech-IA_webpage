import { NextRequest, NextResponse } from "next/server";

/**
 * Hugging Face Trending Models API
 *
 * Fetches trending models from Hugging Face Hub API with caching
 * @param period - 'week' (likes7d) or 'month' (likes30d)
 * @param limit - Number of models to fetch (5-50)
 * @param category - Optional pipeline_tag filter
 */

const HF_API_BASE = "https://huggingface.co/api/models";
const CACHE_DURATION = 3600; // 1 hour in seconds

// In-memory cache
interface CacheEntry {
  data: HFModel[];
  timestamp: number;
}

const cache: Map<string, CacheEntry> = new Map();

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

interface HFAPIResponse {
  _id: string;
  id: string;
  modelId: string;
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

function getCacheKey(period: string, limit: number, category?: string): string {
  return `${period}-${limit}-${category || "all"}`;
}

function isValidCache(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION * 1000;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20"), 5), 50);
    const category = searchParams.get("category") || undefined;

    // Validate period
    if (!["week", "month"].includes(period)) {
      return NextResponse.json(
        { error: "Invalid period. Use 'week' or 'month'" },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = getCacheKey(period, limit, category);
    const cached = cache.get(cacheKey);
    if (cached && isValidCache(cached)) {
      return NextResponse.json({
        models: cached.data,
        cached: true,
        period,
        limit,
        category: category || "all",
      });
    }

    // Build API URL
    const sortField = period === "week" ? "likes7d" : "likes30d";
    const params = new URLSearchParams({
      sort: sortField,
      direction: "-1",
      limit: limit.toString(),
    });

    if (category && category !== "all") {
      params.append("pipeline_tag", category);
    }

    const apiUrl = `${HF_API_BASE}?${params.toString()}`;

    // Fetch from Hugging Face API
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: CACHE_DURATION },
    });

    if (!response.ok) {
      console.error("[HF API] Error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch from Hugging Face API" },
        { status: response.status }
      );
    }

    const rawModels: HFAPIResponse[] = await response.json();

    // Transform data
    const models: HFModel[] = rawModels.map((model) => ({
      id: model.id,
      modelId: model.modelId || model.id,
      author: model.id.split("/")[0] || "unknown",
      likes: model.likes || 0,
      downloads: model.downloads || 0,
      trendingScore: model.trendingScore || 0,
      pipeline_tag: model.pipeline_tag,
      tags: model.tags || [],
      createdAt: model.createdAt,
      lastModified: model.lastModified,
      library_name: model.library_name,
      private: model.private || false,
    }));

    // Update cache
    cache.set(cacheKey, {
      data: models,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      models,
      cached: false,
      period,
      limit,
      category: category || "all",
      source: "huggingface.co",
    });
  } catch (error) {
    console.error("[HF Trending API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
