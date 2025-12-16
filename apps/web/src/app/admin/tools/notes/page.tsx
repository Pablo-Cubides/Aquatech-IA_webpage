import UploadNotes from "@/app/(portals)/ia/(marketing)/autor/herramientas/consulta-nota/UploadNotes";

export default function NotesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Consulta de Notas</h1>
          <p className="text-slate-400 mt-2">Carga masiva de calificaciones y gestión de base de conocimiento.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Subir Archivo de Notas</h2>
            <p className="text-slate-400 mb-6 text-sm">
                Sube un archivo Excel (.xlsx) con las columnas requeridas para actualizar la base de datos de notas de los estudiantes.
            </p>
            <UploadNotes />
        </div>
      </div>
    </div>
  );
}
