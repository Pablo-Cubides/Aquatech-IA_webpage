import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeBlogAdmin } from "@/lib/security/blog-admin-auth";
import {
  createStoredArticle,
  getStoredArticles,
  CreateArticleInput,
} from "@/lib/services/blog-store";
import { getAllArticles } from "@/lib/blog-articles";

// GET /api/admin/blog/articles
export async function GET(req: NextRequest) {
  const auth = await authorizeBlogAdmin(req);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  const portal = searchParams.get("portal") as "ia" | "ambiental" | null;
  const status = searchParams.get("status");
  const includeCode = searchParams.get("includeCode") === "true";

  let dynamicArticles = await getStoredArticles();

  if (portal) {
    dynamicArticles = dynamicArticles.filter((a) => a.portal === portal);
  }

  if (status && status !== "ALL") {
    dynamicArticles = dynamicArticles.filter((a) => a.status === status);
  }

  const allResults = [...dynamicArticles];

  if (includeCode) {
    const portalsToFetch: ("ia" | "ambiental")[] = portal ? [portal] : ["ia", "ambiental"];
    for (const p of portalsToFetch) {
      const staticList = (await getAllArticles(p, true))

        .filter((a) => a.source === "CODE")
        .map((a) => ({
          ...a,
          id: `code_${p}_${a.slug}`,
          portal: p,
          status: "PUBLISHED" as const,
          source: "CODE" as const,
          publishedAt: `${a.date}T12:00:00.000Z`,
          createdAt: `${a.date}T12:00:00.000Z`,
          updatedAt: `${a.date}T12:00:00.000Z`,
        }));
      allResults.push(...staticList);
    }
  }

  // Sort newest first
  allResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({
    success: true,
    total: allResults.length,
    articles: allResults,
  });
}

// POST /api/admin/blog/articles
export async function POST(req: NextRequest) {
  const auth = await authorizeBlogAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();

    if (!body.portal || (body.portal !== "ia" && body.portal !== "ambiental")) {
      return NextResponse.json(
        { error: "El campo 'portal' es requerido y debe ser 'ia' o 'ambiental'." },
        { status: 400 }
      );
    }

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "El campo 'title' es requerido." },
        { status: 400 }
      );
    }

    if (!body.content) {
      return NextResponse.json(
        { error: "El campo 'content' (texto Markdown o secciones estructuradas) es requerido." },
        { status: 400 }
      );
    }

    const defaultCategory =
      body.portal === "ia" ? "Inteligencia Artificial" : "Gestión Ambiental";

    const input: CreateArticleInput = {
      portal: body.portal,
      title: body.title.trim(),
      slug: body.slug,
      category: body.category?.trim() || defaultCategory,
      excerpt: body.excerpt?.trim() || body.title.trim(),
      content: body.content,
      heroImage: body.heroImage,
      authorName: body.authorName,
      authorAvatar: body.authorAvatar,
      authorBio: body.authorBio,
      readTime: body.readTime,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      status: body.status,
      publishedAt: body.publishedAt,
      source: body.source || (auth.via === "agent" ? "AGENT" : "ADMIN"),
    };

    const created = await createStoredArticle(input);

    // Instant cache invalidation
    try {
      revalidatePath(`/${created.portal}/blog`);
      revalidatePath(`/${created.portal}/blog/${created.slug}`);
      revalidatePath(`/admin/content`);
    } catch (e) {
      console.warn("[API Blog Articles] Notice: revalidatePath:", e);
    }

    return NextResponse.json(

      {
        success: true,
        message: "Artículo recibido y guardado con éxito.",
        article: created,
        previewUrl: `/${created.portal}/blog/${created.slug}`,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno al procesar el artículo.";
    console.error("[API Blog Articles] Error creating article:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
