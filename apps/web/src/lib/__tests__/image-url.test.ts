import { describe, expect, it } from "vitest";
import { optimizedImageUrl } from "../image-url";

describe("optimizedImageUrl", () => {
  it("agrega formato, calidad y ancho a una imagen original de Cloudinary", () => {
    expect(
      optimizedImageUrl("https://res.cloudinary.com/lv3hwy1f/image/upload/v1792694719/articulos/a/b.jpg", 800),
    ).toBe("https://res.cloudinary.com/lv3hwy1f/image/upload/f_auto,q_auto,w_800/v1792694719/articulos/a/b.jpg");
  });

  it("no toca una URL que ya trae transformaciones", () => {
    const url = "https://res.cloudinary.com/lv3hwy1f/image/upload/c_fill,w_300/v1/articulos/a/b.jpg";
    expect(optimizedImageUrl(url, 800)).toBe(url);
  });

  it("no toca imagenes que no son de Cloudinary", () => {
    expect(optimizedImageUrl("/images/portal-ia/hero.webp", 800)).toBe("/images/portal-ia/hero.webp");
    expect(optimizedImageUrl("https://images.unsplash.com/photo-1?w=400", 800)).toBe("https://images.unsplash.com/photo-1?w=400");
  });
});
