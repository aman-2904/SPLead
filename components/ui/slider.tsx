import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className,
}: SliderProps) {
  // Calculate percentage of track filled
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full flex items-center select-none", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none accent-primary"
        style={{
          background: `linear-gradient(to right, var(--primary) ${percentage}%, var(--accent-light) ${percentage}%)`
        }}
      />
    </div>
  );
}
