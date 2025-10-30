"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/ia/autor/herramientas/visualizador-notas");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-lg text-gray-600">
          Redirigiendo a Visualizador de Notas...
        </p>
      </div>
    </div>
  );
}
