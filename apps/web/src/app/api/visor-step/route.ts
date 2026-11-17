import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { readBoundedJson } from "@/lib/schemas/blog-article.zod";
import { guardPublicProxy, proxyError } from "@/lib/security/public-proxy";

const CASES_PUBLIC_PATH = "/static/visor-cases";

interface CaseData {
  id: string;
  prompt: string;
  description: string;
  title: string;
  step_files: string[];
  total_steps: number;
}

// SEC-003: cuerpo validado. `prompt_id` es una clave de la tabla de casos (se busca con hasOwn:
// "constructor" o "__proto__" no son casos). `step` entero acotado.
const stepRequestSchema = z.strictObject({
  prompt_id: z.string().regex(/^[A-Za-z0-9.-]{1,40}$/),
  step: z.number().int().min(0).max(100),
});

const EDUCATIONAL_TEXTS: Record<number, string> = {
  0: "🎯 Inicializamos con ruido aleatorio puro. Este es el punto de partida donde no hay información visual coherente.",
  1: "🔄 Paso 1: El modelo comienza a detectar patrones muy básicos en el ruido y hace las primeras predicciones sobre qué podría emerger.",
  2: "🎨 Paso 2: Emergen las primeras formas y contornos vagos. El modelo está identificando las regiones principales de la imagen.",
  3: "🖼️ Paso 3: Se definen mejor las formas básicas y la composición general. Los colores principales empiezan a aparecer.",
  4: "🎭 Paso 4: Los detalles faciales y las características principales se vuelven reconocibles. La estructura está tomando forma.",
  5: "✨ Paso 5: Se refinan los detalles y se mejora la definición. Los elementos del prompt se hacen más evidentes.",
  6: "🔍 Paso 6: Los detalles finos se añaden y se corrigen imperfecciones. La calidad visual mejora significativamente.",
  7: "🌟 Paso 7: Se perfeccionan los detalles y se añaden texturas más realistas. La imagen está casi completa.",
  8: "💫 Paso 8: Refinamiento final de detalles y ajuste de colores. Los últimos retoques hacen la imagen más realista.",
  9: "🎉 Paso 9: Imagen final generada. El proceso de difusión ha transformado completamente el ruido en una imagen coherente.",
  10: "✅ Proceso completado. La imagen ha pasado por todo el proceso de difusión, desde ruido puro hasta el resultado final detallado.",
};

