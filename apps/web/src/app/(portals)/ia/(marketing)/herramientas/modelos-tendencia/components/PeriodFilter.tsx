"use client";

import React from "react";

interface PeriodFilterProps {
  period: "week" | "month";
  onChange: (period: "week" | "month") => void;
}

export default function PeriodFilter({ period, onChange }: PeriodFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#CCCCCC] mr-2">📅 Período:</span>
      <div className="flex items-center bg-[#10111A] rounded-lg p-1 border border-[rgba(0,239,255,0.1)]">
        <button
          onClick={() => onChange("week")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            period === "week"
              ? "bg-gradient-to-r from-[#00efff] to-[#0095ff] text-[#10111A]"
              : "text-[#CCCCCC] hover:text-white hover:bg-[rgba(0,239,255,0.1)]"
          }`}
        >
          Última Semana
        </button>
        <button
          onClick={() => onChange("month")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            period === "month"
              ? "bg-gradient-to-r from-[#00efff] to-[#0095ff] text-[#10111A]"
              : "text-[#CCCCCC] hover:text-white hover:bg-[rgba(0,239,255,0.1)]"
          }`}
        >
          Último Mes
        </button>
      </div>
    </div>
  );
}
