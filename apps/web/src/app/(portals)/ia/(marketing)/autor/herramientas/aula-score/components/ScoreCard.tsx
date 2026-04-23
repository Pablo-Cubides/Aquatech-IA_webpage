"use client";

interface ScoreCardProps {
  id: string;
  name: string;
  score: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function ScoreCard({
  name,
  score,
  onIncrement,
  onDecrement,
}: ScoreCardProps) {
  return (
    <div className="card card-premium flex flex-row items-center justify-between p-6 md:p-8 transition-all hover:scale-[1.01]">
      <div className="flex-1">
        <h3 className="heading-tertiary text-2xl font-bold text-white tracking-tight">
          {name}
        </h3>
        <p className="text-sm text-foreground-secondary">Grupo de competencia</p>
      </div>

      <div className="flex flex-row items-center gap-8 md:gap-12">
        <div className="flex gap-3">
          <button
            onClick={onDecrement}
            disabled={score === 0}
            className="btn-danger rounded-xl w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg active:scale-90"
            aria-label={`Disminuir puntos de ${name}`}
          >
            −
          </button>
          <button
            onClick={onIncrement}
            className="btn-success rounded-xl w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg active:scale-90"
            aria-label={`Aumentar puntos de ${name}`}
          >
            +
          </button>
        </div>

        <div
          className="text-brand-gradient glow-text font-black leading-none min-w-[3ch] text-right"
          style={{ fontSize: "5rem" }}
        >
          {score}
        </div>
      </div>
    </div>
  );
}

