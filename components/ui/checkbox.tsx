import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 text-xs text-primary font-medium cursor-pointer select-none">
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded accent-primary border-accent/30 cursor-pointer focus:outline-none transition-all",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
