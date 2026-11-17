import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { authorizeMock, createMock, updateMock } = vi.hoisted(() => ({
  authorizeMock: vi.fn(),
  createMock: vi.fn(),
  updateMock: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/security/blog-admin-auth", () => ({ authorizeBlogAdmin: authorizeMock }));
vi.mock("@/lib/blog-articles", () => ({ getAllArticles: vi.fn() }));
vi.mock("@ia-next/database", () => ({ prisma: {} }));
// Las funciones puras del store (valores por defecto, markdown, estado) son las reales: la validación
// de publicación (SEC-004b) las usa. Solo se sustituyen las que tocan la base de datos.
vi.mock("@/lib/services/blog-store", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/services/blog-store")>()),
  createStoredArticle: createMock,
  getStoredArticles: vi.fn().mockResolvedValue([]),
  updateStoredArticle: updateMock,
  deleteStoredArticle: vi.fn(),
}));

import { PATCH } from "./[id]/route";
import { POST } from "./route";

const req = (method: string, body: unknown, raw = false) =>
  new NextRequest("http://localhost/api/admin/blog/articles", {
    method,
    headers: { "content-type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });

const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

// Cumple blogArticleSchema una vez aplicados los valores por defecto del servidor (SEC-004b):
// publicar exige el mismo contrato que los artículos de código.
const validPost = {
  portal: "ia",
  title: "Un artículo de prueba para la API de administración",
  excerpt: "Extracto de prueba con la longitud mínima que exige el contrato.",
  content: {
    introduction: "Introducción de prueba suficientemente larga para cumplir el mínimo de cien caracteres del contrato canónico de artículos.",
    sections: [
      { id: "primera", title: "Primera sección", content: "Contenido de la primera sección con más de cincuenta caracteres de texto." },
    ],
  },
  tags: ["a", "b", "c"],
};

describe("POST /api/admin/blog/articles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeMock.mockResolvedValue({ ok: true, via: "session" });
    createMock.mockResolvedValue({ portal: "ia", slug: "un-articulo" });
  });

  it("crea con un cuerpo válido y la procedencia la fija el servidor", async () => {
    const response = await POST(req("POST", { ...validPost, source: "AGENT" }));

    expect(response.status).toBe(201);
    expect(createMock.mock.calls[0][0].source).toBe("ADMIN"); // sesión => ADMIN, aunque el cliente diga AGENT
  });

  it("un Bearer de agente queda como AGENT", async () => {
    authorizeMock.mockResolvedValue({ ok: true, via: "agent" });
    await POST(req("POST", { ...validPost, source: "ADMIN" }));
    expect(createMock.mock.calls[0][0].source).toBe("AGENT");
  });

  it("acepta el cuerpo que envía hoy la UI de administración (excerpt y category vacíos)", async () => {
    const response = await POST(
      req("POST", { ...validPost, category: "", excerpt: "", status: "PUBLISHED", source: "ADMIN" }),
    );
    expect(response.status).toBe(201);
    expect(createMock.mock.calls[0][0].excerpt).toBe(validPost.title);
  });

  it("rechaza claves desconocidas con 400 y las nombra", async () => {
    const response = await POST(req("POST", { ...validPost, id: "x", createdAt: "2020-01-01", password: "p" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.rejectedKeys).toEqual(expect.arrayContaining(["id", "createdAt", "password"]));
    expect(createMock).not.toHaveBeenCalled();
  });

  it.each([
    ["heroImage javascript:", { heroImage: "javascript:alert(1)" }],
    ["heroImage data:", { heroImage: "data:text/html,x" }],
    ["heroImage //host", { heroImage: "//evil.example/x.png" }],
    ["portal inválido", { portal: "otro" }],
    ["slug con mayúsculas y espacios", { slug: "Mi Slug" }],
    ["demasiadas etiquetas", { tags: Array.from({ length: 8 }, (_, i) => `t${i}`) }],
    ["fecha inválida", { publishedAt: "no-es-fecha" }],
    ["título vacío", { title: "   " }],
    ["contenido gigante", { content: "x".repeat(200_001) }],
    ["sección sin id", { content: { introduction: "i", sections: [{ title: "t", content: "c" }] } }],
  ])("rechaza %s", async (_label, patch) => {
    const response = await POST(req("POST", { ...validPost, ...patch }));
    expect(response.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza JSON inválido (400) y cuerpos enormes (413)", async () => {
    expect((await POST(req("POST", "{no json", true))).status).toBe(400);
    expect((await POST(req("POST", JSON.stringify({ ...validPost, pad: "y".repeat(310_000) }), true))).status).toBe(413);
  });

  it("no hace nada sin autorización", async () => {
    authorizeMock.mockResolvedValue({ ok: false, response: new Response("no", { status: 401 }) });
    expect((await POST(req("POST", validPost))).status).toBe(401);
    expect(createMock).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/admin/blog/articles/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeMock.mockResolvedValue({ ok: true, via: "session" });
    updateMock.mockResolvedValue({ portal: "ia", slug: "x" });
  });

  it("la UI actual (solo status) sigue funcionando", async () => {
    const response = await PATCH(req("PATCH", { status: "PAUSED" }), ctx("abc123"));
    expect(response.status).toBe(200);
    expect(updateMock).toHaveBeenCalledWith("abc123", { status: "PAUSED" });
  });

  it.each(["id", "createdAt", "updatedAt", "source", "authorName", "foo"])(
    "rechaza la clave %s con 400 y la nombra (asignación masiva cerrada)",
    async (key) => {
      const response = await PATCH(req("PATCH", { status: "PAUSED", [key]: "x" }), ctx("abc123"));
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.rejectedKeys).toContain(key);
      expect(updateMock).not.toHaveBeenCalled();
    },
  );

  it("rechaza un update vacío, un id con formato inválido y valores peligrosos", async () => {
    expect((await PATCH(req("PATCH", {}), ctx("abc123"))).status).toBe(400);
    expect((await PATCH(req("PATCH", { status: "PAUSED" }), ctx("../x"))).status).toBe(400);
    expect((await PATCH(req("PATCH", { heroImage: "javascript:alert(1)" }), ctx("abc123"))).status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("acepta los campos de la lista blanca", async () => {
    const body = {
      title: "Nuevo título",
      tags: ["a"],
      author: { name: "Ana", avatar: "/images/a.png", bio: "b" },
      nextArticle: { slug: "otro", title: "Otro" },
    };
    expect((await PATCH(req("PATCH", body), ctx("abc123"))).status).toBe(200);
  });
});
