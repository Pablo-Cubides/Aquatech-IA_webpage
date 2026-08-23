import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_LOGO } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Papers de IA | Investigación ArXiv',
  description:
    'Explora los artículos científicos más recientes sobre inteligencia artificial desde ArXiv. Búsqueda por categoría, autor y tema. Machine Learning, NLP, Visión por Computadora y más.',
  keywords: [
    'papers IA',
    'ArXiv',
    'investigación IA',
    'machine learning papers',
    'NLP research',
    'computer vision papers',
    'artículos científicos IA',
    'deep learning research',
    'inteligencia artificial papers',
    'GPT papers',
    'transformer papers',
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
    canonical: `${SITE_URL}/ia/herramientas/papers-ia`,
  },
  openGraph: {
    title: 'Papers de IA | Investigación ArXiv | AquatechIA',
    description:
      'Explora los artículos científicos más recientes sobre inteligencia artificial desde ArXiv.',
    type: 'website',
    url: `${SITE_URL}/ia/herramientas/papers-ia`,
    siteName: 'AquatechIA',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papers de IA | Investigación ArXiv',
    description:
      'Explora los artículos científicos más recientes sobre inteligencia artificial desde ArXiv.',
    creator: '@aquatechia',
  },
  category: 'technology',
};

// Structured data for the collection page
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Papers de IA - ArXiv Explorer',
  description:
    'Colección de artículos científicos de inteligencia artificial de ArXiv',
  url: `${SITE_URL}/ia/herramientas/papers-ia`,
  provider: {
    '@type': 'Organization',
    name: 'AquatechIA',
    url: SITE_URL,
    logo: DEFAULT_LOGO,
  },
  about: {
    '@type': 'Thing',
    name: 'Inteligencia Artificial',
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Machine Learning Papers',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Natural Language Processing Research',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Computer Vision Papers',
      },
    ],
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'IA',
        item: `${SITE_URL}/ia`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Herramientas',
        item: `${SITE_URL}/ia/herramientas`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Papers de IA',
        item: `${SITE_URL}/ia/herramientas/papers-ia`,
      },
    ],
  },
};

export default function PapersIALayout({
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
