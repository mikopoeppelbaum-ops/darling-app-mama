import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label: string;
}

/** Fortschrittsanzeige mit Text — Fortschritt ist auch ohne Farbe ablesbar. */
function Progress({ value, max = 100, label, className, ...props }: ProgressProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className={cn("space-y-1", className)} {...props}>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        <span aria-hidden="true">{pct} %</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-3 w-full overflow-hidden rounded-full border border-border bg-muted"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export { Progress };
