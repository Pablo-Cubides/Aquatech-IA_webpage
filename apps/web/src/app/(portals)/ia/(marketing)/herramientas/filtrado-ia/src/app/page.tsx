"use client";

import MenuCasos from '../components/MenuCasos';
import VisualizadorCaso from '../components/VisualizadorCaso';
import { CasosProvider } from '../context/CasosContext';

export default function Home() {
  return (
    <CasosProvider>
      <main style={{ minHeight: '100vh', padding: 0, background: 'linear-gradient(135deg, rgba(10, 10, 15, 1) 0%, rgba(19, 21, 34, 1) 100%)' }}>
        {/* Premium Header */}
        <div style={{
          padding: '3rem 2rem',
          background: 'linear-gradient(180deg, rgba(0, 239, 255, 0.08) 0%, transparent 100%)',
          borderBottom: '2px solid rgba(0, 239, 255, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative background elements */}
          <div style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(0, 239, 255, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(0, 149, 255, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          
          {/* Logo Container */}
          <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
            <img
              src="/images/Portal IA/Herramientas/FiltrarIA.png"
              alt="FiltrarIA"
              style={{
                height: '80px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 20px rgba(0, 239, 255, 0.5)) drop-shadow(0 0 40px rgba(0, 149, 255, 0.3))',
                margin: '0 auto',
                display: 'block'
              }}
              onError={(e) => {
                console.error('Error loading FiltrarIA logo');
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>

          {/* Subtitle */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(0, 239, 255, 0.9)',
              margin: '1rem 0 0 0',
              fontWeight: '400',
              letterSpacing: '0.8px',
              textTransform: 'uppercase'
            }}>
              Casos Reales y Riesgos del Entrenamiento de IA
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(200, 220, 255, 0.7)',
              margin: '0.5rem 0 0 0',
              fontWeight: '300',
              letterSpacing: '0.3px'
            }}>
              Explora cómo los filtros de seguridad protegen a los usuarios de contenido peligroso
            </p>
          </div>

          {/* Decorative gradient line */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, #00efff 25%, #0095ff 50%, #10b981 75%, transparent 100%)',
            marginTop: '2rem',
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(0, 239, 255, 0.5)'
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
