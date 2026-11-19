// Sentry en el navegador: carga diferida. Ver src/lib/observability/sentry-client.ts
// para el porqué (presupuesto de JS). Sin DSN no se engancha ni se carga nada.
import { installLazyErrorCapture } from "@/lib/observability/sentry-client";

installLazyErrorCapture();

// Sin trazas de navegación a propósito (ver sentry-client.ts). Se exporta vacío para que
// el SDK no avise en cada build de que falta el hook.
export const onRouterTransitionStart = () => {};
