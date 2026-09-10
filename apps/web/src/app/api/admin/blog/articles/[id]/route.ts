import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getStoredArticles,
  updateStoredArticle,
  deleteStoredArticle,
} from "@/lib/services/blog-store";

const AGENT_API_KEY = process.env.BLOG_AGENT_API_KEY || "aquatech-agent-key-2026";

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token === AGENT_API_KEY) {
      return true;
    }
  }

  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role === "ADMIN") {
      return true;
    }
  } catch (e) {
    // Session check error
  }

  return false;
}

// PATCH /api/admin/blog/articles/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json(
      { error: "No autorizado. Se requiere token de agente o sesión de Administrador." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const updated = await updateStoredArticle(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: `No se encontró el artículo con ID ${id} o es un artículo fijo de código.` },
        { status: 404 }
      );
    }

    // Instant cache invalidation
    try {
      revalidatePath(`/${updated.portal}/blog`);
      revalidatePath(`/${updated.portal}/blog/${updated.slug}`);
      revalidatePath(`/admin/content`);
    } catch (e) {
      console.warn("[API Blog Articles] Notice: revalidatePath:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Artículo actualizado correctamente.",
      article: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al actualizar el artículo.";
    console.error("[API Blog Articles] Error updating article:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/articles/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json(
      { error: "No autorizado. Se requiere token de agente o sesión de Administrador." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const articles = await getStoredArticles();
    const target = articles.find((a) => a.id === id);

    const deleted = await deleteStoredArticle(id);

    if (!deleted) {
      return NextResponse.json(
        { error: `No se encontró el artículo con ID ${id} o no se puede eliminar porque es estático.` },
        { status: 404 }
      );
    }

    // Instant cache invalidation
    if (target) {
      try {
        revalidatePath(`/${target.portal}/blog`);
        revalidatePath(`/${target.portal}/blog/${target.slug}`);
        revalidatePath(`/admin/content`);
      } catch (e) {
        console.warn("[API Blog Articles] Notice: revalidatePath:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Artículo eliminado con éxito.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al eliminar el artículo.";
    console.error("[API Blog Articles] Error deleting article:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

