import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSessionMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
}));

vi.mock("next-auth", () => ({ getServerSession: getServerSessionMock }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));

import { DELETE, PUT, GET as GET_ONE } from "./[id]/route";
import { GET, POST } from "./route";

const asAdmin = () =>
  getServerSessionMock.mockResolvedValue({ user: { id: "a1", role: "ADMIN" } });
const asUser = () =>
  getServerSessionMock.mockResolvedValue({ user: { id: "u1", role: "USER" } });
const anonymous = () => getServerSessionMock.mockResolvedValue(null);

const json = (method: string, body: unknown) =>
  new Request("http://localhost/api/projects", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

describe("/api/projects: lectura", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sin sesión, el listado completo no incluye datos personales", async () => {
    anonymous();
    const response = await GET(new Request("http://localhost/api/projects"));
    const projects = (await response.json()) as Record<string, unknown>[];

    expect(response.status).toBe(200);
    expect(projects.length).toBeGreaterThan(0);
    for (const project of projects) {
      expect(project).not.toHaveProperty("estudiante");
      expect(project).not.toHaveProperty("notas_admin");
    }
  });

  it("un usuario autenticado sin rol ADMIN tampoco recibe datos personales", async () => {
    asUser();
    const projects = (await (await GET(new Request("http://localhost/api/projects"))).json()) as Record<string, unknown>[];
    expect(projects[0]).not.toHaveProperty("estudiante");
  });

  it("un ADMIN sí recibe los campos de gestión", async () => {
    asAdmin();
    const projects = (await (await GET(new Request("http://localhost/api/projects"))).json()) as Record<string, unknown>[];
    expect(projects[0]).toHaveProperty("estudiante");
    expect(projects[0]).toHaveProperty("notas_admin");
  });

  it("publicOnly=true devuelve la proyección pública para cualquiera", async () => {
    asAdmin();
    const projects = (await (await GET(new Request("http://localhost/api/projects?publicOnly=true"))).json()) as Record<string, unknown>[];
    for (const project of projects) {
      expect(project).not.toHaveProperty("estudiante");
    }
  });

  it("el detalle por id aplica la misma proyección", async () => {
    anonymous();
    const list = (await (await GET(new Request("http://localhost/api/projects"))).json()) as { id: string }[];
    const response = await GET_ONE(new Request("http://localhost/api/projects/x"), ctx(list[0].id));
    const project = await response.json();

    expect(response.status).toBe(200);
    expect(project).not.toHaveProperty("estudiante");
    expect(project).not.toHaveProperty("notas_admin");
  });

  it("un id con formato inválido da 404, no un error", async () => {
    anonymous();
    const response = await GET_ONE(new Request("http://localhost/api/projects/x"), ctx("../etc/passwd"));
    expect(response.status).toBe(404);
  });
});

describe("/api/projects: escritura exige ADMIN y responde 404 si no", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ["sin sesión", anonymous],
    ["usuario sin rol ADMIN", asUser],
  ])("POST, PUT y DELETE rechazados (%s)", async (_label, setSession) => {
    setSession();

    expect((await POST(json("POST", { titulo: "Intruso" }))).status).toBe(404);
    expect((await PUT(json("PUT", { titulo: "Cambio" }), ctx("coag-moringa"))).status).toBe(404);
    expect((await DELETE(json("DELETE", {}), ctx("coag-moringa"))).status).toBe(404);
  });

  it("un ADMIN puede crear, editar y borrar; el cuerpo se valida con Zod", async () => {
    asAdmin();

    const bad = await POST(json("POST", { titulo: "" }));
    expect(bad.status).toBe(400);

    const created = await POST(json("POST", { id: "sec-test", titulo: "Proyecto de prueba", campoInventado: "x" }));
    expect(created.status).toBe(201);
    expect(await created.json()).not.toHaveProperty("campoInventado");

    const status = await PUT(json("PUT", { action: "updateStatus", estado: "inexistente" }), ctx("sec-test"));
    expect(status.status).toBe(400);

    const updated = await PUT(json("PUT", { action: "updateStatus", estado: "abierto", estudiante: "Ana" }), ctx("sec-test"));
    expect(updated.status).toBe(200);

    expect((await DELETE(json("DELETE", {}), ctx("sec-test"))).status).toBe(200);
  });
});
