"use client";

import { usePathname } from "next/navigation";

export interface PortalTheme {
  portal: "ia" | "ambiental";
  portalBase: "/ia" | "/ambiental";
  isAmbiental: boolean;
  bgMain: string;
  bgCard: string;
  bgInput: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  borderCard: string;
  btnPrimary: string;
  btnSecondary: string;
  logoSrc: string;
}

export function usePortalTheme(): PortalTheme {
  const pathname = usePathname();
  const isAmbiental = pathname ? pathname.startsWith("/ambiental") : false;

  if (isAmbiental) {
    return {
      portal: "ambiental",
      portalBase: "/ambiental",
      isAmbiental: true,
      bgMain: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 text-gray-800",
      bgCard: "bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm hover:border-[#0077B6]",
      bgInput: "bg-white text-gray-900 border-gray-300 focus:border-[#0077B6]",
      textPrimary: "text-[#0D161C]",
      textSecondary: "text-gray-600",
      textAccent: "text-[#0077B6]",
      borderCard: "border-gray-200",
      btnPrimary: "bg-gradient-to-r from-[#0077B6] to-[#10B981] hover:opacity-95 text-white shadow-md",
      btnSecondary: "bg-white border border-[#0077B6] text-[#0077B6] hover:bg-blue-50",
      logoSrc: "/images/logo-aquatech.png",
    };
  }

  return {
    portal: "ia",
    portalBase: "/ia",
    isAmbiental: false,
    bgMain: "bg-gradient-to-br from-gray-900 via-[#10111A] to-gray-900 text-white",
    bgCard: "bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:border-cyan-500",
    bgInput: "bg-gray-900 text-white border-gray-600 focus:border-cyan-500",
    textPrimary: "text-white",
    textSecondary: "text-gray-400",
    textAccent: "text-cyan-400",
    borderCard: "border-gray-700",
    btnPrimary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/20",
    btnSecondary: "bg-gray-800 border border-gray-600 text-cyan-400 hover:bg-gray-700",
    logoSrc: "/images/portal-ia/autor/ruleta-academica.png",
  };
}
