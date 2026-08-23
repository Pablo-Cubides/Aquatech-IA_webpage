import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/auth/Providers";
import {
  SITE_URL,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  DEFAULT_LOGO,
} from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  openGraph: {
    type: "website",
    locale: DEFAULT_LOCALE,
    alternateLocale: ["es_ES", "es_MX", "es_419"],
    url: SITE_URL,
    siteName: "AquatechIA",
    title: "AquatechIA - Inteligencia Artificial + Gestión Ambiental",
    description:
      "Plataforma de IA para gestión ambiental sostenible. Herramientas, cursos y recursos.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
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
    images: [DEFAULT_OG_IMAGE],
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
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    name: "AquatechIA",
    url: SITE_URL,
    logo: DEFAULT_LOGO,
    description:
      "Plataforma educativa de Inteligencia Artificial para la gestión ambiental sostenible",
    sameAs: [
      "https://twitter.com/aquatechia",
      "https://linkedin.com/company/aquatechia",
    ],
    knowsAbout: [
      "Inteligencia Artificial",
      "Machine Learning",
      "Gestión Ambiental",
      "Educación",
      "Tecnología Sostenible",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "info@aquatechia.com",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AquatechIA",
    url: SITE_URL,
    description:
      "Plataforma de IA para gestión ambiental sostenible con herramientas y cursos",
  };

  return (
    <html lang="es">
      <head>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Structured Data - Website */}
        <script
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
