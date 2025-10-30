import { describe, it, expect } from "vitest";
import {
  getToolsByPortal,
  getToolBySlug,
  isValidToolSlug,
  iaTools,
  ambientalTools,
} from "@/lib/services/tools-registry";

describe("getToolsByPortal", () => {
  it('should return IA tools for "ia" portal', () => {
    const tools = getToolsByPortal("ia");

    expect(tools).toHaveLength(iaTools.length);
    expect(tools).toEqual(iaTools);
  });

  it('should return Environmental tools for "ambiental" portal', () => {
    const tools = getToolsByPortal("ambiental");

    expect(tools).toHaveLength(ambientalTools.length);
    expect(tools).toEqual(ambientalTools);
  });

  it("should return array of tools with required properties", () => {
    const iaToolsList = getToolsByPortal("ia");

    iaToolsList.forEach((tool) => {
      expect(tool).toHaveProperty("slug");
      expect(tool).toHaveProperty("name");
      expect(tool).toHaveProperty("description");
      expect(tool).toHaveProperty("type");
      expect(tool).toHaveProperty("url");
      expect(tool).toHaveProperty("owner");
      expect(tool).toHaveProperty("version");
      expect(tool).toHaveProperty("status");
      expect(tool).toHaveProperty("portal");
      expect(tool).toHaveProperty("seo");
    });
  });

  it("should return different arrays for different portals", () => {
    const iaToolsList = getToolsByPortal("ia");
    const ambientalToolsList = getToolsByPortal("ambiental");

    expect(iaToolsList).not.toEqual(ambientalToolsList);
  });

  it("should return all tools with valid status", () => {
    const iaToolsList = getToolsByPortal("ia");
    const ambientalToolsList = getToolsByPortal("ambiental");

    const allTools = [...iaToolsList, ...ambientalToolsList];

    allTools.forEach((tool) => {
      expect(["beta", "stable", "active", "maintenance"]).toContain(
        tool.status,
      );
    });
  });
});

describe("getToolBySlug", () => {
  it("should return correct IA tool by slug", () => {
    const tool = getToolBySlug("como-funciona-llm", "ia");

    expect(tool).toBeDefined();
    expect(tool?.slug).toBe("como-funciona-llm");
    expect(tool?.name).toContain("LLM");
  });

  it("should return correct Environmental tool by slug", () => {
    const tool = getToolBySlug("visor-mapas-ambientales", "ambiental");

    expect(tool).toBeDefined();
    expect(tool?.slug).toBe("visor-mapas-ambientales");
    expect(tool?.name).toContain("mapas");
  });

  it("should return null for non-existent slug", () => {
    const tool = getToolBySlug("non-existent-tool", "ia");

    expect(tool).toBeNull();
  });

  it("should return null when searching IA tool in ambiental portal", () => {
    const tool = getToolBySlug("como-funciona-llm", "ambiental");

    expect(tool).toBeNull();
  });

  it("should return null when searching Environmental tool in IA portal", () => {
    const tool = getToolBySlug("visor-mapas-ambientales", "ia");

    expect(tool).toBeNull();
  });

  it("should be case-sensitive", () => {
    const tool = getToolBySlug("COMO-FUNCIONA-LLM", "ia");

    expect(tool).toBeNull();
  });

  it("should handle empty string slug", () => {
    const tool = getToolBySlug("", "ia");

    expect(tool).toBeNull();
  });
});

