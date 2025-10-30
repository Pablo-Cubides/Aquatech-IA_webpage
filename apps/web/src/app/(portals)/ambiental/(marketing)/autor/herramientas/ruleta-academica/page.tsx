"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/ia/autor/herramientas/ruleta-academica");
  }, [router]);

  return <div>Redirigiendo a Ruleta Académica...</div>;
}
