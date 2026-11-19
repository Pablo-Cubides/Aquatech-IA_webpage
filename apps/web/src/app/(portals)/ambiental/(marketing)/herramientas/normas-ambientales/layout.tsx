import type { Metadata } from 'next';
import { SITE_URL, TWITTER_HANDLE } from '@/lib/site-config';
import ToolSeoBlock from "@/components/seo/ToolSeoBlock";

export const metadata: Metadata = {
  title: 'Normas Ambientales por País | Regulaciones y Legislación',
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
    canonical: `${SITE_URL}/ambiental/herramientas/normas-ambientales`,
  },
  openGraph: {
    images: [{ url: "https://aquatechia.com/images/og-image-ambiental.jpg", width: 1200, height: 630 }],
    title: 'Normas Ambientales por País | Legislación Actualizada',
    description:
      'Consulta normativas ambientales de agua, aire, residuos y vertimientos por país.',
    type: 'website',
    url: `${SITE_URL}/ambiental/herramientas/normas-ambientales`,
    siteName: 'AquatechIA',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Normas Ambientales por País',
    description:
      'Base de datos de normativas ambientales por país y sector.',
    creator: TWITTER_HANDLE,
  },
  category: 'technology',
};

const FEATURE_LIST = [
    'Normativas de agua potable',
    'Regulaciones de vertimientos',
    'Normativas de aire',
    'Gestión de residuos sólidos',
    'Búsqueda por país y sector',
  ];

export default function NormasAmbientalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ToolSeoBlock featureList={FEATURE_LIST} slug="normas-ambientales" portal="ambiental" />
    </>
  );
}
