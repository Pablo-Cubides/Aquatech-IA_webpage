import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IA Portal - Inteligencia Artificial aplicada al agua y al ambiente',
  description: 'Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.',
  keywords: ['inteligencia artificial', 'agua', 'medio ambiente', 'modelos generativos', 'visualizaciones', 'herramientas IA'],
  openGraph: {
    title: 'IA Portal - Inteligencia Artificial aplicada al agua y al ambiente',
    description: 'Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IA Portal - Inteligencia Artificial aplicada al agua y al ambiente',
    description: 'Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.',
  },
}

export default function IAPage() {
  return (
    <main className="bg-[#10111A] text-[#B6C2DF]">
      <section className="py-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-[#F3F6FF]">
            Inteligencia Artificial aplicada al agua y al ambiente
          </h1>
          <p className="mt-6 text-lg text-[#F3F6FF]">
            Explora modelos generativos, visualizaciones y herramientas prácticas.
          </p>
        </div>
      </section>
    </main>
  )
}