"use client";

import { Download } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function PrivacySettingsPage() {
  const store = useAppStore();
  const p = store.state.privacySettings;

  const toggles = [
    { key: "showAge" as const, label: "Alter im Profil anzeigen" },
    { key: "showCity" as const, label: "Ungefähren Ort anzeigen" },
    { key: "showPronouns" as const, label: "Pronomen anzeigen" },
    { key: "showLastActive" as const, label: "Zuletzt aktiv anzeigen" },
    {
      key: "incognito" as const,
      label: "Inkognito-Modus (Premium-Funktion, technisch vorbereitet)",
    },
  ];

  function downloadData() {
    // DSGVO Art. 20: Datenexport als JSON-Datei.
    const blob = new Blob([store.exportMyData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "echtnah-meine-daten.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Privatsphäre</h1>

      <Alert variant="info" title="Deine Daten gehören dir">
        Sensible Angaben (z. B. zu Behinderung oder Neurodivergenz) steuerst du direkt in deinem
        Profil — für jede Angabe einzeln. Dein genauer Standort wird nie gespeichert, dein
        Geburtsdatum nie angezeigt.
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Sichtbarkeit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {toggles.map((t) => (
            <div key={t.key} className="flex items-center justify-between gap-3">
              <Label htmlFor={`priv-${t.key}`} className="font-normal">
                {t.label}
              </Label>
              <Switch
                id={`priv-${t.key}`}
                checked={p[t.key]}
                disabled={t.key === "incognito"}
                onCheckedChange={(v) => store.updatePrivacySettings({ [t.key]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deine Daten</CardTitle>
          <CardDescription>
            Du kannst jederzeit alle deine gespeicherten Daten herunterladen (DSGVO Art. 20) oder
            dein Konto unter „Einstellungen → Konto“ löschen (DSGVO Art. 17).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadData}>
            <Download aria-hidden="true" /> Alle meine Daten herunterladen
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deine Einwilligungen</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Datenschutzerklärung: zugestimmt bei der Registrierung</li>
            <li>Nutzungsbedingungen: zugestimmt bei der Registrierung</li>
            <li>Community-Regeln: zugestimmt bei der Registrierung</li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            Einwilligungen werden mit Zeitpunkt und Version protokolliert.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
