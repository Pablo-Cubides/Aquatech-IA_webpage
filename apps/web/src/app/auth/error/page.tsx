"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  Configuration: "Hay un problema con la configuración del servidor.",
  AccessDenied: "No tienes permiso para acceder a esta página.",
  Verification: "El enlace de verificación ha expirado o ya fue usado.",
  OAuthSignin: "Error al conectar con el proveedor de autenticación.",
  OAuthCallback: "Error en la respuesta del proveedor de autenticación.",
  OAuthCreateAccount: "No se pudo crear la cuenta con este proveedor.",
  EmailCreateAccount: "No se pudo crear la cuenta con este email.",
  Callback: "Hubo un error en el proceso de autenticación.",
  OAuthAccountNotLinked: "Esta cuenta ya está vinculada a otro método de inicio de sesión.",
  SessionRequired: "Debes iniciar sesión para acceder a esta página.",
  Default: "Ocurrió un error durante la autenticación.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-4">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Error de Autenticación
        </h1>
        <p className="text-gray-400 mb-8">{errorMessage}</p>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
          >
            Intentar de nuevo
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
          >
            Volver al inicio
          </Link>
        </div>

        {/* Debug info (solo en desarrollo) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-left">
            <p className="text-gray-500 text-xs font-mono">
              Error code: {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
