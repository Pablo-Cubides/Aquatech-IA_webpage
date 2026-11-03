import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  parse: vi.fn(),
  limit: vi.fn(),
  import: vi.fn(),
  prepare: vi.fn(),
  saved: vi.fn(),
  cleanup: vi.fn(),
}));
vi.mock("@ia-next/database", () => ({
  prisma: {
    gradeReport: { findMany: mocks.saved },
    $executeRaw: mocks.cleanup,
  },
}));
vi.mock("@/lib/grade-sync-auth", () => ({
  authenticateGradeSync: mocks.auth,
  parseGradeSyncBatch: mocks.parse,
}));
vi.mock("@/lib/grade-request-limit", () => ({
  limitGradeRequest: mocks.limit,
}));
vi.mock("@/lib/grade-reports", () => ({
  importGradeReports: mocks.import,
  prepareGradeReports: mocks.prepare,
}));
import { POST } from "./route";
const request = () =>
  new Request("https://example.test/api/grade-reports/sync", {
    method: "POST",
    body: "{}",
  });
beforeEach(() => {
  mocks.auth.mockReturnValue(true);
  mocks.parse.mockReturnValue({
    period: "2026-3",
    courseId: "ct01111-g1",
    cut: 2,
    source: { version: "1", sha256: "a".repeat(64) },
  });
  mocks.limit.mockResolvedValue({ success: true });
  mocks.import.mockResolvedValue({ students: 1, changed: 0 });
  const row = {
    code: "00001234",
    sourceVersion: "1",
    sourceSha256: "a".repeat(64),
    reportHash: "b".repeat(64),
    published: true,
  };
  mocks.prepare.mockReturnValue([row]);
  mocks.saved.mockResolvedValue([row]);
  mocks.cleanup.mockResolvedValue(0);
});
describe("signed grade synchronization", () => {
  it("rejects unauthenticated requests before touching data", async () => {
    mocks.auth.mockReturnValue(false);
    expect((await POST(request())).status).toBe(401);
    expect(mocks.import).not.toHaveBeenCalled();
  });
  it("returns a receipt only after verifying persisted hashes", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      ok: true,
      verified: true,
      students: 1,
      reports: [{ code: "00001234", hash: "b".repeat(64) }],
    });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
  it("does not report success on a readback mismatch", async () => {
    mocks.saved.mockResolvedValue([]);
    expect((await POST(request())).status).toBe(409);
  });
  it("stops imports when the distributed counter fails", async () => {
    mocks.limit.mockResolvedValue({ success: false, limit: 0 });
    expect((await POST(request())).status).toBe(503);
    expect(mocks.import).not.toHaveBeenCalled();
  });
});
