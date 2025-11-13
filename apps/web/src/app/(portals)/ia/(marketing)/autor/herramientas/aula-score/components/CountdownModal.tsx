'use client';

import { useEffect, useState } from 'react';
import { Modal } from './Modal';

interface CountdownModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function CountdownModal({ isOpen, onComplete }: CountdownModalProps) {
  const [count, setCount] = useState(3);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (!hasStarted) {
      setHasStarted(true);
      setCount(3);
    }
  }, [isOpen, hasStarted]);

  useEffect(() => {
    if (!hasStarted || count < 0) return;

    if (count === 0) {
      // Reproducir sonido
      new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==').play();
      setTimeout(onComplete, 100);
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, hasStarted, onComplete]);

  return (
    <Modal isOpen={isOpen} title="Preparar inicio" onClose={() => {}} closeButton={false}>
      <div className="flex items-center justify-center h-48">
        <div className="text-9xl font-bold text-primary-color animate-pulse">{count > 0 ? count : '¡YA!'}</div>
      </div>
    </Modal>
  );
}
