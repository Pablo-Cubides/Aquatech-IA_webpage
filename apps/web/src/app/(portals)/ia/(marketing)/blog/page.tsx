import { safeJsonLd } from "@/lib/security/safe-json-ld";
import { Metadata } from "next";
import { getAllArticles } from "@/lib/blog-articles";
import { getCategories } from "@/lib/blog-categories";
import { BlogContent } from "@/components/blog/BlogContent";
import { FAQStructuredData } from "@/components/seo/StructuredData";
import { AuthoritativeReferences } from "@/components/seo/AuthoritativeReferences";
import { IA_OFFICIAL_RESOURCES, OFFICIAL_RESOURCES_SUBTITLE, OFFICIAL_RESOURCES_TITLE } from "@/components/seo/official-resources";
import { SITE_URL, DEFAULT_LOGO } from "@/lib/site-config";

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
    images: [{ url: "https://aquatechia.com/images/og-image-ia.jpg", width: 1200, height: 630 }],
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

const blogIAFaqs = [
  {
    question: "¿Qué temas cubre el Blog de Inteligencia Artificial de Aquatech IA?",
    answer: "Cubre diseño e implementación de modelos de lenguaje grande (LLM), arquitecturas de recuperación aumentada (RAG), ingeniería de prompts, integración de APIs neuronales y marcos éticos y normativos para IA empresarial.",
  },
  {
    question: "¿Con qué frecuencia se publican nuevos artículos y guías de IA?",
    answer: "Publicamos artículos semanales y actualizaciones técnicas periódicas conforme evolucionan los modelos fundacionales y las mejores prácticas de la industria.",
  },
  {
    question: "¿Los tutoriales incluyen código y demostraciones prácticas?",
    answer: "Sí, todos los tutoriales técnicos incluyen fragmentos de código reproducibles en Python y TypeScript, parámetros de inferencia y diagramas de arquitectura de sistemas.",
  },
];

// JSON-LD Schema for Blog
function generateBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de IA - AquatechIA",
    description:
      "Guías, tutoriales y análisis sobre inteligencia artificial, machine learning y tecnologías emergentes.",
    url: `${SITE_URL}/ia/blog`,
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

export const revalidate = 3600; // 1h: antes 60s (CPU por regeneraciones constantes)

export default async function BlogIAPage() {

  const articles = await getAllArticles("ia");
  const categories = getCategories("ia");
  const blogSchema = generateBlogSchema();


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(blogSchema),
        }}
      />
      <FAQStructuredData faqs={blogIAFaqs} />
      <BlogContent articles={articles} categories={categories} portal="ia" />
      <div className="bg-[#10111A] py-12 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <AuthoritativeReferences
            sources={IA_OFFICIAL_RESOURCES}
            title={OFFICIAL_RESOURCES_TITLE}
            subtitle={OFFICIAL_RESOURCES_SUBTITLE}
            theme="dark"
          />
        </div>
      </div>
    </>
  );
}
