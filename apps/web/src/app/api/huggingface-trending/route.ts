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
    const hfHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (process.env.HUGGINGFACE_API_KEY) {
      hfHeaders["Authorization"] = `Bearer ${process.env.HUGGINGFACE_API_KEY}`;
    }

    const response = await fetch(apiUrl, {
      headers: hfHeaders,
      next: { revalidate: CACHE_DURATION },
    });

    if (!response.ok) {
      console.warn("[HF API] Error or rate limit, falling back to mock data:", response.status);
      const mockModels = generateMockHFModels(limit, category);
      return NextResponse.json({
        models: mockModels,
        cached: false,
        period,
        limit,
        category: category || "all",
        source: "huggingface.co (mock)",
      });
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
    console.error("[HF Trending API] Error, falling back to mock data:", error);
    const mockModels = generateMockHFModels(20, undefined);
    return NextResponse.json({
      models: mockModels,
      cached: false,
      period: "week",
      limit: 20,
      category: "all",
      source: "huggingface.co (mock-fallback)",
    });
  }
}

function generateMockHFModels(limit: number, category?: string): HFModel[] {
  const allMocks: HFModel[] = [
    {
      id: "meta-llama/Llama-3-8B-Instruct",
      modelId: "meta-llama/Llama-3-8B-Instruct",
      author: "meta-llama",
      likes: 12543,
      downloads: 453920,
      trendingScore: 98.5,
      pipeline_tag: "text-generation",
      tags: ["llama-3", "instruct", "meta", "conversational", "text-generation"],
      createdAt: "2024-04-18T12:00:00Z",
      library_name: "transformers",
      private: false
    },
    {
      id: "google/gemma-7b-it",
      modelId: "google/gemma-7b-it",
      author: "google",
      likes: 8432,
      downloads: 219803,
      trendingScore: 88.2,
      pipeline_tag: "text-generation",
      tags: ["gemma", "instruction-tuned", "google", "text-generation"],
      createdAt: "2024-02-21T10:00:00Z",
      library_name: "transformers",
      private: false
    },
    {
      id: "mistralai/Mistral-7B-Instruct-v0.2",
      modelId: "mistralai/Mistral-7B-Instruct-v0.2",
      author: "mistralai",
      likes: 9248,
      downloads: 312040,
      trendingScore: 92.1,
      pipeline_tag: "text-generation",
      tags: ["mistral", "instruct", "transformers", "text-generation"],
      createdAt: "2023-12-11T09:00:00Z",
      library_name: "transformers",
      private: false
    },
    {
      id: "openai-community/gpt2",
      modelId: "openai-community/gpt2",
      author: "openai-community",
      likes: 1420,
      downloads: 12480392,
      trendingScore: 45.3,
      pipeline_tag: "text-generation",
      tags: ["gpt2", "text-generation", "transformers"],
      createdAt: "2019-02-14T08:00:00Z",
      library_name: "transformers",
      private: false
    },
    {
      id: "google-t5/t5-small",
      modelId: "google-t5/t5-small",
      author: "google-t5",
      likes: 890,
      downloads: 3840291,
      trendingScore: 35.1,
      pipeline_tag: "text2text-generation",
      tags: ["t5", "translation", "summarization", "text2text-generation"],
      createdAt: "2020-03-12T08:00:00Z",
      library_name: "transformers",
      private: false
    },
    {
      id: "Qwen/Qwen2.5-7B-Instruct",
      modelId: "Qwen/Qwen2.5-7B-Instruct",
      author: "Qwen",
      likes: 10432,
      downloads: 389201,
      trendingScore: 97.4,
      pipeline_tag: "text-generation",
      tags: ["qwen", "conversational", "text-generation", "transformers"],
      createdAt: "2024-09-18T10:00:00Z",
      library_name: "transformers",
      private: false
    },
    {
      id: "stabilityai/stable-diffusion-3-medium",
      modelId: "stabilityai/stable-diffusion-3-medium",
      author: "stabilityai",
      likes: 11029,
      downloads: 504930,
      trendingScore: 96.2,
      pipeline_tag: "text-to-image",
      tags: ["stable-diffusion", "text-to-image", "diffusers"],
      createdAt: "2024-06-12T12:00:00Z",
      library_name: "diffusers",
      private: false
    }
  ];

  let filtered = allMocks;
  if (category && category !== "all") {
    filtered = allMocks.filter(m => m.pipeline_tag === category);
  }

  return filtered.slice(0, limit);
}
