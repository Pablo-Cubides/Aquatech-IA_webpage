import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateMock } = vi.hoisted(() => ({ updateMock: vi.fn() }));

vi.mock("@ia-next/database", () => ({
  prisma: { blogPost: { update: updateMock } },
}));

import { pickUpdatableFields, updateStoredArticle } from "@/lib/services/blog-store";

describe("blog-store: lista blanca de campos actualizables", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Captura los argumentos y corta el flujo: no interesa lo que ocurra después del update.
    updateMock.mockImplementation(async () => {
      throw new Error("stop");
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("prisma.blogPost.update NO recibe id, createdAt, updatedAt, source ni claves desconocidas", async () => {
    await updateStoredArticle("abc", {
      title: "Nuevo",
      status: "PAUSED",
      // En runtime llega cualquier cosa aunque el tipo la excluya:
      ...({ id: "otro", createdAt: "2000-01-01", updatedAt: "2000-01-01", source: "ADMIN", role: "ADMIN", password: "x" } as object),
    });

    expect(updateMock).toHaveBeenCalledTimes(1);
    const { where, data } = updateMock.mock.calls[0][0];
    expect(where).toEqual({ id: "abc" });
    expect(Object.keys(data).sort()).toEqual(["status", "title"]);
  });

  it("conserva el mapeo de portal (mayúsculas), author y publishedAt", async () => {
    await updateStoredArticle("abc", {
      portal: "ia",
      author: { name: "Ana", avatar: "/a.png", bio: "bio" },
      publishedAt: "2026-01-01T00:00:00.000Z",
    });

    const { data } = updateMock.mock.calls[0][0];
    expect(data.portal).toBe("IA");
    expect(data).toMatchObject({ authorName: "Ana", authorAvatar: "/a.png", authorBio: "bio" });
    expect(data.author).toBeUndefined();
    expect(data.publishedAt).toBeInstanceOf(Date);
  });

  it("pickUpdatableFields descarta undefined y claves heredadas", () => {
    const picked = pickUpdatableFields({ title: "t", slug: undefined, __proto__: { status: "X" }, id: "1" } as Record<string, unknown>);
    expect(picked).toEqual({ title: "t" });
  });

  it("SEC-005b: un content en TEXTO se guarda estructurado y la lectura posterior no se rompe", async () => {
    const markdown =
      "Introducción con texto suficiente para parecer un artículo real y no una frase suelta cualquiera.\n\n" +
      "## Primera sección\nContenido de la primera sección con más de cincuenta caracteres de texto.\n\n" +
      "## Segunda sección\nContenido de la segunda sección, también con más de cincuenta caracteres.";
    // La base devuelve la fila con lo que se le pasó (como haría Prisma).
    updateMock.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      id: "abc",
      portal: "IA",
      slug: "x",
      title: "t",
      category: "c",
      excerpt: "e",
      readTime: 1,
      heroImage: null,
      authorName: null,
      authorAvatar: null,
      authorBio: null,
      tags: ["a", "b", "c"],
      status: "PUBLISHED",
      source: "ADMIN",
      references: null,
      nextArticle: null,
      publishedAt: new Date("2026-01-01"),
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
      ...data,
    }));

    const result = await updateStoredArticle("abc", { content: markdown });

    const { data } = updateMock.mock.calls[0][0];
    expect(typeof data.content).toBe("object"); // antes: el string markdown tal cual
    expect(Array.isArray(data.content.sections)).toBe(true);
    expect(data.content.sections.map((s: { title: string }) => s.title)).toEqual(["Primera sección", "Segunda sección"]);
    // Y lo que lee la página existe: antes mapDbPostToStoredArticle hacía JSON.parse del markdown y lanzaba.
    expect(result).not.toBeNull();
    expect(Array.isArray(result!.content.sections)).toBe(true);
    expect(result!.content.introduction).toContain("Introducción con texto suficiente");
  });

  it("un content ya estructurado pasa sin cambios", async () => {
    const structured = { introduction: "i".repeat(120), sections: [{ id: "a", title: "A", content: "c".repeat(60) }] };
    await updateStoredArticle("abc", { content: structured });
    expect(updateMock.mock.calls[0][0].data.content).toEqual(structured);
  });
});
