'use client';

import { useState } from 'react';
import { Modal } from './Modal';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
  existingNames: string[];
}

export function AddGroupModal({ isOpen, onClose, onAdd, existingNames }: AddGroupModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setError('El nombre es requerido');
      return;
    }

    if (existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      setError('Este nombre ya existe');
      return;
    }

    onAdd(trimmed);
    setName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Agregar grupo" onClose={handleClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre del grupo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ej: Grupo A"
            className="input-primary"
            autoFocus
          />
        </div>
        {error && <div className="text-danger-color text-sm font-medium">{error}</div>}
        <button onClick={handleSubmit} className="btn-primary w-full">
          Agregar
        </button>
      </div>
    </Modal>
  );
}
