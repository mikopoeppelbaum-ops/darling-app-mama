import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatiert ein Datum leicht lesbar auf Deutsch, z. B. "12. März 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Formatiert Datum und Uhrzeit, z. B. "12. März 2026, 15:00 Uhr". */
export function formatDateTime(iso: string): string {
  return `${new Date(iso).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })}, ${new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  })} Uhr`;
}

/** Liegt der Zeitpunkt in der Vergangenheit? */
export function isPastDate(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

/** Kurzer, gut vorlesbarer Sicherheitscode für ein Treffen. */
export function generateSafetyCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/** Berechnet das Alter aus einem ISO-Geburtsdatum. */
export function ageFromBirthdate(birthdate: string, now: Date = new Date()): number {
  const b = new Date(birthdate);
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}
