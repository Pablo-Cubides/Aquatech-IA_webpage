"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AddGroupModal } from "../components/AddGroupModal";
import { CountdownModal } from "../components/CountdownModal";
import { ScoreCard } from "../components/ScoreCard";
import { ThemeToggle } from "../components/ThemeToggle";
import { TimerModal } from "../components/TimerModal";
import { shuffleArray } from "../lib/utils";

interface Group {
  id: string;
  name: string;
  score: number;
}

export default function ClassificationPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const hasShuffledRef = useRef(false);

  // Cargar grupos del sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("aula-score-groups");
    if (!stored) {
      router.push("/ia/autor/herramientas/aula-score");
      return;
    }

    const parsedGroups = JSON.parse(stored) as Group[];
    setGroups(parsedGroups);
    setShowCountdown(true);
  }, [router]);

  // Cuando se completa el countdown
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    // Barajar solo una vez, guardar el orden
    if (!hasShuffledRef.current) {
      const shuffled = shuffleArray([...groups]);
      setGroups(shuffled);
      hasShuffledRef.current = true;
    }
    setIsStarted(true);
  };

  // Incrementar puntos
  const handleIncrement = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, score: g.score + 1 } : g)),
    );
  };

  // Decrementar puntos
  const handleDecrement = (id: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id && g.score > 0 ? { ...g, score: g.score - 1 } : g,
      ),
    );
  };

  // Agregar grupo tardío
  const handleAddGroup = (name: string) => {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      score: 0,
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  // No reordenar - mantener el orden del shuffle
  const displayGroups = groups;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <ThemeToggle />

      {/* Header */}
      <div className="mb-12">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <img 
              src="/images/portal-ia/autor/aula-score.png" 
              alt="Aula Score" 
              className="h-20 md:h-28 w-auto object-contain"
            />
            <p className="text-foreground-secondary text-lg font-medium ml-1">Clasificación en vivo</p>
          </div>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShowTimer(true)}
              className="p-4 bg-surface hover:bg-surface-hover rounded-xl border border-border transition-all hover:scale-105"
              aria-label="Abrir temporizador"
              title="Temporizador"
            >
              <span className="text-2xl">⏱️</span>
            </button>
            <button
              onClick={() => router.push("/ia/autor/herramientas/aula-score")}
              className="btn-secondary py-4 px-8"
            >
              Nueva sesión
            </button>
          </div>
        </div>
      </div>

      {/* Tablero de puntuación */}
      <div className="max-w-6xl mx-auto space-y-12">
        {isStarted && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {displayGroups.map((group) => (
              <ScoreCard
                key={group.id}
                id={group.id}
                name={group.name}
                score={group.score}
                onIncrement={() => handleIncrement(group.id)}
                onDecrement={() => handleDecrement(group.id)}
              />
            ))}
          </div>
        )}


        {/* Botón agregar grupo */}
        {isStarted && (
          <button
            onClick={() => setShowAddGroup(true)}
            className="btn-primary w-full py-4 text-lg"
            aria-label="Agregar nuevo grupo"
          >
            + Agregar grupo
          </button>
        )}
      </div>

      {/* Modales */}
      <CountdownModal
        isOpen={showCountdown && !isStarted}
        onComplete={handleCountdownComplete}
      />

      <AddGroupModal
        isOpen={showAddGroup}
        onClose={() => setShowAddGroup(false)}
        onAdd={handleAddGroup}
        existingNames={groups.map((g) => g.name)}
      />

      <TimerModal isOpen={showTimer} onClose={() => setShowTimer(false)} />
    </div>
  );
}
