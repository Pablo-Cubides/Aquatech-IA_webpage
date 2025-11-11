import { NextResponse } from "next/server";
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
        console.log(`[visor-prompts] Found cases dir at: ${dir}`);
        return dir;
      }
    } catch (e) {
      // Continue to next path
    }
  }

  console.log(
    "[visor-prompts] Tried paths:",
    possiblePaths.map((p) => `\n  - ${p}`).join(""),
  );
  return null;
}

const STATIC_CASES_DIR = findCasesDir();

const shortTitles: Record<string, string> = {
  "1": "Spider-Man Dorado",
  "2": "Superman y Avión",
  "3": "Retrato de Mujer",
  "flux-1": "Cine de los 90s",
  "flux-1.1-2": "Caballera Medieval",
  "gemini-2": "Ceramista Japonés",
  "gemini-ai": "Hombre con Caballo",
  "stable-diffusion": "Polestar 4 Portada",
  "stable-diffusion-2": "Sala de Interrogatorio",
};

export async function GET() {
  if (!STATIC_CASES_DIR) {
    console.error("[visor-prompts] Cases directory not found");
    return NextResponse.json([], { status: 200 });
  }

  if (!fs.existsSync(STATIC_CASES_DIR)) {
    console.warn("[visor-prompts] Cases directory does not exist");
    return NextResponse.json([], { status: 200 });
  }

  try {
    const caseFolders = fs.readdirSync(STATIC_CASES_DIR).filter((folder) => {
      try {
        return fs.statSync(path.join(STATIC_CASES_DIR!, folder)).isDirectory();
      } catch {
        return false;
      }
    });

    const promptsList = caseFolders
      .map((caseFolder) => {
        const casePath = path.join(STATIC_CASES_DIR!, caseFolder);
        const promptFile = path.join(casePath, "prompt.txt");
        const descriptionFile = path.join(casePath, "description.txt");

        let prompt = "";
        try {
          if (fs.existsSync(promptFile)) {
            prompt = fs.readFileSync(promptFile, "utf-8").trim();
          }
        } catch (e) {
          console.error(`Error reading prompt for ${caseFolder}:`, e);
        }

        let description = "";
        try {
          if (fs.existsSync(descriptionFile)) {
            description = fs.readFileSync(descriptionFile, "utf-8").trim();
          }
        } catch (e) {
          console.error(`Error reading description for ${caseFolder}:`, e);
        }

        return {
          id: caseFolder,
          title: shortTitles[caseFolder] || `Caso ${caseFolder}`,
          prompt: prompt || "",
          description:
            description ||
            (prompt ? `Caso educativo: ${prompt.slice(0, 100)}...` : ""),
        };
      })
      .filter((p) => !!p.prompt);

    return NextResponse.json(promptsList);
  } catch (error) {
    console.error("[visor-prompts] Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
