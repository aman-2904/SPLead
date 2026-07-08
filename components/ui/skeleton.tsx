import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-accent/10 dark:bg-neutral-850",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
