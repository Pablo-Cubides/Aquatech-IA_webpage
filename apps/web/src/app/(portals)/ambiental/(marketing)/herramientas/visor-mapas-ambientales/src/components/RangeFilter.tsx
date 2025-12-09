"use client";

import { useState, useEffect } from "react";

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  unit?: string;
  onChange: (min: number, max: number) => void;
}

export default function RangeFilter({
  label,
  min,
  max,
  currentMin,
  currentMax,
  unit = "",
  onChange,
}: RangeFilterProps) {
  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);

  useEffect(() => {
    setLocalMin(currentMin);
    setLocalMax(currentMax);
  }, [currentMin, currentMax]);

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localMax);
    setLocalMin(newMin);
    onChange(newMin, localMax);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localMin);
    setLocalMax(newMax);
    onChange(localMin, newMax);
  };

  const percentage = ((localMax - localMin) / (max - min)) * 100;
  const leftPosition = ((localMin - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Range Display */}
      <div className="flex items-center justify-between text-xs text-gray-600 px-1">
        <span className="font-medium">
          {localMin.toFixed(1)} {unit}
        </span>
        <span className="text-gray-400">-</span>
        <span className="font-medium">
          {localMax.toFixed(1)} {unit}
        </span>
      </div>

      {/* Dual Range Slider */}
      <div className="relative pt-1 pb-6">
        {/* Track Background */}
        <div className="relative h-2 bg-gray-200 rounded-full">
          {/* Active Range */}
          <div
            className="absolute h-2 bg-primary-500 rounded-full"
            style={{
              left: `${leftPosition}%`,
              width: `${percentage}%`,
            }}
          ></div>
        </div>

        {/* Min Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={(max - min) / 100}
          value={localMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="absolute w-full h-2 top-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-primary-700 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:bg-primary-700"
        />

        {/* Max Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={(max - min) / 100}
          value={localMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute w-full h-2 top-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-primary-700 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:bg-primary-700"
        />

        {/* Range Labels */}
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
          <span>
            {min} {unit}
          </span>
          <span>
            {max} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
