"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

interface ProfileSectionProps {
  portal?: "ia" | "ambiental";
}

export default function ProfileSection({ portal }: ProfileSectionProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Detectar portal automáticamente si no se proporciona
  const currentPortal =
    portal || (pathname.includes("/ia/") ? "ia" : "ambiental");
  const isDark = currentPortal === "ia";

  // Redireccionar si no hay sesión
  useEffect(() => {
    if (status === "loading") return; // Aún cargando
    if (!session) {
      router.push(`/${currentPortal}`);
    }
  }, [session, status, router, currentPortal]);

  // Estado local del perfil (conectar a base de datos en implementación real)
  const [avatarUrl, setAvatarUrl] = useState<string>(
    session?.user?.image ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  );
  const [fullName, setFullName] = useState(session?.user?.name || "");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [country, setCountry] = useState("Chile");
  const [language, setLanguage] = useState("Español");
  const [bio, setBio] = useState("");

  // Redes sociales
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  // Preferencias
  const [emailNotif, setEmailNotif] = useState(true);

  // Loading state
  if (status === "loading") {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-[#10111A] text-slate-200" : "bg-[#F5F9F8] text-[#0D161C]"}`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
        </div>
      </div>
    );
  }

  // Si no hay sesión, no mostrar nada (el redirect se encarga)
  if (!session) return null;

  useEffect(() => {
    return () => {
      if (avatarUrl?.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const handleChooseFile = () => fileInputRef.current?.click();

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/image\/(jpeg|png|webp)/.test(file.type)) {
      alert("Formato no soportado. Usa JPEG/PNG/WebP.");
      return;
    }
    if (file.size > 1_000_000) {
      alert("Imagen muy pesada. Máx 1MB.");
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setAvatarUrl(nextUrl);
    // TODO: subir a storage y guardar URL permanente
  };

  const handleSave = () => {
    // TODO: Persistir en base de datos
    console.log({
      avatarUrl,
      fullName,
      username,
      email,
      country,
      language,
      bio,
      website,
      twitter,
      linkedin,
      github,
      emailNotif,
    });
    alert("Cambios guardados (demo).");
  };

  // Clases condicionales según el tema
  const bgMain = isDark ? "bg-[#10111A]" : "bg-[#F5F9F8]";
  const textMain = isDark ? "text-slate-200" : "text-[#0D161C]";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-600";
  const cardBg = isDark ? "bg-[#1a1c29]" : "bg-white";
  const cardBorder = isDark ? "border-[#2d2f3d]" : "border-gray-200";
  const inputBg = isDark ? "bg-[#1a1c29]" : "bg-white";
  const inputBorder = isDark ? "border-slate-600" : "border-gray-300";
  const primaryColor = isDark ? "#00EFFF" : "#10B981";
  const primaryColorClass = isDark ? "text-[#00EFFF]" : "text-[#10B981]";
  const primaryBgClass = isDark ? "bg-[#00EFFF]" : "bg-[#10B981]";
  const primaryButtonText = isDark ? "text-[#10111A]" : "text-white";

  return (
    <div className={`min-h-screen ${bgMain} ${textMain}`}>
      <main className="px-4 md:px-8 py-6 md:py-10">
        <div className="mx-auto w-full max-w-7xl">
          {/* Encabezado de perfil */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-8 md:mb-10">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Avatar del usuario"
                className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 ${isDark ? "border-[#2d2f3d]" : "border-gray-200"} object-cover`}
              />
              <button
                type="button"
                onClick={handleChooseFile}
                className={`absolute bottom-0 right-0 rounded-full ${primaryBgClass} p-1.5 hover:opacity-80 transition-opacity`}
                aria-label="Cambiar foto de perfil"
                title="Cambiar foto de perfil"
              >
                <svg
                  className={`w-4 h-4 ${primaryButtonText}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="text-center md:text-left">
              <h2
                className={`text-3xl md:text-4xl font-bold ${isDark ? "text-white" : "text-[#0D161C]"}`}
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {fullName || "Usuario"}
              </h2>
              <p className={textSecondary}>@{username || "usuario"}</p>
            </div>

            <div className="md:ml-auto">
              <button
                type="button"
                onClick={handleSave}
                className={`inline-flex items-center gap-2 rounded-lg ${primaryBgClass} ${primaryButtonText} font-bold px-5 py-2.5 transition-transform hover:translate-y-[-2px]`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Guardar cambios
              </button>
            </div>
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda (contenido principal) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Detalles del Perfil */}
              <section
                className={`rounded-lg border ${cardBorder} ${cardBg} p-6`}
              >
                <h3
                  className={`text-xl font-bold ${isDark ? "text-white" : "text-[#0D161C]"} border-b ${cardBorder} pb-3 mb-6`}
                >
                  Detalles del perfil
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      Nombre completo
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} px-3 py-2`}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      Nombre de usuario
                    </label>
                    <div className="relative">
                      <span
                        className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`}
                      >
                        @
                      </span>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) =>
                          setUsername(
                            e.target.value.replace(/\s/g, "").toLowerCase(),
                          )
                        }
                        className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} pl-7 pr-3 py-2`}
                        placeholder="usuario"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} px-3 py-2`}
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      País
                    </label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} px-3 py-2`}
                    >
                      <option>Chile</option>
                      <option>México</option>
                      <option>Argentina</option>
                      <option>Colombia</option>
                      <option>Perú</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="language"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      Idioma
                    </label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} px-3 py-2`}
                    >
                      <option>Español</option>
                      <option>Inglés</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="bio"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      Biografía
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} px-3 py-2`}
                      placeholder="Cuéntanos un poco sobre ti…"
                    />
                  </div>
                </div>
              </section>

              {/* Mis redes */}
              <section
                className={`rounded-lg border ${cardBorder} ${cardBg} p-6`}
              >
                <h3
                  className={`text-xl font-bold ${isDark ? "text-white" : "text-[#0D161C]"} border-b ${cardBorder} pb-3 mb-6`}
                >
                  Mis redes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="website"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      Sitio web
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://tusitio.com"
                      className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} px-3 py-2`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="twitter"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      X / Twitter
                    </label>
                    <input
                      id="twitter"
                      type="url"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://twitter.com/usuario"
                      className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} px-3 py-2`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="linkedin"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/usuario"
                      className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} px-3 py-2`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="github"
                      className={`block text-sm font-medium ${textSecondary} mb-1`}
                    >
                      GitHub
                    </label>
                    <input
                      id="github"
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/usuario"
                      className={`w-full rounded-md ${inputBg} border ${inputBorder} ${textMain} focus:outline-none focus:ring-2 ${isDark ? "focus:ring-[#00EFFF]" : "focus:ring-[#10B981]"} px-3 py-2`}
                    />
                  </div>
                </div>
              </section>

              {/* Preferencias y Seguridad */}
              <section
                className={`rounded-lg border ${cardBorder} ${cardBg} p-6`}
              >
                <h3
                  className={`text-xl font-bold ${isDark ? "text-white" : "text-[#0D161C]"} border-b ${cardBorder} pb-3 mb-6`}
                >
                  Preferencias y seguridad
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h4
                        className={`font-semibold ${isDark ? "text-white" : "text-[#0D161C]"}`}
                      >
                        Notificaciones por correo
                      </h4>
                      <p className={`text-sm ${textSecondary}`}>
                        Recibir noticias y actualizaciones del producto.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={emailNotif}
                        onChange={(e) => setEmailNotif(e.target.checked)}
                      />
                      <div
                        className={`w-11 h-6 ${isDark ? "bg-slate-600" : "bg-gray-300"} rounded-full peer ${primaryBgClass.replace("bg-", "peer-checked:bg-")} peer-focus:ring-2 transition-colors`}
                        style={
                          {
                            "--tw-ring-color": primaryColor,
                          } as React.CSSProperties
                        }
                      >
                        <span className="absolute left-[2px] top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className={`font-semibold ${isDark ? "text-white" : "text-[#0D161C]"}`}
                      >
                        Autenticación de dos factores
                      </h4>
                      <p className={`text-sm ${textSecondary}`}>
                        Añade una capa extra de seguridad a tu cuenta.
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`rounded-lg border ${primaryColorClass} px-4 py-1.5 text-sm font-semibold hover:opacity-80 transition-opacity`}
                      style={{ borderColor: primaryColor }}
                    >
                      Activar
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className={`font-semibold ${isDark ? "text-white" : "text-[#0D161C]"}`}
                      >
                        Cambiar contraseña
                      </h4>
                      <p className={`text-sm ${textSecondary}`}>
                        Se recomienda actualizarla periódicamente.
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`rounded-lg border ${primaryColorClass} px-4 py-1.5 text-sm font-semibold hover:opacity-80 transition-opacity`}
                      style={{ borderColor: primaryColor }}
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Columna derecha (sidebar) */}
            <aside className="space-y-8">
              {/* Acceso rápido */}
              <section
                className={`rounded-lg border ${cardBorder} ${cardBg} p-6`}
              >
                <h3
                  className={`text-xl font-bold ${isDark ? "text-white" : "text-[#0D161C]"} mb-4`}
                >
                  Acceso rápido
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`/${currentPortal}/herramientas`}
                      className={`flex items-center gap-3 ${textSecondary} hover:${primaryColorClass.replace("text-", "")} transition-colors`}
                    >
                      <svg
                        className={`w-5 h-5 ${primaryColorClass}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <span>Mis herramientas</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/${currentPortal}/blog`}
                      className={`flex items-center gap-3 ${textSecondary} hover:${primaryColorClass.replace("text-", "")} transition-colors`}
                    >
                      <svg
                        className={`w-5 h-5 ${primaryColorClass}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      <span>Blogs favoritos</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/${currentPortal}/productos`}
                      className={`flex items-center gap-3 ${textSecondary} hover:${primaryColorClass.replace("text-", "")} transition-colors`}
                    >
                      <svg
                        className={`w-5 h-5 ${primaryColorClass}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span>Mis productos</span>
                    </a>
                  </li>
                </ul>
              </section>

              {/* Zona de peligro */}
              <section className="rounded-lg border border-red-500/50 bg-red-900/20 p-6">
                <h3 className="text-xl font-bold text-red-300 mb-4">
                  Zona de peligro
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4
                      className={`font-semibold ${isDark ? "text-white" : "text-[#0D161C]"}`}
                    >
                      Eliminar cuenta
                    </h4>
                    <p className={`text-sm ${textSecondary}`}>
                      Esta acción es permanente e irreversible.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-red-500 text-red-400 px-4 py-1.5 text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
