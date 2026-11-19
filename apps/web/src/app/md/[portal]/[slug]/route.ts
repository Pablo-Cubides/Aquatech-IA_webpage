import { NextResponse } from "next/server";
import { getArticlesForIndexing } from "@/lib/articles-for-indexing";
import { articleUrl, renderArticle } from "@/lib/seo/llms";
import { SITE_URL } from "@/lib/site-config";

type Portal = "ia" | "ambiental";
const PORTALS: Portal[] = ["ia", "ambiental"];

// Igual que el resto de superficies de indexacion: estatico con revalidacion horaria.
export const revalidate = 3600;
// Un slug publicado despues del build (agente/admin) se genera bajo demanda con la MISMA fuente completa.
// Un slug que no existe da 404; si la BD cae en produccion, getArticlesForIndexing lanza => 500 (nunca una lista parcial).
export const dynamicParams = true;

export async function generateStaticParams() {
  // En produccion un fallo de BD PROPAGA y rompe el build: mejor no desplegar que publicar 11 de 23 rutas.
  const lists = await Promise.all(PORTALS.map((portal) => getArticlesForIndexing(portal)));
  return PORTALS.flatMap((portal, index) => lists[index].map((article) => ({ portal, slug: article.slug })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ portal: string; slug: string }> }) {
  const { portal, slug } = await params;
  if (!PORTALS.includes(portal as Portal)) return new NextResponse("Not found", { status: 404 });
  const articles = await getArticlesForIndexing(portal as Portal);
  const article = articles.find((item) => item.slug === slug);
  if (!article) return new NextResponse("Not found", { status: 404 });

  // Titulo como H1 (renderArticle lo emite como "###" porque cuelga de llms-full.txt).
  const markdown = renderArticle(article, portal as Portal, SITE_URL).replace(/^### /, "# ") + "\n";
  const canonical = articleUrl(SITE_URL, portal as Portal, slug);
  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // La version HTML es la canonica: el .md no compite con ella en el indice.
      Link: `<${canonical}>; rel="canonical"`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
