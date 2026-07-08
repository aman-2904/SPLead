import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  return (
    <div className={cn("relative w-full text-primary", className)}>
      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-accent pointer-events-none" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-3 h-10 bg-secondary-light border border-accent/20 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer text-primary transition-colors"
      />
    </div>
  );
}
