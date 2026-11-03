import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ query: vi.fn(), upstash: vi.fn() }));
vi.mock("@ia-next/database", () => ({ prisma: { $queryRaw: mocks.query } }));
vi.mock("./rate-limit", () => ({
  checkRateLimit: mocks.upstash,
  getClientIP: () => "203.0.113.8",
}));
import { limitGradeRequest } from "./grade-request-limit";
beforeEach(() => {
  vi.stubEnv("GRADE_RATE_LIMIT_BACKEND", "postgres");
  vi.stubEnv("GRADE_SYNC_SECRET", "s".repeat(43));
});
afterEach(() => vi.unstubAllEnvs());
describe("distributed grade request limit", () => {
  it("allows within the minute and blocks over its limit", async () => {
    mocks.query
      .mockResolvedValueOnce([{ hits: 10, reset: new Date() }])
      .mockResolvedValueOnce([{ hits: 11, reset: new Date() }]);
    const request = new Request("https://example.test");
    expect((await limitGradeRequest(request, "lookup")).success).toBe(true);
    expect((await limitGradeRequest(request, "lookup")).success).toBe(false);
    expect(JSON.stringify(mocks.query.mock.calls)).not.toContain("203.0.113.8");
  });
  it("fails closed when the counter is unavailable", async () => {
    mocks.query.mockRejectedValueOnce(Error("offline"));
    expect(
      await limitGradeRequest(new Request("https://example.test"), "lookup"),
    ).toMatchObject({ success: false, limit: 0 });
  });
  it("continues to use Upstash when that backend is selected", async () => {
    vi.stubEnv("GRADE_RATE_LIMIT_BACKEND", "upstash");
    mocks.upstash.mockResolvedValue({ success: true });
    expect(
      (await limitGradeRequest(new Request("https://example.test"), "catalog"))
        .success,
    ).toBe(true);
    expect(mocks.upstash).toHaveBeenCalledWith(
      "api",
      "grade:catalog:203.0.113.8",
    );
  });
});
