import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-cyan-400 mb-4">404</p>
        <h1 className="text-2xl font-semibold mb-2">Página no encontrada</h1>
        <p className="text-slate-400 mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-cyan-500 text-slate-950 rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/ia"
            className="px-6 py-3 border border-slate-700 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Portal IA
          </Link>
          <Link
            href="/ambiental"
            className="px-6 py-3 border border-slate-700 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Portal Ambiental
          </Link>
        </div>
      </div>
    </div>
  );
}
