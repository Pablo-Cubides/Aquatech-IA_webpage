"use client";

import React from 'react';
import { useCasos } from '../context/CasosContext';
import styles from './VisualizadorCaso.module.css';

const VisualizadorCaso = () => {
  const { selectedCaso, selectedIndex, casos, selectCaso } = useCasos();

  const caso = selectedCaso;
  const index = selectedIndex;

  if (!caso) {
    return (
      <section className={styles.content}>
        <div className={styles.introCard}>
          <b>Aprende con casos reales — selecciona un caso a la izquierda para empezar</b>
          <div style={{ fontSize: 16, color: '#555', marginTop: 16 }}>
            Selecciona un caso en la lista de la izquierda y verás:
            <ul style={{ textAlign: 'left', margin: '12px auto', maxWidth: 560 }}>
              <li>Sin filtro (rojo): lo que saldría sin moderación.</li>
              <li>Coherencia humana (amarillo): cómo la edición podría hacerlo más claro/peligroso.</li>
              <li>Alineamiento/Política (azul): respuesta segura y explicación.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.content}>
      <h2 className={styles.title}>{caso.frase}</h2>

      {/* Banner de revisión si corresponde */}
          {/* Banner de revisión oculto temporalmente — reactivar si se requiere mostrar casos sensibles
          {caso.requires_review && (
            <div className={styles.reviewBanner}>
              <strong>Atención:</strong> Este caso contiene temas sensibles y ha sido marcado para revisión editorial.
            </div>
          )} */}

      <div className={styles.lesson}>
        <b>Lección aprendida:</b> {caso.leccion}
      </div>

      <div className={styles.steps}>
        <div className={`${styles.card} ${styles.alert}`}>
          <span role="img" aria-label="alerta" style={{ fontSize: 28 }}>
  🚨</span>
          <div style={{ fontWeight: 700, color: '#c62828', marginTop: 8 }}>Sin filtro (ejemplo abreviado)</div>
          <div style={{ marginTop: 8 }}>
            {(() => {
              const txt = (caso.sin_filtro || '').trim();
              if (/\[.*eliminad/i.test(txt) || txt.length === 0) {
                const f = (caso.frase || '').toLowerCase();
                if (f.includes('bomba') || f.includes('explos')) return "Por ejemplo: 'El texto podría empezar describiendo el objetivo y mencionando materiales comunes...';" + ' …';
                if (f.includes('fentanil') || f.includes('droga')) return "Por ejemplo: 'La respuesta podría abrir con una descripción general del proceso y advertencias sobre riesgos...';" + ' …';
                if (f.includes('hack') || f.includes('hackear') || f.includes('servidor')) return "Por ejemplo: 'Podría empezar indicando el objetivo del ataque y las áreas técnicas implicadas...';" + ' …';
                return "Por ejemplo: 'La respuesta podría comenzar explicando qué se busca lograr y listar, en líneas generales, los pasos...';" + ' …';
              }
              const safe = txt.replace(/\s+/g, ' ').slice(0, 120);
              return safe.length < txt.length ? safe + ' …' : safe;
            })()}
          </div>
        </div>

  <div className={`${styles.card} ${styles.problem}`}>
          <span role="img" aria-label="problematica" style={{ fontSize: 28 }}>
  💡</span>
          <div style={{ fontWeight: 700, color: '#f57f17', marginTop: 8 }}>Por qué es problemática</div>
          <div style={{ marginTop: 8 }}>{caso.razon_filtro || caso.coherencia_humana}</div>
        </div>

  <div className={`${styles.card} ${styles.align}`}>
          <span role="img" aria-label="alineamiento" style={{ fontSize: 28 }}>
  🛡️</span>
          <div style={{ fontWeight: 700, color: '#1976d2', marginTop: 8 }}>Alineamiento / Política</div>
          <div style={{ marginTop: 8 }}>{caso.alineamiento}</div>
          <div style={{ fontSize: 13, color: '#1976d2', marginTop: 8 }}>{caso.explicacion_politica}</div>
        </div>
      </div>

      <div style={{ background: '#fafafa', borderRadius: 10, padding: 18, color: '#333', fontSize: 15, marginBottom: 16 }}>
        <b>Explicación del caso</b>
        <div style={{ marginTop: 8, color: '#444' }}>
          {caso.contexto}
        </div>
        {caso.historia_real && (
          <div style={{ marginTop: 12, color: '#666', fontSize: 14 }}>
            {caso.historia_real}
          </div>
        )}
      </div>
      <div className={styles.navBtns} style={{ display: 'flex', gap: 8, margin: '8px 0 16px' }}>
        <button aria-label="Anterior" onClick={() => { if (!casos || casos.length === 0) return; const nextIdx = index > 0 ? index - 1 : casos.length - 1; selectCaso(nextIdx); }}>Anterior</button>
        <button aria-label="Siguiente" onClick={() => { if (!casos || casos.length === 0) return; const nextIdx = index >= 0 ? (index + 1) % casos.length : 0; selectCaso(nextIdx); }}>Siguiente</button>
      </div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{caso.nota}</div>
      <a href={caso.referencia} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontSize: 14 }}>Referencia</a>
      <div style={{ marginTop: 24 }}>
        <button id="btnPNG" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px #0002' }}
          onClick={async () => {
            const node = document.querySelector('.content') as HTMLElement;
            if (!node) return;
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(node);
            const link = document.createElement('a');
            link.download = 'caso.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          }}>
          Exportar como PNG
        </button>
      </div>
    </section>
  );
};

export default VisualizadorCaso;
