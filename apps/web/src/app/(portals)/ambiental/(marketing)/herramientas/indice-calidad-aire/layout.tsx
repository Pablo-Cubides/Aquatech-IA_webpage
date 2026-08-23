import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Calculadora de Índices de Calidad del Aire | AQI, ICA, IBOCA, EAQI',
  description:
    'Calcula índices de calidad del aire: US AQI (EPA), ICA Colombia (Res. 2254), IBOCA Bogotá, EAQI Europa e Índice OMS. Soporta PM2.5, PM10, O3, NO2, SO2 y CO.',
  keywords: [
    'AQI',
    'calidad del aire',
    'ICA Colombia',
    'IBOCA Bogotá',
    'EAQI Europa',
    'índice OMS',
    'PM2.5',
    'PM10',
    'ozono',
    'contaminación atmosférica',
    'Resolución 2254',
    'Resolución 2840',
    'EPA AQI',
    'calculadora AQI',
    'monitoreo aire',
  ],
  authors: [{ name: 'AquatechIA', url: SITE_URL }],
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
    canonical: `${SITE_URL}/ambiental/herramientas/indice-calidad-aire`,
  },
  openGraph: {
    title: 'Calculadora de Índices de Calidad del Aire',
    description:
      'Calcula AQI US EPA, ICA Colombia, IBOCA, EAQI Europa e Índice OMS a partir de concentraciones de contaminantes.',
    type: 'website',
    url: `${SITE_URL}/ambiental/herramientas/indice-calidad-aire`,
    siteName: 'AquatechIA',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora AQI - Calidad del Aire',
    description:
      'Calcula índices de calidad del aire para múltiples metodologías internacionales.',
    creator: '@aquatechia',
  },
  category: 'technology',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calculadora de Índices de Calidad del Aire',
  description:
    'Herramienta para calcular índices de calidad del aire (AQI) usando metodologías US EPA, ICA Colombia, IBOCA Bogotá, EAQI Europa y OMS',
  url: `${SITE_URL}/ambiental/herramientas/indice-calidad-aire`,
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
    url: SITE_URL,
  },
  featureList: [
    'US AQI (EPA) - Índice oficial de Estados Unidos',
    'ICA Colombia - Resolución 2254 de 2017',
    'IBOCA Bogotá - Resolución 2840 de 2023',
    'EAQI Europa - European Environment Agency',
    'Índice OMS - Guías de calidad del aire 2021',
    'Soporte para PM2.5, PM10, O3, NO2, SO2, CO',
    'Carga de datos CSV',
    'Integración con OpenAQ',
  ],
};

export default function IndiceCalidadAireLayout({
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
