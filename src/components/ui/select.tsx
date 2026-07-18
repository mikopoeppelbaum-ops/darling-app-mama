import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Natives select-Element: beste Screenreader- und Mobil-Unterstützung
 * ohne zusätzliche Skript-Logik.
 */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <span className="relative block w-full">
    <select
      ref={ref}
      className={cn(
        "min-h-11 w-full cursor-pointer appearance-none rounded-md border-2 border-input bg-card px-3 py-2 pr-10 text-base text-foreground disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted-foreground"
    />
  </span>
));
Select.displayName = "Select";

export { Select };
