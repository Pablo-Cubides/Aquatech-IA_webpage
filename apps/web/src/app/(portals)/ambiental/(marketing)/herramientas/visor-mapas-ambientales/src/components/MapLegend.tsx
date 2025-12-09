"use client";

import { useState } from "react";

interface LegendItem {
  color: string;
  label: string;
  range?: string;
}

interface MapLegendProps {
  items: LegendItem[];
  title?: string;
  parameter?: string;
  units?: string;
}

export default function MapLegend({
  items,
  title = "Leyenda",
  parameter,
  units,
}: MapLegendProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-xs z-10">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-red-500 rounded-sm" />
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          aria-label={isCollapsed ? "Expandir leyenda" : "Colapsar leyenda"}
        >
          {isCollapsed ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="px-4 py-3">
          {parameter && (
            <div className="mb-3 text-xs text-gray-600">
              <span className="font-medium">{parameter}</span>
              {units && <span className="ml-1">({units})</span>}
            </div>
          )}

          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 text-xs">
                  <div className="font-medium text-gray-900">{item.label}</div>
                  {item.range && (
                    <div className="text-gray-500">{item.range}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <p>El color indica la calidad del aire según estándares internacionales</p>
          </div>
        </div>
      )}
    </div>
  );
}
