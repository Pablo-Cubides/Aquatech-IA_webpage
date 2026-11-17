import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeBlogAdmin } from "@/lib/security/blog-admin-auth";
import {
  createArticleSchema,
  describeInvalidBody,
  readBoundedJson,
} from "@/lib/schemas/blog-article.zod";
import {
  createStoredArticle,
  getStoredArticles,
  CreateArticleInput,
} from "@/lib/services/blog-store";
import { getAllArticles } from "@/lib/blog-articles";
import { checkCreateForPublication, describePublicationFailure } from "@/lib/services/blog-publication";

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
    const raw = await readBoundedJson(req);
    if (!raw.ok) {
      return NextResponse.json(
        { error: raw.status === 413 ? "Cuerpo demasiado grande" : "JSON inválido" },
        { status: raw.status },
      );
    }

    const parsed = createArticleSchema.safeParse(raw.value);
    if (!parsed.success) {
      return NextResponse.json(describeInvalidBody(parsed.error), { status: 400 });
    }
    const body = parsed.data;

    const defaultCategory =
      body.portal === "ia" ? "Inteligencia Artificial" : "Gestión Ambiental";

    const input: CreateArticleInput = {
      portal: body.portal,
      title: body.title,
      slug: body.slug,
      category: body.category?.trim() || defaultCategory,
      excerpt: body.excerpt?.trim() || body.title,
      content: body.content,
      heroImage: body.heroImage,
      authorName: body.authorName,
      authorAvatar: body.authorAvatar,
      authorBio: body.authorBio,
      readTime: body.readTime,
      tags: body.tags,
      status: body.status,
      publishedAt: body.publishedAt,
      // La procedencia la fija el servidor: un cliente no puede declararse "ADMIN" ni "AGENT".
      source: auth.via === "agent" ? "AGENT" : "ADMIN",
    };

    // SEC-004b: un artículo que va a quedar visible (PUBLISHED/SCHEDULED) cumple el mismo contrato
    // que los de código; los borradores siguen siendo laxos.
    const publication = checkCreateForPublication(input);
    if (!publication.ok) {
      return NextResponse.json(describePublicationFailure(publication.issues), { status: 400 });
    }

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
