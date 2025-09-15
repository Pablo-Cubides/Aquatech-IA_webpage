import type { Metadata } from "next";
import { ProfileSection } from "../../../../../components/auth";

export const metadata: Metadata = {
  title: "Perfil | Aquatech IA",
  description:
    "Gestiona tu perfil y configuración personal en el portal de IA.",
  robots: "noindex", // Página privada
};

export default function IAPerfilPage() {
  return <ProfileSection portal="ia" />;
}
