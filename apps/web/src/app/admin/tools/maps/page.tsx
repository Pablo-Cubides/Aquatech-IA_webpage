"use client";

import { useState } from "react";
import UploadWizard from "@/app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales/src/components/UploadWizard";
import { Map, UploadCloud } from "lucide-react";

export default function MapsAdminPage() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Visor de Mapas Ambientales</h1>
          <p className="text-slate-400 mt-2">Gestión de capas geográficas y datos ambientales.</p>
        </div>
      </div>

      {!showWizard ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-500/50 transition-all cursor-pointer group" onClick={() => setShowWizard(true)}>
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <UploadCloud className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Subir Nuevos Datos</h3>
                <p className="text-slate-400 max-w-sm">
                    Carga archivos GeoJSON, CSV o Excel para añadir nuevas capas al visor de mapas.
                </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <Map className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Gestionar Capas Existentes</h3>
                <p className="text-slate-400 max-w-sm">
                    Edita o elimina capas ya publicadas en el visor. (Próximamente)
                </p>
            </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">Asistente de Carga</h2>
                <button onClick={() => setShowWizard(false)} className="text-sm text-slate-400 hover:text-white">
                    Cancelar
                </button>
            </div>
            <UploadWizard 
                onComplete={() => {
                    setShowWizard(false);
                    // Optionally show success toast
                }}
                onCancel={() => setShowWizard(false)}
            />
        </div>
      )}
    </div>
  );
}
