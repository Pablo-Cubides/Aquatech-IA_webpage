'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  closeButton?: boolean;
}

export function Modal({ isOpen, title, children, onClose, closeButton = true }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 id="modal-title" className="heading-secondary">
            {title}
          </h2>
          {closeButton && onClose && (
            <button
              onClick={onClose}
              className="text-foreground-secondary hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          )}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
