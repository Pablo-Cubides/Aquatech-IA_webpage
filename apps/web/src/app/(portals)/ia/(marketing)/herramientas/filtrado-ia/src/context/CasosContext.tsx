"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Casos, Caso } from "../types/caso";

interface CasosContextValue {
  casos: Casos;
  selectedIndex: number;
  selectedCaso: Caso | null;
  selectCaso: (i: number) => void;
  reload: () => Promise<void>;
}

const CasosContext = createContext<CasosContextValue | undefined>(undefined);

// Heurística simple para detectar contenido sensible que debe revisarse
function detectSensitive(caso: Caso) {
  const text = [
    caso.frase,
    caso.contexto,
    caso.sin_filtro,
    caso.razon_filtro,
    caso.coherencia_humana,
  ]
    .join(" ")
    .toLowerCase();
  const keywords = [
    "bomba",
    "explos",
    "fentanil",
    "drog",
    "suicid",
    "pedo",
    "hack",
    "hackear",
    "dirección",
    "doxx",
    "adolf",
    "hitler",
    "menor",
    "sexual",
    "abuso",
    "evadir impuestos",
  ];
  return keywords.some((k) => text.includes(k));
}

export const CasosProvider = ({ children }: { children: React.ReactNode }) => {
  const [casos, setCasos] = useState<Casos>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const load = async () => {
    // Intentar backend primero
    try {
      const base =
        (typeof window !== "undefined" && (window as any).LOCATION_API_BASE) ||
        "";
      const api = base + "/casos";
      const res = await fetch(api, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const withFlags = (Array.isArray(data) ? data : []).map((c: Caso) => ({
          ...c,
          requires_review: detectSensitive(c),
        }));
        setCasos(withFlags);
        return;
      }
    } catch (e) {
      // ignore and try fallback
      console.warn(
        "Fallo al cargar desde backend, intentando fallback public:",
        e,
      );
    }

    try {
      // Load from the main public folder
      const resLocal = await fetch("/casos.json", {
        cache: "no-store",
      });
      if (resLocal.ok) {
        const lista = await resLocal.json();
        const arr = Array.isArray(lista) ? lista : [];
        const withFlags = arr.map((c: Caso) => ({
          ...c,
          requires_review: detectSensitive(c),
        }));
        setCasos(withFlags);
        return;
      }
    } catch (e) {
      console.error("Error cargando casos desde /casos.json", e);
      setCasos([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectCaso = (i: number) => {
    setSelectedIndex(i);
  };

  const value: CasosContextValue = {
    casos,
    selectedIndex,
    selectedCaso:
      selectedIndex >= 0 && selectedIndex < casos.length
        ? casos[selectedIndex]
        : null,
    selectCaso,
    reload: load,
  };

  return (
    <CasosContext.Provider value={value}>{children}</CasosContext.Provider>
  );
};

export function useCasos() {
  const ctx = useContext(CasosContext);
  if (!ctx) throw new Error("useCasos debe usarse dentro de CasosProvider");
  return ctx;
}
