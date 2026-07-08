import * as React from "react";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full text-primary">
        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-primary/40 pointer-events-none" />
        <input
          type="text"
          className={cn(
            "flex h-10 w-full rounded-xl border border-accent/20 bg-secondary-light pl-9 pr-3 py-2 text-xs text-primary font-medium placeholder:text-primary/40 focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Search.displayName = "Search";

export { Search };
