import type { Metadata } from 'next';

const baseUrl = 'https://aquatechpro.co';

export const metadata: Metadata = {
  title: 'Visor de Mapas Ambientales | GIS Interactivo | AquatechIA',
  description:
    'Visualiza datos ambientales en mapas interactivos con capas GIS personalizables. Integración con GBIF, Water Quality Portal y datasets propios.',
  keywords: [
    'mapas ambientales',
    'GIS ambiental',
    'datos geoespaciales',
    'visor de mapas',
    'GBIF',
    'Water Quality Portal',
    'monitoreo ambiental',
    'capas geoespaciales',
    'análisis territorial',
    'SIG ambiental',
  ],
  authors: [{ name: 'AquatechIA', url: baseUrl }],
  creator: 'AquatechIA',
  publisher: 'AquatechIA',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${baseUrl}/ambiental/herramientas/visor-mapas-ambientales`,
  },
  openGraph: {
    title: 'Visor de Mapas Ambientales | GIS Interactivo',
    description:
      'Visualiza datos ambientales en mapas interactivos con capas GIS personalizables.',
    type: 'website',
    url: `${baseUrl}/ambiental/herramientas/visor-mapas-ambientales`,
    siteName: 'AquatechIA',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visor de Mapas Ambientales | GIS Interactivo',
    description:
      'Visualiza datos ambientales en mapas interactivos con capas GIS personalizables.',
    creator: '@aquatechpro',
  },
  category: 'technology',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Visor de Mapas Ambientales',
  description:
    'Herramienta de visualización de datos ambientales con mapas interactivos y capas GIS',
  url: `${baseUrl}/ambiental/herramientas/visor-mapas-ambientales`,
  applicationCategory: 'EnvironmentalApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  provider: {
    '@type': 'Organization',
    name: 'AquatechIA',
    url: baseUrl,
  },
  featureList: [
    'Capas GIS personalizables',
    'Integración con GBIF',
    'Water Quality Portal',
    'Carga de datasets propios',
    'Exportación de datos',
  ],
};

export default function VisorMapasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
    </>
  );
}
