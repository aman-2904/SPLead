import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center gap-1.5 text-xs text-primary/60 font-semibold", className)}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        
        return (
          <React.Fragment key={idx}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-primary font-bold">{item.label}</span>
            )}
            
            {!isLast && <ChevronRight className="h-3 w-3 text-primary/40 shrink-0" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
