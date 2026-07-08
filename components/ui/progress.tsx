import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
}

export function Progress({ value = 0, className }: ProgressProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-accent/20",
        className
      )}
    >
      <div
        className="h-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
