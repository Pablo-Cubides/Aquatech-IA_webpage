import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSessionMock, prismaMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  prismaMock: { user: { update: vi.fn() } },
}));

vi.mock("next-auth", () => ({ getServerSession: getServerSessionMock }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@ia-next/database", () => ({ prisma: prismaMock }));

import { PATCH } from "./route";

const patch = (body: unknown) =>
  new Request("http://localhost/api/user/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("PATCH /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ user: { email: "ana@example.com" } });
  });

  it("usa select explícito y no devuelve password, role ni credits", async () => {
    prismaMock.user.update.mockResolvedValue({ id: "u1", name: "Ana", image: null });

    const response = await PATCH(patch({ name: "Ana" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ select: { id: true, name: true, image: true } }),
    );
    expect(body).not.toHaveProperty("password");
    expect(body).not.toHaveProperty("role");
    expect(body).not.toHaveProperty("credits");
  });

  it("rechaza una imagen con esquema javascript:", async () => {
    const response = await PATCH(patch({ image: "javascript:alert(1)" }));
    expect(response.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("exige sesión", async () => {
    getServerSessionMock.mockResolvedValue(null);
    expect((await PATCH(patch({ name: "Ana" }))).status).toBe(401);
  });
});
