import type { Metadata } from "next";
import { ProfileSection } from "../../../../../components/auth";

export const metadata: Metadata = {
  title: "Perfil | Aquatech Ambiental",
  description:
    "Gestiona tu perfil y configuración personal en el portal ambiental.",
  robots: "noindex", // Página privada
};

export default function AmbientalPerfilPage() {
  return <ProfileSection portal="ambiental" />;
}
