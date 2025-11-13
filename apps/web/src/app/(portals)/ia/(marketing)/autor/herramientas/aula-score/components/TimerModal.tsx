"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TimerModal({ isOpen, onClose }: TimerModalProps) {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedAt, setPausedAt] = useState(0);

  const maxMs = 9 * 60 * 1000; // 9:00

  const totalMs = minutes * 60 * 1000 + seconds * 1000;

  const handleStart = () => {
    if (totalMs === 0 || totalMs > maxMs) return;
    setRemainingMs(totalMs);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!isRunning) return;
    setPausedAt(remainingMs);
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    if (!isPaused) return;
    setRemainingMs(pausedAt);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingMs(0);
  };

  useEffect(() => {
    if (!isRunning || remainingMs <= 0) {
      if (remainingMs <= 0 && isRunning) {
        setIsRunning(false);
        new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==",
        ).play();
      }
      return;
    }

    const interval = setInterval(() => {
      setRemainingMs((prev) => {
        const next = Math.max(0, prev - 100);
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, remainingMs]);

  const displayMinutes = Math.floor(remainingMs / 60000);
  const displaySeconds = Math.floor((remainingMs % 60000) / 1000);

  return (
    <Modal isOpen={isOpen} title="Temporizador" onClose={onClose}>
      <div className="space-y-6">
        {/* Display del tiempo */}
        <div className="text-center">
          <div className="text-6xl font-bold text-primary-color font-mono">
            {String(displayMinutes).padStart(1, "0")}:
            {String(displaySeconds).padStart(2, "0")}
          </div>
        </div>

        {/* Configuración de tiempo (solo si no está corriendo) */}
        {!isRunning && !isPaused && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Minutos (0-9)
              </label>
              <input
                type="number"
                min="0"
                max="9"
                value={minutes}
                onChange={(e) =>
                  setMinutes(
                    Math.min(9, Math.max(0, parseInt(e.target.value) || 0)),
                  )
                }
                className="input-primary"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Segundos (0-59)
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) =>
                  setSeconds(
                    Math.min(59, Math.max(0, parseInt(e.target.value) || 0)),
                  )
                }
                className="input-primary"
                disabled={isRunning}
              />
            </div>
          </div>
        )}

        {/* Botones de control */}
        <div className="flex gap-3">
          {!isRunning && !isPaused && (
            <button
              onClick={handleStart}
              className="btn-primary flex-1"
              disabled={totalMs === 0 || totalMs > maxMs}
            >
              Iniciar
            </button>
          )}
          {isRunning && (
            <button onClick={handlePause} className="btn-secondary flex-1">
              Pausar
            </button>
          )}
          {isPaused && (
            <button onClick={handleResume} className="btn-success flex-1">
              Reanudar
            </button>
          )}
          {(isRunning || isPaused) && (
            <button onClick={handleReset} className="btn-danger flex-1">
              Reiniciar
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
