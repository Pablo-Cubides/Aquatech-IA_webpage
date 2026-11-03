import { beforeEach, describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({
  account: vi.fn(),
  import: vi.fn(),
  limit: vi.fn(),
}));
vi.mock("@/lib/aquaquiz", () => ({ getAquaQuizAccount: mocks.account }));
vi.mock("@/lib/grade-reports", () => ({ importGradeReports: mocks.import }));
vi.mock("@ia-next/database", () => ({ prisma: {} }));
vi.mock("@/lib/grade-request-limit", () => ({
  limitGradeRequest: mocks.limit,
  getClientIP: () => "127.0.0.1",
}));
import { POST } from "./route";
const request = (body: unknown) =>
  new NextRequest("http://localhost/api/grade-reports/import", {
    method: "POST",
    body: JSON.stringify(body),
  });
beforeEach(() => {
  mocks.limit.mockResolvedValue({ success: true });
});
describe("grade import authorization", () => {
  it("blocks unauthenticated and non-admin users without importing", async () => {
    mocks.account.mockResolvedValue(null);
    expect((await POST(request({}))).status).toBe(401);
    mocks.account.mockResolvedValue({ id: "student", role: "USER" });
    expect((await POST(request({}))).status).toBe(403);
    expect(mocks.import).not.toHaveBeenCalled();
  });
  it("passes explicit publication only for an administrator", async () => {
    mocks.account.mockResolvedValue({ id: "teacher", role: "ADMIN" });
    mocks.import.mockResolvedValue({ students: 24, changed: 24 });
    const result = await POST(
      request({ batch: { kind: "test" }, publish: true }),
    );
    expect(result.status).toBe(200);
    expect(result.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.import).toHaveBeenCalledWith({}, { kind: "test" }, true);
  });
  it("rejects a non-boolean publish flag", async () => {
    mocks.account.mockResolvedValue({ id: "teacher", role: "ADMIN" });
    expect((await POST(request({ batch: {}, publish: "true" }))).status).toBe(
      400,
    );
    expect(mocks.import).not.toHaveBeenCalled();
  });
});