function loadCases(): Record<string, CaseData> {
  const cases: Record<string, CaseData> = {
    "1": {
      id: "1",
      prompt: "Spider-Man wearing a gold medal, portrait painting",
      description: "Portrait painting of Spider-Man wearing a gold medal",
      title: "Spider-Man Dorado",
      step_files: Array.from(
        { length: 9 },
        (_, i) => `${CASES_PUBLIC_PATH}/1/step_${i + 1}.jpg`,
      ),
      total_steps: 9,
    },
    "2": {
      id: "2",
      prompt: "Superman and airplane",
      description: "Superman flying next to an airplane",
      title: "Superman y Avión",
      step_files: Array.from(
        { length: 8 },
        (_, i) => `${CASES_PUBLIC_PATH}/2/step_${i + 1}.jpg`,
      ),
      total_steps: 8,
    },
    "3": {
      id: "3",
      prompt: "Woman portrait",
      description: "Portrait of a woman",
      title: "Retrato de Mujer",
      step_files: Array.from(
        { length: 9 },
        (_, i) => `${CASES_PUBLIC_PATH}/3/step_${i + 1}.jpg`,
      ),
      total_steps: 9,
    },
    "flux-1": {
      id: "flux-1",
      prompt: "1990s cinema aesthetic",
      description: "90s cinema aesthetic image",
      title: "Cine de los 90s",
      step_files: Array.from(
        { length: 7 },
        (_, i) => `${CASES_PUBLIC_PATH}/flux-1/step_${i + 1}.jpg`,
      ),
      total_steps: 7,
    },
    "flux-1.1-2": {
      id: "flux-1.1-2",
      prompt: "Medieval knight woman",
      description: "Medieval knight in armor",
      title: "Caballera Medieval",
      step_files: Array.from(
        { length: 8 },
        (_, i) => `${CASES_PUBLIC_PATH}/flux-1.1-2/step_${i + 1}.jpg`,
      ),
      total_steps: 8,
    },
    "gemini-2": {
      id: "gemini-2",
      prompt: "Japanese ceramist working",
      description: "Japanese ceramist at work",
      title: "Ceramista Japonés",
      step_files: Array.from(
        { length: 9 },
        (_, i) => `${CASES_PUBLIC_PATH}/gemini-2/step_${i + 1}.jpg`,
      ),
      total_steps: 9,
    },
    "gemini-ai": {
      id: "gemini-ai",
      prompt: "Man with horse",
      description: "Man with a horse",
      title: "Hombre con Caballo",
      step_files: Array.from(
        { length: 8 },
        (_, i) => `${CASES_PUBLIC_PATH}/gemini-ai/step_${i + 1}.jpg`,
      ),
      total_steps: 8,
    },
    "stable-diffusion": {
      id: "stable-diffusion",
      prompt: "Polestar 4 cover art",
      description: "Polestar 4 car cover",
      title: "Polestar 4 Portada",
      step_files: Array.from(
        { length: 9 },
        (_, i) => `${CASES_PUBLIC_PATH}/stable-diffusion/step_${i + 1}.jpg`,
      ),
      total_steps: 9,
    },
    "stable-diffusion-2": {
      id: "stable-diffusion-2",
      prompt: "Interrogation room scene",
      description: "Interrogation room",
      title: "Sala de Interrogatorio",
      step_files: Array.from(
        { length: 8 },
        (_, i) => `${CASES_PUBLIC_PATH}/stable-diffusion-2/step_${i + 1}.jpg`,
      ),
      total_steps: 8,
    },
  };

  return cases;
}

export async function POST(request: NextRequest) {
  // Cálculo local sin coste de terceros: límite en memoria, por instancia.
  const guard = await guardPublicProxy(request, {
    name: "visor:step",
    schema: z.strictObject({}),
    perMinutePerIp: 120,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;

  const raw = await readBoundedJson(request);
  if (!raw.ok) {
    return proxyError(raw.status, raw.status === 413 ? "payload_too_large" : "invalid_json", "Cuerpo inválido.");
  }
  const parsed = stepRequestSchema.safeParse(raw.value);
  if (!parsed.success) {
    return proxyError(400, "invalid_body", "Cuerpo inválido: se espera { prompt_id, step }.");
  }
  const { prompt_id, step } = parsed.data;

  try {
    const cases = loadCases();

    if (!Object.prototype.hasOwnProperty.call(cases, prompt_id)) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const caseData = cases[prompt_id];
    let normalizedStep = step;
    if (caseData.total_steps > 0 && normalizedStep > caseData.total_steps) {
      normalizedStep = caseData.total_steps;
    }

    // If we are at or past the end, show the final image (last in array)
    // Otherwise show the requested step, or fallback to 0 if missing.
    const lastImageIndex = caseData.step_files.length - 1;
    const stepIndex =
      normalizedStep >= caseData.step_files.length
        ? lastImageIndex
        : normalizedStep;

    const stepFilePath =
      caseData.step_files[stepIndex] || caseData.step_files[0];

    // Returning the path/URL directly instead of reading the file
    // This avoids bundling large static assets into the serverless function
    const educationalText =
      EDUCATIONAL_TEXTS[normalizedStep] ||
      `Step ${normalizedStep}: progressing`;
    const isFinished =
      caseData.total_steps > 0 && normalizedStep >= caseData.total_steps;

    return NextResponse.json({
      step: normalizedStep,
      intermediate_image: stepFilePath,
      educational_text: educationalText,
      is_finished: isFinished,
      total_steps: caseData.total_steps,
    });
  } catch (error) {
    logger.error("[visor-step] Error in POST", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
