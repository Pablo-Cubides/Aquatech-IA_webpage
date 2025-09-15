import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // TODO: Obtener datos de la herramienta desde el registry
  return {
    title: `${params.slug} | Herramientas IA`,
    description: `Explora la herramienta ${params.slug} de inteligencia artificial.`,
  };
}

export default function IAHerramientaPage({ params }: Props) {
  // TODO: Validar que el slug existe en el registry de herramientas IA
  // TODO: Si no existe, llamar notFound()

  return (
    <div>
      <h1>Herramienta IA: {params.slug}</h1>
      {/* TODO: Breadcrumbs */}
      {/* TODO: ToolDetailShell con iframe */}
      {/* TODO: Handshake postMessage */}
      {/* TODO: Estados: loading, error, retry */}
    </div>
  );
}
