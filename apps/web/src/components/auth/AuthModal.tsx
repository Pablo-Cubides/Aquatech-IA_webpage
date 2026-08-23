"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef, useLayoutEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { LayoutDashboard, UserCog, LogOut, X, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot3",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot4",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot5",
  "https://robohash.org/Cat1.png?set=set4",
  "https://robohash.org/Cat2.png?set=set4",
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg",
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f415.svg",
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f42c.svg",
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
}

type AuthMode = "login" | "register";

function reloadPageSafely() {
  if (typeof window === "undefined") {
    return;
  }

  if (process.env.NODE_ENV === "test") {
    return;
  }

  window.location.reload();
}

function AuthModalContent({ isOpen, onClose, theme = "dark" }: AuthModalProps) {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<AuthMode>("login");
  const [view, setView] = useState<"default" | "edit-profile">("default");

  // Profile Edit State
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Detect auth error from URL params (after redirect from auth/error page)
  useEffect(() => {
    const authError = searchParams.get("auth_error");
    if (authError) {
      const errorMessages: Record<string, string> = {
        Callback: "Error de autenticación. Por favor intenta de nuevo.",
        OAuthSignin: "Error al iniciar sesión con Google.",
        OAuthCallback: "Error en la respuesta de Google.",
        OAuthCreateAccount: "No se pudo crear la cuenta.",
        EmailCreateAccount: "No se pudo crear la cuenta con este email.",
        Signin: "Error al iniciar sesión.",
        OAuthAccountNotLinked: "Este email ya está registrado con otro método.",
        default: "Error de autenticación. Por favor intenta de nuevo.",
      };
      setError(errorMessages[authError] || errorMessages["default"]);

      // Clean the URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    if (session?.user) {
      setEditName(session.user.name || "");
      setEditImage(session.user.image || AVATARS[0]);
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, image: editImage }),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil");

      await updateSession({
        ...session,
        user: { ...session?.user, name: editName, image: editImage },
      });

      setView("default");
      setSuccess("Perfil actualizado correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset scroll position when modal opens - force multiple times to combat autofocus
  useLayoutEffect(() => {
    if (isOpen) {
      // Immediate scroll reset
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
      // Delayed scroll reset to combat browser autofocus behavior
      const timer1 = setTimeout(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0;
        if (modalRef.current) modalRef.current.scrollTop = 0;
      }, 50);

      return () => {
        clearTimeout(timer1);
      };
    }
  }, [isOpen]);

  // Ensure we only render portal on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  // ... (maintain logic)

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Store return URL for error handling
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_return_url", window.location.href);
      }
      await signIn("google", { callbackUrl: window.location.href });
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Error de conexión. Verifica tu internet.");
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al registrar");
        }

        setSuccess("¡Cuenta creada! Iniciando sesión...");
        setTimeout(() => {
          handleCredentialsSignIn();
        }, 1000);
      } else {
        await handleCredentialsSignIn();
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error al procesar la solicitud.",
      );
      setIsLoading(false);
    }
  };

  const handleCredentialsSignIn = async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      setIsLoading(false);
    } else {
      onClose();
      reloadPageSafely();
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      onClose();
      reloadPageSafely();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError(null);
    setSuccess(null);
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    resetForm();
  };

  const isDark = theme === "dark";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      data-testid="auth-modal-backdrop"
    >
      <div className="flex min-h-full items-start justify-center p-4 py-8 md:py-12">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
            isDark
              ? "bg-[#10111A] border border-cyan-500/20"
              : "bg-white border border-gray-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - Fixed relative to modal container */}
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className={`absolute top-4 right-4 z-30 p-2 rounded-lg transition-colors ${
              isDark
                ? "text-gray-400 hover:text-white hover:bg-white/10"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {session ? (
            // Usuario autenticado
            <div className="p-6">
              {view === "default" ? (
                <div className="space-y-6 pt-4">
                  <div className="text-center">
                    <h2
                      className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Mi Cuenta
                    </h2>
                  </div>

                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative group">
                      <div className="relative w-24 h-24">
                        <img
                          src={session.user?.image || AVATARS[0]}
                          alt={session.user?.name || "Usuario"}
                          className="w-24 h-24 rounded-full ring-4 ring-cyan-500/30 object-cover bg-white/5"
                          onError={(e) => {
                            // Hide the broken img and show initials div
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            const fallback = parent?.querySelector('.avatar-fallback') as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="avatar-fallback w-24 h-24 rounded-full ring-4 ring-cyan-500/30 bg-gradient-to-br from-purple-500 to-cyan-500 items-center justify-center text-white text-2xl font-bold"
                          style={{ display: 'none' }}
                        >
                          {(session.user?.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <button
                        onClick={() => setView("edit-profile")}
                        aria-label="Editar perfil y avatar"
                        className="absolute bottom-0 right-0 p-1.5 bg-cyan-500 rounded-full text-black hover:bg-cyan-400 transition-colors shadow-lg"
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {session.user?.name}
                      </p>
                      <p
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {session.user?.email}
                      </p>
                      {/* @ts-ignore */}
                      {session.user?.role === "ADMIN" && (
                        <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          ADMINISTRADOR
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* @ts-ignore */}
                    {session.user?.role === "ADMIN" && (
                      <button
                        onClick={() => {
                          onClose();
                          router.push("/admin");
                        }}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          isDark
                            ? "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Panel de Administración
                      </button>
                    )}

                    <button
                      onClick={() => setView("edit-profile")}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        isDark
                          ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                          : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <UserCog className="w-5 h-5" />
                      Editar Perfil
                    </button>

                    <button
                      onClick={handleSignOut}
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        isDark
                          ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                          : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      }`}
                    >
                      <LogOut className="w-5 h-5" />
                      {isLoading ? "Cerrando..." : "Cerrar Sesión"}
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Profile View
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Editar Perfil
                    </h2>
                    <button
                      onClick={() => setView("default")}
                      aria-label="Volver a la información de cuenta"
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium ">
                        Elige tu Avatar
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {AVATARS.map((avatar, i) => (
                          <button
                            key={i}
                            onClick={() => setEditImage(avatar)}
                            aria-label={`Seleccionar Avatar ${i + 1}`}
                            className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all bg-white/5 ${
                              editImage === avatar
                                ? "border-cyan-500 ring-2 ring-cyan-500/20 scale-105"
                                : "border-transparent hover:border-white/20"
                            }`}
                          >
                            <img
                              src={avatar}
                              alt={`Avatar ${i}`}
                              className="w-full h-full object-cover"
                            />
                            {editImage === avatar && (
                              <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium ">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${
                          isDark
                            ? "bg-white/5 border border-white/10 text-white focus:border-cyan-500"
                            : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-blue-500"
                        }`}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setView("default")}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          isDark
                            ? "bg-white/5 text-gray-300 hover:bg-white/10"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isLoading}
                        className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                          isDark
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/20"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Usuario no autenticado
            <>
              {/* Header (Logo + Title + Google) - Sticky */}
              <div
                className={`p-6 pb-0 sticky top-0 z-20 ${isDark ? "bg-[#10111A]" : "bg-white"}`}
              >
                {/* Logo */}
                <div ref={logoRef} className="flex justify-center mb-4">
                  <img
                    src="/images/logo-aquatech.png"
                    alt="Aquatech IA"
                    width={80}
                    height={80}
                    className="drop-shadow-lg object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/portal-ia/logo-ia.png";
                    }}
                  />
                </div>

                {/* Title */}
                <div className="text-center mb-6">
                  <h2
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                  </h2>
                  <p
                    className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {mode === "login"
                      ? "Accede a tu cuenta para continuar"
                      : "Regístrate para empezar"}
                  </p>
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-3 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:shadow-lg transition-all disabled:opacity-50 mb-4"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>
                    {isLoading ? "Conectando..." : "Continuar con Google"}
                  </span>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 pt-0">
                <div className="space-y-5">
                  {/* Messages */}
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-red-500 text-sm text-center">
                        {error}
                      </p>
                    </div>
                  )}
                  {success && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <p className="text-green-500 text-sm text-center">
                        {success}
                      </p>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div
                        className={`w-full border-t ${isDark ? "border-white/20" : "border-gray-300"}`}
                      ></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span
                        className={`px-4 text-sm ${isDark ? "bg-[#10111A] text-gray-400" : "bg-white text-gray-500"}`}
                      >
                        o continúa con email
                      </span>
                    </div>
                  </div>

                  {/* Email Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    {mode === "register" && (
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Tu nombre"
                          autoFocus={false}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                            isDark
                              ? "bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                              : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                          }`}
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        autoFocus={false}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Contraseña
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoFocus={false}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                        }`}
                        required
                        minLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                        isDark
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                      }`}
                    >
                      {isLoading
                        ? "Procesando..."
                        : mode === "login"
                          ? "Iniciar Sesión"
                          : "Crear Cuenta"}
                    </button>
                  </form>

                  {/* Toggle mode */}
                  <p
                    className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {mode === "login"
                      ? "¿No tienes cuenta? "
                      : "¿Ya tienes cuenta? "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className={`font-semibold ${isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-500"}`}
                    >
                      {mode === "login" ? "Regístrate" : "Inicia sesión"}
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function AuthModal(props: AuthModalProps) {
  return (
    <Suspense fallback={null}>
      <AuthModalContent {...props} />
    </Suspense>
  );
}

interface AuthButtonProps {
  theme?: "dark" | "light";
  className?: string;
}

function AuthButtonFallback({ theme = "dark", className }: AuthButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const styles = {
    dark: "rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-[#B6C2DF] transition-all hover:border-[#00EFFF] hover:text-[#00EFFF] opacity-80",
    light:
      "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#0077B6] hover:text-[#0077B6] hover:bg-blue-50 opacity-80",
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className || styles[theme]}
      >
        Iniciar sesión
      </button>
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theme={theme}
      />
    </>
  );
}

function AuthButtonContent({ theme = "dark", className }: AuthButtonProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-open modal if there's an auth error in URL
  useEffect(() => {
    const authError = searchParams.get("auth_error");
    if (authError) {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const styles = {
    dark: "rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-[#B6C2DF] transition-all hover:border-[#00EFFF] hover:text-[#00EFFF]",
    light:
      "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#0077B6] hover:text-[#0077B6] hover:bg-blue-50",
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className || styles[theme]}
      >
        {session ? session.user?.name || "Mi Cuenta" : "Iniciar sesión"}
      </button>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theme={theme}
      />
    </>
  );
}

export function AuthButton(props: AuthButtonProps) {
  return (
    <Suspense fallback={<AuthButtonFallback {...props} />}>
      <AuthButtonContent {...props} />
    </Suspense>
  );
}
