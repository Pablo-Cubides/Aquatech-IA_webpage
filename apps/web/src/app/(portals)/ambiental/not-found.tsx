import Link from "next/link";

export default function AmbientalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F9F8] text-[#0D161C]">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-[#0077B6] mb-4">404</h1>
        <h2 className="text-2xl mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Puedes volver al inicio o explorar nuestras secciones populares.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/ambiental">
            <p className="bg-[#10B981] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0077B6] transition-colors">
              Volver al inicio
            </p>
          </Link>
          <Link href="/ambiental/herramientas">
            <p className="bg-transparent border-2 border-[#0077B6] text-[#0077B6] px-6 py-3 rounded-lg font-semibold hover:bg-[#0077B6] hover:text-white transition-colors">
              Explorar herramientas
            </p>
          </Link>
        </div>
        <div className="mt-12 text-left max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Quizás buscabas:</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/ambiental/herramientas/visor-mapas-ambientales">
                <p className="text-[#0077B6] hover:underline">
                  Visor de Mapas Ambientales
                </p>
              </Link>
            </li>
            <li>
              <Link href="/ambiental/herramientas/normas-ambientales">
                <p className="text-[#0077B6] hover:underline">
                  Normas Ambientales
                </p>
              </Link>
            </li>
            <li>
              <Link href="/ambiental/blog">
                <p className="text-[#0077B6] hover:underline">
                  Blog Ambiental
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
