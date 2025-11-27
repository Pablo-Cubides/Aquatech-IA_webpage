import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // TODO: Get tool data from registry
  return {
    title: `${params.slug} | Herramientas IA`,
    description: `Explora la herramienta ${params.slug} de inteligencia artificial.`,
  };
}

export default function IAHerramientaPage({ params }: Props) {
  // TODO: Validate that slug exists in IA tools registry
  // TODO: If it doesn't exist, call notFound()

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
