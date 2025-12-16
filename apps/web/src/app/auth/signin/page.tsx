"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, getProviders } from "next-auth/react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  // Check if auth is configured
  useEffect(() => {
    const checkProviders = async () => {
      try {
        const providers = await getProviders();
        setIsConfigured(providers !== null && Object.keys(providers).length > 0);
      } catch {
        setIsConfigured(false);
      }
    };
    checkProviders();
  }, []);

  // Handle error from URL params
  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case "OAuthSignin":
        case "OAuthCallback":
          setError("Error de configuración de autenticación. Contacta al administrador.");
          break;
        case "OAuthCreateAccount":
          setError("No se pudo crear la cuenta. Intenta de nuevo.");
          break;
        case "EmailCreateAccount":
          setError("Error al crear cuenta con email.");
          break;
        case "Callback":
          setError("Error en la autenticación. Intenta de nuevo.");
          break;
        case "AccessDenied":
          setError("Acceso denegado.");
          break;
        default:
          setError("Error de autenticación. Intenta de nuevo.");
      }
    }
  }, [errorParam]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl });
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      setError("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/Logo Aquatech - IA 512 - sin fondo.png"
              alt="AquatechIA"
              width={120}
              height={120}
              className="mx-auto drop-shadow-2xl"
              priority
            />
          </Link>
          <h2 className="mt-4 text-xl font-semibold text-white/80">
            Aquatech IA
          </h2>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Bienvenido
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Inicia sesión para acceder a la plataforma
          </p>

          {/* Configuration Warning */}
          {isConfigured === false && (
            <div className="mb-6 p-4 bg-amber-500/20 border border-amber-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-amber-300 font-medium">Configuración Pendiente</p>
                  <p className="text-amber-200/80 text-sm mt-1">
                    El sistema de autenticación no está configurado. Contacta al administrador para configurar las credenciales de Google OAuth.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Check */}
          {isConfigured === null ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : (
            <>
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading || !isConfigured}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></span>
                    Conectando...
                  </>
                ) : (
                  "Continuar con Google"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">o</span>
                </div>
              </div>

              {/* Continue as Guest */}
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Continuar como invitado
              </Link>
            </>
          )}

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/60 text-xs text-center mb-4">
              Con tu cuenta tendrás acceso a:
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-white/70">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar análisis
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Historial completo
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Exportar datos
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Soporte prioritario
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-6">
            <p className="text-gray-500 text-xs text-center">
              Al continuar, aceptas nuestros{" "}
              <Link href="/ia/terms" className="text-cyan-400 hover:underline">
                Términos de Servicio
              </Link>{" "}
              y{" "}
              <Link href="/ia/privacy" className="text-cyan-400 hover:underline">
                Política de Privacidad
              </Link>
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-white/60">Cargando...</p>
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
