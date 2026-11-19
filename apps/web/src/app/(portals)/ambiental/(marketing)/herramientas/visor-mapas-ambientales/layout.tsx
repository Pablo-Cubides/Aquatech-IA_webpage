import type { Metadata } from 'next';
import { SITE_URL, TWITTER_HANDLE } from '@/lib/site-config';
import ToolSeoBlock from "@/components/seo/ToolSeoBlock";

export const metadata: Metadata = {
  title: 'Visor de Mapas Ambientales | GIS Interactivo',
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
    canonical: `${SITE_URL}/ambiental/herramientas/visor-mapas-ambientales`,
  },
  openGraph: {
    images: [{ url: "https://aquatechia.com/images/og-image-ambiental.jpg", width: 1200, height: 630 }],
    title: 'Visor de Mapas Ambientales | GIS Interactivo',
    description:
      'Visualiza datos ambientales en mapas interactivos con capas GIS personalizables.',
    type: 'website',
    url: `${SITE_URL}/ambiental/herramientas/visor-mapas-ambientales`,
    siteName: 'AquatechIA',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visor de Mapas Ambientales | GIS Interactivo',
    description:
      'Visualiza datos ambientales en mapas interactivos con capas GIS personalizables.',
    creator: TWITTER_HANDLE,
  },
  category: 'technology',
};

const FEATURE_LIST = [
    'Capas GIS personalizables',
    'Integración con GBIF',
    'Water Quality Portal',
    'Carga de datasets propios',
    'Exportación de datos',
  ];

export default function VisorMapasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ToolSeoBlock featureList={FEATURE_LIST} slug="visor-mapas-ambientales" portal="ambiental" />
    </>
  );
}
