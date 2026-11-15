import type { Metadata } from 'next';
import { SITE_URL, TWITTER_HANDLE } from '@/lib/site-config';
import ToolSeoBlock from "@/components/seo/ToolSeoBlock";

export const metadata: Metadata = {
  title: 'Análisis de Correlaciones Ambientales | Estadística',
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
    canonical: `${SITE_URL}/ambiental/herramientas/analisis-correlaciones`,
  },
  openGraph: {
    images: [{ url: "https://aquatechia.com/images/og-image-ambiental.jpg", width: 1200, height: 630 }],
    title: 'Análisis de Correlaciones Ambientales | Estadística',
    description:
      'Calcula correlaciones Pearson, Spearman y Kendall en datos ambientales.',
    type: 'website',
    url: `${SITE_URL}/ambiental/herramientas/analisis-correlaciones`,
    siteName: 'AquatechIA',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Análisis de Correlaciones Ambientales',
    description:
      'Herramienta estadística para análisis de correlaciones en datos ambientales.',
    creator: TWITTER_HANDLE,
  },
  category: 'technology',
};

const FEATURE_LIST = [
    'Correlación de Pearson',
    'Correlación de Spearman',
    'Correlación de Kendall',
    'Gráficos de dispersión',
    'Integración World Bank',
    'Integración WHO GHO',
    'Exportación CSV/XLSX',
  ];

export default function AnalisisCorrelacionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ToolSeoBlock featureList={FEATURE_LIST} slug="analisis-correlaciones" portal="ambiental" />
    </>
  );
}
