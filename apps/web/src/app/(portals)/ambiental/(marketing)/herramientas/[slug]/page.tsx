import { Metadata } from "next";
import { notFound } from "next/navigation";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // If this is an excluded slug, return 404 to let the folder route handle it
  if (EXCLUDED_SLUGS.includes(slug)) {
    return notFound();
  }

  // TODO: Obtener datos de la herramienta desde el registry
  return {
    title: `${slug} | Herramientas Ambientales`,
    description: `Explora la herramienta ${slug} para el cuidado ambiental.`,
  };
}

export default async function AmbientalHerramientaPage({ params }: Props) {
  const { slug } = await params;

  // If this is an excluded slug, show 404
  if (EXCLUDED_SLUGS.includes(slug)) {
    notFound();
  }

  // TODO: Validar que el slug existe en el registry de herramientas ambientales
  // TODO: Si no existe, llamar notFound()

  return (
    <div>
      <h1>Herramienta Ambiental: {slug}</h1>
      {/* TODO: Breadcrumbs */}
      {/* TODO: ToolDetailShell con iframe */}
      {/* TODO: Handshake postMessage */}
      {/* TODO: Estados: loading, error, retry */}
    </div>
  );
}
