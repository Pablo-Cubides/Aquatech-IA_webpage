import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeBlogAdmin } from "@/lib/security/blog-admin-auth";
import {
  articleIdSchema,
  describeInvalidBody,
  readBoundedJson,
  updateArticleSchema,
} from "@/lib/schemas/blog-article.zod";
import {
  getStoredArticles,
  updateStoredArticle,
  deleteStoredArticle,
} from "@/lib/services/blog-store";

// PATCH /api/admin/blog/articles/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeBlogAdmin(req);
  if (!auth.ok) return auth.response;

  const parsedId = articleIdSchema.safeParse((await params).id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  const id = parsedId.data;

  try {
    const raw = await readBoundedJson(req);
    if (!raw.ok) {
      return NextResponse.json(
        { error: raw.status === 413 ? "Cuerpo demasiado grande" : "JSON inválido" },
        { status: raw.status },
      );
    }

    // Esquema cerrado: id, createdAt, updatedAt y source no se aceptan (400 con las claves rechazadas).
    const parsed = updateArticleSchema.safeParse(raw.value);
    if (!parsed.success) {
      return NextResponse.json(describeInvalidBody(parsed.error), { status: 400 });
    }

    const updated = await updateStoredArticle(id, parsed.data);

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
  const auth = await authorizeBlogAdmin(req);
  if (!auth.ok) return auth.response;

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

