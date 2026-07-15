"use client";

import Link from "next/link";
import { useState } from "react";

export default function FooterAmbiental() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, portal: "ambiental", source: "footer" }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Error al suscribirse. Intenta de nuevo.");
    }
  };

  return (
    <footer className="bg-white py-16 text-gray-600 border-t border-blue-600/20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-4 md:text-left">
          {/* Marca */}
          <div>
            <h3 className="text-lg font-bold text-black">Aquatech IA</h3>
            <p className="mt-2 text-sm text-gray-600">
              Tecnología para un futuro sostenible.
            </p>
            <div className="mt-4 flex justify-center gap-4 md:justify-start">
              <a
                aria-label="Facebook"
                href="https://www.facebook.com/Aquatechia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 0 256 256"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,184V136h24a8,8,0,0,0,0-16H136V104a16,16,0,0,1,16-16h8a8,8,0,0,0,0-16h-8a32,32,0,0,0-32,32v16H96a8,8,0,0,0,0,16h24v72a8,8,0,0,0,16,0Z" />
                </svg>
              </a>
              <a
                aria-label="Instagram"
                href="https://www.instagram.com/aquatech_ia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 0 256 256"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M172,36H84A48.05,48.05,0,0,0,36,84v88a48.05,48.05,0,0,0,48,48h88a48.05,48.05,0,0,0,48-48V84A48.05,48.05,0,0,0,172,36Zm32,136a32,32,0,0,1-32,32H84a32,32,0,0,1-32-32V84A32,32,0,0,1,84,52h88a32,32,0,0,1,32,32ZM128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm60-88a8,8,0,1,1-8-8A8,8,0,0,1,188,72Z" />
                </svg>
              </a>
              <a
                aria-label="X (Twitter)"
                href="https://x.com/Aquatech_ia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                aria-label="YouTube"
                href="https://www.youtube.com/@AquatechIA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 0 256 256"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0-14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Mapa del sitio */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-black">
              Mapa del sitio
            </h3>
            <nav aria-label="Navegación del mapa del sitio de Ambiental" className="mt-4 flex flex-col gap-2">
              <Link
                href="/ambiental/nosotros"
                className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                Nosotros
              </Link>
              <Link
                href="/ambiental/blog"
                className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                Blog
              </Link>
              <Link
                href="/ambiental/herramientas"
                className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                Herramientas
              </Link>
              <Link
                href="/ambiental/autor"
                className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                Autor
              </Link>
              <Link
                href="/ambiental/productos"
                className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                Productos
              </Link>
            </nav>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-black">
              Recursos
            </h3>
            <nav aria-label="Navegación de recursos de Ambiental" className="mt-4 flex flex-col gap-2">
              <Link
                href="/soporte"
                className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                Soporte
              </Link>
              <Link
                href="/faq"
                className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                FAQ
              </Link>
              <Link
                href="/guia"
                className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-600"
              >
                Guía GeoVisor
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-black">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Suscríbete para recibir las últimas noticias.
            </p>
            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="flex">
                <input
                  type="email"
                  required
                  aria-label="Tu correo electrónico para suscribirte"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email"
                  disabled={status === "loading"}
                  className="w-full rounded-l-lg border border-blue-600/30 bg-white px-4 py-2 text-sm text-black
                             placeholder:text-[#CCCCCC] focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-r-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white
                             hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Enviar"
                  )}
                </button>
              </div>
              {message && (
                <p className={`mt-2 text-xs ${
                  status === "success" ? "text-green-600" : "text-red-600"
                }`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-8 text-center text-sm">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Aquatech IA. Todos los derechos
            reservados.{" "}
            <Link
              href="/ambiental/terms"
              className="underline hover:text-[#0077B6] transition-colors"
            >
              Términos
            </Link>{" "}
            |{" "}
            <Link
              href="/ambiental/privacy"
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
