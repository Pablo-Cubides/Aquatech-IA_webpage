"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateGroupNames } from "./lib/utils";
import { ThemeToggle } from "./components/ThemeToggle";

export default function ConfigurationPage() {
  const router = useRouter();
  const [numGroups, setNumGroups] = useState(3);
  const [groupNames, setGroupNames] = useState<string[]>([
    "Grupo 1",
    "Grupo 2",
    "Grupo 3",
  ]);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleNumGroupsChange = (num: number) => {
    const clamped = Math.max(1, Math.min(30, num));
    setNumGroups(clamped);
    setGroupNames(
      Array(clamped)
        .fill("")
        .map((_, i) => `Grupo ${i + 1}`),
    );
    setError("");
  };

  const handleNameChange = (index: number, name: string) => {
    const updated = [...groupNames];
    updated[index] = name;
    setGroupNames(updated);
    setError("");
  };

  const handleContinue = () => {
    if (step === 1) {
      if (numGroups < 1 || numGroups > 30) {
        setError("El número de grupos debe estar entre 1 y 30");
        return;
      }
      setStep(2);
      return;
    }

    // Step 2: validar nombres
    const validation = validateGroupNames(groupNames);
    if (!validation.valid) {
      setError(validation.error || "Error en validación");
      return;
    }

    // Guardar estado y navegar
    sessionStorage.setItem(
      "aula-score-groups",
      JSON.stringify(
        groupNames.map((name) => ({ id: crypto.randomUUID(), name, score: 0 })),
      ),
    );

    router.push("/ia/autor/herramientas/aula-score/clasificacion");
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface p-6">
      <ThemeToggle />

      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="heading-primary mb-2 text-5xl">Aula Score</h1>
          <p className="heading-tertiary mb-8 text-foreground-secondary">
            Aventuras de juego en clase
          </p>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-primary-color to-secondary-color rounded-full"></div>
        </div>

        {/* Card principal */}
        <div className="card border border-primary-color/20 space-y-8 shadow-xl">
          {step === 1 ? (
            <>
              <div>
                <h2 className="heading-secondary mb-4">
                  ¿Cuántos grupos van a participar?
                </h2>
                <p className="text-foreground-secondary mb-6">
                  Selecciona un número entre 1 y 30
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleNumGroupsChange(numGroups - 1)}
                    disabled={numGroups <= 1}
                    className="btn-secondary w-12 h-12 p-0 text-xl font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={numGroups}
                    onChange={(e) =>
                      handleNumGroupsChange(parseInt(e.target.value) || 1)
                    }
                    className="input-primary text-center text-4xl font-bold flex-1 py-4"
                  />
                  <button
                    onClick={() => handleNumGroupsChange(numGroups + 1)}
                    disabled={numGroups >= 30}
                    className="btn-success w-12 h-12 p-0 text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-danger-color font-medium bg-danger-color/10 p-3 rounded-lg">
                  {error}
                </div>
              )}
              <button
                onClick={handleContinue}
                className="btn-primary w-full text-lg py-4"
              >
                Continuar →
              </button>
            </>
          ) : (
            <>
              <div>
                <h2 className="heading-secondary mb-2">
                  Nombres de los grupos
                </h2>
                <p className="text-foreground-secondary text-sm mb-6">
                  Ingresa un nombre único para cada grupo
                </p>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {groupNames.map((name, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium mb-1">
                        Grupo {index + 1}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          handleNameChange(index, e.target.value)
                        }
                        placeholder={`Nombre grupo ${index + 1}`}
                        className="input-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {error && (
                <div className="text-danger-color font-medium bg-danger-color/10 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="btn-secondary flex-1 py-3"
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleContinue}
                  className="btn-primary flex-1 py-3"
                >
                  Ir a Clasificación →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-foreground-secondary text-sm">Paso {step} de 2</p>
          <div className="mt-3 flex gap-2 justify-center">
            <div
              className={`h-1 w-12 rounded-full ${step === 1 ? "bg-primary-color" : "bg-primary-color/30"}`}
            ></div>
            <div
              className={`h-1 w-12 rounded-full ${step === 2 ? "bg-primary-color" : "bg-primary-color/30"}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
