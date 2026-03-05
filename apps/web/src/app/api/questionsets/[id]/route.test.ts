import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT, DELETE } from "./route";

const { getServerSessionMock, prismaMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  prismaMock: {
    user: {
      findUnique: vi.fn(),
    },
    questionSet: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    question: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
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

describe("/api/questionsets/[id] authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 for unauthenticated GET", async () => {
    getServerSessionMock.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(401);
  });

  it("returns 401 for unauthenticated PUT", async () => {
    getServerSessionMock.mockResolvedValue(null);

    const request = new Request("http://localhost", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Set", questions: ["Q1"] }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(401);
  });

  it("returns 401 for unauthenticated DELETE", async () => {
    getServerSessionMock.mockResolvedValue(null);

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(401);
  });

  it("returns 403 for non-admin DELETE", async () => {
    getServerSessionMock.mockResolvedValue({
      user: { email: "user@example.com" },
    });
    prismaMock.user.findUnique.mockResolvedValue({ role: "USER" });

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(403);
  });
});
