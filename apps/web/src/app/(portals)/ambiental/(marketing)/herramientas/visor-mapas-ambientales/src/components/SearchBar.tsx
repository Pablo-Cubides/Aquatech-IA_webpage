"use client";

import { useState, useRef, useEffect } from "react";
import type { GeoJSONFeature } from "../types";

interface SearchBarProps {
  data: GeoJSONFeature[];
  onResultSelect: (feature: GeoJSONFeature) => void;
  placeholder?: string;
}

export default function SearchBar({
  data,
  onResultSelect,
  placeholder = "Buscar estación, ciudad o ubicación...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoJSONFeature[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = data.filter((feature) => {
      const props = feature.properties;
      const searchableText = [
        props.estacion,
        props.location,
        props.ciudad,
        props.city,
        props.departamento,
        props.pais,
        props.country,
        props.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchQuery);
    });

    setResults(filtered.slice(0, 10)); // Limit to 10 results
    setShowResults(true);
  }, [query, data]);

  const handleSelect = (feature: GeoJSONFeature) => {
    const name =
      feature.properties.estacion ||
      feature.properties.location ||
      feature.properties.ciudad ||
      "Ubicación";
    setQuery(String(name));
    setShowResults(false);
    onResultSelect(feature);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!text) return "";
    const textStr = String(text);
    const index = textStr.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return textStr;

    return (
      <>
        {textStr.substring(0, index)}
        <mark className="bg-yellow-200">{textStr.substring(index, index + query.length)}</mark>
        {textStr.substring(index + query.length)}
      </>
    );
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          placeholder={placeholder}
          aria-label="Buscar ubicaciones"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowResults(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            aria-label="Limpiar búsqueda"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.map((feature, index) => {
            const props = feature.properties;
            const name = props.estacion || props.location || props.ciudad || "Sin nombre";
            const location = [props.ciudad || props.city, props.pais || props.country]
              .filter(Boolean)
              .join(", ");

            return (
              <button
                key={`${props.id}-${index}`}
                onClick={() => handleSelect(feature)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
              >
                <div className="font-medium text-gray-900 text-sm">
                  {highlightMatch(String(name), query)}
                </div>
                {location && (
                  <div className="text-xs text-gray-500 mt-1">
                    📍 {highlightMatch(String(location), query)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {showResults && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
          No se encontraron resultados para &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
