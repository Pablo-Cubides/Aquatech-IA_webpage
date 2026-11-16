import type { Metadata } from "next";
import TermsContent from "@/components/legal/TermsContent";

export const metadata: Metadata = {
  title: "Términos de Servicio | AquatechIA Ambiental",
  description: "Términos y condiciones de uso de la plataforma AquatechIA: licencia, uso aceptable, propiedad intelectual y responsabilidades del usuario.",
  robots: "index, follow",
};

// Mismo contenido legal que el portal IA, compartido desde components/legal (la URL del JSON-LD sale del portal)
export default function Page() {
  return <TermsContent portal="ambiental" />;
}
