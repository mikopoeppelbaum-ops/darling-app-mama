"use client";

import Link from "next/link";
import {
  Accessibility,
  Bell,
  Brain,
  ChevronRight,
  Lock,
  ShieldOff,
  Trash2,
  BookOpenCheck,
  LifeBuoy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SETTINGS_LINKS = [
  {
    href: "/einstellungen/barrierefreiheit",
    label: "Barrierefreiheit",
    description: "Schriftgröße, Kontrast, Dark Mode, reduzierte Ansicht",
    icon: Accessibility,
  },
  {
    href: "/einstellungen/adhs",
    label: "ADHS-freundliche Funktionen",
    description: "Erinnerungen, Fokusmodus, automatische Entwürfe",
    icon: Brain,
  },
  {
    href: "/einstellungen/privatsphaere",
    label: "Privatsphäre",
    description: "Sichtbarkeit, Datenexport, Einwilligungen",
    icon: Lock,
  },
  {
    href: "/einstellungen/benachrichtigungen",
    label: "Benachrichtigungen",
    description: "Einzeln oder gebündelt, pro Ereignis einstellbar",
    icon: Bell,
  },
  {
    href: "/einstellungen/blockiert",
    label: "Blockierte Nutzer:innen",
    description: "Blockierungen ansehen und aufheben",
    icon: ShieldOff,
  },
  {
    href: "/community-regeln",
    label: "Community-Regeln",
    description: "Unsere gemeinsamen Regeln für respektvollen Umgang",
    icon: BookOpenCheck,
  },
  {
    href: "/hilfe-sicherheit",
    label: "Hilfe & Sicherheit",
    description: "Sicherheitsleitfaden und Unterstützung",
    icon: LifeBuoy,
  },
  {
    href: "/einstellungen/konto",
    label: "Konto",
    description: "Daten herunterladen, Konto löschen",
    icon: Trash2,
  },
] as const;

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Einstellungen</h1>
      <ul className="space-y-2">
        {SETTINGS_LINKS.map(({ href, label, description, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="block rounded-lg">
              <Card className="hover:bg-muted">
                <CardContent className="flex items-center gap-4 p-4">
                  <Icon aria-hidden="true" className="size-6 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <ChevronRight aria-hidden="true" className="size-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
