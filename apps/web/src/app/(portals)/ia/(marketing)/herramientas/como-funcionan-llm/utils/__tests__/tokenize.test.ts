import { describe, it, expect } from "vitest";

describe("tokenize", () => {
  it("should split simple spanish sentence into tokens", async () => {
    const { tokenize } = await import("../llm-simulation");
    const text = "Los pájaros vuelan, porque tienen alas.";
    const tokens = tokenize(text);
    expect(tokens).toContain("Los");
    expect(tokens).toContain("pájaros");
    expect(tokens).toContain("vuelan");
    expect(tokens).toContain("porque");
    expect(tokens).toContain("tienen");
    expect(tokens).toContain("alas");
  });
});
