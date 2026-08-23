"use client";

import { useState, useEffect } from "react";
import EducationalPanel from "@/components/EducationalPanel";

// Modelos y prompts originales
const caseInfo: Record<string, { model: string; originalPrompt: string }> = {
  "1": {
    model: "Aperture Maxcon",
    originalPrompt:
      "Portrait painting of Spider-Man wearing a gold metallic suit, ultra realistic, concept art, intricate details, eerie, highly detailed, photorealistic, octane render, 8k, unreal engine. art by artgerm and Jim Lee, NYC in the background, Full Body, Night time, photshoot",
  },
  "2": {
    model: "Aperture Maxcon",
    originalPrompt:
      "Superman flying alongside a plane, this is a selfie, his arm reaching towards the camera, you can see the pilot inside the plane.",
  },
  "3": {
    model: "Aperture Maxcon",
    originalPrompt:
      "Create a 4K digital photograph of a beautiful young Ukrainian woman with green eyes. She has a mid-length bob hairstyle with blunt, chic, modern edges and face-framing bangs that highlight her golden-brown hair. She is wearing a black midi dress and is posing with her chin down, gazing directly at the camera. The lighting is soft Rembrandt style on her face, with a gentle backlight behind her. The background features a dark red abstract gradient in a studio setting.",
  },
  "flux-1": {
    model: "Flux 1",
    originalPrompt:
      "The photo: Create a cinematic, photorealistic medium shot capturing the nostalgic warmth of a late 90s indie film.",
  },
  "flux-1.1-2": {
    model: "Flux 1.1-2",
    originalPrompt:
      "Set in medieval times. A woman is riding a horse down a village street. She is riding away from the viewer. there is a large foreboding castle in the distance. Lightning can be seen streaking across the sky. She has long messy auburn hair. She is wearing dark leather armor. The horse has a saddle and saddle bags. It is raining and there are puddles forming in the dirt. sharp scenery, lush background, ultra-detailed environment, natural textures, vibrant lighting, crisp clouds, realistic water surface, vivid skies, photo-real terrain, fantstyle, MythP0rt, raz'sscenesmith-mk.1",
  },
  "gemini-2": {
    model: "Gemini 2",
    originalPrompt:
      "A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful. Vertical portrait orientation.",
  },
  "gemini-ai": {
    model: "Gemini AI",
    originalPrompt:
      "Ultra realistic, 8K resolution cinematic image of a person crouching beside a powerful black horse in a snow-covered mountainous landscape. Face with the face from the uploaded image, keeping the facial features exactly the same. Wavy hair, and wears dark sunglasses, a cozy black sweater, grey cargo pants, and black boots. He crouches with one knee bent, holding the reins of the horse with a relaxed yet confident posture. The horse is muscular, with a glossy jet-black coat, flowing mane, and expressive eyes, wearing a simple leather halter. Snow blankets the ground with footprints and scattered rocks visible. In the background, soft-focus snow-covered hills, pine trees, and distant mountain peaks stretch under a clear blue sky. Snowflakes gently fall around them, adding depth and softness to the scene. The lighting is soft and natural, highlighting details like the texture of the snow, fabric folds, and hair strands. The overall mood is calm, adventurous, and majestic, evoking a sense of freedom and harmony with nature.",
  },
  "stable-diffusion": {
    model: "Stable Diffusion",
    originalPrompt:
      "Magazine cover. Polestar 4, employee of the month. Running over MGroup",
  },
  "stable-diffusion-2": {
    model: "Stable Diffusion 2",
    originalPrompt:
      'A realistic photo of an interrogation room in a Spanish police station. A Spanish "Policía Nacional" officer in dark blue uniform questions a suspect across a metal table. The room has sparse furniture, concrete walls, a two-way mirror. Dramatic overhead lighting, tense atmosphere, photorealistic, 8k.',
  },
};

// Nota sobre optimización de imágenes:
// Las imágenes en esta aplicación son datos base64 generados dinámicamente
// desde las APIs serverless, no URLs estáticas. Por esta razón, no se puede
// usar el componente <Image> de Next.js que requiere URLs optimizables.
// Se mantienen las etiquetas <img> nativas para contenido dinámico.

