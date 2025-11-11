import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Try multiple possible locations for the noise directory
function findNoiseDir(): string | null {
  const possiblePaths = [
    // Primary: if cwd is the web app root
    path.join(
      process.cwd(),
      "src/app/(portals)/ia/(marketing)/herramientas/visor-difusion/src/components/static/noise",
    ),
    // Alternative: if cwd is the monorepo root
    path.join(
      process.cwd(),
      "apps/web/src/app/(portals)/ia/(marketing)/herramientas/visor-difusion/src/components/static/noise",
    ),
  ];

  for (const dir of possiblePaths) {
    try {
      if (fs.existsSync(dir)) {
        console.log(`[visor-noise] Found noise dir at: ${dir}`);
        return dir;
      }
    } catch (e) {
      // Continue to next path
    }
  }

  console.log("[visor-noise] Noise dir not found, tried:", possiblePaths);
  return null;
}

const STATIC_NOISE_DIR = findNoiseDir();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ step: string }> },
) {
  try {
    const { step: stepStr } = await params;
    const step = parseInt(stepStr, 10);

    console.log(`[visor-noise] GET request for step: ${step}`);

    if (step < 2 || step > 9) {
      console.warn(`[visor-noise] Invalid step: ${step}`);
      return NextResponse.json(
        { error: "No noise image available for this step" },
        { status: 404 },
      );
    }

    if (!STATIC_NOISE_DIR) {
      console.error("[visor-noise] Noise directory not found");
      return NextResponse.json(
        { error: "Noise directory not found on server" },
        { status: 500 },
      );
    }

    const noiseFile = path.join(STATIC_NOISE_DIR, `noise_step_${step}.png`);

    if (!fs.existsSync(noiseFile)) {
      console.warn(`[visor-noise] Noise file not found: ${noiseFile}`);
      return NextResponse.json(
        { error: "Noise image not found" },
        { status: 404 },
      );
    }

    try {
      const imageData = fs.readFileSync(noiseFile);
      const imageBase64 = imageData.toString("base64");
      console.log(`[visor-noise] Successfully loaded noise for step ${step}`);
      return NextResponse.json({
        step,
        noise_image: `data:image/png;base64,${imageBase64}`,
      });
    } catch (error) {
      console.error("[visor-noise] Error reading noise file:", error);
      return NextResponse.json(
        { error: "Error reading noise image" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("[visor-noise] Error in GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
