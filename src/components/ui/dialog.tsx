"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Dialog auf Basis des nativen <dialog>-Elements: Fokusfalle, Escape zum
 * Schließen und Screenreader-Semantik kommen vom Browser.
 */
function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onCancel={onClose}
      className={cn(
        "m-auto w-[min(92vw,32rem)] rounded-lg border-2 border-border bg-card p-0 text-card-foreground backdrop:bg-black/50",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border p-5">
        <div>
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          {description ? (
            <p id={descId} className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Dialog schließen">
          <X aria-hidden="true" />
        </Button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}

export { Dialog };
