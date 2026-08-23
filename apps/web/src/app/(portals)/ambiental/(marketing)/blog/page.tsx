import { Metadata } from "next";
import { getAllArticles } from "@/lib/blog-articles";
import { getCategories } from "@/lib/blog-categories";
import { BlogContent } from "@/components/blog/BlogContent";

// SEO Metadata
export const metadata: Metadata = {
  title: "Blog Ambiental | Artículos sobre Medio Ambiente y Sostenibilidad",
  description:
    "Artículos, análisis y soluciones innovadoras para los desafíos ambientales. Normatividad, gestión ambiental, control de contaminación y tecnologías verdes.",
  keywords: [
    "blog ambiental",
    "medio ambiente",
    "sostenibilidad",
    "normativa ambiental",
    "gestión ambiental",
    "contaminación",
    "tecnología verde",
  ],
  alternates: {
    canonical: "https://aquatechia.com/ambiental/blog",
  },
  openGraph: {
    title: "Blog Ambiental | AquatechIA",
    description:
      "Artículos, análisis y soluciones innovadoras para los desafíos ambientales del siglo XXI.",
    url: "https://aquatechia.com/ambiental/blog",
    type: "website",
    siteName: "AquatechIA - Portal Ambiental",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Ambiental | AquatechIA",
    description:
      "Artículos, análisis y soluciones innovadoras para los desafíos ambientales del siglo XXI.",
  },
};

import { SITE_URL, DEFAULT_LOGO } from "@/lib/site-config";

// JSON-LD Schema for Blog
function generateBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Ambiental - AquatechIA",
    description:
      "Artículos, análisis y soluciones innovadoras para los desafíos ambientales.",
    url: `${SITE_URL}/ambiental/blog`,
    publisher: {
      "@type": "Organization",
      name: "AquatechIA",
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_LOGO,
      },
    },
  };
}

export default function BlogAmbientalPage() {
  const articles = getAllArticles("ambiental");
  const categories = getCategories("ambiental");
  const blogSchema = generateBlogSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />
      <BlogContent
        articles={articles}
        categories={categories}
        portal="ambiental"
      />
    </>
  );
}



