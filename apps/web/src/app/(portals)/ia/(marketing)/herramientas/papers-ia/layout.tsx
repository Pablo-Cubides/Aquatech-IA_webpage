import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Papers de IA | Investigación ArXiv | AquatechIA',
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
  ],
  openGraph: {
    title: 'Papers de IA | Investigación ArXiv | AquatechIA',
    description:
      'Explora los artículos científicos más recientes sobre inteligencia artificial desde ArXiv.',
    type: 'website',
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
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Papers de IA - ArXiv Explorer',
            description:
              'Colección de artículos científicos de inteligencia artificial de ArXiv',
            provider: {
              '@type': 'Organization',
              name: 'AquatechIA',
              url: 'https://aquatechpro.co',
            },
            about: {
              '@type': 'Thing',
              name: 'Inteligencia Artificial',
            },
          }),
        }}
      />
      {children}
    </>
  );
}
