import { Plus, Clock, Image as ImageIcon } from "lucide-react";

const WEEK_DAYS = [
  { name: "Lunes", date: "16 Dic" },
  { name: "Martes", date: "17 Dic" },
  { name: "Miércoles", date: "18 Dic" },
  { name: "Jueves", date: "19 Dic" },
  { name: "Viernes", date: "20 Dic" },
  { name: "Sábado", date: "21 Dic" },
  { name: "Domingo", date: "22 Dic" },
];

export default function ContentSchedulerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Programador de Contenido
          </h1>
          <p className="text-slate-400 mt-2">
            Gestiona y programa las publicaciones de la semana.
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo Post
        </button>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {WEEK_DAYS.map((day, index) => (
          <div
            key={day.name}
            className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[600px]"
          >
            <div
              className={`p-3 border-b border-slate-800 text-center ${
                index === 0
                  ? "bg-emerald-900/20 text-emerald-400"
                  : "text-slate-400"
              }`}
            >
              <div className="font-bold">{day.name}</div>
              <div className="text-xs opacity-70">{day.date}</div>
            </div>

            <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
              {/* Mock Post Slot */}
              <div className="group relative border border-dashed border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-slate-600 hover:border-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all cursor-pointer min-h-[100px]">
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Programar</span>
              </div>

              {/* Mock Scheduled Post (Example on Monday) */}
              {index === 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-xs text-blue-400">
                    <Clock className="w-3 h-3" />
                    <span>09:00 AM</span>
                  </div>
                  <p className="text-sm text-white font-medium line-clamp-2">
                    Lanzamiento de nuevas normas ambientales 2025...
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-full h-24 bg-slate-700 rounded overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Facebook, IG</span>
                    <span className="bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded">
                      Pendiente
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
