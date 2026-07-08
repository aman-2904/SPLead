import React, { useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className={cn("relative w-full text-primary", className)}>
      {/* Selector Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-10 w-full items-center justify-between rounded-xl border border-accent/20 bg-secondary-light px-3 py-1.5 text-xs font-medium cursor-pointer focus:border-primary select-none gap-2"
      >
        <div className="flex flex-wrap gap-1.5 flex-grow">
          {selected.length > 0 ? (
            selected.map((val) => {
              const label = options.find((o) => o.value === val)?.label || val;
              return (
                <div
                  key={val}
                  className="flex items-center gap-1 bg-primary text-secondary px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-accent/20"
                >
                  <span>{label}</span>
                  <button
                    onClick={(e) => removeOption(val, e)}
                    className="hover:text-accent focus:outline-none cursor-pointer"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              );
            })
          ) : (
            <span className="text-primary/45 font-medium">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-primary/50" />
      </div>

      {/* Options Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-accent/25 bg-secondary-light shadow-lg z-40 p-1">
            {options.map((opt) => {
              const isChecked = selected.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold hover:bg-accent/10 cursor-pointer transition-colors",
                    isChecked ? "text-primary bg-accent/5 font-bold" : "text-primary/80"
                  )}
                >
                  <span>{opt.label}</span>
                  {isChecked && <Check className="h-3.5 w-3.5 text-accent" />}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
