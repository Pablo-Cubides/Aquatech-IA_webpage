import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Try multiple possible locations for the cases directory
function findCasesDir(): string | null {
  const possiblePaths = [
    // Primary: if cwd is the web app root
    path.join(
      process.cwd(),
      "src/app/(portals)/ia/(marketing)/herramientas/visor-difusion/src/components/static/cases",
    ),
    // Alternative: if cwd is the monorepo root
    path.join(
      process.cwd(),
      "apps/web/src/app/(portals)/ia/(marketing)/herramientas/visor-difusion/src/components/static/cases",
    ),
  ];

  for (const dir of possiblePaths) {
    try {
      if (fs.existsSync(dir)) {
        console.log(`[visor-step] Found cases dir at: ${dir}`);
        return dir;
      }
    } catch (e) {
      // Continue to next path
    }
  }

  console.log("[visor-step] Cases dir not found, tried:", possiblePaths);
  return null;
}

const STATIC_CASES_DIR = findCasesDir();

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
  const cases: Record<string, CaseData> = {};

  if (!STATIC_CASES_DIR) {
    console.error("[visor-step] Cases directory not found");
    return {};
  }

  if (!fs.existsSync(STATIC_CASES_DIR)) {
    console.error(
      `[visor-step] Cases directory does not exist: ${STATIC_CASES_DIR}`,
    );
    return {};
  }

  try {
    const caseFolders = fs.readdirSync(STATIC_CASES_DIR).filter((folder) => {
      try {
        return fs.statSync(path.join(STATIC_CASES_DIR!, folder)).isDirectory();
      } catch {
        return false;
      }
    });

    for (const caseFolder of caseFolders) {
      const casePath = path.join(STATIC_CASES_DIR, caseFolder);
      const promptFile = path.join(casePath, "prompt.txt");
      const descriptionFile = path.join(casePath, "description.txt");

      let prompt = "";
      try {
        if (fs.existsSync(promptFile)) {
          prompt = fs.readFileSync(promptFile, "utf-8").trim();
        }
      } catch (e) {
        console.error(
          `[visor-step] Error reading prompt for ${caseFolder}:`,
          e,
        );
      }

      let description = "";
      try {
        if (fs.existsSync(descriptionFile)) {
          description = fs.readFileSync(descriptionFile, "utf-8").trim();
        }
      } catch (e) {
        console.error(
          `[visor-step] Error reading description for ${caseFolder}:`,
          e,
        );
      }

      const stepFiles: string[] = [];
      for (let i = 1; i <= 10; i++) {
        const stepFile = path.join(casePath, `step_${i}.png`);
        try {
          if (fs.existsSync(stepFile)) {
            stepFiles.push(stepFile);
          }
        } catch {
          break;
        }
      }

      if (prompt) {
        cases[caseFolder] = {
          id: caseFolder,
          prompt,
          description:
            description || `Caso educativo: ${prompt.slice(0, 100)}...`,
          title: `Caso ${caseFolder}`,
          step_files: stepFiles,
          total_steps: stepFiles.length,
        };
      }
    }
  } catch (error) {
    console.error("[visor-step] Error loading cases:", error);
  }

  return cases;
}

function loadStepImageB64(
  caseId: string,
  step: number,
  cases: Record<string, CaseData>,
): string {
  const caseData = cases[caseId];
  if (!caseData || !caseData.step_files || caseData.step_files.length === 0) {
    return generatePlaceholderImage();
  }

  const stepFiles = caseData.step_files;
  const fileIndex = Math.max(0, Math.min(step, stepFiles.length - 1));

  try {
    const imageData = fs.readFileSync(stepFiles[fileIndex]);
    return imageData.toString("base64");
  } catch (error) {
    console.error(`Error loading step image`, error);
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

    const stepImage = loadStepImageB64(prompt_id, normalizedStep, cases);
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
