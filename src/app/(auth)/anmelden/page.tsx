"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, mfaCodeSchema, type LoginInput } from "@/lib/validation";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [mfaFactorId, setMfaFactorId] = React.useState<string | null>(null);
  const [mfaCode, setMfaCode] = React.useState("");
  const [mfaError, setMfaError] = React.useState<string | null>(null);
  const [mfaBusy, setMfaBusy] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    if (!isSupabaseConfigured()) {
      router.push("/entdecken");
      return;
    }
    const supabase = createSupabaseBrowserClient()!;
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setServerError(
        "Anmeldung fehlgeschlagen. Bitte prüfe E-Mail-Adresse und Passwort. Falls du dich gerade erst registriert hast: Bestätige zuerst deine E-Mail-Adresse.",
      );
      return;
    }

    // Zwei-Faktor-Anmeldung: prüfen, ob nach Passwort noch ein Code fehlt.
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === "aal2" && aal.nextLevel !== aal.currentLevel) {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const factor = factors?.totp.find((f) => f.status === "verified");
      if (factor) {
        setMfaFactorId(factor.id);
        return;
      }
    }
    router.push("/entdecken");
  }

  async function onSubmitMfaCode(e: React.FormEvent) {
    e.preventDefault();
    setMfaError(null);
    const parsed = mfaCodeSchema.safeParse(mfaCode);
    if (!parsed.success) {
      setMfaError(parsed.error.issues[0]?.message ?? "Bitte prüfe den Code.");
      return;
    }
    if (!mfaFactorId) return;
    setMfaBusy(true);
    const supabase = createSupabaseBrowserClient()!;
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: mfaFactorId,
    });
    if (challengeError || !challenge) {
      setMfaBusy(false);
      setMfaError("Der Code konnte nicht geprüft werden. Bitte versuche es erneut.");
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: mfaFactorId,
      challengeId: challenge.id,
      code: parsed.data,
    });
    setMfaBusy(false);
    if (verifyError) {
      setMfaError("Der Code stimmt nicht. Bitte versuche es erneut.");
      return;
    }
    router.push("/entdecken");
  }

  if (mfaFactorId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bestätigungscode eingeben</CardTitle>
          <CardDescription>
            Öffne deine Authenticator-App und gib den aktuellen 6-stelligen Code ein.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mfaError ? (
            <Alert variant="destructive" className="mb-4">
              {mfaError}
            </Alert>
          ) : null}
          <form onSubmit={onSubmitMfaCode} className="space-y-4" noValidate>
            <FormField label="Code" htmlFor="mfa-login-code">
              <Input
                id="mfa-login-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                autoFocus
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                aria-invalid={Boolean(mfaError)}
              />
            </FormField>
            <Button type="submit" size="lg" className="w-full" disabled={mfaBusy}>
              {mfaBusy ? "Wird geprüft …" : "Bestätigen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Anmelden</CardTitle>
        <CardDescription>Schön, dass du wieder da bist.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isSupabaseConfigured() ? (
          <Alert variant="info" title="Demo-Modus" className="mb-4">
            Ohne Supabase-Konfiguration gelangst du direkt in die Demo mit fiktiven Profilen.
          </Alert>
        ) : null}
        {serverError ? (
          <Alert variant="destructive" className="mb-4">
            {serverError}
          </Alert>
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="E-Mail-Adresse" htmlFor="login-email" error={errors.email?.message}>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </FormField>
          <FormField label="Passwort" htmlFor="login-password" error={errors.password?.message}>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
          </FormField>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Wird geprüft …" : "Anmelden"}
          </Button>
        </form>
        <div className="mt-4 space-y-1 text-center text-sm text-muted-foreground">
          <p>
            <Link href="/passwort-vergessen" className="font-medium text-primary underline">
              Passwort vergessen?
            </Link>
          </p>
          <p>
            Noch kein Konto?{" "}
            <Link href="/registrieren" className="font-medium text-primary underline">
              Kostenlos registrieren
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
