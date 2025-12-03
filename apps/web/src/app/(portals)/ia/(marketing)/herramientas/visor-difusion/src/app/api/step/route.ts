import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { loadDynamicCases } from "../_lib/cases";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

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
  // For simplicity, return a base64 encoded 1x1 pixel PNG
  // In a real implementation, you might generate a proper placeholder
  const placeholder =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  return placeholder;
}

function loadStepImageB64(caseId: string, step: number): string {
  const caseData = predefinedCases[caseId];
  if (!caseData) {
    return generatePlaceholderImage();
  }

  const stepFiles = caseData.step_files;
  const fileIndex = step - 1;

  if (fileIndex < 0 || fileIndex >= stepFiles.length) {
    const adjustedIndex = Math.min(
      stepFiles.length - 1,
      Math.max(0, fileIndex),
    );
    const imagePath = stepFiles[adjustedIndex];
    try {
      const imageData = fs.readFileSync(imagePath);
      return imageData.toString("base64");
    } catch (error) {
      console.error(`Error loading image ${imagePath}`, error as Error);
      return generatePlaceholderImage();
    }
  }

  const imagePath = stepFiles[fileIndex];
  try {
    const imageData = fs.readFileSync(imagePath);
    return imageData.toString("base64");
  } catch (error) {
    console.error(`Error loading image ${imagePath}`, error as Error);
    return generatePlaceholderImage();
  }
}

// Load cases (same as in prompts)
const predefinedCases = loadDynamicCases();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: máximo 100 requests por hora
    const headers = request.headers
      ? Object.fromEntries(request.headers.entries())
      : {};
    const ip = getClientIp(headers);
    const rateLimit = checkRateLimit(ip, {
      interval: 3600000, // 1 hora
      maxRequests: 100,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Demasiadas solicitudes. Intenta de nuevo en " +
            rateLimit.retryAfter +
            " segundos.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfter.toString(),
          },
        },
      );
    }

    const body: StepRequest = await request.json();
    const { prompt_id, step } = body;

    if (!predefinedCases[prompt_id]) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const caseData = predefinedCases[prompt_id];
    let normalizedStep = step;
    if (normalizedStep < 0) normalizedStep = 0;
    if (caseData.total_steps > 0 && normalizedStep > caseData.total_steps) {
      normalizedStep = caseData.total_steps;
    }

    const stepImage = loadStepImageB64(prompt_id, normalizedStep);
    // Public URL for the step image (if files are served from /static)
    const intermediateImageUrl = `/static/cases/${prompt_id}/step_${normalizedStep}.png`;
    const educationalText =
      EDUCATIONAL_TEXTS[normalizedStep] ||
      `Step ${normalizedStep}: progressing`;
    const isFinished =
      caseData.total_steps > 0 && normalizedStep >= caseData.total_steps;

    return NextResponse.json({
      step: normalizedStep,
      intermediate_image: stepImage,
      intermediate_image_url: intermediateImageUrl,
      educational_text: educationalText,
      is_finished: isFinished,
      total_steps: caseData.total_steps,
    });
  } catch (error) {
    console.error("Error in /step", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
