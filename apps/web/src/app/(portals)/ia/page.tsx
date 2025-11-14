import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IA Portal - Inteligencia Artificial aplicada al agua y al ambiente",
  description:
    "Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.",
  keywords: [
    "inteligencia artificial",
    "agua",
    "medio ambiente",
    "modelos generativos",
    "visualizaciones",
    "herramientas IA",
  ],
  openGraph: {
    title: "IA Portal - Inteligencia Artificial aplicada al agua y al ambiente",
    description:
      "Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA Portal - Inteligencia Artificial aplicada al agua y al ambiente",
    description:
      "Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.",
  },
};

export default function IAPage() {
  return (
    <main className="bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-screen lg:h-screen flex items-center text-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/technology-hero.jpg')" }}
        >
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl">
            {/* Logo */}
            <div className="mb-12 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
              <img
                src="/images/Logo Aquatech - IA 512 - sin fondo.png"
                alt="Aquatech IA Logo"
                className="h-64 w-auto object-contain drop-shadow-[0_0_30px_rgba(0,239,255,0.7)]"
              />
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold text-white animate-in fade-in slide-in-from-top-6 duration-700 delay-150"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Inteligencia Artificial aplicada al agua y al ambiente
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[#E0E0E0] animate-in fade-in slide-in-from-top-8 duration-700 delay-300">
              Explora modelos generativos, visualizaciones y herramientas
              prácticas.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <button className="rounded-lg bg-cyan-400 px-8 py-3 text-base font-bold text-black transition-all duration-300 ease-out hover:bg-white hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 hover:scale-105 active:translate-y-0">
                Explorar herramientas
              </button>
              <button className="rounded-lg border-2 border-cyan-400 px-8 py-3 text-base font-bold text-cyan-400 backdrop-blur-sm bg-black/30 transition-all duration-300 ease-out hover:bg-cyan-400 hover:text-black hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 hover:scale-105 active:translate-y-0">
                Conocer más
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="py-24">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
          <div>
            <h2
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Nosotros
            </h2>
            <p className="mt-4 text-lg text-[#CCCCCC]">
              Aquatech IA se dedica a aprovechar la inteligencia artificial para
              abordar desafíos ambientales críticos. Nuestra misión es
              proporcionar soluciones innovadoras para la gestión del agua y el
              medio ambiente, fomentando un futuro sostenible a través de la
              tecnología.
            </p>
            <button className="mt-8 rounded-lg border border-cyan-400 px-6 py-2 font-medium text-cyan-400 transition-all duration-300 ease-out hover:bg-cyan-400 hover:text-black hover:-translate-y-1">
              Leer más
            </button>
          </div>

          <div className="flex justify-center">
            <img
              alt="Innovación en IA Ambiental"
              className="h-auto w-full max-w-md rounded-2xl object-cover shadow-lg transition-transform duration-300 hover:scale-105"
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop&crop=center"
            />
          </div>
        </div>
      </section>

      {/* Herramientas */}
      <section id="herramientas" className="bg-[#10111A] py-24">
        <div className="container mx-auto px-4">
          <h2
            className="text-center text-4xl font-bold text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Herramientas (IA)
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <a
              href="/ia/herramientas/como-funcionan-llm"
              className="rounded-2xl border border-cyan-500/30 bg-gray-900/50 p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                <img
                  alt="Análisis de Agua con IA"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">
                Cómo funciona un LLM
              </h3>
              <p className="mt-2 text-sm text-[#CCCCCC]">
                Descubre el funcionamiento interno de los modelos de lenguaje y
                su aplicación en el análisis de datos ambientales.
              </p>
              <button className="mt-4 w-full rounded-lg bg-cyan-500/15 py-2 font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30">
                Abrir
              </button>
            </a>

            {/* Card 2 */}
            <a
              href="/ia/herramientas/visor-difusion"
              className="rounded-2xl border border-cyan-500/30 bg-gray-900/50 p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                <img
                  alt="Visor de Difusión"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">
                Visor de difusión
              </h3>
              <p className="mt-2 text-sm text-[#CCCCCC]">
                Explora los modelos de difusión para la generación de contenido
                y visualizaciones con IA.
              </p>
              <button className="mt-4 w-full rounded-lg bg-cyan-500/15 py-2 font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30">
                Abrir
              </button>
            </a>

            {/* Card 3 */}
            <a
              href="/ia/herramientas/filtrado-ia"
              className="rounded-2xl border border-cyan-500/30 bg-gray-900/50 p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                <img
                  alt="Filtros de IA"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop&crop=center"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">
                Cómo la IA filtra las respuestas
              </h3>
              <p className="mt-2 text-sm text-[#CCCCCC]">
                Comprende los mecanismos de filtrado y validación que utilizan
                los sistemas de IA para generar respuestas precisas.
              </p>
              <button className="mt-4 w-full rounded-lg bg-cyan-500/15 py-2 font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30">
                Abrir
              </button>
            </a>
          </div>

          {/* Botón Ver más */}
          <div className="mt-12 text-center">
            <a
              href="/ia/herramientas"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/15 px-8 py-3 font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1"
            >
              Ver más herramientas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-24">
        <div className="container mx-auto px-4">
          <h2
            className="text-center text-4xl font-bold text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Blog
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Post 1 */}
            <div className="group overflow-hidden rounded-2xl border border-cyan-500/20 bg-gray-900/30 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
              <img
                alt="IA en la Gestión del Agua"
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop&crop=center"
              />
              <div className="p-6">
                <p className="text-xs text-[#CCCCCC]">24 MAYO, 2024</p>
                <h3 className="mt-2 text-lg font-bold text-white">
                  El Papel de la IA en la Gestión Sostenible del Agua
                </h3>
                <p className="mt-2 text-sm text-[#CCCCCC]">
                  Explore cómo la IA está revolucionando la gestión de recursos
                  hídricos.
                </p>
                <a
                  className="mt-4 inline-block font-semibold text-cyan-400 transition-all duration-300 group-hover:translate-x-1"
                  href="#"
                >
                  Leer →
                </a>
              </div>
            </div>

            {/* Post 2 */}
            <div className="group overflow-hidden rounded-2xl border border-cyan-500/20 bg-gray-900/30 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
              <img
                alt="Monitoreo Ambiental con IA"
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=400&h=250&fit=crop&crop=center"
              />
              <div className="p-6">
                <p className="text-xs text-[#CCCCCC]">18 MAYO, 2024</p>
                <h3 className="mt-2 text-lg font-bold text-white">
                  Soluciones de IA para el Monitoreo Ambiental
                </h3>
                <p className="mt-2 text-sm text-[#CCCCCC]">
                  Descubra cómo las herramientas de IA mejoran el monitoreo
                  ambiental.
                </p>
                <a
                  className="mt-4 inline-block font-semibold text-cyan-400 transition-all duration-300 group-hover:translate-x-1"
                  href="#"
                >
                  Leer →
                </a>
              </div>
            </div>

            {/* Post 3 */}
            <div className="group overflow-hidden rounded-2xl border border-cyan-500/20 bg-gray-900/30 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
              <img
                alt="Futuro de la IA Ambiental"
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&crop=center"
              />
              <div className="p-6">
                <p className="text-xs text-[#CCCCCC]">12 MAYO, 2024</p>
                <h3 className="mt-2 text-lg font-bold text-white">
                  El Futuro de la IA en la Conservación Ambiental
                </h3>
                <p className="mt-2 text-sm text-[#CCCCCC]">
                  Conozca las tendencias emergentes y futuras aplicaciones de la
                  IA.
                </p>
                <a
                  className="mt-4 inline-block font-semibold text-cyan-400 transition-all duration-300 group-hover:translate-x-1"
                  href="#"
                >
                  Leer →
                </a>
              </div>
            </div>
          </div>

          {/* Botón Ver más */}
          <div className="mt-12 text-center">
            <a
              href="/ia/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/15 px-8 py-3 font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1"
            >
              Ver más artículos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Autor */}
      <section id="autor" className="bg-[#10111A] py-24">
        <div className="container mx-auto flex flex-col items-center gap-8 px-4 text-center md:flex-row md:text-left">
          <img
            alt="Elena Rodriguez"
            className="h-40 w-40 rounded-full object-cover shadow-lg shadow-cyan-500/20 transition-transform duration-300 hover:scale-105"
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
          />
          <div className="flex-1">
            <h2
              className="text-4xl font-bold text-[#F3F6FF]"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Elena Rodriguez
            </h2>
            <p className="mt-2 text-lg">
              Científica Ambiental y Especialista en IA
            </p>
            <p className="mt-4 max-w-2xl md:mx-0">
              Elena es una apasionada defensora de la tecnología para el bien
              ambiental. Con más de 10 años de experiencia, lidera la
              investigación y el desarrollo en Aquatech IA.
            </p>
            <div className="mt-4 flex justify-center gap-4 md:justify-start">
              <a
                className="hover:text-[#00EFFF]"
                href="#"
                aria-label="LinkedIn"
              >
                <svg
                  fill="currentColor"
                  height="24px"
                  viewBox="0 0 256 256"
                  width="24px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
                </svg>
              </a>
              <a className="hover:text-[#00EFFF]" href="#" aria-label="X">
                <svg
                  fill="currentColor"
                  height="24px"
                  viewBox="0 0 256 256"
                  width="24px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z" />
                </svg>
              </a>
            </div>
          </div>

          <button className="shrink-0 rounded-lg border-2 border-[#00EFFF] px-6 py-2 font-bold text-[#00EFFF] transition-colors hover:bg-[#00EFFF] hover:text-[#10111A] md:ml-auto">
            Ver perfil
          </button>
        </div>
      </section>

      {/* Productos */}
      <section id="productos" className="py-24">
        <div className="container mx-auto px-4">
          <h2
            className="text-center text-4xl font-bold text-[#F3F6FF]"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Productos
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Producto 1 */}
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10111A] transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.15)]">
              <div className="relative">
                <img
                  alt="Producto IA para Gestión Hídrica"
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=225&fit=crop&crop=center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#F3F6FF]">
                  IA para la Gestión de Recursos Hídricos
                </h3>
                <p className="mt-2 text-sm">
                  Aprenda a aplicar técnicas de IA para la gestión eficiente del
                  agua.
                </p>
              </div>
            </div>

            {/* Producto 2 */}
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10111A] transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.15)]">
              <div className="relative">
                <img
                  alt="Producto Análisis de Datos Ambientales"
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center"
                />
                <span className="absolute right-3 top-3 rounded-full bg-amber-400/80 px-3 py-1 text-xs font-semibold text-black">
                  Próximamente
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#F3F6FF]">
                  Análisis de Datos Ambientales con IA
                </h3>
                <p className="mt-2 text-sm">
                  Domine el análisis de datos ambientales utilizando
                  herramientas de IA.
                </p>
              </div>
            </div>

            {/* Producto 3 */}
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10111A] transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.15)]">
              <div className="relative">
                <img
                  alt="Producto IA en Conservación"
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=225&fit=crop&crop=center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#F3F6FF]">
                  IA en Biología de la Conservación
                </h3>
                <p className="mt-2 text-sm">
                  Explore el uso de la IA en la protección y conservación de la
                  biodiversidad.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="rounded-lg bg-[#00EFFF] px-8 py-3 text-base font-bold text-[#10111A] transition-transform hover:scale-105">
              Ver todos los productos
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
