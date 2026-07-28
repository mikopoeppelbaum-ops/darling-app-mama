"use client";

import * as React from "react";
import { KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { mfaCodeSchema } from "@/lib/validation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface TotpFactor {
  id: string;
  friendlyName?: string;
  status: string;
  createdAt: string;
}

interface EnrollmentState {
  factorId: string;
  qrCode: string;
  secret: string;
  uri: string;
}

/**
 * Optionale Zwei-Faktor-Anmeldung über Supabase Auth (TOTP).
 * Läuft ausschließlich über die offizielle Supabase-MFA-API
 * (auth.mfa.enroll/challenge/verify/unenroll/listFactors) — es werden
 * keine Geheimnisse selbst gespeichert oder verwaltet.
 */
export default function SecuritySettingsPage() {
  const configured = isSupabaseConfigured();
  const [factors, setFactors] = React.useState<TotpFactor[]>([]);
  const [loadingFactors, setLoadingFactors] = React.useState(configured);
  const [enrollment, setEnrollment] = React.useState<EnrollmentState | null>(null);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [removeTarget, setRemoveTarget] = React.useState<TotpFactor | null>(null);

  const refreshFactors = React.useCallback(async () => {
    if (!configured) return;
    const supabase = createSupabaseBrowserClient()!;
    const { data, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError) {
      setError("Deine Zwei-Faktor-Einstellungen konnten nicht geladen werden.");
      setLoadingFactors(false);
      return;
    }
    setFactors(
      (data?.totp ?? []).map((f) => ({
        id: f.id,
        friendlyName: f.friendly_name,
        status: f.status,
        createdAt: f.created_at,
      })),
    );
    setLoadingFactors(false);
  }, [configured]);

  React.useEffect(() => {
    refreshFactors();
  }, [refreshFactors]);

  async function startEnrollment() {
    setError(null);
    setSuccess(null);
    setBusy(true);
    const supabase = createSupabaseBrowserClient()!;
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    setBusy(false);
    if (enrollError || !data) {
      setError(
        "Die Einrichtung konnte nicht gestartet werden. Falls du bereits eine unbestätigte Einrichtung hast, entferne sie zuerst.",
      );
      return;
    }
    setEnrollment({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    });
  }

  async function confirmEnrollment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = mfaCodeSchema.safeParse(code);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Bitte prüfe den Code.");
      return;
    }
    if (!enrollment) return;
    setBusy(true);
    const supabase = createSupabaseBrowserClient()!;
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: enrollment.factorId,
    });
    if (challengeError || !challenge) {
      setBusy(false);
      setError("Der Code konnte nicht geprüft werden. Bitte versuche es erneut.");
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enrollment.factorId,
      challengeId: challenge.id,
      code: parsed.data,
    });
    setBusy(false);
    if (verifyError) {
      setError(
        "Der Code stimmt nicht überein. Prüfe, ob die Uhrzeit deines Geräts korrekt ist, und versuche es erneut.",
      );
      return;
    }
    setEnrollment(null);
    setCode("");
    setSuccess(
      "Zwei-Faktor-Anmeldung ist jetzt aktiv. Bei der nächsten Anmeldung wird ein Code abgefragt.",
    );
    refreshFactors();
  }

  async function removeFactor(factor: TotpFactor) {
    setBusy(true);
    setError(null);
    const supabase = createSupabaseBrowserClient()!;
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
    setBusy(false);
    setRemoveTarget(null);
    if (unenrollError) {
      setError(
        "Entfernen war nicht möglich. Wenn dies dein einziger zweiter Faktor ist, musst du dich eventuell zuerst per Code bestätigen.",
      );
      return;
    }
    setSuccess("Zwei-Faktor-Anmeldung wurde entfernt.");
    refreshFactors();
  }

  function cancelEnrollment() {
    setEnrollment(null);
    setCode("");
    setError(null);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Zwei-Faktor-Anmeldung</h1>
      <p className="text-muted-foreground">
        Zusätzlicher Schutz für dein Konto: Nach E-Mail und Passwort fragen wir einen 6-stelligen
        Code aus einer Authenticator-App ab (z. B. Google Authenticator, Authy, oder die Funktion in
        vielen Passwort-Managern). Diese Funktion ist freiwillig und kostenlos.
      </p>

      {!configured ? (
        <Alert variant="info" title="Demo-Modus">
          Die Zwei-Faktor-Anmeldung benötigt eine Supabase-Verbindung und ist im Demo-Modus nicht
          verfügbar. Richte Supabase gemäß README ein, um sie auszuprobieren.
        </Alert>
      ) : (
        <>
          {error ? <Alert variant="destructive">{error}</Alert> : null}
          {success ? (
            <Alert variant="success" role="status">
              {success}
            </Alert>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
                Eingerichtete Authenticator-Apps
              </CardTitle>
              <CardDescription>
                Du kannst mehrere Geräte einrichten, falls eines nicht verfügbar ist.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingFactors ? (
                <p className="text-muted-foreground">Wird geladen …</p>
              ) : factors.length === 0 ? (
                <p className="text-muted-foreground">
                  Du hast noch keine Zwei-Faktor-Anmeldung eingerichtet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {factors.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
                    >
                      <span className="flex items-center gap-2">
                        <KeyRound aria-hidden="true" className="size-4 text-muted-foreground" />
                        {f.friendlyName || "Authenticator-App"}
                        <Badge variant={f.status === "verified" ? "success" : "outline"}>
                          {f.status === "verified" ? "Aktiv" : "Nicht bestätigt"}
                        </Badge>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRemoveTarget(f)}
                        aria-label="Diese Zwei-Faktor-Anmeldung entfernen"
                      >
                        <Trash2 aria-hidden="true" className="size-4" /> Entfernen
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {!enrollment ? (
                <Button onClick={startEnrollment} disabled={busy}>
                  Zwei-Faktor-Anmeldung einrichten
                </Button>
              ) : (
                <form
                  onSubmit={confirmEnrollment}
                  className="space-y-4 rounded-md border border-border p-4"
                >
                  <div>
                    <p className="font-semibold">1. QR-Code scannen</p>
                    <p className="text-sm text-muted-foreground">
                      Öffne deine Authenticator-App und scanne diesen Code.
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Supabase liefert den QR-Code als fertiges Daten-URI-SVG, kein optimierbares Bild */}
                    <img
                      src={enrollment.qrCode}
                      alt="QR-Code für die Einrichtung der Zwei-Faktor-Anmeldung. Alternativ kannst du den Schlüssel darunter manuell eingeben."
                      className="mt-2 size-48 rounded-md border border-border bg-white p-2"
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Kein Kamerazugriff oder Screenreader? Gib diesen Schlüssel manuell in deiner
                      App ein:
                    </p>
                    <p className="mt-1 rounded-md bg-muted p-2 font-mono text-sm break-all select-all">
                      {enrollment.secret}
                    </p>
                  </div>
                  <FormField
                    label="2. Code aus der App eingeben"
                    htmlFor="mfa-code"
                    error={error ?? undefined}
                  >
                    <Input
                      id="mfa-code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      aria-invalid={Boolean(error)}
                    />
                  </FormField>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={busy}>
                      Bestätigen und aktivieren
                    </Button>
                    <Button type="button" variant="secondary" onClick={cancelEnrollment}>
                      Abbrechen
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        title="Zwei-Faktor-Anmeldung entfernen?"
        description="Danach reicht bei der Anmeldung wieder allein dein Passwort."
      >
        <div className="flex gap-3">
          <Button
            variant="destructive"
            disabled={busy}
            onClick={() => removeTarget && removeFactor(removeTarget)}
          >
            Ja, entfernen
          </Button>
          <Button variant="secondary" onClick={() => setRemoveTarget(null)}>
            Abbrechen
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
