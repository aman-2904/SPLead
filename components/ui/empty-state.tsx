import * as React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<any>;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search terms or filters to locate items.",
  icon: Icon = FolderOpen,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center border border-dashed border-accent/20 rounded-3xl bg-secondary-light/20",
        className
      )}
    >
      <div className="p-3 bg-accent/10 rounded-full text-accent mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-serif text-base font-bold text-primary mb-1.5">{title}</h3>
      <p className="text-[10px] text-primary/60 font-semibold max-w-xs mx-auto leading-normal mb-6">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
