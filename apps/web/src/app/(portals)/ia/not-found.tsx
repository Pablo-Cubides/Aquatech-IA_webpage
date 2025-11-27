import Link from "next/link";

export default function IaNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10111A] text-white">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-[#00EFFF] mb-4">404</h1>
        <h2 className="text-2xl mb-4">Página no encontrada</h2>
        <p className="text-[#CCCCCC] mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Puedes volver al inicio o explorar nuestras secciones populares.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/ia">
            <p className="bg-[#00EFFF] text-black px-6 py-3 rounded-lg font-semibold hover:bg-white transition-colors">
              Volver al inicio
            </p>
          </Link>
          <Link href="/ia/herramientas">
            <p className="bg-transparent border-2 border-[#00EFFF] text-[#00EFFF] px-6 py-3 rounded-lg font-semibold hover:bg-[#00EFFF] hover:text-black transition-colors">
              Explorar herramientas
            </p>
          </Link>
        </div>
        <div className="mt-12 text-left max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Quizás buscabas:</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/ia/herramientas/como-funcionan-llm">
                <p className="text-[#00EFFF] hover:underline">
                  Cómo funciona un LLM
                </p>
              </Link>
            </li>
            <li>
              <Link href="/ia/herramientas/visor-difusion">
                <p className="text-[#00EFFF] hover:underline">
                  Visor de difusión
                </p>
              </Link>
            </li>
            <li>
              <Link href="/ia/blog">
                <p className="text-[#00EFFF] hover:underline">
                  Blog de IA
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