describe("isValidToolSlug", () => {
  it("should return true for valid IA tool slug", () => {
    const isValid = isValidToolSlug("como-funciona-llm", "ia");

    expect(isValid).toBe(true);
  });

  it("should return true for valid Environmental tool slug", () => {
    const isValid = isValidToolSlug("visor-mapas-ambientales", "ambiental");

    expect(isValid).toBe(true);
  });

  it("should return false for non-existent slug", () => {
    const isValid = isValidToolSlug("non-existent-tool", "ia");

    expect(isValid).toBe(false);
  });

  it("should return false for wrong portal", () => {
    const isValid = isValidToolSlug("como-funciona-llm", "ambiental");

    expect(isValid).toBe(false);
  });

  it("should return false for empty string", () => {
    const isValid = isValidToolSlug("", "ia");

    expect(isValid).toBe(false);
  });

  it("should be case-sensitive", () => {
    const isValid = isValidToolSlug("COMO-FUNCIONA-LLM", "ia");

    expect(isValid).toBe(false);
  });
});

describe("iaTools registry", () => {
  it("should contain expected tools", () => {
    expect(iaTools.length).toBeGreaterThanOrEqual(3);

    const slugs = iaTools.map((tool) => tool.slug);

    expect(slugs).toContain("como-funciona-llm");
    expect(slugs).toContain("sistema-de-difusion");
    expect(slugs).toContain("filtros-ia-respuestas");
  });

  it("should have unique slugs", () => {
    const slugs = iaTools.map((tool) => tool.slug);
    const uniqueSlugs = new Set(slugs);

    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it("should have all required SEO fields", () => {
    iaTools.forEach((tool) => {
      expect(tool.seo).toBeDefined();
      expect(tool.seo.title).toBeTruthy();
      expect(tool.seo.description).toBeTruthy();
      expect(tool.seo.keywords).toBeInstanceOf(Array);
      expect(tool.seo.keywords.length).toBeGreaterThan(0);
    });
  });

  it("should have valid URLs", () => {
    iaTools.forEach((tool) => {
      expect(tool.url).toBeTruthy();
      // URLs can be either relative (starting with /) or absolute (https://)
      expect(tool.url).toMatch(/^(\/|https:\/\/)/);
    });
  });

  it("should have valid type", () => {
    iaTools.forEach((tool) => {
      expect([
        "public",
        "interactive",
        "visualization",
        "calculator",
        "simulator",
      ]).toContain(tool.type);
    });
  });
});

describe("ambientalTools registry", () => {
  it("should contain expected tools", () => {
    expect(ambientalTools.length).toBeGreaterThanOrEqual(4);

    const slugs = ambientalTools.map((tool) => tool.slug);

    expect(slugs).toContain("visor-mapas-ambientales");
    expect(slugs).toContain("normas-ambientales");
    expect(slugs).toContain("generador-matrices");
    expect(slugs).toContain("analisis-correlaciones");
  });

  it("should have unique slugs", () => {
    const slugs = ambientalTools.map((tool) => tool.slug);
    const uniqueSlugs = new Set(slugs);

    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it("should have all required SEO fields", () => {
    ambientalTools.forEach((tool) => {
      expect(tool.seo).toBeDefined();
      expect(tool.seo.title).toBeTruthy();
      expect(tool.seo.description).toBeTruthy();
      expect(tool.seo.keywords).toBeInstanceOf(Array);
      expect(tool.seo.keywords.length).toBeGreaterThan(0);
    });
  });

  it("should have valid URLs", () => {
    ambientalTools.forEach((tool) => {
      expect(tool.url).toBeTruthy();
      // URLs can be either relative (starting with /) or absolute (https://)
      expect(tool.url).toMatch(/^(\/|https:\/\/)/);
    });
  });

  it("should have valid type", () => {
    ambientalTools.forEach((tool) => {
      expect([
        "public",
        "interactive",
        "visualization",
        "calculator",
        "simulator",
      ]).toContain(tool.type);
    });
  });
});

describe("Cross-portal slug uniqueness", () => {
  it("should not have duplicate slugs across portals", () => {
    const iaSlugs = iaTools.map((tool) => tool.slug);
    const ambientalSlugs = ambientalTools.map((tool) => tool.slug);

    const duplicates = iaSlugs.filter((slug) => ambientalSlugs.includes(slug));

    expect(duplicates).toHaveLength(0);
  });
});
