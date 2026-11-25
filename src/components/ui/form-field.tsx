import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Einheitlicher Formularbaustein: Label, optionaler Hinweis in einfacher
 * Sprache und eine per aria-describedby verknüpfte Fehlermeldung.
 */
function FormField({ label, htmlFor, error, hint, optional, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? (
          <span className="ml-2 text-sm font-normal text-muted-foreground">(freiwillig)</span>
        ) : null}
      </Label>
      {hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { FormField };
