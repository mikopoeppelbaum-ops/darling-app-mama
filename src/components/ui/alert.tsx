import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva("flex gap-3 rounded-md border-2 p-4 text-base", {
  variants: {
    variant: {
      info: "border-border bg-muted text-foreground",
      warning: "border-accent bg-muted text-foreground",
      destructive: "border-destructive bg-muted text-foreground",
      success: "border-success bg-muted text-foreground",
    },
  },
  defaultVariants: { variant: "info" },
});

const icons = {
  info: Info,
  warning: AlertTriangle,
  destructive: AlertTriangle,
  success: CheckCircle2,
} as const;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

/**
 * Hinweisbox mit Symbol + Text: wichtige Informationen werden nie nur
 * über Farbe vermittelt.
 */
function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const Icon = icons[variant ?? "info"];
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export { Alert };
