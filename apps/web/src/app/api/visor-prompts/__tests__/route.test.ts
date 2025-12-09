import { describe, it, expect } from "vitest";
import { GET } from "../route";

describe("visor-prompts API", () => {
  it("should return an array of prompts", async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("should return prompts with required fields", async () => {
    const response = await GET();
    const data = await response.json();

    data.forEach((prompt: { id: string; title: string; prompt: string }) => {
      expect(prompt).toHaveProperty("id");
      expect(prompt).toHaveProperty("title");
      expect(prompt).toHaveProperty("prompt");
      expect(typeof prompt.id).toBe("string");
      expect(typeof prompt.title).toBe("string");
      expect(typeof prompt.prompt).toBe("string");
    });
  });

  it("should include known cases", async () => {
    const response = await GET();
    const data = await response.json();

    const ids = data.map((p: { id: string }) => p.id);

    expect(ids).toContain("1");
    expect(ids).toContain("flux-1");
    expect(ids).toContain("stable-diffusion");
  });

  it("should return 200 status code", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
  });

  it("should return valid JSON", async () => {
    const response = await GET();
    const contentType = response.headers.get("content-type");

    expect(contentType).toContain("application/json");
  });
});
