"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { AccessibilityNeedsPicker } from "@/components/profile/accessibility-needs-picker";
import { ProfileDetails } from "@/components/profile/profile-details";
import {
  COMMUNICATION_STYLE_OPTIONS,
  CONTACT_FREQUENCY_OPTIONS,
  DEALBREAKER_OPTIONS,
  GENDER_OPTIONS,
  INTEREST_OPTIONS,
  ORIENTATION_OPTIONS,
  PLANNING_STYLE_OPTIONS,
  RELATIONSHIP_GOAL_OPTIONS,
  SENSORY_NEED_OPTIONS,
  VALUE_OPTIONS,
} from "@/lib/options";
import type {
  CommunicationStyle,
  ContactFrequency,
  Gender,
  Orientation,
  PlanningStyle,
  RelationshipGoal,
} from "@/lib/types";
import { displayNameSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { ChipGroup } from "@/components/ui/chip-group";
import { RadioCards } from "@/components/ui/radio-cards";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { VisibilitySelect } from "@/components/profile/visibility-select";

const STEP_KEY = "echtnah.onboarding-step";

/**
 * Onboarding in kurzen Etappen (ADHS-freundlich):
 * jeder Schritt ist klein, der Fortschritt wird gespeichert und man kann
 * jederzeit pausieren und später weitermachen.
 */
export default function OnboardingPage() {
  const store = useAppStore();
  const { state } = store;
  const me = state.me;
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(STEP_KEY);
    if (saved) setStep(Number(saved));
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STEP_KEY, String(step));
    headingRef.current?.focus();
  }, [step]);

  const steps: {
    title: string;
    description?: string;
    content: React.ReactNode;
    validate?: () => string | null;
  }[] = [
    {
      title: "Wie möchtest du genannt werden?",
      description: "Dein Anzeigename kann dein Vorname oder ein frei gewählter Name sein.",
      validate: () => {
        const r = displayNameSchema.safeParse(me.displayName);
        return r.success ? null : (r.error.issues[0]?.message ?? "Bitte prüfe deinen Namen.");
      },
      content: (
        <div className="space-y-4">
          <FormField label="Anzeigename" htmlFor="ob-name">
            <Input
              id="ob-name"
              value={me.displayName}
              onChange={(e) => store.updateProfile({ displayName: e.target.value })}
            />
          </FormField>
          <FormField label="Pronomen" htmlFor="ob-pronouns" optional>
            <Input
              id="ob-pronouns"
              placeholder="z. B. sie/ihr, er/ihm, they/them"
              value={me.pronouns ?? ""}
              onChange={(e) => store.updateProfile({ pronouns: e.target.value || undefined })}
            />
          </FormField>
        </div>
      ),
    },
    {
      title: "Wer bist du — und wen suchst du?",
      description: "Alle Angaben außer dem Alter kannst du später jederzeit ändern.",
      content: (
        <div className="space-y-5">
          <RadioCards
            legend="Geschlechtsidentität"
            name="ob-gender"
            options={GENDER_OPTIONS}
            value={me.gender}
            onChange={(v) => store.updateProfile({ gender: v as Gender })}
          />
          <RadioCards
            legend="Sexuelle Orientierung"
            name="ob-orientation"
            options={ORIENTATION_OPTIONS}
            value={me.orientation}
            onChange={(v) => store.updateProfile({ orientation: v as Orientation })}
          />
          <ChipGroup
            legend="Ich möchte kennenlernen"
            options={GENDER_OPTIONS.filter((g) => g.value !== "prefer_not_to_say")}
            selected={state.myPreferences.seekingGenders}
            onChange={(v) => store.updatePreferences({ seekingGenders: v as Gender[] })}
          />
        </div>
      ),
    },
    {
      title: "Wo bist du ungefähr?",
      description:
        "Wir speichern nie deine genaue Adresse — nur die Stadt und einen ungefähren Umkreis.",
      content: (
        <div className="space-y-4">
          <FormField label="Stadt" htmlFor="ob-city">
            <Input
              id="ob-city"
              value={me.city}
              onChange={(e) => store.updateProfile({ city: e.target.value })}
            />
          </FormField>
          <FormField label="Suchradius (km)" htmlFor="ob-radius">
            <Input
              id="ob-radius"
              type="number"
              min={1}
              max={500}
              value={state.myPreferences.maxDistanceKm}
              onChange={(e) =>
                store.updatePreferences({ maxDistanceKm: Number(e.target.value) || 50 })
              }
            />
          </FormField>
        </div>
      ),
    },
    {
      title: "Was wünschst du dir?",
      content: (
        <RadioCards
          legend="Beziehungswunsch"
          name="ob-goal"
          options={RELATIONSHIP_GOAL_OPTIONS}
          value={me.relationshipGoal}
          onChange={(v) => store.updateProfile({ relationshipGoal: v as RelationshipGoal })}
        />
      ),
    },
    {
      title: "Interessen und Werte",
      content: (
        <div className="space-y-5">
          <ChipGroup
            legend="Interessen und Hobbys"
            options={INTEREST_OPTIONS.map((i) => ({ value: i, label: i }))}
            selected={me.interests}
            onChange={(v) => store.updateProfile({ interests: v })}
            max={8}
          />
          <ChipGroup
            legend="Persönliche Werte"
            options={VALUE_OPTIONS.map((i) => ({ value: i, label: i }))}
            selected={me.values}
            onChange={(v) => store.updateProfile({ values: v })}
            max={5}
          />
        </div>
      ),
    },
    {
      title: "Wie kommunizierst du gerne?",
      content: (
        <div className="space-y-5">
          <ChipGroup
            legend="Kommunikationsvorlieben"
            options={COMMUNICATION_STYLE_OPTIONS}
            selected={me.communicationStyles}
            onChange={(v) =>
              store.updateProfile({ communicationStyles: v as CommunicationStyle[] })
            }
          />
          <RadioCards
            legend="Gewünschte Kontaktfrequenz"
            name="ob-frequency"
            options={CONTACT_FREQUENCY_OPTIONS}
            value={me.contactFrequency}
            onChange={(v) => store.updateProfile({ contactFrequency: v as ContactFrequency })}
          />
          <RadioCards
            legend="Planst du lieber spontan oder strukturiert?"
            name="ob-planning"
            options={PLANNING_STYLE_OPTIONS}
            value={me.planningStyle}
            onChange={(v) => store.updateProfile({ planningStyle: v as PlanningStyle })}
          />
        </div>
      ),
    },
    {
      title: "Reize und Barrierefreiheit",
      description: "Diese Angaben sind freiwillig und helfen bei der Planung guter Treffen.",
      content: (
        <div className="space-y-5">
          <ChipGroup
            legend="Reizempfindlichkeiten"
            options={SENSORY_NEED_OPTIONS.map((i) => ({ value: i, label: i }))}
            selected={me.sensoryNeeds}
            onChange={(v) => store.updateProfile({ sensoryNeeds: v })}
          />
          <AccessibilityNeedsPicker
            selected={me.accessibilityNeeds}
            onChange={(v) => store.updateProfile({ accessibilityNeeds: v })}
          />
          <VisibilitySelect
            id="ob-access-vis"
            label="Wer soll deine Barrierefreiheitsbedürfnisse sehen?"
            value={me.accessibilityVisibility}
            onChange={(v) => store.updateProfile({ accessibilityVisibility: v })}
          />
        </div>
      ),
    },
    {
      title: "Freiwillige Angaben",
      description:
        "Behinderung, Erkrankung, ADHS oder Neurodivergenz: Du entscheidest, ob und was du teilst. Eine Diagnose ist nie verpflichtend. Diese Angaben kannst du in deinem Profil jederzeit hinzufügen, ändern und einzeln sichtbar oder unsichtbar schalten.",
      content: (
        <Alert variant="info" title="Kein Druck">
          Du kannst diesen Schritt einfach überspringen. Alles dazu findest du später unter „Mein
          Profil“.
        </Alert>
      ),
    },
    {
      title: "Zeig, wer du bist",
      content: (
        <div className="space-y-4">
          <FormField label="Kurzer Profiltext" htmlFor="ob-bio" hint="2–3 Sätze reichen völlig.">
            <Textarea
              id="ob-bio"
              rows={4}
              value={me.bio}
              onChange={(e) => store.updateProfile({ bio: e.target.value })}
            />
          </FormField>
          <FormField label="Persönliche Grenzen und No-Gos" htmlFor="ob-boundaries" optional>
            <Textarea
              id="ob-boundaries"
              rows={2}
              value={me.boundaries}
              onChange={(e) => store.updateProfile({ boundaries: e.target.value })}
            />
          </FormField>
          <ChipGroup
            legend="Dealbreaker"
            hint="Profile mit diesen Merkmalen werden dir nicht vorgeschlagen."
            options={DEALBREAKER_OPTIONS.map((d) => ({ value: d, label: d }))}
            selected={state.myPreferences.dealbreakers}
            onChange={(v) => store.updatePreferences({ dealbreakers: v })}
          />
          <Alert variant="info" title="Profilbilder">
            Fotos sind freiwillig. Du kannst sie später unter „Mein Profil“ hinzufügen — jeweils
            mit einer kurzen Bildbeschreibung für Screenreader.
          </Alert>
        </div>
      ),
    },
    {
      title: "So sehen dich andere",
      description:
        "Das ist genau die Ansicht, die Menschen vor einem Match sehen. Angaben, die du „erst nach einem Match“ oder „nie“ zeigen möchtest, sind hier nicht dabei.",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-4">
            <ProfileDetails profile={me} context="public" />
          </div>
          <p className="text-sm text-muted-foreground">
            Passt etwas nicht? Mit „Zurück“ kannst du alles ändern — oder später unter „Mein
            Profil“.
          </p>
        </div>
      ),
    },
  ];

  const isLast = step === steps.length - 1;
  const current = steps[step];

  function next() {
    const validationError = current.validate?.() ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    if (isLast) {
      store.updateProfile({ onboardingCompleted: true });
      window.localStorage.removeItem(STEP_KEY);
      router.push("/entdecken");
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-3xl font-semibold">Dein Profil, in kleinen Schritten</h1>
      <Progress
        value={step + 1}
        max={steps.length}
        label={`Schritt ${step + 1} von ${steps.length}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            <span ref={headingRef} tabIndex={-1} className="outline-none">
              {current.title}
            </span>
          </CardTitle>
          {current.description ? <CardDescription>{current.description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? <Alert variant="destructive">{error}</Alert> : null}
          {current.content}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              variant="secondary"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft aria-hidden="true" /> Zurück
            </Button>
            <p className="text-sm text-muted-foreground">Dein Fortschritt wird gespeichert.</p>
            <Button onClick={next}>
              {isLast ? (
                <>
                  <CheckCircle2 aria-hidden="true" /> Fertig
                </>
              ) : (
                <>
                  Weiter <ArrowRight aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
