"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export default function AdhsSettingsPage() {
  const store = useAppStore();
  const s = store.state.adhsSettings;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ADHS-freundliche Funktionen</h1>
      <p className="text-muted-foreground">
        Alle Funktionen sind freiwillig. Aktiviere nur, was dir wirklich hilft — es gibt keine
        Belohnungspunkte, kein endloses Scrollen und keinen Zeitdruck.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Nachrichten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="adhs-reminders" className="font-medium">
                Erinnerungen an unbeantwortete Nachrichten
              </Label>
              <p className="text-sm text-muted-foreground">
                Für Nachrichten, die du als „Später beantworten“ markiert hast.
              </p>
            </div>
            <Switch
              id="adhs-reminders"
              checked={s.remindersEnabled}
              onCheckedChange={(v) => store.updateAdhsSettings({ remindersEnabled: v })}
            />
          </div>
          <FormField
            label="Erinnerung nach (Stunden)"
            htmlFor="adhs-reminder-hours"
            hint="Frei einstellbar — was für dich passt."
          >
            <Input
              id="adhs-reminder-hours"
              type="number"
              min={1}
              max={168}
              value={s.defaultReminderHours}
              onChange={(e) =>
                store.updateAdhsSettings({ defaultReminderHours: Number(e.target.value) || 24 })
              }
              className="max-w-32"
            />
          </FormField>
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="adhs-chunk" className="font-medium">
                Lange Nachrichten in Abschnitte gliedern
              </Label>
              <p className="text-sm text-muted-foreground">
                Sehr lange Nachrichten werden automatisch in gut lesbare Absätze aufgeteilt.
              </p>
            </div>
            <Switch
              id="adhs-chunk"
              checked={s.autoChunkLongMessages}
              onCheckedChange={(v) => store.updateAdhsSettings({ autoChunkLongMessages: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fokusmodus</CardTitle>
          <CardDescription>
            Blendet die Navigation aus, damit du dich auf eine Sache konzentrieren kannst — z. B.
            eine Unterhaltung. Zum Beenden kommst du einfach hierher zurück (Browser-Zurück).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="adhs-focus" className="font-medium">
              Fokusmodus aktivieren
            </Label>
            <Switch
              id="adhs-focus"
              checked={s.focusMode}
              onCheckedChange={(v) => store.updateAdhsSettings({ focusMode: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automatisch aktiv</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Entwürfe werden im Chat automatisch gespeichert.</li>
            <li>Das Onboarding ist in kurze Etappen mit Fortschrittsanzeige aufgeteilt.</li>
            <li>Die Profil-Checkliste zeigt dir, was noch fehlt.</li>
            <li>Geplante Dates kannst du als Kalendererinnerung (ICS) speichern.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
