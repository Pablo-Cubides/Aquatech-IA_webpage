'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AddGroupModal } from '../components/AddGroupModal';
import { CountdownModal } from '../components/CountdownModal';
import { ScoreCard } from '../components/ScoreCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { TimerModal } from '../components/TimerModal';
import { shuffleArray } from '../lib/utils';

interface Group {
  id: string;
  name: string;
  score: number;
}

export default function ClassificationPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [shuffledGroups, setShuffledGroups] = useState<Group[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  // Cargar grupos del sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('aula-score-groups');
    if (!stored) {
      router.push('/ia/autor/herramientas/aula-score');
      return;
    }

    const parsedGroups = JSON.parse(stored) as Group[];
    setGroups(parsedGroups);
    setShowCountdown(true);
  }, [router]);

  // Cuando se completa el countdown
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setIsStarted(true);
    // Barajar solo una vez
    const shuffled = shuffleArray([...groups]);
    setShuffledGroups(shuffled);
    setGroups(shuffled);
  };

  // Incrementar puntos
  const handleIncrement = (id: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, score: g.score + 1 }
          : g
      )
    );
  };

  // Decrementar puntos
  const handleDecrement = (id: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id && g.score > 0
          ? { ...g, score: g.score - 1 }
          : g
      )
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

  // Ordenar por puntaje descendente para mostrar ranking
  const displayGroups = [...groups].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <ThemeToggle />

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-primary">Aula Score</h1>
            <p className="text-foreground-secondary">Clasificación en vivo</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTimer(true)}
              className="p-3 bg-surface hover:bg-surface-hover rounded-lg transition-colors"
              aria-label="Abrir temporizador"
              title="Temporizador"
            >
              ⏱️
            </button>
            <button
              onClick={() => router.push('/ia/autor/herramientas/aula-score')}
              className="btn-secondary"
            >
              Nueva sesión
            </button>
          </div>
        </div>
      </div>

      {/* Tablero de puntuación */}
      <div className="space-y-8">
        {isStarted && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <CountdownModal isOpen={showCountdown && !isStarted} onComplete={handleCountdownComplete} />

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
