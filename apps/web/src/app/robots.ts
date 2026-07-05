import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com").trim().replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/auth/",
          "/perfil",
          "/*.json$",
          "/*?*", // Disallow URLs with query parameters by default
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
