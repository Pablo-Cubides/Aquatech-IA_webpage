import { describe, it, expect } from "vitest";
import { GET } from "../route";

describe("/api/noise/[step]", () => {
  it("should return a response for noise endpoint", async () => {
    const mockParams = Promise.resolve({ step: "2" });
    const mockRequest = {} as any;

    const response = await GET(mockRequest, { params: mockParams });
    expect(response).toBeDefined();
    expect([200, 404]).toContain(response.status);
  });

  it("should return 404 for invalid step", async () => {
    const mockParams = Promise.resolve({ step: "15" }); // Invalid step
    const mockRequest = {} as any;

    const response = await GET(mockRequest, { params: mockParams });
    expect(response.status).toBe(404);
  });
});
