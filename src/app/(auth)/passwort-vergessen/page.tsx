"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordSchema } from "@/lib/validation";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";

type ResetInput = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetInput>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(data: ResetInput) {
    if (isSupabaseConfigured()) {
      const supabase = createSupabaseBrowserClient();
      await supabase!.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/anmelden`,
      });
    }
    // Immer dieselbe Rückmeldung — verrät nicht, ob die Adresse existiert.
    setSent(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Passwort zurücksetzen</CardTitle>
        <CardDescription>
          Gib deine E-Mail-Adresse ein. Wenn ein Konto existiert, schicken wir dir einen Link zum
          Zurücksetzen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <Alert variant="success" title="E-Mail unterwegs">
            Wenn ein Konto mit dieser Adresse existiert, bekommst du in den nächsten Minuten eine
            E-Mail. Schau auch im Spam-Ordner nach.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField label="E-Mail-Adresse" htmlFor="reset-email" error={errors.email?.message}>
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
            </FormField>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Wird gesendet …" : "Link anfordern"}
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/anmelden" className="font-medium text-primary underline">
            Zurück zur Anmeldung
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
