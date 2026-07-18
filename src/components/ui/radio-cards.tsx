"use client";

import * as React from "react";
import { CircleDot, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioCardsProps {
  legend: string;
  name: string;
  options: readonly RadioCardOption[];
  value: string | null;
  onChange: (value: string) => void;
  hint?: string;
  className?: string;
}

/**
 * Einfachauswahl als große, gut treffbare Karten mit nativen Radio-Inputs.
 * Auswahl wird durch Symbol und Rahmen angezeigt, nicht nur durch Farbe.
 */
function RadioCards({ legend, name, options, value, onChange, hint, className }: RadioCardsProps) {
  return (
    <fieldset className={cn("space-y-2", className)}>
      <legend className="text-base font-medium">{legend}</legend>
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      <div className="grid gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-md border-2 p-3.5 has-focus-visible:outline-3 has-focus-visible:outline-ring",
                isSelected ? "border-primary bg-muted" : "border-input bg-card",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {isSelected ? (
                <CircleDot aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              ) : (
                <Circle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              )}
              <span>
                <span className="block font-medium">{opt.label}</span>
                {opt.description ? (
                  <span className="block text-sm text-muted-foreground">{opt.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export { RadioCards };
