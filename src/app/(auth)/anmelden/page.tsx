"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
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
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase!.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setServerError(
        "Anmeldung fehlgeschlagen. Bitte prüfe E-Mail-Adresse und Passwort. Falls du dich gerade erst registriert hast: Bestätige zuerst deine E-Mail-Adresse.",
      );
      return;
    }
    router.push("/entdecken");
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
