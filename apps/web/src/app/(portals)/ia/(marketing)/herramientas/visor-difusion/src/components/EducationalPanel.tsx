"use client";

import React from "react";

interface EducationalPanelProps {
  upperText: string;
  lowerText: string;
  className?: string;
}

export default function EducationalPanel({
  upperText,
  lowerText,
  className = "",
}: EducationalPanelProps) {
  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-br from-[#1A1F3A] via-[#0F1629] to-[#0A0E27] border-2 border-[#00D4FF]/30 rounded-lg p-5 backdrop-blur-md ${className}`}
    >
      {/* Sección superior - Explicación del paso */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        <h3 className="text-[#00FF88] font-semibold text-sm mb-3 uppercase tracking-wide">
          Paso Actual
        </h3>
        <p className="text-[#FFFFFF] leading-relaxed text-base font-medium">
          {upperText}
        </p>
      </div>

      {/* Divisor visual mejorado */}
      <div className="my-4 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent h-[2px]"></div>

      {/* Sección inferior - Detalles técnicos */}
      <div className="flex-1 overflow-y-auto pr-2">
        <h3 className="text-[#FFB700] font-semibold text-sm mb-3 uppercase tracking-wide">
          Detalles Técnicos
        </h3>
        <p className="whitespace-pre-line text-[#E8F0FF] text-xs leading-relaxed font-mono bg-[#0A0E27]/80 p-3 rounded border border-[#00D4FF]/20">
          {lowerText}
        </p>
      </div>
    </div>
  );
}
