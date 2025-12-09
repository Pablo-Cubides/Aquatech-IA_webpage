"use client";

import { useState } from "react";

export type DataSource = "worldbank" | "who" | "upload";

interface DataSourceSelectorProps {
  selected: DataSource;
  onSelect: (source: DataSource) => void;
}

export default function DataSourceSelector({
  selected,
  onSelect,
}: DataSourceSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Selecciona la fuente de datos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* World Bank Option */}
        <button
          onClick={() => onSelect("worldbank")}
          className={`
            relative p-6 rounded-lg border-2 transition-all duration-200
            ${
              selected === "worldbank"
                ? "border-[#00796B] bg-[#E0F2F1] shadow-md"
                : "border-gray-200 hover:border-[#00796B] hover:bg-gray-50"
            }
          `}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Icon */}
            <div
              className={`
              w-16 h-16 rounded-full flex items-center justify-center text-3xl
              ${
                selected === "worldbank"
                  ? "bg-[#00796B] text-white"
                  : "bg-gray-100 text-gray-400"
              }
            `}
            >
              🌍
            </div>

            {/* Title */}
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Banco Mundial
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Accede a indicadores globales ambientales y socioeconómicos
              </p>
            </div>

            {/* Features */}
            <ul className="text-xs text-gray-600 space-y-1 text-left w-full">
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Datos de 200+ países
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Indicadores ambientales y económicos
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Series temporales desde 1960
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Datos validados y actualizados
              </li>
            </ul>

            {/* Selected Badge */}
            {selected === "worldbank" && (
              <div className="absolute top-2 right-2">
                <div className="bg-[#00796B] text-white text-xs font-bold px-2 py-1 rounded-full">
                  SELECCIONADO
                </div>
              </div>
            )}
          </div>
        </button>

        {/* WHO GHO Option */}
        <button
          onClick={() => onSelect("who")}
          className={`
            relative p-6 rounded-lg border-2 transition-all duration-200
            ${
              selected === "who"
                ? "border-[#00796B] bg-[#E0F2F1] shadow-md"
                : "border-gray-200 hover:border-[#00796B] hover:bg-gray-50"
            }
          `}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Icon */}
            <div
              className={`
              w-16 h-16 rounded-full flex items-center justify-center text-3xl
              ${
                selected === "who"
                  ? "bg-[#00796B] text-white"
                  : "bg-gray-100 text-gray-400"
              }
            `}
            >
              ⚕️
            </div>

            {/* Title */}
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                WHO GHO
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Observatorio Mundial de Salud de la OMS
              </p>
            </div>

            {/* Features */}
            <ul className="text-xs text-gray-600 space-y-1 text-left w-full">
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Indicadores de salud global
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Mortalidad y enfermedades
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Salud ambiental
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Datos validados por OMS
              </li>
            </ul>

            {/* Selected Badge */}
            {selected === "who" && (
              <div className="absolute top-2 right-2">
                <div className="bg-[#00796B] text-white text-xs font-bold px-2 py-1 rounded-full">
                  SELECCIONADO
                </div>
              </div>
            )}
          </div>
        </button>

        {/* Upload File Option */}
        <button
          onClick={() => onSelect("upload")}
          className={`
            relative p-6 rounded-lg border-2 transition-all duration-200
            ${
              selected === "upload"
                ? "border-[#00796B] bg-[#E0F2F1] shadow-md"
                : "border-gray-200 hover:border-[#00796B] hover:bg-gray-50"
            }
          `}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Icon */}
            <div
              className={`
              w-16 h-16 rounded-full flex items-center justify-center text-3xl
              ${
                selected === "upload"
                  ? "bg-[#00796B] text-white"
                  : "bg-gray-100 text-gray-400"
              }
            `}
            >
              📁
            </div>

            {/* Title */}
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Subir Archivo
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Analiza tus propios datos en formato CSV o Excel
              </p>
            </div>

            {/* Features */}
            <ul className="text-xs text-gray-600 space-y-1 text-left w-full">
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Formatos CSV y XLSX
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Tus datos personalizados
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Procesamiento local seguro
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Sin límite de variables
              </li>
            </ul>

            {/* Selected Badge */}
            {selected === "upload" && (
              <div className="absolute top-2 right-2">
                <div className="bg-[#00796B] text-white text-xs font-bold px-2 py-1 rounded-full">
                  SELECCIONADO
                </div>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Info Footer */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 Consejo:</span> Usa datos del Banco
          Mundial para indicadores económicos y ambientales, WHO GHO para salud 
          pública, o sube tus archivos para análisis personalizados.
        </p>
      </div>
    </div>
  );
}
