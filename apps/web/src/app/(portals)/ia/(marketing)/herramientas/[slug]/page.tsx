import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getToolBySlug,
  iaTools,
} from "@/lib/services/tools-registry";
import {
  ToolStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/StructuredData";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params from the IA tools registry
export async function generateStaticParams() {
  return iaTools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug, "ia");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";
  const canonicalUrl = `${baseUrl}/ia/herramientas/${slug}`;

  if (!tool) {
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
          alt: `${tool.name} - Herramienta IA de AquatechIA`,
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

export default async function IAHerramientaPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug, "ia");

  // 404 if tool doesn't exist in IA registry
  if (!tool) {
    notFound();
  }

  // Determine if tool has internal route or external URL
  const isInternal = tool.url.startsWith("/");
  const toolUrl = isInternal ? tool.url : tool.url;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";
  const canonicalUrl = `${baseUrl}/ia/herramientas/${slug}`;

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* JSON-LD Structured Data for SEO */}
      <ToolStructuredData
        name={tool.name}
        description={tool.description}
        url={canonicalUrl}
        keywords={tool.seo.keywords}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Inicio", url: `${baseUrl}/ia` },
          { name: "Herramientas", url: `${baseUrl}/ia/herramientas` },
          { name: tool.name, url: canonicalUrl },
        ]}
      />

      {/* Breadcrumbs */}
      <nav
        className="bg-[#10111A] border-b border-[rgba(0,239,255,0.1)] py-4"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-[#CCCCCC]">
            <li>
              <Link
                href="/ia"
                className="hover:text-[#00efff] transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li>
              <svg
                className="w-4 h-4 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <Link
                href="/ia/herramientas"
                className="hover:text-[#00efff] transition-colors"
              >
                Herramientas
              </Link>
            </li>
            <li>
              <svg
                className="w-4 h-4 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="text-[#00efff] font-medium">{tool.name}</li>
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
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : tool.status === "beta"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}
            >
              {tool.status === "stable"
                ? "✓ Estable"
                : tool.status === "beta"
                  ? "⚡ Beta"
                  : "⚠️ Deprecado"}
            </span>
            <span className="text-[#CCCCCC] text-sm">v{tool.version}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-[#00efff] bg-clip-text text-transparent mb-4">
            {tool.name}
          </h1>
          <p className="text-lg text-[#CCCCCC] mb-8 max-w-2xl mx-auto">
            {tool.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isInternal ? (
              <Link
                href={toolUrl}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
                Abrir herramienta
              </Link>
            ) : (
              <a
                href={toolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Abrir en nueva ventana
              </a>
            )}
            <Link
              href="/ia/herramientas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[rgba(0,239,255,0.3)] text-[#00efff] rounded-lg font-semibold hover:bg-[rgba(0,239,255,0.1)] transition-colors"
            >
              ← Ver todas las herramientas
            </Link>
          </div>
        </div>
      </header>

      {/* Tool Info Cards */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-[#1a1b2e]/50 backdrop-blur-sm rounded-xl p-6 border border-[rgba(0,239,255,0.1)]">
            <div className="text-[#00efff] mb-2">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Tipo</h3>
            <p className="text-[#CCCCCC]">
              {tool.type === "public" ? "Acceso público" : "Acceso privado"}
            </p>
          </div>
          <div className="bg-[#1a1b2e]/50 backdrop-blur-sm rounded-xl p-6 border border-[rgba(0,239,255,0.1)]">
            <div className="text-[#00efff] mb-2">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Desarrollador
            </h3>
            <p className="text-[#CCCCCC]">{tool.owner}</p>
          </div>
          <div className="bg-[#1a1b2e]/50 backdrop-blur-sm rounded-xl p-6 border border-[rgba(0,239,255,0.1)]">
            <div className="text-[#00efff] mb-2">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Portal</h3>
            <p className="text-[#CCCCCC]">
              {tool.portal === "ia"
                ? "Inteligencia Artificial"
                : "Ambiental"}
            </p>
          </div>
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">
            Temas relacionados
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {tool.seo.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#1a1b2e]/50 text-[#CCCCCC] rounded-full text-sm border border-[rgba(0,239,255,0.1)] hover:border-[rgba(0,239,255,0.3)] transition-colors"
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
