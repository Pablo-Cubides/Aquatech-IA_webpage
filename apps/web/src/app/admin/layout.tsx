import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Calendar, ShieldAlert } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
            <ShieldAlert className="w-6 h-6" />
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
          >
            <Users className="w-5 h-5" />
            Usuarios
          </Link>

          <Link
            href="/admin/content"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
          >
            <Calendar className="w-5 h-5" />
            Programar Posts
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              {session.user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {session.user?.name}
              </p>
              <p className="text-xs truncate opacity-70">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
