import { NextRequest, NextResponse } from "next/server";

const CASES_PUBLIC_PATH = "/static/visor-cases";
const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

interface CaseData {
  id: string;
  prompt: string;
  description: string;
  title: string;
  step_files: string[];
  total_steps: number;
}

interface StepRequest {
  prompt_id: string;
  step: number;
}

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

function generatePlaceholderImage(): string {
  const placeholder =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  return placeholder;
}

function loadCases(): Record<string, CaseData> {
  const cases: Record<string, CaseData> = {
    "1": {
      id: "1",
      prompt: "Spider-Man wearing a gold medal, portrait painting",
      description: "Portrait painting of Spider-Man wearing a gold medal",
      title: "Spider-Man Dorado",
      step_files: Array.from({ length: 9 }, (_, i) => 
        `${CASES_PUBLIC_PATH}/1/step_${i + 1}.png`
      ),
      total_steps: 9,
    },
    "2": {
      id: "2",
      prompt: "Superman and airplane",
      description: "Superman flying next to an airplane",
      title: "Superman y Avión",
      step_files: Array.from({ length: 8 }, (_, i) => 
        `${CASES_PUBLIC_PATH}/2/step_${i + 1}.png`
      ),
      total_steps: 8,
    },
    "3": {
      id: "3",
      prompt: "Woman portrait",
      description: "Portrait of a woman",
      title: "Retrato de Mujer",
      step_files: Array.from({ length: 9 }, (_, i) => 
        `${CASES_PUBLIC_PATH}/3/step_${i + 1}.png`
      ),
      total_steps: 9,
    },
    "flux-1": {
      id: "flux-1",
      prompt: "1990s cinema aesthetic",
      description: "90s cinema aesthetic image",
      title: "Cine de los 90s",
      step_files: Array.from({ length: 7 }, (_, i) => 
        `${CASES_PUBLIC_PATH}/flux-1/step_${i + 1}.png`
      ),
      total_steps: 7,
    },
    "flux-1.1-2": {
      id: "flux-1.1-2",
      prompt: "Medieval knight woman",
      description: "Medieval knight in armor",
      title: "Caballera Medieval",
      step_files: Array.from({ length: 8 }, (_, i) => 
        `${CASES_PUBLIC_PATH}/flux-1.1-2/step_${i + 1}.png`
      ),
      total_steps: 8,
    },
    "gemini-2": {
      id: "gemini-2",
      prompt: "Japanese ceramist working",
      description: "Japanese ceramist at work",
      title: "Ceramista Japonés",
      step_files: Array.from({ length: 9 }, (_, i) => 
        `${CASES_PUBLIC_PATH}/gemini-2/step_${i + 1}.png`
      ),
      total_steps: 9,
    },
    "gemini-ai": {
      id: "gemini-ai",
      prompt: "Man with horse",
      description: "Man with a horse",
      title: "Hombre con Caballo",
      step_files: Array.from({ length: 8 }, (_, i) => 
        `${CASES_PUBLIC_PATH}/gemini-ai/step_${i + 1}.png`
      ),
      total_steps: 8,
    },
    "stable-diffusion": {
      id: "stable-diffusion",
      prompt: "Polestar 4 cover art",
      description: "Polestar 4 car cover",
      title: "Polestar 4 Portada",
      step_files: Array.from({ length: 9 }, (_, i) => 
        `${CASES_PUBLIC_PATH}/stable-diffusion/step_${i + 1}.png`
      ),
      total_steps: 9,
    },
    "stable-diffusion-2": {
      id: "stable-diffusion-2",
      prompt: "Interrogation room scene",
      description: "Interrogation room",
      title: "Sala de Interrogatorio",
      step_files: Array.from({ length: 8 }, (_, i) => 
        `${CASES_PUBLIC_PATH}/stable-diffusion-2/step_${i + 1}.png`
      ),
      total_steps: 8,
    },
  };

  return cases;
}

async function loadStepImageB64(
  filePath: string,
): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}${filePath}`, {
      cache: "force-cache",
    });
    
    if (!response.ok) {
      console.error(
        `[visor-step] Failed to fetch image: ${filePath}, status: ${response.status}`
      );
      return generatePlaceholderImage();
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  } catch (error) {
    console.error(`[visor-step] Error loading step image from ${filePath}:`, error);
    return generatePlaceholderImage();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: StepRequest = await request.json();
    const { prompt_id, step } = body;

    console.log(
      `[visor-step] POST request for case: ${prompt_id}, step: ${step}`,
    );

    const cases = loadCases();

    if (Object.keys(cases).length === 0) {
      console.error("[visor-step] No cases loaded");
      return NextResponse.json(
        { error: "No cases available" },
        { status: 500 },
      );
    }

    if (!cases[prompt_id]) {
      console.error(
        `[visor-step] Case not found: ${prompt_id}. Available cases:`,
        Object.keys(cases),
      );
      return NextResponse.json(
        { error: `Case not found: ${prompt_id}` },
        { status: 404 },
      );
    }

    const caseData = cases[prompt_id];
    let normalizedStep = Math.max(0, step);
    if (caseData.total_steps > 0 && normalizedStep > caseData.total_steps) {
      normalizedStep = caseData.total_steps;
    }

    const stepFilePath = caseData.step_files[normalizedStep] || caseData.step_files[0];
    const stepImage = await loadStepImageB64(stepFilePath);
    const educationalText =
      EDUCATIONAL_TEXTS[normalizedStep] ||
      `Step ${normalizedStep}: progressing`;
    const isFinished =
      caseData.total_steps > 0 && normalizedStep >= caseData.total_steps;

    console.log(
      `[visor-step] Returning step ${normalizedStep}, finished: ${isFinished}, total_steps: ${caseData.total_steps}`,
    );

    return NextResponse.json({
      step: normalizedStep,
      intermediate_image: stepImage,
      educational_text: educationalText,
      is_finished: isFinished,
      total_steps: caseData.total_steps,
    });
  } catch (error) {
    console.error("[visor-step] Error in POST:", error);
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown"}`,
      },
      { status: 500 },
    );
  }
}
