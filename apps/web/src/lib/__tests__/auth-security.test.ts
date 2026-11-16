import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: { user: { findUnique: vi.fn() } },
}));

vi.mock("@ia-next/database", () => ({ prisma: prismaMock }));

const { rateLimitMock } = vi.hoisted(() => ({ rateLimitMock: vi.fn() }));
vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIP: (headers: Headers) => headers.get("x-vercel-forwarded-for") ?? "unknown",
}));

import { authOptions, INVALID_CREDENTIALS_MESSAGE, TOO_MANY_ATTEMPTS_MESSAGE } from "@/lib/auth";

type JwtArgs = Parameters<NonNullable<NonNullable<typeof authOptions.callbacks>["jwt"]>>[0];

const runJwt = (args: Partial<JwtArgs>) =>
  authOptions.callbacks!.jwt!(args as JwtArgs);

const credentialsAuthorize = () => {
  const provider = authOptions.providers.find(
    (p) => (p as { type?: string }).type === "credentials",
  ) as unknown as {
    options: {
      authorize: (credentials: Record<string, string>, req?: unknown) => Promise<unknown>;
    };
  };
  return provider.options.authorize;
};

describe("auth jwt callback: el rol nunca viene del cliente", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("un payload de update() con role ADMIN no cambia el rol del token", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ role: "USER" });

    const token = await runJwt({
      token: { uid: "user-1", role: "USER" } as JwtArgs["token"],
      trigger: "update",
      session: { user: { role: "ADMIN" } },
    });

    expect(token.role).toBe("USER");
  });

  it("si la base de datos falla, el rol del token se conserva (no se toma del cliente)", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("db down"));

    const token = await runJwt({
      token: { uid: "user-1", role: "USER" } as JwtArgs["token"],
      trigger: "update",
      session: { user: { role: "ADMIN" } },
    });

    expect(token.role).toBe("USER");
  });

  it("refresca el rol desde la base de datos por uid", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ role: "MODERATOR" });

    const token = await runJwt({
      token: { uid: "user-1", role: "USER" } as JwtArgs["token"],
      trigger: "update",
      session: { user: { role: "ADMIN" } },
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: { role: true },
    });
    expect(token.role).toBe("MODERATOR");
  });

  it("conserva name y picture válidos del payload de update()", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ role: "USER" });

    const token = await runJwt({
      token: { uid: "user-1", role: "USER" } as JwtArgs["token"],
      trigger: "update",
      session: {
        user: { name: "  Ana Pérez ", image: "https://example.com/a.png" },
      },
    });

    expect(token.name).toBe("Ana Pérez");
    expect(token.picture).toBe("https://example.com/a.png");
  });

  it("descarta imágenes con esquema no http(s)", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ role: "USER" });

    const token = await runJwt({
      token: { uid: "user-1", role: "USER", picture: "https://ok.example/a.png" } as JwtArgs["token"],
      trigger: "update",
      session: { user: { image: "javascript:alert(1)" } },
    });

    expect(token.picture).toBe("https://ok.example/a.png");
  });

  it("en el inicio de sesión toma uid y rol del usuario autenticado", async () => {
    const token = await runJwt({
      token: {} as JwtArgs["token"],
      user: { id: "user-9", role: "ADMIN" } as JwtArgs["user"],
    });

    expect(token.uid).toBe("user-9");
    expect(token.role).toBe("ADMIN");
  });
});

describe("auth credentials: no enumera usuarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rateLimitMock.mockResolvedValue({ success: true, limit: 6, remaining: 5, reset: Date.now() + 1000 });
  });

  it("usuario inexistente y contraseña incorrecta dan exactamente el mismo mensaje", async () => {
    const authorize = credentialsAuthorize();

    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    const missing = await authorize({ email: "nadie@example.com", password: "whatever" }).catch(
      (e: Error) => e,
    );

    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: "u1",
      email: "real@example.com",
      password: bcrypt.hashSync("correcta", 4),
      role: "USER",
    });
    const wrong = await authorize({ email: "real@example.com", password: "incorrecta" }).catch(
      (e: Error) => e,
    );

    expect(missing).toBeInstanceOf(Error);
    expect(wrong).toBeInstanceOf(Error);
    expect((missing as Error).message).toBe(INVALID_CREDENTIALS_MESSAGE);
    expect((wrong as Error).message).toBe(INVALID_CREDENTIALS_MESSAGE);
  });

  it("un usuario sin contraseña (cuenta solo Google) tampoco se distingue", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: "u2",
      email: "google@example.com",
      password: null,
      role: "USER",
    });

    await expect(
      credentialsAuthorize()({ email: "google@example.com", password: "x" }),
    ).rejects.toThrow(INVALID_CREDENTIALS_MESSAGE);
  });

  it("las credenciales correctas siguen autenticando", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: "u1",
      email: "real@example.com",
      name: "Real",
      image: null,
      password: bcrypt.hashSync("correcta", 4),
      role: "USER",
    });

    await expect(
      credentialsAuthorize()({ email: "real@example.com", password: "correcta" }),
    ).resolves.toMatchObject({ id: "u1", email: "real@example.com", role: "USER" });
  });
});

describe("auth credentials: límite de intentos de inicio de sesión", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rateLimitMock.mockResolvedValue({ success: true, limit: 6, remaining: 5, reset: Date.now() + 1000 });
  });

  it("limita por cuenta+IP y por IP, ambos en modo cerrado, antes de tocar la base de datos", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await credentialsAuthorize()(
      { email: " Ana@Example.com ", password: "x" },
      { headers: { "x-vercel-forwarded-for": "203.0.113.9" } },
    ).catch(() => undefined);

    const calls = rateLimitMock.mock.calls;
    expect(calls.map((c) => c[0])).toEqual([
      "auth:login:acct:203.0.113.9:ana@example.com",
      "auth:login:ip:203.0.113.9",
    ]);
    for (const [, config] of calls) expect(config.failureMode).toBe("closed");
  });

  it("al superar el límite rechaza sin consultar usuarios ni comparar contraseñas", async () => {
    rateLimitMock.mockResolvedValue({ success: false, limit: 6, remaining: 0, reset: Date.now() + 1000 });

    await expect(
      credentialsAuthorize()({ email: "a@b.co", password: "x" }, { headers: {} }),
    ).rejects.toThrow(TOO_MANY_ATTEMPTS_MESSAGE);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("si el almacén de límites no está disponible (cerrado) tampoco se permite probar contraseñas", async () => {
    rateLimitMock.mockResolvedValue({ success: false, limit: 6, remaining: 0, reset: Date.now(), reason: "backend-unavailable" });

    await expect(
      credentialsAuthorize()({ email: "a@b.co", password: "x" }, { headers: {} }),
    ).rejects.toThrow(TOO_MANY_ATTEMPTS_MESSAGE);
  });
});
