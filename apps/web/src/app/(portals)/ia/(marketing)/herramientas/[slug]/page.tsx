import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // TODO: Get all tool slugs from registry for static generation
  // For now, return empty array - will use dynamic rendering
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // TODO: Implement getToolBySlug function
  // For now, create generic metadata
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";
  const canonicalUrl = `${baseUrl}/ia/herramientas/${slug}`;
  
  // TODO: Replace with real tool data from registry
  const toolName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${toolName} | Herramientas IA | AquatechIA`,
    description: `Explora ${toolName}, una herramienta interactiva de inteligencia artificial para el aprendizaje y análisis. Desarrollada por AquatechIA.`,
    keywords: [
      "herramientas IA",
      slug,
      "inteligencia artificial",
      "aprendizaje interactivo",
      "educación IA",
    ],
    openGraph: {
      title: `${toolName} | Herramientas IA`,
      description: `Herramienta interactiva de inteligencia artificial: ${toolName}`,
      type: "website",
      locale: "es_ES",
      url: canonicalUrl,
      siteName: "AquatechIA",
      images: [
        {
          url: `${baseUrl}/images/og-image-ia.jpg`,
          width: 1200,
          height: 630,
          alt: `${toolName} - Herramienta IA de AquatechIA`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${toolName} | AquatechIA`,
      description: `Herramienta educativa de inteligencia artificial`,
      images: [`${baseUrl}/images/og-image-ia.jpg`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function IAHerramientaPage({ params }: Props) {
  const { slug } = await params;
  
  // TODO: Validate that slug exists in IA tools registry
  // TODO: If it doesn't exist, call notFound()
  // const tool = getToolBySlug("ia", slug);
  // if (!tool) notFound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Herramienta IA: {slug}
      </h1>
      
      <div className="max-w-2xl text-center space-y-4">
        <p className="text-gray-600">
          Esta herramienta está siendo desarrollada. Pronto estará disponible.
        </p>
        
        {/* TODO: Breadcrumbs */}
        {/* TODO: ToolDetailShell con iframe */}
        {/* TODO: Handshake postMessage */}
        {/* TODO: Estados: loading, error, retry */}
      </div>
    </div>
  );
}
