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
});
