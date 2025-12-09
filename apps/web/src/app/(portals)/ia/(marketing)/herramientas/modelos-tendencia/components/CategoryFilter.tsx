"use client";

import React, { useState } from "react";

interface Category {
  value: string;
  label: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategory = categories.find((c) => c.value === selected);

  return (
    <div className="relative">
      <span className="text-sm text-[#CCCCCC] mr-2">🏷️ Categoría:</span>

      {/* Desktop: Horizontal pills */}
      <div className="hidden lg:inline-flex items-center gap-1 bg-[#10111A] rounded-lg p-1 border border-[rgba(0,239,255,0.1)]">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onChange(category.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
              selected === category.value
                ? "bg-gradient-to-r from-[#00efff] to-[#0095ff] text-[#10111A]"
                : "text-[#CCCCCC] hover:text-white hover:bg-[rgba(0,239,255,0.1)]"
            }`}
          >
            <span>{category.icon}</span>
            <span className="hidden xl:inline">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile: Dropdown */}
      <div className="lg:hidden inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-[#10111A] border border-[rgba(0,239,255,0.1)] rounded-lg text-sm font-medium text-white flex items-center gap-2"
        >
          <span>{selectedCategory?.icon || "🌐"}</span>
          <span>{selectedCategory?.label || "Todos"}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 right-0 bg-[#10111A] border border-[rgba(0,239,255,0.1)] rounded-lg shadow-xl z-50 min-w-[200px]">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => {
                  onChange(category.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                  selected === category.value
                    ? "bg-[rgba(0,239,255,0.1)] text-[#00efff]"
                    : "text-[#CCCCCC] hover:bg-[rgba(0,239,255,0.05)] hover:text-white"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
