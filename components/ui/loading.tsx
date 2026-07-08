import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingProps {
  size?: "sm" | "default" | "lg";
  text?: string;
  className?: string;
}

export function Loading({ size = "default", text, className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative flex items-center justify-center">
        <Loader2
          className={cn(
            "animate-spin text-accent",
            size === "sm" && "h-5 w-5",
            size === "default" && "h-8 w-8",
            size === "lg" && "h-12 w-12"
          )}
        />
        <Sparkles
          className={cn(
            "absolute text-primary animate-pulse",
            size === "sm" && "h-2 w-2",
            size === "default" && "h-3.5 w-3.5",
            size === "lg" && "h-5 w-5"
          )}
        />
      </div>
      {text && (
        <span className="text-[10px] font-bold text-primary/60 tracking-wider uppercase">
          {text}
        </span>
      )}
    </div>
  );
}
