"use client";

interface ScoreCardProps {
  id: string;
  name: string;
  score: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function ScoreCard({
  id,
  name,
  score,
  onIncrement,
  onDecrement,
}: ScoreCardProps) {
  return (
    <div className="card flex flex-col items-center justify-center p-8 min-h-48">
      <h3 className="heading-tertiary text-center mb-6 text-xl">{name}</h3>

      <div
        style={{ fontSize: "4rem" }}
        className="font-bold text-primary-color mb-8"
      >
        {score}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onDecrement}
          disabled={score === 0}
          className="btn-danger rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold"
          aria-label={`Disminuir puntos de ${name}`}
        >
          −
        </button>
        <button
          onClick={onIncrement}
          className="btn-success rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold"
          aria-label={`Aumentar puntos de ${name}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
