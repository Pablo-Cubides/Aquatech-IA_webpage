import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";

const { getServerSessionMock, prismaMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  prismaMock: {
    user: {
      findUnique: vi.fn(),
    },
    questionSet: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("next-auth/next", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
}));

describe("/api/questionsets authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 for unauthenticated GET", async () => {
    getServerSessionMock.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("returns 403 for non-admin GET", async () => {
    getServerSessionMock.mockResolvedValue({
      user: { email: "user@example.com" },
    });
    prismaMock.user.findUnique.mockResolvedValue({ role: "USER" });

    const response = await GET();

    expect(response.status).toBe(403);
  });

  it("returns 401 for unauthenticated POST", async () => {
    getServerSessionMock.mockResolvedValue(null);

    const request = new Request("http://localhost/api/questionsets", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Set 1",
        questions: ["Pregunta 1"],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it("creates a questionset for ADMIN", async () => {
    getServerSessionMock.mockResolvedValue({
      user: { email: "admin@example.com" },
    });
    prismaMock.user.findUnique.mockResolvedValue({ role: "ADMIN" });
    prismaMock.questionSet.findUnique.mockResolvedValue(null);
    prismaMock.questionSet.create.mockResolvedValue({
      id: 1,
      name: "Set 1",
      questions: [{ id: 10, text: "Pregunta 1" }],
    });

    const request = new Request("http://localhost/api/questionsets", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Set 1",
        questions: ["Pregunta 1"],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(prismaMock.questionSet.create).toHaveBeenCalledTimes(1);
  });
});
