'use client'

import React from 'react'

interface SimulationControlsProps {
  onStart?: () => void;
  onNext?: () => void;
  onReset?: () => void;
  disabled?: boolean;
}

export default function SimulationControls({ onStart, onNext, onReset, disabled }: SimulationControlsProps){
  return (
    <div className="flex gap-2">
      <button onClick={onStart} disabled={disabled} className="btn">Start</button>
      <button onClick={onNext} disabled={disabled} className="btn">Next</button>
      <button onClick={onReset} className="btn">Reset</button>
    </div>
  )
}
