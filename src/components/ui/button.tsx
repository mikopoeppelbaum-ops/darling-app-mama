import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * Große, klar erkennbare Schaltflächen: Mindesthöhe 44px (WCAG 2.5.8 Zielgröße),
 * deutlicher Fokusring, keine rein farbliche Unterscheidung (Varianten haben
 * unterschiedliche Füllung/Rahmen).
 */
const buttonVariants = cva(
  "transition-calm inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-5 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-card text-foreground border border-border hover:bg-muted",
        soft: "bg-primary-soft text-foreground hover:bg-muted",
        outline: "border-2 border-input bg-transparent text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "text-primary underline underline-offset-4 hover:no-underline",
      },
      size: {
        default: "min-h-11 px-5 py-2 text-base",
        sm: "min-h-10 px-3 py-1.5 text-sm",
        lg: "min-h-13 px-7 py-3 text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
