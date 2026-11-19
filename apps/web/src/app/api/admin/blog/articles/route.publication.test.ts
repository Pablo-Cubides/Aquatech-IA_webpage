import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * SEC-004b (ADR-0016): publicar por la API exige el contrato canónico; los borradores siguen siendo
 * laxos; editar un artículo ya publicado solo exige lo que el PATCH toca.
 */
const { authorizeMock, createMock, updateMock, getStoredMock } = vi.hoisted(() => ({
  authorizeMock: vi.fn(),
  createMock: vi.fn(),
  updateMock: vi.fn(),
  getStoredMock: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/security/blog-admin-auth", () => ({ authorizeBlogAdmin: authorizeMock }));
vi.mock("@/lib/blog-articles", () => ({ getAllArticles: vi.fn() }));
vi.mock("@ia-next/database", () => ({ prisma: {} }));
vi.mock("@/lib/services/blog-store", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/services/blog-store")>()),
  createStoredArticle: createMock,
  getStoredArticles: getStoredMock,
  updateStoredArticle: updateMock,
  deleteStoredArticle: vi.fn(),
}));

import { PATCH } from "./[id]/route";
import { POST } from "./route";

const req = (method: string, body: unknown) =>
  new NextRequest("http://localhost/api/admin/blog/articles", {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

const content = {
  introduction: "Introducción de prueba suficientemente larga para cumplir el mínimo de cien caracteres del contrato canónico de artículos.",
  sections: [{ id: "primera", title: "Primera sección", content: "Contenido de la primera sección con más de cincuenta caracteres de texto." }],
};
const goodPost = {
  portal: "ia",
  title: "Un artículo de prueba para la API de administración",
  excerpt: "Extracto de prueba con la longitud mínima que exige el contrato.",
  content,
  tags: ["a", "b", "c"],
};

/** Artículo ya guardado con los defectos de los antiguos: 2 etiquetas (las de por defecto). */
const legacy = {
  id: "abc123",
  portal: "ia",
  slug: "articulo-antiguo",
  title: "Un artículo antiguo publicado hace tiempo",
  category: "Inteligencia Artificial",
  date: "2025-04-02",
  readTime: 5,
  excerpt: "Extracto del artículo antiguo con longitud suficiente para el contrato.",
  heroImage: "/images/portal-ia/blog/llm-transformers-architecture.jpg",
  author: { name: "Pablo Cubides", avatar: "/images/portal-ia/autor/pablo-cubides.png", bio: "bio" },
  content,
  tags: ["Inteligencia Artificial", "IA"],
  status: "PUBLISHED",
  source: "AGENT",
  publishedAt: "2025-04-02T00:00:00.000Z",
  createdAt: "2025-04-02T00:00:00.000Z",
  updatedAt: "2025-04-02T00:00:00.000Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  authorizeMock.mockResolvedValue({ ok: true, via: "agent" });
  createMock.mockResolvedValue({ portal: "ia", slug: "x" });
  updateMock.mockResolvedValue({ portal: "ia", slug: "x" });
  getStoredMock.mockResolvedValue([legacy]);
});

describe("POST: publicar exige el contrato canónico", () => {
  it("control positivo: un artículo completo se publica", async () => {
    expect((await POST(req("POST", goodPost))).status).toBe(201);
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["2 etiquetas (las de por defecto)", { tags: ["a", "b"] }, "tags"],
    ["sin etiquetas (el servidor pondría 2)", { tags: undefined }, "tags"],
    ["extracto de 10 caracteres", { excerpt: "muy corto." }, "excerpt"],
    ["extracto de más de 280", { excerpt: "e".repeat(281) }, "excerpt"],
    ["introducción de 20 caracteres", { content: { ...content, introduction: "Introducción corta." } }, "content.introduction"],
    ["sección de menos de 50 caracteres", { content: { ...content, sections: [{ id: "a", title: "A", content: "poco" }] } }, "content.sections.0.content"],
    ["markdown sin estructura suficiente", { content: "## Intro\ntexto" }, "content"],
  ])("400 con %s", async (_label, patch, path) => {
    const response = await POST(req("POST", { ...goodPost, ...patch }));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.contract).toBe("blogArticleSchema");
    expect(body.issues.join(" | ")).toContain(path);
    expect(body.error).toContain(path); // la UI de administración solo muestra `error`
    expect(createMock).not.toHaveBeenCalled();
  });

  it("el estado SCHEDULED (fecha futura) también se valida", async () => {
    const response = await POST(req("POST", { ...goodPost, tags: ["a"], publishedAt: "2099-01-01T00:00:00Z" }));
    expect(response.status).toBe(400);
  });

  it.each(["DRAFT", "PAUSED", "ARCHIVED"])("un borrador (%s) con 1 etiqueta y extracto corto se acepta", async (status) => {
    const response = await POST(req("POST", { ...goodPost, status, tags: ["a"], excerpt: "corto" }));
    expect(response.status).toBe(201);
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("la UI sin extracto: usa el título como extracto y pasa si el título tiene 20-280 caracteres", async () => {
    const response = await POST(req("POST", { ...goodPost, excerpt: "", category: "" }));
    expect(response.status).toBe(201);
    const short = await POST(req("POST", { ...goodPost, title: "Título corto", excerpt: "" }));
    expect(short.status).toBe(400);
  });
});

describe("PATCH: el resultado visible cumple el contrato", () => {
  it("reanudar (PAUSED -> PUBLISHED) un artículo con 2 etiquetas se rechaza y dice por qué", async () => {
    getStoredMock.mockResolvedValue([{ ...legacy, status: "PAUSED" }]);
    const response = await PATCH(req("PATCH", { status: "PUBLISHED" }), ctx("abc123"));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("tags");
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("mientras está en pausa se pueden corregir las etiquetas y después reanudarlo", async () => {
    getStoredMock.mockResolvedValue([{ ...legacy, status: "PAUSED" }]);
    expect((await PATCH(req("PATCH", { tags: ["a", "b", "c"] }), ctx("abc123"))).status).toBe(200);
    getStoredMock.mockResolvedValue([{ ...legacy, status: "PAUSED", tags: ["a", "b", "c"] }]);
    expect((await PATCH(req("PATCH", { status: "PUBLISHED" }), ctx("abc123"))).status).toBe(200);
  });

  it("editar el título de un artículo ya publicado con 2 etiquetas NO se bloquea por ese defecto previo", async () => {
    const response = await PATCH(req("PATCH", { title: "Un título corregido de la misma guía" }), ctx("abc123"));
    expect(response.status).toBe(200);
  });

  it("pero tocar las etiquetas de uno publicado exige 3-7", async () => {
    expect((await PATCH(req("PATCH", { tags: ["solo-una"] }), ctx("abc123"))).status).toBe(400);
    expect((await PATCH(req("PATCH", { tags: ["a", "b", "c"] }), ctx("abc123"))).status).toBe(200);
  });

  it("pausar nunca se bloquea", async () => {
    expect((await PATCH(req("PATCH", { status: "PAUSED" }), ctx("abc123"))).status).toBe(200);
  });

  it("un artículo que no existe pasa al almacén (que responde 404)", async () => {
    getStoredMock.mockResolvedValue([]);
    updateMock.mockResolvedValue(null);
    expect((await PATCH(req("PATCH", { status: "PUBLISHED" }), ctx("nope"))).status).toBe(404);
  });

  it("SEC-005b: PATCH con content en TEXTO sobre un artículo publicado se estructura y se valida", async () => {
    const good =
      "Introducción con texto suficiente para parecer un artículo real y no una frase suelta cualquiera, de más de cien caracteres.\n\n" +
      "## Primera sección\nContenido de la primera sección con más de cincuenta caracteres de texto.";
    expect((await PATCH(req("PATCH", { content: good }), ctx("abc123"))).status).toBe(200);
    expect(updateMock).toHaveBeenCalledTimes(1);
  });

  it("SEC-005b: un texto demasiado corto para un artículo publicado se rechaza con los motivos (no se guarda)", async () => {
    const response = await PATCH(req("PATCH", { content: "## Intro\ntexto" }), ctx("abc123"));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("content");
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("SEC-005b: el mismo texto corto sobre un borrador se acepta (laxo)", async () => {
    getStoredMock.mockResolvedValue([{ ...legacy, status: "DRAFT" }]);
    expect((await PATCH(req("PATCH", { content: "## Intro\ntexto" }), ctx("abc123"))).status).toBe(200);
  });
});
