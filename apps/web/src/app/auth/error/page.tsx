"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    // Redirect back to the callback URL with error parameter
    const separator = callbackUrl.includes("?") ? "&" : "?";
    const redirectUrl = `${callbackUrl}${separator}auth_error=${encodeURIComponent(error || "unknown")}`;
    
    // Small delay to ensure the redirect happens
    setTimeout(() => {
      router.replace(redirectUrl);
    }, 100);
  }, [error, callbackUrl, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
