"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
}

export function AuthModal({ isOpen, onClose, theme = "dark" }: AuthModalProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { redirect: false });
      onClose();
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos basados en el tema
  const styles = {
    dark: {
      backdrop: "bg-black/50",
      modal: "bg-[#10111A] border border-white/10",
      title: "text-[#F3F6FF]",
      text: "text-[#B6C2DF]",
      button: "bg-[#00EFFF] text-[#10111A] hover:bg-[#00D4E6]",
      closeButton: "text-[#B6C2DF] hover:text-[#F3F6FF]",
    },
    light: {
      backdrop: "bg-black/50",
      modal: "bg-white border border-gray-200",
      title: "text-[#0D161C]",
      text: "text-gray-700",
      button: "bg-[#0077B6] text-white hover:bg-[#005A87]",
      closeButton: "text-gray-500 hover:text-gray-700",
    },
  };

  const currentStyles = styles[theme];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${currentStyles.backdrop} backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`rounded-xl p-6 max-w-md w-full shadow-2xl ${currentStyles.modal}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${currentStyles.title}`}>
            {session ? "Mi Cuenta" : "Iniciar Sesión"}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-gray-100/10 ${currentStyles.closeButton}`}
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
        </div>

        {session ? (
          // Usuario autenticado
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "Usuario"}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className={`font-medium ${currentStyles.title}`}>
                  {session.user?.name}
                </p>
                <p className={`text-sm ${currentStyles.text}`}>
                  {session.user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${currentStyles.button} disabled:opacity-50`}
            >
              {isLoading ? "Cerrando sesión..." : "Cerrar Sesión"}
            </button>
          </div>
        ) : (
          // Usuario no autenticado
          <div className="space-y-4">
            <p className={currentStyles.text}>
              Inicia sesión para acceder a todas las funcionalidades de la
              plataforma.
            </p>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-3 border ${
                theme === "dark"
                  ? "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:shadow-md"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:shadow-md"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                {isLoading ? "Iniciando sesión..." : "Continuar con Google"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface AuthButtonProps {
  theme?: "dark" | "light";
  className?: string;
}

export function AuthButton({ theme = "dark", className }: AuthButtonProps) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        {session ? "Mi Cuenta" : "Iniciar sesión"}
      </button>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theme={theme}
      />
    </>
  );
}
