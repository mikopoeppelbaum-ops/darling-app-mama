"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

/**
 * Native Checkbox mit sichtbarem Häkchen-Symbol (nicht nur Farbe) und
 * großer Klickfläche. Volle Tastatur- und Screenreader-Unterstützung
 * durch das native input-Element.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "peer size-6 shrink-0 cursor-pointer appearance-none rounded-sm border-2 border-input bg-card checked:border-primary checked:bg-primary disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      />
      <Check
        aria-hidden="true"
        className="pointer-events-none absolute size-4 text-primary-foreground opacity-0 peer-checked:opacity-100"
        strokeWidth={3}
      />
    </span>
  ),
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
