import { Metadata } from "next";
import { getAllArticles } from "@/lib/blog-articles";
import { getCategories } from "@/lib/blog-categories";
import { BlogContent } from "@/components/blog/BlogContent";

// SEO Metadata
export const metadata: Metadata = {
  title: "Blog de IA | Inteligencia Artificial, Machine Learning y LLM",
  description:
    "Guías, tutoriales y análisis sobre inteligencia artificial. LLM, ChatGPT, Stable Diffusion, productividad con IA y fundamentos de machine learning.",
  keywords: [
    "blog inteligencia artificial",
    "IA",
    "machine learning",
    "LLM",
    "ChatGPT",
    "Stable Diffusion",
    "deep learning",
    "productividad IA",
  ],
  alternates: {
    canonical: "https://aquatechia.com/ia/blog",
  },
  openGraph: {
    title: "Blog de IA | AquatechIA",
    description:
      "Guías, tutoriales y análisis sobre inteligencia artificial, machine learning y tecnologías emergentes.",
    url: "https://aquatechia.com/ia/blog",
    type: "website",
    siteName: "AquatechIA - Portal IA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de IA | AquatechIA",
    description:
      "Guías, tutoriales y análisis sobre inteligencia artificial, machine learning y tecnologías emergentes.",
  },
};

// JSON-LD Schema for Blog
function generateBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de IA - AquatechIA",
    description:
      "Guías, tutoriales y análisis sobre inteligencia artificial, machine learning y tecnologías emergentes.",
    url: "https://aquatechia.com/ia/blog",
    publisher: {
      "@type": "Organization",
      name: "AquatechIA",
      logo: {
        "@type": "ImageObject",
        url: "https://aquatechia.com/images/logo.png",
      },
    },
  };
}

export default function BlogIAPage() {
  const articles = getAllArticles("ia");
  const categories = getCategories("ia");
  const blogSchema = generateBlogSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />
      <BlogContent articles={articles} categories={categories} portal="ia" />
    </>
  );
}
