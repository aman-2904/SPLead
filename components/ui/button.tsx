import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
          // Variants
          variant === "default" && "bg-primary text-secondary hover:bg-primary-dark shadow-sm hover:shadow-md",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700 shadow-sm",
          variant === "outline" && "border border-accent/40 bg-transparent text-primary hover:bg-accent/10",
          variant === "secondary" && "bg-accent text-primary hover:bg-accent-dark shadow-sm",
          variant === "ghost" && "text-primary hover:bg-accent/10",
          variant === "link" && "text-primary underline-offset-4 hover:underline bg-transparent !p-0 !h-auto",
          // Sizes
          size === "default" && "px-6 py-3",
          size === "sm" && "px-4 py-2 text-[10px]",
          size === "lg" && "px-8 py-4 text-sm",
          size === "icon" && "h-10 w-10 !rounded-full p-0 flex items-center justify-center",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
