import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/auth/Providers";
import Script from "next/script";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";

export const metadata: Metadata = {
  title: {
    default: "AquatechIA - Inteligencia Artificial + Gestión Ambiental",
    template: "%s | AquatechIA",
  },
  description:
    "Plataforma de Inteligencia Artificial para la gestión ambiental sostenible. Herramientas, cursos y recursos para profesionales ambientales.",
  keywords: [
    "inteligencia artificial",
    "gestión ambiental",
    "sostenibilidad",
    "herramientas IA",
    "cursos ambientales",
    "tecnología ambiental",
  ],
  authors: [{ name: "AquatechIA" }],
  creator: "AquatechIA",
  publisher: "AquatechIA",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: baseUrl,
    siteName: "AquatechIA",
    title: "AquatechIA - Inteligencia Artificial + Gestión Ambiental",
    description:
      "Plataforma de IA para gestión ambiental sostenible. Herramientas, cursos y recursos.",
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "AquatechIA - IA + Gestión Ambiental",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AquatechIA - IA + Gestión Ambiental",
    description:
      "Plataforma de IA para gestión ambiental sostenible. Herramientas y cursos.",
    images: [`${baseUrl}/images/og-image.jpg`],
    creator: "@aquatechia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AquatechIA",
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description:
      "Plataforma de Inteligencia Artificial para la gestión ambiental sostenible",
    sameAs: [
      "https://twitter.com/aquatechia",
      "https://linkedin.com/company/aquatechia",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AquatechIA",
    url: baseUrl,
    description:
      "Plataforma de IA para gestión ambiental sostenible con herramientas y cursos",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="es">
      <head>
        {/* Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Preconnect for critical resources */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
