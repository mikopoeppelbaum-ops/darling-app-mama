"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";

export default function AccountPage() {
  const store = useAppStore();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function downloadData() {
    const blob = new Blob([store.exportMyData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "echtnah-meine-daten.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function deleteAccount() {
    if (confirmText.trim().toUpperCase() !== "LÖSCHEN") {
      setError("Bitte tippe das Wort LÖSCHEN, um zu bestätigen.");
      return;
    }
    store.deleteAccount();
    router.push("/");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Konto</h1>

      <Card>
        <CardHeader>
          <CardTitle>Daten herunterladen</CardTitle>
          <CardDescription>
            Bevor du dein Konto löschst, kannst du alle deine Daten als Datei speichern.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" onClick={downloadData}>
            <Download aria-hidden="true" /> Alle meine Daten herunterladen
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Konto löschen</CardTitle>
          <CardDescription>
            Dein Profil, deine Matches, Nachrichten und alle Angaben werden dauerhaft gelöscht.
            Das kann nicht rückgängig gemacht werden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 aria-hidden="true" /> Konto dauerhaft löschen
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Konto wirklich löschen?"
        description="Dieser Schritt kann nicht rückgängig gemacht werden."
      >
        <div className="space-y-4">
          {error ? <Alert variant="destructive">{error}</Alert> : null}
          <FormField
            label="Tippe LÖSCHEN, um zu bestätigen"
            htmlFor="confirm-delete"
            hint="Diese zusätzliche Hürde schützt vor versehentlichem Löschen."
          >
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
            />
          </FormField>
          <div className="flex gap-3">
            <Button variant="destructive" onClick={deleteAccount}>
              Ja, Konto löschen
            </Button>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Abbrechen
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
