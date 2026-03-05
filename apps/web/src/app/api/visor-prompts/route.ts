import { NextResponse } from "next/server";

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

const casePrompts: Record<string, string> = {
  "1": "Spider-Man wearing a gold medal, portrait painting",
  "2": "Superman and airplane",
  "3": "Woman portrait",
  "flux-1": "1990s cinema aesthetic",
  "flux-1.1-2": "Medieval knight woman",
  "gemini-2": "Japanese ceramist working",
  "gemini-ai": "Man with horse",
  "stable-diffusion": "Polestar 4 cover art",
  "stable-diffusion-2": "Interrogation room scene",
};

const caseDescriptions: Record<string, string> = {
  "1": "Portrait painting of Spider-Man wearing a gold medal",
  "2": "Superman flying next to an airplane",
  "3": "Portrait of a woman",
  "flux-1": "90s cinema aesthetic image",
  "flux-1.1-2": "Medieval knight in armor",
  "gemini-2": "Japanese ceramist at work",
  "gemini-ai": "Man with a horse",
  "stable-diffusion": "Polestar 4 car cover",
  "stable-diffusion-2": "Interrogation room",
};

export async function GET() {
  try {
    const caseIds = Object.keys(shortTitles);

    const promptsList = caseIds.map((caseId) => ({
      id: caseId,
      title: shortTitles[caseId] || `Caso ${caseId}`,
      prompt: casePrompts[caseId] || "",
      description: caseDescriptions[caseId] || "",
    }));

    return NextResponse.json(promptsList);
  } catch (error) {
    console.error("[visor-prompts] Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
