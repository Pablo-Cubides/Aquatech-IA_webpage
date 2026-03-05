import { NextRequest, NextResponse } from "next/server";
import { getClientIP, rateLimit } from "@/lib/security/rate-limit";

const WHO_API_BASE = "https://ghoapi.azureedge.net/api";
const WHO_PATH_PATTERN = /^[a-zA-Z0-9/_(),-]+$/;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawPath = searchParams.get("path") || "";
  const path = rawPath.trim().replace(/^\/+/, "");

  const clientIP = getClientIP(request.headers);

  const limit = await rateLimit(`proxy:who:${clientIP}`, {
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
    !WHO_PATH_PATTERN.test(path) ||
    path.includes("..") ||
    path.includes("//") ||
    path.includes(":")
  ) {
    return NextResponse.json(
      { error: "Invalid path parameter" },
      { status: 400 },
    );
  }

  // Para OData de WHO, a veces hay filtros complejos en la URL
  // Vamos a pasar todo lo que recibamos
  const queryParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== "path") {
      queryParams.append(key, value);
    }
  });

  // Manejo especial para OData $filter que puede venir encodeado o no
  // Next.js automáticamente decodifica searchParams, así que al reconstruir debería estar bien

  const queryString = queryParams.toString();
  const targetUrl = `${WHO_API_BASE}/${path}${queryString ? `?${queryString}` : ""}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `WHO API error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy WHO Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error fetching from WHO" },
      { status: 500 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
