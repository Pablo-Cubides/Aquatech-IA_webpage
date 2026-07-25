import { NextRequest, NextResponse } from "next/server";
import { getClientIP, rateLimit } from "@/lib/security/rate-limit";

const WB_API_BASE = "https://api.worldbank.org/v2";
const WORLD_BANK_PATH_PATTERN = /^[a-zA-Z0-9/_-]+$/;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawPath = searchParams.get("path") || "";
  const path = rawPath.trim().replace(/^\/+/, "");

  const clientIP = getClientIP(request.headers);

  const limit = await rateLimit(`proxy:worldbank:${clientIP}`, {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 60,
  });

  if (!limit.success) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.limit.toString(),
          "X-RateLimit-Remaining": limit.remaining.toString(),
          "X-RateLimit-Reset": new Date(limit.reset).toISOString(),
        },
      },
    );
  }

  if (!path) {
    return NextResponse.json(
      { error: "Path parameter is required" },
      { status: 400 },
    );
  }

  if (
    !WORLD_BANK_PATH_PATTERN.test(path) ||
    path.includes("..") ||
    path.includes("//") ||
    path.includes(":")
  ) {
    return NextResponse.json(
      { error: "Invalid path parameter" },
      { status: 400 },
    );
  }

  // Reconstruir la URL de destino
  // Eliminamos 'path' de los parámetros para enviarlos a la API externa
  const queryParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== "path") {
      queryParams.append(key, value);
    }
  });

  const targetUrl = `${WB_API_BASE}/${path}?${queryParams.toString()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(targetUrl, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `WorldBank API error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy WorldBank Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error fetching from WorldBank" },
      { status: 500 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
