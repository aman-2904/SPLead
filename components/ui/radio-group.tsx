import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioItem {
  value: string;
  label: string;
  id: string;
}

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  items: RadioItem[];
  className?: string;
}

export function RadioGroup({ name, value, onChange, items, className }: RadioGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const isChecked = value === item.value;
        return (
          <label
            key={item.id}
            className={cn(
              "flex items-center gap-2.5 text-xs text-primary/80 font-medium cursor-pointer select-none",
              isChecked ? "text-primary font-bold" : ""
            )}
          >
            <input
              type="radio"
              name={name}
              value={item.value}
              checked={isChecked}
              onChange={() => onChange(item.value)}
              className="h-4 w-4 accent-primary cursor-pointer focus:outline-none"
            />
            <span>{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}
