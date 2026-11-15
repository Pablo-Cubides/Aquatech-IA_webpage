/**
 * Rutas que ningun agente debe rastrear. Se aplican a TODAS las reglas de robots.ts: el acceso ampliado de los bots de IA
 * (llms.txt, llms-full.txt) es solo sobre contenido publico, nunca mayor que el de Googlebot.
 * /ia/perfil y /ambiental/perfil son las rutas reales del perfil (la ruta "/perfil" suelta no existe).
 */
export const PRIVATE_PATHS = [
  "/api/",
  "/admin/",
  "/auth/",
  "/perfil",
  "/ia/perfil",
  "/ambiental/perfil",
  "/*.json$",
];

export const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot", "anthropic-ai"];