interface Prompt {
  id: string;
  text?: string;
  title?: string;
  description?: string;
  prompt?: string;
  model?: string;
  originalPrompt?: string;
}

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptsLoading, setPromptsLoading] = useState<boolean>(true);
  const [selectedPromptId, setSelectedPromptId] = useState<string>("");
  // Stateless backend: frontend tracks prompt and current step
  // stateless: no simulationId needed - kept for potential future use
  const [, setSimulationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Define default total steps, will be updated by API
  const [currentTotalSteps, setCurrentTotalSteps] = useState<number>(10);

  console.log("Component rendered, current state:", {
    selectedPromptId,
    currentStep,
    isLoading,
    isFinished,
    currentTotalSteps,
  });
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // --- IMAGE STATES ---
  const [noiseImage, setNoiseImage] = useState<string | null>(null);
  const [intermediateImage, setIntermediateImage] = useState<string | null>(
    null,
  );
  const [educationalText, setEducationalText] = useState<string>(
    'Bienvenido. Selecciona un prompt y haz clic en "Iniciar Simulación".',
  );

  // --- STATE FOR TRANSPARENT NOISE IMAGE ---
  const [noiseOverlayImage, setNoiseOverlayImage] = useState<string | null>(
    null,
  );
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.3);

  // --- STATE FOR SELECTED PROMPT ---
  const [, setSelectedPromptText] = useState<string>("");

  // --- STATES FOR BOTTOM PANEL ---
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedOriginalPrompt, setSelectedOriginalPrompt] =
    useState<string>("");

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setPromptsLoading(true);
        console.log("🔄 [CLIENT] Fetching cases from /api/visor-prompts...");
        const response = await fetch("/api/visor-prompts");
        console.log("🔄 [CLIENT] Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("🔴 [CLIENT] Response not OK:", errorText);
          throw new Error(`Failed to load prompts: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          "✅ [CLIENT] Cases loaded successfully:",
          data.length,
          "cases",
        );
        console.log(
          "✅ [CLIENT] Case IDs:",
          data.map((c: Prompt) => c.id).join(", "),
        );

        if (data.length === 0) {
          console.warn("⚠️  [CLIENT] No cases returned from API");
          setError("No se encontraron casos educativos en el servidor.");
        }

        setPrompts(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar casos";
        console.error("🔴 [CLIENT] Error loading cases:", err);
        setError(message);
      } finally {
        setPromptsLoading(false);
      }
    };
    fetchPrompts();
  }, []); // --- FUNCTION TO LOAD STATIC NOISE IMAGE ---
  const loadStaticNoiseImage = async (step: number): Promise<string | null> => {
    if (step < 2 || step > 9) return null;
    try {
      // Usar archivos estáticos directamente desde /public
      return `/static/noise/noise_step_${step}.png`;
    } catch (err) {
      console.error(`Error loading noise for step ${step}:`, err);
      return null;
    }
  };

  // --- EFFECT TO GENERATE NOISE AT EACH STEP ---
  useEffect(() => {
    const loadNoiseOverlay = async () => {
      const overlay = await loadStaticNoiseImage(currentStep);
      setNoiseOverlayImage(overlay);

      // Opacidad fija para las imágenes estáticas (no necesitamos variarla)
      setOverlayOpacity(0.8); // Un poco más visible porque las imágenes ya son muy sutiles
    };

    loadNoiseOverlay();
  }, [currentStep]);

  const handleStartSimulation = async () => {
    if (!selectedPromptId) return;
    console.log("Starting simulation for prompt:", selectedPromptId);
    setIsLoading(true);
    setError(null);
    try {
      // Stateless: initialize local state and attempt to load step 0 image
      setCurrentStep(0);
      setIsFinished(false);
      setNoiseImage(null);
      setIntermediateImage(null);
      setEducationalText("Initializing...");

      console.log(
        "Calling /api/visor-step with step 0 for prompt",
        selectedPromptId,
      );
      const response = await fetch("/api/visor-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt_id: selectedPromptId, step: 0 }),
      });
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error("No se pudo iniciar la simulación.");
      const data = await response.json();

      // Update total steps from API response
      if (data.total_steps) {
        setCurrentTotalSteps(data.total_steps);
      }

      console.log("Step 0 loaded:", data); // API routes may return either a full data URL (data:image/...) or raw base64.
      const img = data.intermediate_image;
      const asDataUrl =
        img &&
        (img.startsWith("/") ||
          img.startsWith("http") ||
          img.startsWith("data:"))
          ? img
          : `data:image/png;base64,${img}`;
      setNoiseImage(asDataUrl);
      setIntermediateImage(asDataUrl);
      setEducationalText(data.educational_text);
      setCurrentStep(1);
      console.log("Simulation started successfully, currentStep set to 1");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      console.error("Error in handleStartSimulation:", err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (!selectedPromptId || currentStep > currentTotalSteps) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/visor-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt_id: selectedPromptId,
          step: currentStep,
        }),
      });
      if (!response.ok) throw new Error("Error al procesar el siguiente paso.");
      const data = await response.json();

      // Update total steps from API response to be sure
      if (data.total_steps) {
        setCurrentTotalSteps(data.total_steps);
      }

      const img = data.intermediate_image;

      // Determine if image is a URL path or base64 data
      // If it starts with / (local path) or http (external url), use as is.
      // Otherwise, assume it's raw base64 data referencing a specific image type (usually png/jpeg).
      const asDataUrl =
        img &&
        (img.startsWith("/") ||
          img.startsWith("http") ||
          img.startsWith("data:"))
          ? img
          : `data:image/png;base64,${img}`;
      setIntermediateImage(asDataUrl);
      setEducationalText(data.educational_text);

      const finished = data.is_finished;
      setIsFinished(finished);

      if (!finished) {
        setCurrentStep((s) => s + 1);
      } else {
        setCurrentStep(currentTotalSteps + 1);
        // Asegurarse de que el ruido desaparezca en el último paso
        setNoiseOverlayImage(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedPromptId) return;
    try {
      setIsExporting(true);
      const res = await fetch(
        `/api/visor-export-gif?case_id=${selectedPromptId}&include_noise=true&overlay_opacity=0.8&frame_ms=350&linger_last_ms=1200`,
      );
      if (!res.ok) throw new Error("No se pudo generar el GIF.");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `diffusion_${selectedPromptId}.gif`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error exportando GIF";
      setError(message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setSelectedPromptId("");
    setSimulationId(null);
    setCurrentStep(0);
    setIsLoading(false);
    setIsFinished(false);
    setError(null);
    setNoiseImage(null);
    setIntermediateImage(null);
    setNoiseOverlayImage(null);
    setSelectedPromptText("");
    setEducationalText(
      'Bienvenido. Selecciona un prompt y haz clic en "Iniciar Simulación".',
    );
  };

  return (
    <div className="min-h-screen bg-[#000106] text-[#FFFFFF] flex flex-col p-4 sm:p-6 lg:p-8 font-sans">
      <header className="text-center mb-8 pb-8 border-b-2 border-[#00D4FF]/20">
        {/* Logo and Title Container */}
        <div className="flex flex-col items-center justify-center gap-4 mb-4 sm:flex-row sm:gap-6">
          {/* PixelGen Logo */}
          <img
            src="/images/portal-ia/herramientas/pixelgen-logo.png"
            alt="PixelGen - Visor de Difusión"
            className="flex-shrink-0 object-contain w-auto h-14 sm:h-36"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#00FF88] to-[#FFFFFF] tracking-tight mb-4">
          Visor de Modelos de Difusión
        </h1>
        {/* Description */}
        <p className="text-base sm:text-lg text-[#E8F0FF] mt-2 max-w-3xl mx-auto leading-relaxed">
          Una herramienta educativa interactiva para visualizar cómo la IA
          genera imágenes mediante el proceso de difusión, transformando ruido
          en arte paso a paso.
        </p>
      </header>

      {error && (
        <div className="bg-[#FF3366]/20 border border-[#FF3366] text-[#FF3366] px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto w-full">
          <b>Error:</b> {error}
        </div>
      )}

      {/* --- SELECCIÓN DE PROMPT --- */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#FFFFFF]">
          1. Selecciona un Prompt Educativo
        </h2>
        {promptsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner"></div>
            <span className="ml-3 text-[#E8F0FF]">
              Cargando casos educativos...
            </span>
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="bg-[#FF3366]/20 border border-[#FF3366] text-[#FF3366] px-6 py-4 rounded-lg">
              <p className="font-semibold">❌ No se encontraron casos</p>
              <p className="mt-2 text-sm">
                Verifica la consola (F12) para más detalles
              </p>
            </div>
          </div>
        ) : (
          <div className="grid max-w-6xl grid-cols-1 gap-4 mx-auto md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                onClick={() => {
                  if (currentStep === 0) {
                    console.log("📌 Selected prompt:", prompt.id, prompt.title);
                    setSelectedPromptId(prompt.id);
                    setSelectedPromptText(prompt.prompt || "");
                    setSelectedModel(caseInfo[prompt.id]?.model || "");
                    setSelectedOriginalPrompt(
                      caseInfo[prompt.id]?.originalPrompt || "",
                    );
                  }
                }}
                className={`glass p-4 cursor-pointer transition-all transform hover:scale-105 ${
                  selectedPromptId === prompt.id
                    ? "border-[#00D4FF] ring-2 ring-[#00D4FF]/70 bg-[#00D4FF]/10"
                    : "hover:border-[#00D4FF]/70 hover:bg-[#00D4FF]/5"
                } ${currentStep > 0 ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <h3 className="font-bold text-lg text-[#00D4FF] line-clamp-2">
                  {prompt.title}
                </h3>
                <p className="text-sm text-[#E8F0FF] mb-2 mt-2 line-clamp-3">
                  {prompt.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- CONTROLES PRINCIPALES --- */}
      <div className="flex flex-col w-full max-w-4xl gap-4 mx-auto mb-8 glass">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <h3 className="text-xl font-semibold text-[#FFFFFF]">
            2. Controla la Simulación
          </h3>
          <button
            onClick={handleStartSimulation}
            disabled={isLoading || currentStep > 0 || !selectedPromptId}
            className="button-primary min-w-max"
            aria-label="Iniciar simulación de generación de imágenes con IA"
          >
            {isLoading && currentStep === 0 ? (
              <>
                <span className="mr-2 spinner"></span>
                Iniciando...
              </>
            ) : (
              "Iniciar Simulación"
            )}
          </button>
          <button
            onClick={handleNextStep}
            disabled={
              isLoading || !selectedPromptId || isFinished || currentStep === 0
            }
            className="button-secondary min-w-max"
            aria-label="Avanzar al siguiente paso del proceso de difusión"
          >
            {isLoading && !!selectedPromptId ? (
              <>
                <span className="mr-2 spinner"></span>
                Procesando...
              </>
            ) : (
              `Siguiente (${Math.min(currentStep, currentTotalSteps)}/${currentTotalSteps})`
            )}
          </button>
          <button
            onClick={handleReset}
            className="button-secondary min-w-max"
            aria-label="Reiniciar la simulación"
          >
            Reiniciar
          </button>
          <button
            onClick={handleExport}
            disabled={!isFinished || isExporting}
            className="px-4 py-2 bg-[#00FF88] text-[#0A0E27] rounded-lg font-semibold hover:bg-[#33FFAA] transition-all duration-200 hover:shadow-lg hover:shadow-[#00FF88]/70 disabled:opacity-50 disabled:cursor-not-allowed min-w-max"
            aria-label="Descargar la animación de difusión como archivo GIF"
          >
            {isExporting ? (
              <>
                <span className="mr-2 spinner"></span>
                Generando...
              </>
            ) : (
              "⬇️ Descargar GIF"
            )}
          </button>
        </div>
      </div>

      {/* --- PANELES DE VISUALIZACIÓN --- */}
      <main className="grid flex-grow grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        <div className="flex flex-col card">
          <h2 className="text-xl font-semibold mb-4 text-[#00D4FF]">
            Ruido Inicial
          </h2>
          <div className="flex-grow bg-[#0F1629] rounded-lg flex items-center justify-center aspect-square overflow-hidden">
            {noiseImage ? (
              <img
                src={noiseImage}
                alt="Ruido Inicial"
                className="object-contain w-full h-full"
              />
            ) : (
              <p className="text-[#E8F0FF]">Esperando simulación...</p>
            )}
          </div>
          <p className="mt-4 text-center text-[#B0C4FF] text-sm">
            Timestep: {currentStep > 0 ? Math.max(0, currentStep - 1) : "N/A"}
          </p>
        </div>

        <div className="flex flex-col card">
          <h2 className="text-xl font-semibold mb-4 text-[#00D4FF]">
            Proceso de Difusión
          </h2>
          <div className="flex-grow bg-[#0F1629] rounded-lg flex items-center justify-center aspect-square relative overflow-hidden">
            {intermediateImage ? (
              <>
                <img
                  src={intermediateImage}
                  alt={`Paso ${currentStep - 1}`}
                  className="absolute top-0 left-0 object-contain w-full h-full"
                />
                {noiseOverlayImage && (
                  <img
                    src={noiseOverlayImage}
                    alt="Capa de ruido"
                    className="absolute top-0 left-0 object-contain w-full h-full pointer-events-none"
                    style={{ opacity: overlayOpacity }}
                  />
                )}
              </>
            ) : (
              <p className="text-[#E8F0FF]">Esperando el primer paso...</p>
            )}
          </div>
          <p className="mt-4 text-center text-[#B0C4FF] text-sm">
            Paso:{" "}
            {currentStep > 0
              ? `${Math.max(0, currentStep - 1)}/${currentTotalSteps}`
              : "N/A"}
          </p>
        </div>

        <div className="card flex flex-col p-0 overflow-hidden border-2 border-[#00D4FF]/30">
          <EducationalPanel
            upperText={educationalText}
            lowerText={`Modelo: ${selectedModel}\n\nPrompt: ${selectedOriginalPrompt}`}
          />
        </div>
      </main>

      <footer className="text-center">
        <p className="text-sm text-[#FFB700] bg-[#FFB700]/10 border border-[#FFB700]/30 rounded-lg px-4 py-3 max-w-2xl mx-auto">
          ℹ️ Esta es una simulación educativa que demuestra cómo los modelos de
          difusión generan imágenes mejorando progresivamente la calidad.
        </p>
      </footer>
    </div>
  );
}
