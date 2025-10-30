import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildAffiliateUrl,
  trackViewList,
  trackAffiliateClick,
} from "@/lib/track-env";
import type { Resource } from "@/lib/types-env";

describe("buildAffiliateUrl", () => {
  const mockResource: Resource = {
    id: "1",
    slug: "test-course",
    type: "course",
    title: "Test Course",
    description: "Test description",
    language: "es",
    topics: ["test"],
    platform: "Udemy",
    affiliate_url: "https://example.com/course?id=123",
    images: [{ src: "/test.jpg", alt: "test" }],
  };

  const ctx = {
    site: "ia-portal",
    campaign: "summer-2024",
  };

  it("should add UTM parameters to URL", () => {
    const result = buildAffiliateUrl(mockResource, ctx);
    const url = new URL(result);

    expect(url.searchParams.get("utm_source")).toBe("udemy");
    expect(url.searchParams.get("utm_medium")).toBe("affiliate");
    expect(url.searchParams.get("utm_campaign")).toBe("ia-portal-summer-2024");
    expect(url.searchParams.get("utm_content")).toBe("test-course");
  });

  it("should preserve existing query parameters", () => {
    const result = buildAffiliateUrl(mockResource, ctx);
    const url = new URL(result);

    expect(url.searchParams.get("id")).toBe("123");
  });

  it("should add Amazon tag for Amazon platform", () => {
    const amazonResource: Resource = {
      ...mockResource,
      platform: "Amazon",
      affiliate_url: "https://amazon.com/dp/123",
    };

    const result = buildAffiliateUrl(amazonResource, ctx);
    const url = new URL(result);

    expect(url.searchParams.get("tag")).toBe("aquaportal-20");
  });

  it("should not override existing Amazon tag", () => {
    const amazonResource: Resource = {
      ...mockResource,
      platform: "Amazon",
      affiliate_url: "https://amazon.com/dp/123?tag=existing-tag",
    };

    const result = buildAffiliateUrl(amazonResource, ctx);
    const url = new URL(result);

    expect(url.searchParams.get("tag")).toBe("existing-tag");
  });

  it("should convert platform name to lowercase", () => {
    const result = buildAffiliateUrl(
      { ...mockResource, platform: "CoursEra" },
      ctx,
    );
    const url = new URL(result);

    expect(url.searchParams.get("utm_source")).toBe("coursera");
  });

  it("should handle platform names with spaces", () => {
    const result = buildAffiliateUrl(
      { ...mockResource, platform: "LinkedIn Learning" },
      ctx,
    );
    const url = new URL(result);

    expect(url.searchParams.get("utm_source")).toBe("linkedin learning");
  });
});

describe("trackViewList", () => {
  beforeEach(() => {
    // Mock window.gtag
    global.window = {
      gtag: vi.fn(),
    } as any;
  });

  const mockResources: Resource[] = Array.from({ length: 15 }, (_, i) => ({
    id: `${i + 1}`,
    slug: `item-${i + 1}`,
    type: "course" as const,
    title: `Course ${i + 1}`,
    description: "Test",
    language: "es" as const,
    topics: ["test"],
    platform: "Udemy",
    affiliate_url: "https://test.com",
    price: i * 10,
    rating_value: 4.5,
    images: [{ src: "/test.jpg", alt: "test" }],
  }));

  it("should call gtag with correct event name", () => {
    trackViewList(mockResources);

    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "view_item_list",
      expect.any(Object),
    );
  });

  it("should limit items to 12", () => {
    trackViewList(mockResources);

    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "view_item_list",
      expect.objectContaining({
        items: expect.arrayContaining([]),
      }),
    );

    const call = (window.gtag as any).mock.calls[0];
    expect(call[2].items).toHaveLength(12);
  });

  it("should include correct item data", () => {
    trackViewList(mockResources);

    const call = (window.gtag as any).mock.calls[0];
    const firstItem = call[2].items[0];

    expect(firstItem).toEqual({
      item_id: "1",
      item_name: "Course 1",
      item_category: "course",
      platform: "Udemy",
      price: 0,
      rating: 4.5,
      index: 0,
    });
  });

  it("should handle missing price and rating", () => {
    const resourcesWithoutData: Resource[] = [
      {
        ...mockResources[0],
        price: undefined,
        rating_value: undefined,
      },
    ];

    trackViewList(resourcesWithoutData);

    const call = (window.gtag as any).mock.calls[0];
    const firstItem = call[2].items[0];

    expect(firstItem.price).toBeNull();
    expect(firstItem.rating).toBeNull();
  });

  it("should not call gtag in server-side environment", () => {
    const originalWindow = global.window;
    // @ts-ignore
    global.window = undefined;

    trackViewList(mockResources);

    // Restore window
    global.window = originalWindow;
  });

  it("should not call gtag if gtag function is not available", () => {
    global.window = {} as any;

    expect(() => trackViewList(mockResources)).not.toThrow();
  });
});

describe("trackAffiliateClick", () => {
  beforeEach(() => {
    global.window = {
      gtag: vi.fn(),
    } as any;
  });

  const mockResource: Resource = {
    id: "1",
    slug: "test-course",
    type: "course",
    title: "Test Course",
    description: "Test",
    language: "es",
    topics: ["test"],
    platform: "Udemy",
    affiliate_url: "https://test.com",
    images: [{ src: "/test.jpg", alt: "test" }],
  };

  it("should call gtag with correct event name", () => {
    trackAffiliateClick(mockResource);

    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "click_affiliate",
      expect.any(Object),
    );
  });

  it("should include correct resource data", () => {
    trackAffiliateClick(mockResource);

    expect(window.gtag).toHaveBeenCalledWith("event", "click_affiliate", {
      item_id: "1",
      item_name: "Test Course",
      item_category: "course",
      platform: "Udemy",
    });
  });

  it("should handle server-side environment", () => {
    const originalWindow = global.window;
    // @ts-ignore
    global.window = undefined;

    trackAffiliateClick(mockResource);

    global.window = originalWindow;
  });

  it("should not throw if gtag is not available", () => {
    global.window = {} as any;

    expect(() => trackAffiliateClick(mockResource)).not.toThrow();
  });
});
