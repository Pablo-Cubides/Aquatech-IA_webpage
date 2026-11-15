import type { Metadata } from "next";

export { default } from "@/app/(portals)/ia/(marketing)/autor/herramientas/proyectos-investigacion/[id]/page";

// Espejo de la pagina del Portal IA: la canonica apunta a ella.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { alternates: { canonical: `/ia/autor/herramientas/proyectos-investigacion/${encodeURIComponent(id)}` } };
}
