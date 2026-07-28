import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-card text-card-foreground", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Überschriften-Ebene. Card-Titel folgen auf den meisten Seiten direkt auf
   * die Seitenüberschrift (h1) und sind daher standardmäßig h2. Liegt eine
   * Card unter einer eigenen Zwischenüberschrift (z. B. Kartenraster unter
   * einem h2-Abschnitt auf der Startseite), muss hier explizit "h3" gesetzt
   * werden, damit keine Ebene übersprungen wird.
   */
  as?: "h2" | "h3" | "h4";
}

function CardTitle({ className, as: Heading = "h2", ...props }: CardTitleProps) {
  return <Heading className={cn("text-lg font-semibold leading-snug", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3 p-5 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
