import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { AI_CRAWLERS, PRIVATE_PATHS } from "@/lib/seo/robots-rules";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
