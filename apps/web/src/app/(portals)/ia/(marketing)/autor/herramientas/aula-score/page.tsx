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
    <div className="min-h-screen flex items-center justify-center p-6">
      <ThemeToggle />

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="heading-primary mb-2">Aula Score</h1>
          <p className="text-foreground-secondary">
            Aventuras de juego en clase
          </p>
        </div>

        <div className="card space-y-6">
          {step === 1 ? (
            <>
              <div>
                <label className="block heading-tertiary mb-4">
                  ¿Cuántos grupos van a participar?
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={numGroups}
                  onChange={(e) =>
                    handleNumGroupsChange(parseInt(e.target.value) || 1)
                  }
                  className="input-primary text-2xl font-bold text-center"
                />
                <p className="text-foreground-secondary text-sm mt-2">
                  Mínimo 1, máximo 30
                </p>
              </div>
              {error && (
                <div className="text-danger-color font-medium">{error}</div>
              )}
              <button onClick={handleContinue} className="btn-primary w-full">
                Continuar
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block heading-tertiary mb-4">
                  Nombres de los grupos
                </label>
                <p className="text-foreground-secondary text-sm mb-4">
                  Ingresa un nombre único para cada grupo
                </p>

                <div className="space-y-3 max-h-96 overflow-y-auto">
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
                <div className="text-danger-color font-medium">{error}</div>
              )}

              <div className="flex gap-3">
                <button onClick={handleBack} className="btn-secondary flex-1">
                  Atrás
                </button>
                <button onClick={handleContinue} className="btn-primary flex-1">
                  Ir a Clasificación
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
