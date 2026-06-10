import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, ambientalTools } from "@/lib/services/tools-registry";
import {
  ToolStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/StructuredData";

interface Props {
  params: Promise<{ slug: string }>;
}

// Exclude these slugs that have their own folder routes
const EXCLUDED_SLUGS = [
  "generador-matrices",
  "analisis-correlaciones",
  "normas-ambientales",
  "visor-mapas-ambientales",
];

// Generate static params from the environmental tools registry
export async function generateStaticParams() {
  return ambientalTools
    .filter((tool) => !EXCLUDED_SLUGS.includes(tool.slug))
    .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug, "ambiental");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";
  const canonicalUrl = `${baseUrl}/ambiental/herramientas/${slug}`;

  if (!tool || EXCLUDED_SLUGS.includes(slug)) {
    return {
      title: "Herramienta no encontrada | AquatechIA",
      description: "La herramienta solicitada no está disponible.",
    };
  }

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      type: "website",
      locale: "es_ES",
      url: canonicalUrl,
      siteName: "AquatechIA",
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${tool.name} - Herramienta Ambiental de AquatechIA`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.name,
      description: tool.seo.description,
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AmbientalHerramientaPage({ params }: Props) {
  const { slug } = await params;

  // Excluded slugs are served by their own folder routes
  if (EXCLUDED_SLUGS.includes(slug)) {
    notFound();
  }

  const tool = getToolBySlug(slug, "ambiental");

  // 404 if tool doesn't exist in the environmental registry
  if (!tool) {
    notFound();
  }

  const isInternal = tool.url.startsWith("/");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";
  const canonicalUrl = `${baseUrl}/ambiental/herramientas/${slug}`;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* JSON-LD Structured Data for SEO */}
      <ToolStructuredData
        name={tool.name}
        description={tool.description}
        url={canonicalUrl}
        keywords={tool.seo.keywords}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Inicio", url: `${baseUrl}/ambiental` },
          { name: "Herramientas", url: `${baseUrl}/ambiental/herramientas` },
          { name: tool.name, url: canonicalUrl },
        ]}
      />

      {/* Breadcrumbs */}
      <nav
        className="bg-emerald-50 border-b border-emerald-100 py-4"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li>
              <Link
                href="/ambiental"
                className="hover:text-emerald-600 transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/ambiental/herramientas"
                className="hover:text-emerald-600 transition-colors"
              >
                Herramientas
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-emerald-700 font-medium">{tool.name}</li>
          </ol>
        </div>
      </nav>

      {/* Tool Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                tool.status === "stable"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : tool.status === "beta"
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {tool.status === "stable"
                ? "✓ Estable"
                : tool.status === "beta"
                  ? "⚡ Beta"
                  : "⚠️ Deprecado"}
            </span>
            <span className="text-slate-500 text-sm">v{tool.version}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {tool.name}
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            {tool.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isInternal ? (
              <Link
                href={tool.url}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Abrir herramienta
              </Link>
            ) : (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Abrir en nueva ventana
              </a>
            )}
            <Link
              href="/ambiental/herramientas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-emerald-300 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              ← Ver todas las herramientas
            </Link>
          </div>
        </div>
      </header>

      {/* Tool Info Cards */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-emerald-50/60 rounded-xl p-6 border border-emerald-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Tipo</h3>
            <p className="text-slate-600">
              {tool.type === "public" ? "Acceso público" : "Acceso privado"}
            </p>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-6 border border-emerald-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Desarrollador
            </h3>
            <p className="text-slate-600">{tool.owner}</p>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-6 border border-emerald-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Portal
            </h3>
            <p className="text-slate-600">Gestión Ambiental</p>
          </div>
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
            Temas relacionados
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {tool.seo.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-emerald-50 text-slate-600 rounded-full text-sm border border-emerald-100"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
