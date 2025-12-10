import type { Metadata } from 'next';

const baseUrl = 'https://aquatechpro.co';

export const metadata: Metadata = {
  title: 'Análisis de Correlaciones Ambientales | Estadística | AquatechIA',
  description:
    'Herramienta de análisis estadístico para datos ambientales. Calcula correlaciones Pearson, Spearman y Kendall con visualizaciones interactivas.',
  keywords: [
    'análisis de correlaciones',
    'correlación Pearson',
    'correlación Spearman',
    'correlación Kendall',
    'estadística ambiental',
    'análisis de datos',
    'matriz de correlaciones',
    'scatter plot',
    'World Bank data',
    'WHO GHO data',
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
    canonical: `${baseUrl}/ambiental/herramientas/analisis-correlaciones`,
  },
  openGraph: {
    title: 'Análisis de Correlaciones Ambientales | Estadística',
    description:
      'Calcula correlaciones Pearson, Spearman y Kendall en datos ambientales.',
    type: 'website',
    url: `${baseUrl}/ambiental/herramientas/analisis-correlaciones`,
    siteName: 'AquatechIA',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Análisis de Correlaciones Ambientales',
    description:
      'Herramienta estadística para análisis de correlaciones en datos ambientales.',
    creator: '@aquatechpro',
  },
  category: 'technology',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Análisis de Correlaciones Ambientales',
  description:
    'Herramienta estadística para calcular correlaciones Pearson, Spearman y Kendall en datasets ambientales',
  url: `${baseUrl}/ambiental/herramientas/analisis-correlaciones`,
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
    'Correlación de Pearson',
    'Correlación de Spearman',
    'Correlación de Kendall',
    'Gráficos de dispersión',
    'Integración World Bank',
    'Integración WHO GHO',
    'Exportación CSV/XLSX',
  ],
};

export default function AnalisisCorrelacionesLayout({
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
