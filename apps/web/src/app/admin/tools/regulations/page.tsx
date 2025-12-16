import { RegulatorySourcesAdmin } from '@/app/(portals)/ambiental/(marketing)/herramientas/normas-ambientales/src/components/RegulatorySourcesAdmin';

export default function RegulationsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Normas Ambientales</h1>
          <p className="text-slate-400 mt-2">Gestión de fuentes regulatorias y documentos legales.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <RegulatorySourcesAdmin />
      </div>
    </div>
  );
}
