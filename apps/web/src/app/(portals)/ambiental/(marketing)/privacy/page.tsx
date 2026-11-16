import type { Metadata } from "next";
import PrivacyContent from "@/components/legal/PrivacyContent";

export const metadata: Metadata = {
  title: "Política de Privacidad | AquatechIA Ambiental",
  description:
    "Política de privacidad y protección de datos personales de AquatechIA: qué datos tratamos, para qué, por cuánto tiempo y cómo ejercer tus derechos.",
  robots: "index, follow",
};

// Mismo contenido legal que el portal IA, compartido desde components/legal
export default PrivacyContent;
