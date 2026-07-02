import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cursos | IA Portal",
  description: "Cursos y formación en inteligencia artificial.",
};

export default function IACursosPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cursos de Inteligencia Artificial",
    url: "https://aquatechia.com/ia/cursos",
    description: "Cursos y formación en inteligencia artificial.",
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
      <h1>Cursos - IA Portal</h1>
      {/* TODO: Diseñar listado de cursos IA */}
      {/* TODO: Enlaces externos a plataformas */}
      {/* TODO: Badges "Nuevo/Popular" */}
    </div>
  );
}
