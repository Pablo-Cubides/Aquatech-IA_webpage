import { NextResponse } from "next/server";
import { buildLlmsFullTxt } from "@/lib/seo/llms";
import { SITE_URL } from "@/lib/site-config";

// Estatico con revalidacion: pesa cientos de KB y no debe generarse en cada peticion.
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return new NextResponse(await buildLlmsFullTxt(SITE_URL), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
