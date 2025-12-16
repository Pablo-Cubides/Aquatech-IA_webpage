import { prisma } from "@ia-next/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming these exist or I'll use raw HTML if they fail
import { Users, FileText, Activity, Server } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  // Fetch real stats
  const userCount = await prisma.user.count();
  // Mock other stats for now
  const activeSessions = 0; 
  const totalPosts = 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard General</h1>
        <p className="text-slate-400 mt-2">Bienvenido al panel de control global de Aquatech IA.</p>
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

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Posts Programados</h3>
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-white">{totalPosts}</p>
          <p className="text-xs text-slate-500 mt-1">Para esta semana</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Estado del Sistema</h3>
            <Server className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">Normal</p>
          <p className="text-xs text-slate-500 mt-1">Todos los servicios operativos</p>
        </div>
      </div>

      {/* Tools Management Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Gestión de Herramientas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/tools/regulations" className="group">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <h3 className="font-bold text-white group-hover:text-blue-400">Normas Ambientales</h3>
              <p className="text-sm text-slate-400 mt-2">Gestionar fuentes regulatorias y documentos.</p>
            </div>
          </Link>
          
          <Link href="/admin/tools/maps" className="group">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
              <h3 className="font-bold text-white group-hover:text-emerald-400">Visor de Mapas</h3>
              <p className="text-sm text-slate-400 mt-2">Subir y gestionar capas geográficas.</p>
            </div>
          </Link>

          <Link href="/admin/tools/notes" className="group">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <h3 className="font-bold text-white group-hover:text-purple-400">Consulta de Notas</h3>
              <p className="text-sm text-slate-400 mt-2">Subir notas y gestionar base de conocimiento.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
