"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipOption {
  value: string;
  label: string;
}

export interface ChipGroupProps {
  legend: string;
  options: readonly ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  hint?: string;
  max?: number;
  className?: string;
}

/**
 * Mehrfachauswahl als Gruppe von Checkboxen im Chip-Stil.
 * Auswahl wird durch Häkchen-Symbol UND Rahmen angezeigt, nicht nur Farbe.
 */
function ChipGroup({ legend, options, selected, onChange, hint, max, className }: ChipGroupProps) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (!max || selected.length < max) {
      onChange([...selected, value]);
    }
  }

  return (
    <fieldset className={cn("space-y-2", className)}>
      <legend className="text-base font-medium">{legend}</legend>
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={cn(
                "transition-calm inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-2 px-4 py-1.5 text-base has-focus-visible:outline-3 has-focus-visible:outline-ring",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card text-foreground",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={() => toggle(opt.value)}
              />
              {isSelected ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : null}
              {opt.label}
            </label>
          );
        })}
      </div>
      {max ? (
        <p className="text-sm text-muted-foreground">
          {selected.length} von maximal {max} ausgewählt
        </p>
      ) : null}
    </fieldset>
  );
}

export { ChipGroup };
