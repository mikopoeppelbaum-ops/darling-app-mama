"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validation";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useAccessibility } from "@/components/a11y/accessibility-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";

export default function RegisterPage() {
  const router = useRouter();
  const { settings } = useAccessibility();
  const simple = settings.simpleLanguage;
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [emailSent, setEmailSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    if (!isSupabaseConfigured()) {
      // Demo-Modus ohne Backend: direkt ins Onboarding.
      router.push("/onboarding");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase!.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/anmelden`,
        data: { birthdate: data.birthdate, consent_version: "2026-01" },
      },
    });
    if (error) {
      setServerError(
        "Die Registrierung hat nicht geklappt. Bitte prüfe deine Angaben und versuche es noch einmal.",
      );
      return;
    }
    setEmailSent(true);
  }

  if (emailSent) {
    return (
      <Alert variant="success" title="Fast geschafft!">
        {simple
          ? "Wir haben dir eine E-Mail geschickt. Klicke auf den Link in der E-Mail. Das bestätigt deine E-Mail-Adresse. Danach kannst du dich anmelden."
          : "Wir haben dir eine E-Mail geschickt. Bitte klicke auf den Link darin, um deine E-Mail-Adresse zu bestätigen. Danach kannst du dich anmelden."}
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Konto erstellen</CardTitle>
        <CardDescription>
          {simple
            ? "Die Registrierung ist kostenlos. Du brauchst nur eine E-Mail-Adresse."
            : "Kostenlos und in deinem Tempo. Du brauchst nur eine E-Mail-Adresse."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSupabaseConfigured() ? (
          <Alert variant="info" title="Demo-Modus" className="mb-4">
            Ohne Supabase-Konfiguration startet nach dem Absenden direkt das Demo-Onboarding.
          </Alert>
        ) : null}
        {serverError ? (
          <Alert variant="destructive" className="mb-4">
            {serverError}
          </Alert>
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="E-Mail-Adresse" htmlFor="reg-email" error={errors.email?.message}>
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "reg-email-error" : undefined}
              {...register("email")}
            />
          </FormField>
          <FormField
            label="Passwort"
            htmlFor="reg-password"
            hint={
              simple
                ? "Nutze mindestens 10 Zeichen. Ein kurzer Satz ist gut und leicht zu merken."
                : "Mindestens 10 Zeichen. Ein Satz ist leicht zu merken und sicher."
            }
            error={errors.password?.message}
          >
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={`reg-password-hint${errors.password ? " reg-password-error" : ""}`}
              {...register("password")}
            />
          </FormField>
          <FormField
            label="Passwort wiederholen"
            htmlFor="reg-password2"
            error={errors.passwordConfirm?.message}
          >
            <Input
              id="reg-password2"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.passwordConfirm)}
              {...register("passwordConfirm")}
            />
          </FormField>
          <FormField
            label="Geburtsdatum"
            htmlFor="reg-birthdate"
            hint={
              simple
                ? "Du musst 18 Jahre oder älter sein. Wir zeigen dein Geburtsdatum nie an. Andere sehen nur dein Alter."
                : "EchtNah ist ab 18 Jahren. Dein Geburtsdatum wird nie öffentlich angezeigt — nur dein Alter."
            }
            error={errors.birthdate?.message}
          >
            <Input
              id="reg-birthdate"
              type="date"
              autoComplete="bday"
              aria-invalid={Boolean(errors.birthdate)}
              {...register("birthdate")}
            />
          </FormField>

          <fieldset className="space-y-3">
            <legend className="font-medium">Einwilligungen</legend>
            <div className="flex items-start gap-3">
              <Checkbox
                id="reg-privacy"
                aria-invalid={Boolean(errors.acceptPrivacy)}
                {...register("acceptPrivacy")}
              />
              <label htmlFor="reg-privacy" className="text-sm">
                {simple
                  ? "Ich stimme dem Datenschutz zu. Ich muss nichts über eine Behinderung oder Neurodivergenz sagen. Das ist immer freiwillig."
                  : "Ich stimme der Datenschutzerklärung zu. Sensible Angaben (z. B. zu Behinderung oder Neurodivergenz) sind immer freiwillig."}
              </label>
            </div>
            {errors.acceptPrivacy ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {errors.acceptPrivacy.message}
              </p>
            ) : null}
            <div className="flex items-start gap-3">
              <Checkbox
                id="reg-terms"
                aria-invalid={Boolean(errors.acceptTerms)}
                {...register("acceptTerms")}
              />
              <label htmlFor="reg-terms" className="text-sm">
                {simple
                  ? "Ich stimme den Regeln für die Nutzung zu."
                  : "Ich stimme den Nutzungsbedingungen zu."}
              </label>
            </div>
            {errors.acceptTerms ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {errors.acceptTerms.message}
              </p>
            ) : null}
            <div className="flex items-start gap-3">
              <Checkbox
                id="reg-rules"
                aria-invalid={Boolean(errors.acceptCommunityRules)}
                {...register("acceptCommunityRules")}
              />
              <label htmlFor="reg-rules" className="text-sm">
                {simple ? (
                  <>
                    Ich habe die{" "}
                    <Link href="/community-regeln" className="underline" target="_blank">
                      Community-Regeln
                    </Link>{" "}
                    gelesen. Ich stimme ihnen zu.
                  </>
                ) : (
                  <>
                    Ich habe die{" "}
                    <Link href="/community-regeln" className="underline" target="_blank">
                      Community-Regeln
                    </Link>{" "}
                    gelesen und stimme ihnen zu.
                  </>
                )}
              </label>
            </div>
            {errors.acceptCommunityRules ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {errors.acceptCommunityRules.message}
              </p>
            ) : null}
          </fieldset>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Wird gesendet …" : "Konto erstellen"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Du hast schon ein Konto?{" "}
          <Link href="/anmelden" className="font-medium text-primary underline">
            Anmelden
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
