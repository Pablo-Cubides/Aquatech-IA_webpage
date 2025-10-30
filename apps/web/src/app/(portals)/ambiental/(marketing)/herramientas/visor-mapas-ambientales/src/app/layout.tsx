import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Mapa Ambiental - Visualización de Datos Ambientales',
    template: '%s | Mapa Ambiental'
  },
  description: 'Plataforma interactiva para visualizar, analizar y gestionar datos ambientales en Colombia. Sistema de mapas con datos de calidad del agua, biodiversidad y monitoreo ambiental.',
  keywords: [
    'datos ambientales',
    'calidad del agua',
    'biodiversidad',
    'monitoreo ambiental',
    'Colombia',
    'GIS',
    'mapas interactivos',
    'geolocalización',
    'análisis ambiental',
    'datasets ambientales'
  ],
  authors: [
    { name: 'Tu Empresa' }
  ],
  creator: 'Tu Empresa',
  publisher: 'Tu Empresa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: '/',
    title: 'Mapa Ambiental - Visualización de Datos Ambientales',
    description: 'Plataforma interactiva para visualizar y analizar datos ambientales en Colombia con mapas interactivos y herramientas de análisis.',
    siteName: 'Mapa Ambiental',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mapa Ambiental - Visualización de Datos',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mapa Ambiental - Visualización de Datos Ambientales',
    description: 'Plataforma interactiva para visualizar y analizar datos ambientales en Colombia',
    images: ['/og-image.jpg'],
  },
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-2 text-sm text-center text-black border-t bg-warning-100 border-warning-300 text-warning-800 texr">
          ⚠️ Los datos podrán ser borrados si el administrador lo considera
        </div>
      </body>
    </html>
  )
}
