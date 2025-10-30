"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCasos } from "../context/CasosContext";
import { trackToolEvent } from "../utils/analytics";
import styles from "./MenuCasos.module.css";

const MenuCasos = () => {
  const { casos, selectCaso } = useCasos();
  const { data: session } = useSession();
  const [busqueda, setBusqueda] = useState("");

  const { selectedIndex } = useCasos();

  const casosFiltrados = useMemo(() => {
    return (Array.isArray(casos) ? casos : []).filter(
      (caso) =>
        (caso.frase || "").toLowerCase().includes(busqueda.toLowerCase()) ||
        ((caso.razon_filtro || "") as string)
          .toLowerCase()
          .includes(busqueda.toLowerCase()),
    );
  }, [casos, busqueda]);

  const listRef = useRef<HTMLUListElement | null>(null);

  // Keyboard navigation: up/down to move selection
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next =
          selectedIndex >= 0
            ? Math.min(selectedIndex + 1, casos.length - 1)
            : 0;
        selectCaso(next);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev =
          selectedIndex > 0 ? selectedIndex - 1 : Math.max(casos.length - 1, 0);
        selectCaso(prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex, casos.length]);

  return (
    <aside className={styles.aside}>
      <input
        type="text"
        aria-label="Buscar casos"
        placeholder="Buscar frase o motivo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className={styles.search}
      />
      <div className={styles.stats}>
        {casos.length > 0
          ? `Mostrando ${casosFiltrados.length} de ${casos.length} casos`
          : "Cargando casos..."}
      </div>
      <ul
        ref={listRef}
        className={styles.list}
        role="listbox"
        aria-label="Lista de casos"
      >
        {casos.length === 0 && (
          <li className={styles.noCases}>
            No se han cargado casos. Intenta recargar la página o verifica la
            consola del navegador.
          </li>
        )}
        {casosFiltrados.map((caso, i) => (
          <li key={i} className={styles.item}>
            <button
              className={styles.caseBtn}
              onClick={() => {
                // Track case selection event
                trackToolEvent(
                  "caso_selected",
                  {
                    casoIndex: i,
                    casoFrase: caso.frase,
                    razonFiltro: caso.razon_filtro,
                  },
                  session?.user?.email || undefined,
                );

                selectCaso(i);
              }}
              aria-current={i === selectedIndex}
              aria-posinset={i + 1}
              aria-setsize={casosFiltrados.length}
            >
              {caso.frase}
            </button>
            <div className={styles.reasonRow}>
              <div>{caso.razon_filtro}</div>
              {/* Ocultar badge de revisión temporalmente
              {caso.requires_review && <div className={styles.reviewBadge}>Requiere revisión</div>} */}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default MenuCasos;
