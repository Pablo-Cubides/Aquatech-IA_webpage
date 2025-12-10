import type { Metadata } from 'next';

const baseUrl = 'https://aquatechpro.co';

export const metadata: Metadata = {
  title: 'Calculadora de Índices de Calidad de Agua | IRCA, WQI, DWQI | AquatechIA',
  description:
    'Calcula índices de calidad de agua potable IRCA (Colombia), WQI (NSF) y DWQI a partir de datos de laboratorio. Resolución 2115/2007.',
  keywords: [
    'IRCA',
    'WQI',
    'DWQI',
    'calidad de agua',
    'agua potable',
    'índice de riesgo',
    'Resolución 2115',
    'NSF Water Quality Index',
    'análisis de agua',
    'parámetros fisicoquímicos',
    'potabilidad',
    'laboratorio de aguas',
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
    canonical: `${baseUrl}/ambiental/herramientas/indice-calidad-agua`,
  },
  openGraph: {
    title: 'Calculadora de Índices de Calidad de Agua | IRCA, WQI, DWQI',
    description:
      'Calcula índices de calidad de agua potable IRCA, WQI y DWQI a partir de datos de laboratorio.',
    type: 'website',
    url: `${baseUrl}/ambiental/herramientas/indice-calidad-agua`,
    siteName: 'AquatechIA',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora IRCA, WQI, DWQI',
    description:
      'Calcula índices de calidad de agua potable a partir de datos de laboratorio.',
    creator: '@aquatechpro',
  },
  category: 'technology',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calculadora de Índices de Calidad de Agua',
  description:
    'Herramienta para calcular índices de calidad de agua potable: IRCA (Resolución 2115/2007 Colombia), WQI (NSF) y DWQI',
  url: `${baseUrl}/ambiental/herramientas/indice-calidad-agua`,
  applicationCategory: 'ScientificApplication',
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
    'IRCA - Índice de Riesgo de Calidad del Agua (Colombia)',
    'WQI - NSF Water Quality Index',
    'DWQI - Drinking Water Quality Index',
    'Carga de datos CSV',
    'Explicación detallada de cálculos',
    'Exportación de resultados',
    'Categorización por niveles de riesgo',
  ],
};

export default function IndiceCalidadAguaLayout({
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
