"use client";

import MenuCasos from '../components/MenuCasos';
import VisualizadorCaso from '../components/VisualizadorCaso';
import { CasosProvider } from '../context/CasosContext';

export default function Home() {
  return (
    <CasosProvider>
      <main style={{ minHeight: '100vh', padding: 0, background: 'linear-gradient(135deg, rgba(10, 10, 15, 1) 0%, rgba(19, 21, 34, 1) 100%)' }}>
        {/* Enhanced Header */}
        <div style={{ padding: '2rem 1rem', textAlign: 'center', borderBottom: '2px solid rgba(0, 239, 255, 0.3)' }}>
          {/* Logo Section */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <img
              src="/images/portal-ia/herramientas/filtrado-ia-logo.png"
              alt="FiltraIA"
              style={{
                height: '50px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 15px rgba(0, 239, 255, 0.4))'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '300',
              color: 'rgba(200, 200, 200, 0.6)',
              letterSpacing: '1px'
            }}>|</div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              margin: 0,
              background: 'linear-gradient(135deg, #00efff 0%, #0095ff 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(0, 239, 255, 0.1)'
            }}>
              FiltraIA
            </h1>
          </div>
          {/* Subtitle */}
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(200, 220, 255, 0.8)',
            margin: '0.5rem 0 0 0',
            fontWeight: '300',
            letterSpacing: '0.5px'
          }}>
            Casos Reales y Riesgos del Entrenamiento de IA
          </p>
          {/* Decorative gradient line */}
          <div style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #00efff 25%, #0095ff 50%, #10b981 75%, transparent 100%)',
            marginTop: '1.5rem',
            borderRadius: '1px'
          }} />
        </div>
        
        {/* Content Area */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', padding: '2rem 1rem' }}>
          <MenuCasos />
          <VisualizadorCaso />
        </div>
      </main>
    </CasosProvider>
  );
}
