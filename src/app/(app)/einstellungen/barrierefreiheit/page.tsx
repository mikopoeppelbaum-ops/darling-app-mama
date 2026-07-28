"use client";

import {
  useAccessibility,
  type FontSize,
  type ThemeSetting,
} from "@/components/a11y/accessibility-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioCards } from "@/components/ui/radio-cards";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AccessibilitySettingsPage() {
  const { settings, update } = useAccessibility();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Barrierefreiheit</h1>
      <p className="text-muted-foreground">
        Diese Einstellungen gelten sofort und werden auf diesem Gerät gespeichert. Alle
        Barrierefreiheits-Funktionen sind und bleiben kostenlos.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Anzeige</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <RadioCards
            legend="Schriftgröße"
            name="fontSize"
            options={[
              { value: "normal", label: "Normal" },
              { value: "large", label: "Groß" },
              { value: "xlarge", label: "Sehr groß" },
            ]}
            value={settings.fontSize}
            onChange={(v) => update({ fontSize: v as FontSize })}
          />
          <RadioCards
            legend="Farbschema"
            name="theme"
            options={[
              {
                value: "system",
                label: "Wie mein Gerät",
                description: "Folgt der Einstellung deines Systems.",
              },
              { value: "light", label: "Hell" },
              { value: "dark", label: "Dunkel" },
            ]}
            value={settings.theme}
            onChange={(v) => update({ theme: v as ThemeSetting })}
          />
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="set-contrast" className="font-medium">
                Hoher Kontrast
              </Label>
              <p className="text-sm text-muted-foreground">
                Kräftigere Farben und deutlichere Ränder.
              </p>
            </div>
            <Switch
              id="set-contrast"
              checked={settings.highContrast}
              onCheckedChange={(v) => update({ highContrast: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reduzierte Ansicht</CardTitle>
          <CardDescription>
            Für Momente, in denen weniger mehr ist: keine Animationen, keine Schatten, ruhigere
            Darstellung.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="set-reduced" className="font-medium">
              Reduzierte Ansicht aktivieren
            </Label>
            <Switch
              id="set-reduced"
              checked={settings.reducedView}
              onCheckedChange={(v) => update({ reducedView: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Einfache Sprache</CardTitle>
          <CardDescription>
            Kürzere Sätze und einfachere Wörter auf der Registrierung und den Community-Regeln. Das
            ist eine Annäherung an Leichte Sprache — keine geprüfte Übersetzung nach dem offiziellen
            Regelwerk, das eine Prüfung durch Menschen aus der Zielgruppe selbst verlangt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="set-simple-language" className="font-medium">
              Einfache Sprache verwenden
            </Label>
            <Switch
              id="set-simple-language"
              checked={settings.simpleLanguage}
              onCheckedChange={(v) => update({ simpleLanguage: v })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
