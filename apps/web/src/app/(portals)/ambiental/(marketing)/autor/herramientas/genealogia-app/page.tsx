"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/ia/autor/herramientas/genealogia-app");
  }, [router]);

  return <div>Redirigiendo a Genealogía App...</div>;
}
