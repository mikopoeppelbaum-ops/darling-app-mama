import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/** Freundlicher leerer Zustand mit klarer Erklärung und nächstem Schritt. */
function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-8 text-center",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-10 text-muted-foreground" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-md text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

export { EmptyState };
