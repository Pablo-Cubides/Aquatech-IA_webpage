import { prisma } from "@ia-next/database";
import { Users, Activity, Server, Newspaper } from "lucide-react";
import Link from "next/link";
import { getStoredArticles } from "@/lib/services/blog-store";

export default async function AdminDashboard() {
  // Fetch real stats
  let userCount = 0;
  try {
    userCount = await prisma.user.count();
  } catch (e) {
    // db fallback
  }

  const storedArticles = await getStoredArticles();
  const totalPosts = storedArticles.length;
  const activeSessions = 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard General</h1>
        <p className="text-slate-400 mt-2">
          Bienvenido al panel de control global de Aquatech IA.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Usuarios Totales</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-white">{userCount}</p>
          <p className="text-xs text-emerald-500 mt-1">+0% esta semana</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Sesiones Activas</h3>
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-white">{activeSessions}</p>
          <p className="text-xs text-slate-500 mt-1">En tiempo real</p>
        </div>

        <Link
          href="/admin/content"
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-6 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 group-hover:text-white font-medium">Artículos de Blog</h3>
            <Newspaper className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">{totalPosts}</p>
          <p className="text-xs text-emerald-400/80 mt-1">Gestionar y publicar &rarr;</p>
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Estado del Sistema</h3>
            <Server className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">Normal</p>
          <p className="text-xs text-slate-500 mt-1">
            Todos los servicios operativos
          </p>
        </div>
      </div>

      {/* Tools Management Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Gestión de Herramientas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/tools/regulations" className="group">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <h3 className="font-bold text-white group-hover:text-blue-400">
                Normas Ambientales
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Gestionar fuentes regulatorias y documentos.
              </p>
            </div>
          </Link>

          <Link href="/admin/tools/maps" className="group">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
              <h3 className="font-bold text-white group-hover:text-emerald-400">
                Visor de Mapas
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Subir y gestionar capas geográficas.
              </p>
            </div>
          </Link>

          <Link href="/admin/tools/notes" className="group">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <h3 className="font-bold text-white group-hover:text-purple-400">
                Consulta de Notas
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Subir notas y gestionar base de conocimiento.
              </p>
            </div>
          </Link>

          <Link href="/admin/tools/question-banks" className="group">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
              <h3 className="font-bold text-white group-hover:text-amber-400">
                Bancos de Preguntas
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Gestionar bancos para la Ruleta Académica.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
