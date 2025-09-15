import React from "react";
import { Metadata } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import HeaderAmbiental from "@/components/nav/HeaderAmbiental";
import FooterAmbiental from "@/components/nav/FooterAmbiental";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Gestión Ambiental - Aquatech IA",
  description:
    "Herramientas de gestión ambiental, mapas, normas y recursos para un futuro sostenible.",
};

export default function AmbientalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${notoSans.variable} ${spaceGrotesk.variable} min-h-screen flex flex-col bg-white text-[#0D161C]`}
      style={
        {
          fontFamily: "var(--font-noto)",
          "--primary-blue": "#0077B6",
          "--success-green": "#10B981",
          "--text-primary": "#0D161C",
          "--text-secondary": "#5D7989",
          "--light-bg": "#F5F9F8",
        } as React.CSSProperties
      }
    >
      <HeaderAmbiental />
      <main className="flex-grow">{children}</main>
      <FooterAmbiental />
    </div>
  );
}
