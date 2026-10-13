import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cursos de Gestión Ambiental y Sostenibilidad | AquatechIA",
  description: "Cursos y formación especializada en sostenibilidad, modelación hídrica y medio ambiente.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AmbientalCursosPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cursos Ambientales",
    url: "https://aquatechia.com/ambiental/cursos",
    description: "Cursos y formación en sostenibilidad y medio ambiente.",
    publisher: {
      "@type": "Organization",
      name: "AquatechIA"
    }
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <h1>Cursos - Ambiental Portal</h1>
      {/* TODO: Diseñar listado de cursos ambientales */}
      {/* TODO: Enlaces externos a plataformas */}
      {/* TODO: Badges "Nuevo/Popular" */}
    </div>
  );
}
