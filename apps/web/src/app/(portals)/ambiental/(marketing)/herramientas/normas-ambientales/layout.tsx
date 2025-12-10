import type { Metadata } from 'next';

const baseUrl = 'https://aquatechpro.co';

export const metadata: Metadata = {
  title: 'Normas Ambientales por País | Regulaciones y Legislación | AquatechIA',
  description:
    'Consulta normativas ambientales de agua, aire, residuos sólidos y vertimientos por país. Base de datos actualizada de legislación ambiental internacional.',
  keywords: [
    'normas ambientales',
    'legislación ambiental',
    'regulaciones agua',
    'normativa vertimientos',
    'residuos sólidos',
    'calidad del aire',
    'regulaciones Colombia',
    'normativa ambiental latinoamérica',
    'cumplimiento ambiental',
    'límites permisibles',
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
    canonical: `${baseUrl}/ambiental/herramientas/normas-ambientales`,
  },
  openGraph: {
    title: 'Normas Ambientales por País | Legislación Actualizada',
    description:
      'Consulta normativas ambientales de agua, aire, residuos y vertimientos por país.',
    type: 'website',
    url: `${baseUrl}/ambiental/herramientas/normas-ambientales`,
    siteName: 'AquatechIA',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Normas Ambientales por País',
    description:
      'Base de datos de normativas ambientales por país y sector.',
    creator: '@aquatechpro',
  },
  category: 'technology',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Navegador de Normas Ambientales',
  description:
    'Base de datos de regulaciones ambientales internacionales organizadas por país, dominio y sector',
  url: `${baseUrl}/ambiental/herramientas/normas-ambientales`,
  applicationCategory: 'ReferenceApplication',
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
    'Normativas de agua potable',
    'Regulaciones de vertimientos',
    'Normativas de aire',
    'Gestión de residuos sólidos',
    'Búsqueda por país y sector',
  ],
};

export default function NormasAmbientalesLayout({
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
