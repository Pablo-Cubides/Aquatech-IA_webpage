import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/auth/Providers";

export const metadata: Metadata = {
  title: "AquatechIA",
  description: "Inteligencia Artificial + Gestión Ambiental",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com",
  ),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "AquatechIA",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
