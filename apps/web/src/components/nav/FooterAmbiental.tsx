"use client";

import Link from "next/link";

export default function FooterAmbiental() {
  return (
    <footer className="bg-gray-50 py-16 text-gray-600">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-4 md:text-left">
          {/* Marca */}
          <div>
            <h3 className="text-lg font-bold text-[#0D161C]">Aquatech IA</h3>
            <p className="mt-2 text-sm">
              Tecnología para un futuro sostenible.
            </p>
            <div className="mt-4 flex justify-center gap-4 md:justify-start">
              <a
                aria-label="LinkedIn"
                href="#"
                className="hover:text-[#0077B6] transition-colors"
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 0 256 256"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm-96,40a12,12,0,1,1-12,12A12,12,0,0,1,120,64Zm88,120H184a36,36,0,0,0-72,0H88V112h24v64a8,8,0,0,0,16,0V112h24v64a8,8,0,0,0,16,0V112h24Z" />
                </svg>
              </a>
              <a
                aria-label="X"
                href="#"
                className="hover:text-[#0077B6] transition-colors"
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 0 256 256"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z" />
                </svg>
              </a>
              <a
                aria-label="YouTube"
                href="#"
                className="hover:text-[#0077B6] transition-colors"
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 0 256 256"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Mapa del sitio */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D161C]">
              Mapa del sitio
            </h3>
            <nav className="mt-4 flex flex-col gap-2">
              <Link
                href="/ambiental/nosotros"
                className="text-sm hover:text-[#0077B6] transition-colors"
              >
                Nosotros
              </Link>
              <Link
                href="/ambiental/blog"
                className="text-sm hover:text-[#0077B6] transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/ambiental/herramientas"
                className="text-sm hover:text-[#0077B6] transition-colors"
              >
                Herramientas
              </Link>
              <Link
                href="/ambiental/autor"
                className="text-sm hover:text-[#0077B6] transition-colors"
              >
                Autor
              </Link>
              <Link
                href="/ambiental/productos"
                className="text-sm hover:text-[#0077B6] transition-colors"
              >
                Productos
              </Link>
            </nav>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D161C]">
              Recursos
            </h3>
            <nav className="mt-4 flex flex-col gap-2">
              <Link
                href="/soporte"
                className="text-sm hover:text-[#0077B6] transition-colors"
              >
                Soporte
              </Link>
              <Link
                href="/faq"
                className="text-sm hover:text-[#0077B6] transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contacto"
                className="text-sm hover:text-[#0077B6] transition-colors"
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D161C]">
              Newsletter
            </h3>
            <p className="mt-4 text-sm">
              Suscríbete para recibir las últimas noticias.
            </p>
            <form
              className="mt-4 flex"
              onSubmit={(e) => {
                e.preventDefault();
                // Conecta tu endpoint o servicio de newsletter
              }}
            >
              <input
                type="email"
                required
                placeholder="Tu email"
                className="w-full rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-sm text-[#0D161C]
                           placeholder:text-gray-500 focus:ring-1 focus:ring-[#0077B6] focus:border-[#0077B6]"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-[#0077B6] px-4 py-2 text-sm font-bold text-white
                           hover:bg-[#005f8a] transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-8 text-center text-sm">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Aquatech IA. Todos los derechos
            reservados.{" "}
            <Link
              href="/terminos"
              className="underline hover:text-[#0077B6] transition-colors"
            >
              Términos
            </Link>{" "}
            |{" "}
            <Link
              href="/privacidad"
              className="underline hover:text-[#0077B6] transition-colors"
            >
              Privacidad
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
