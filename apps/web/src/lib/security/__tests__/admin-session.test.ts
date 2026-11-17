import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const { getServerSessionMock, findUniqueMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  findUniqueMock: vi.fn(),
}));

vi.mock("next-auth", () => ({ getServerSession: getServerSessionMock }));
vi.mock("@/lib/auth", () => ({ authOptions: { marker: "opts" } }));
vi.mock("@ia-next/database", () => ({ prisma: { user: { findUnique: findUniqueMock } } }));

import { getAdminSession, isAdminInDatabase } from "@/lib/security/admin-session";

describe("getAdminSession / isAdminInDatabase (SEC-004: el rol sale de la base de datos)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("control positivo: sesión + rol ADMIN en la base => devuelve la sesión", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "a1", role: "ADMIN" } });
    findUniqueMock.mockResolvedValue({ role: "ADMIN" });
    const session = await getAdminSession();
    expect(session?.user?.id).toBe("a1");
    expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: "a1" }, select: { role: true } });
  });

  it("un ADMIN degradado conserva el rol en su JWT pero la base manda: null", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "a1", role: "ADMIN" } });
    findUniqueMock.mockResolvedValue({ role: "USER" });
    expect(await getAdminSession()).toBeNull();
  });

  it("el rol que viaja en la sesión NO concede nada si la base dice otra cosa", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "u1", role: "ADMIN" } });
    findUniqueMock.mockResolvedValue({ role: "EDITOR" });
    expect(await getAdminSession()).toBeNull();
  });

  it("usuario borrado (la base no lo encuentra) => null", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "a1", role: "ADMIN" } });
    findUniqueMock.mockResolvedValue(null);
    expect(await getAdminSession()).toBeNull();
  });

  it("la base no responde => se DENIEGA (nunca lanza ni concede)", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "a1", role: "ADMIN" } });
    findUniqueMock.mockRejectedValue(new Error("db down"));
    expect(await getAdminSession()).toBeNull();
    expect(await isAdminInDatabase("a1")).toBe(false);
  });

  it("sin sesión o sin id de usuario => null sin consultar la base", async () => {
    getServerSessionMock.mockResolvedValue(null);
    expect(await getAdminSession()).toBeNull();
    getServerSessionMock.mockResolvedValue({ user: { role: "ADMIN" } });
    expect(await getAdminSession()).toBeNull();
    expect(await isAdminInDatabase(undefined)).toBe(false);
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("getServerSession falla => null", async () => {
    getServerSessionMock.mockRejectedValue(new Error("boom"));
    expect(await getAdminSession()).toBeNull();
  });
});

describe("guarda estática: ningún chequeo de privilegio en servidor lee el rol del JWT", () => {
  const src = path.join(process.cwd(), "src");
  const serverFiles = [
    "app/admin/layout.tsx",
    "app/api/notes/route.ts",
    "app/api/tools/analytics/route.ts",
    "app/(portals)/ia/(marketing)/autor/herramientas/consulta-nota/page.tsx",
    "lib/security/admin-session.ts",
  ];
  const FORBIDDEN = /user\??\.role\s*[!=]==?\s*["']ADMIN["']/;

  it("control: la guarda detecta el patrón prohibido", () => {
    expect('if (session.user.role !== "ADMIN") {').toMatch(FORBIDDEN);
  });

  it.each(serverFiles)("%s no compara session.user.role con ADMIN", (file) => {
    const code = readFileSync(path.join(src, file), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    expect(code).not.toMatch(FORBIDDEN);
  });

  it("la sesión del JWT dura 7 días como máximo", () => {
    const code = readFileSync(path.join(src, "lib/auth.ts"), "utf8");
    expect(code).toMatch(/maxAge:\s*7\s*\*\s*24\s*\*\s*60\s*\*\s*60/);
  });
});
