import { Metadata } from "next";
import { getAllArticles } from "@/lib/blog-articles";
import { getCategories } from "@/lib/blog-categories";
import { BlogContent } from "@/components/blog/BlogContent";
import { FAQStructuredData } from "@/components/seo/StructuredData";
import { AuthoritativeReferences } from "@/components/seo/AuthoritativeReferences";
import { SITE_URL, DEFAULT_LOGO } from "@/lib/site-config";

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

const blogAmbientalReferences = [
  {
    title: "Ministerio de Ambiente y Desarrollo Sostenible de Colombia",
    url: "https://www.minambiente.gov.co/",
    organization: "MinAmbiente Colombia",
    domain: "minambiente.gov.co",
  },
  {
    title: "Instituto de Hidrología, Meteorología y Estudios Ambientales (IDEAM)",
    url: "http://www.ideam.gov.co/",
    organization: "IDEAM",
    domain: "ideam.gov.co",
  },
  {
    title: "United Nations Environment Programme (UNEP)",
    url: "https://www.unep.org/",
    organization: "United Nations",
    domain: "unep.org",
  },
  {
    title: "USGS Water Resources Mission Area",
    url: "https://www.usgs.gov/mission-areas/water-resources",
    organization: "U.S. Geological Survey",
    domain: "usgs.gov",
  },
];

const blogAmbientalFaqs = [
  {
    question: "¿Qué contenido se analiza en el Blog Ambiental de Aquatech IA?",
    answer: "Trata sobre gestión integral del recurso hídrico, evaluación de impacto ambiental (EIA), normativa ambiental colombiana e internacional, monitoreo de cuencas hidrográficas y tecnologías de tratamiento y mitigación.",
  },
  {
    question: "¿Quién elabora y revisa los artículos técnicos ambientales?",
    answer: "Los contenidos son dirigidos y revisados por ingenieros químicos y magísteres en ingeniería ambiental con experiencia investigativa y docente en gestión de recursos hídricos.",
  },
  {
    question: "¿Cómo se fundamentan las publicaciones y normativas citadas?",
    answer: "Todos los análisis se respaldan en resoluciones y decretos vigentes del Ministerio de Ambiente, guías del IDEAM y publicaciones indexadas en ciencias ambientales.",
  },
];

// JSON-LD Schema for Blog
function generateBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Ambiental - AquatechIA",
    description:
      "Artículos, análisis y soluciones innovadoras para los desafíos ambientales.",
    url: `${SITE_URL}/ambiental/blog`,
    datePublished: "2024-01-01",
    dateModified: "2026-09-06",
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
      <FAQStructuredData faqs={blogAmbientalFaqs} />
      <BlogContent
        articles={articles}
        categories={categories}
        portal="ambiental"
      />
      <div className="bg-slate-50 py-12 px-4 border-t border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <AuthoritativeReferences customSources={blogAmbientalReferences} theme="light" />
        </div>
      </div>
    </>
  );
}



