import { prisma } from "@ia-next/database";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      accounts: true // To see provider (Google, etc)
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="text-slate-400 mt-2">Administra los usuarios registrados en la plataforma.</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300">
          Total: <span className="font-bold text-white">{users.length}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Registro</th>
                <th className="px-6 py-4">Proveedor</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-white">{user.name?.[0] || "U"}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name || "Sin nombre"}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                        : 'bg-slate-700/50 text-slate-300 border border-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(user.createdAt), "d MMM, yyyy", { locale: es })}
                  </td>
                  <td className="px-6 py-4">
                    {user.accounts.length > 0 ? (
                      <span className="capitalize">{user.accounts[0].provider}</span>
                    ) : (
                      "Email"
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-400 hover:text-blue-300 font-medium text-xs">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
