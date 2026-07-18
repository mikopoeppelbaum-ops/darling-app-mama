"use client";

import * as React from "react";
import { Eye, ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/lib/store";
import {
  ACCESSIBILITY_NEED_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
  CONTACT_FREQUENCY_OPTIONS,
  ENERGY_LEVEL_OPTIONS,
  INTEREST_OPTIONS,
  PLANNING_STYLE_OPTIONS,
  RELATIONSHIP_GOAL_OPTIONS,
  RESPONSE_PACE_OPTIONS,
  SENSORY_NEED_OPTIONS,
  SOCIAL_ACTIVITY_OPTIONS,
  VALUE_OPTIONS,
} from "@/lib/options";
import { profileBasicsSchema, type ProfileBasicsInput, disclosureSchema } from "@/lib/validation";
import type {
  CommunicationStyle,
  ContactFrequency,
  EnergyLevel,
  PlanningStyle,
  Profile,
  RelationshipGoal,
  ResponsePace,
  SensitiveDisclosure,
  Visibility,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { ChipGroup } from "@/components/ui/chip-group";
import { RadioCards } from "@/components/ui/radio-cards";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ProfileDetails } from "@/components/profile/profile-details";
import { VisibilitySelect } from "@/components/profile/visibility-select";

/** Checkliste für die Profilvervollständigung (ADHS-freundlich: klare Schritte). */
function completionChecklist(p: Profile): { label: string; done: boolean }[] {
  return [
    { label: "Profiltext geschrieben", done: p.bio.length >= 20 },
    { label: "Mindestens 3 Interessen gewählt", done: p.interests.length >= 3 },
    { label: "Werte ausgewählt", done: p.values.length >= 1 },
    { label: "Kommunikationsstil angegeben", done: p.communicationStyles.length >= 1 },
    { label: "„Mein perfektes erstes Date“ ausgefüllt", done: Boolean(p.prompts.perfectFirstDate) },
    { label: "Grenzen formuliert", done: Boolean(p.boundaries) },
  ];
}

export default function MyProfilePage() {
  const store = useAppStore();
  const { state } = store;
  const me = state.me;
  const [tab, setTab] = React.useState<"edit" | "preview_public" | "preview_match">("edit");
  const [saved, setSaved] = React.useState(false);

  const checklist = completionChecklist(me);
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mein Profil</h1>

      <div role="group" aria-label="Ansicht wählen" className="flex flex-wrap gap-2">
        <Button variant={tab === "edit" ? "default" : "outline"} aria-pressed={tab === "edit"} onClick={() => setTab("edit")}>
          <Pencil aria-hidden="true" /> Bearbeiten
        </Button>
        <Button
          variant={tab === "preview_public" ? "default" : "outline"}
          aria-pressed={tab === "preview_public"}
          onClick={() => setTab("preview_public")}
        >
          <Eye aria-hidden="true" /> Vorschau: vor einem Match
        </Button>
        <Button
          variant={tab === "preview_match" ? "default" : "outline"}
          aria-pressed={tab === "preview_match"}
          onClick={() => setTab("preview_match")}
        >
          <Eye aria-hidden="true" /> Vorschau: nach einem Match
        </Button>
      </div>

      {tab !== "edit" ? (
        <>
          <Alert variant="info" title="So sehen andere dein Profil">
            Diese Vorschau zeigt exakt, was {tab === "preview_public" ? "Personen vor einem Match" : "deine Matches"} sehen —
            inklusive deiner Sichtbarkeits-Einstellungen.
          </Alert>
          <ProfileDetails profile={me} context={tab === "preview_public" ? "public" : "matched"} />
        </>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ListChecks aria-hidden="true" className="size-5 text-primary" />
                Profil-Checkliste
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={doneCount} max={checklist.length} label={`${doneCount} von ${checklist.length} Schritten erledigt`} />
              <ul className="space-y-1 text-sm">
                {checklist.map((c) => (
                  <li key={c.label} className={c.done ? "text-muted-foreground line-through" : ""}>
                    {c.done ? "✓" : "○"} {c.label}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {saved ? (
            <Alert variant="success" role="status">
              Deine Änderungen wurden gespeichert.
            </Alert>
          ) : null}

          <BasicsForm onSaved={() => setSaved(true)} />
          <SelectionsForm onSaved={() => setSaved(true)} />
          <PromptsForm onSaved={() => setSaved(true)} />
          <DisclosuresEditor />
          <StatusFlagsCard />
        </div>
      )}
    </div>
  );
}

function BasicsForm({ onSaved }: { onSaved: () => void }) {
  const store = useAppStore();
  const me = store.state.me;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileBasicsInput>({
    resolver: zodResolver(profileBasicsSchema),
    defaultValues: {
      displayName: me.displayName,
      pronouns: me.pronouns ?? "",
      city: me.city,
      bio: me.bio,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Über mich</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit((data) => {
            store.updateProfile({
              displayName: data.displayName,
              pronouns: data.pronouns || undefined,
              city: data.city,
              bio: data.bio,
            });
            onSaved();
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Anzeigename" htmlFor="p-name" error={errors.displayName?.message}>
              <Input id="p-name" aria-invalid={Boolean(errors.displayName)} {...register("displayName")} />
            </FormField>
            <FormField label="Pronomen" htmlFor="p-pronouns" optional error={errors.pronouns?.message}>
              <Input id="p-pronouns" placeholder="z. B. sie/ihr, er/ihm, they/them" {...register("pronouns")} />
            </FormField>
          </div>
          <FormField
            label="Ort"
            htmlFor="p-city"
            hint="Nur der Stadtname — deine genaue Adresse wird nie gespeichert oder angezeigt."
            error={errors.city?.message}
          >
            <Input id="p-city" aria-invalid={Boolean(errors.city)} {...register("city")} />
          </FormField>
          <FormField label="Profiltext" htmlFor="p-bio" error={errors.bio?.message}>
            <Textarea id="p-bio" rows={4} aria-invalid={Boolean(errors.bio)} {...register("bio")} />
          </FormField>
          <Button type="submit">Speichern</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SelectionsForm({ onSaved }: { onSaved: () => void }) {
  const store = useAppStore();
  const me = store.state.me;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interessen, Werte & Alltag</CardTitle>
        <CardDescription>Änderungen werden sofort gespeichert.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <ChipGroup
          legend="Interessen"
          options={INTEREST_OPTIONS.map((i) => ({ value: i, label: i }))}
          selected={me.interests}
          onChange={(v) => {
            store.updateProfile({ interests: v });
            onSaved();
          }}
          max={8}
        />
        <ChipGroup
          legend="Meine Werte"
          options={VALUE_OPTIONS.map((i) => ({ value: i, label: i }))}
          selected={me.values}
          onChange={(v) => {
            store.updateProfile({ values: v });
            onSaved();
          }}
          max={5}
        />
        <RadioCards
          legend="Beziehungswunsch"
          name="relationshipGoal"
          options={RELATIONSHIP_GOAL_OPTIONS}
          value={me.relationshipGoal}
          onChange={(v) => {
            store.updateProfile({ relationshipGoal: v as RelationshipGoal });
            onSaved();
          }}
        />
        <ChipGroup
          legend="So kommuniziere ich gerne"
          options={COMMUNICATION_STYLE_OPTIONS}
          selected={me.communicationStyles}
          onChange={(v) => {
            store.updateProfile({ communicationStyles: v as CommunicationStyle[] });
            onSaved();
          }}
        />
        <RadioCards
          legend="Gewünschte Kontaktfrequenz"
          name="contactFrequency"
          options={CONTACT_FREQUENCY_OPTIONS}
          value={me.contactFrequency}
          onChange={(v) => {
            store.updateProfile({ contactFrequency: v as ContactFrequency });
            onSaved();
          }}
        />
        <RadioCards
          legend="Wie planst du am liebsten?"
          name="planningStyle"
          options={PLANNING_STYLE_OPTIONS}
          value={me.planningStyle}
          onChange={(v) => {
            store.updateProfile({ planningStyle: v as PlanningStyle });
            onSaved();
          }}
        />
        <RadioCards
          legend="Energielevel im Alltag"
          name="energyLevel"
          options={ENERGY_LEVEL_OPTIONS}
          value={me.energyLevel}
          onChange={(v) => {
            store.updateProfile({ energyLevel: v as EnergyLevel });
            onSaved();
          }}
        />
        <RadioCards
          legend="Antwort-Tempo"
          name="responsePace"
          options={RESPONSE_PACE_OPTIONS}
          value={me.responsePace}
          onChange={(v) => {
            store.updateProfile({ responsePace: v as ResponsePace });
            onSaved();
          }}
        />
        <ChipGroup
          legend="Bevorzugte soziale Aktivitäten"
          options={SOCIAL_ACTIVITY_OPTIONS.map((i) => ({ value: i, label: i }))}
          selected={me.socialActivities}
          onChange={(v) => {
            store.updateProfile({ socialActivities: v });
            onSaved();
          }}
        />
        <ChipGroup
          legend="Reizempfindlichkeiten"
          hint="Freiwillig. Hilft anderen, gute Treffen mit dir zu planen."
          options={SENSORY_NEED_OPTIONS.map((i) => ({ value: i, label: i }))}
          selected={me.sensoryNeeds}
          onChange={(v) => {
            store.updateProfile({ sensoryNeeds: v });
            onSaved();
          }}
        />
        <div className="space-y-2">
          <ChipGroup
            legend="Barrierefreiheitsbedürfnisse"
            hint="Freiwillig. Du bestimmst unten, wer diese Angaben sieht."
            options={ACCESSIBILITY_NEED_OPTIONS.map((i) => ({ value: i, label: i }))}
            selected={me.accessibilityNeeds}
            onChange={(v) => {
              store.updateProfile({ accessibilityNeeds: v });
              onSaved();
            }}
          />
          <VisibilitySelect
            id="access-visibility"
            label="Wer sieht deine Barrierefreiheitsbedürfnisse?"
            value={me.accessibilityVisibility}
            onChange={(v) => {
              store.updateProfile({ accessibilityVisibility: v });
              onSaved();
            }}
          />
        </div>
        <VisibilitySelect
          id="orientation-visibility"
          label="Wer sieht deine sexuelle Orientierung?"
          value={me.orientationVisibility}
          onChange={(v) => {
            store.updateProfile({ orientationVisibility: v });
            onSaved();
          }}
        />
      </CardContent>
    </Card>
  );
}

function PromptsForm({ onSaved }: { onSaved: () => void }) {
  const store = useAppStore();
  const me = store.state.me;
  const prompts = [
    { key: "helpsMeOnDates", label: "Das hilft mir bei einem Treffen" },
    { key: "aboutMyCommunication", label: "Das solltest du über meine Kommunikation wissen" },
    { key: "howIShowInterest", label: "So zeige ich Interesse" },
    { key: "whatGivesMeSafety", label: "Das gibt mir Sicherheit" },
    { key: "myBoundaries", label: "Meine Grenzen" },
    { key: "perfectFirstDate", label: "Mein perfektes erstes Date" },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gut zu wissen</CardTitle>
        <CardDescription>
          Alle Felder sind freiwillig. Sie helfen anderen, dich so kennenzulernen, wie du bist.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prompts.map((p) => (
          <FormField key={p.key} label={p.label} htmlFor={`prompt-${p.key}`} optional>
            <Textarea
              id={`prompt-${p.key}`}
              rows={2}
              defaultValue={me.prompts[p.key] ?? ""}
              onBlur={(e) => {
                store.updateProfile({ prompts: { ...me.prompts, [p.key]: e.target.value || undefined } });
                onSaved();
              }}
            />
          </FormField>
        ))}
        <FormField label="Persönliche Grenzen und No-Gos" htmlFor="p-boundaries" optional>
          <Textarea
            id="p-boundaries"
            rows={2}
            defaultValue={me.boundaries}
            onBlur={(e) => {
              store.updateProfile({ boundaries: e.target.value });
              onSaved();
            }}
          />
        </FormField>
      </CardContent>
    </Card>
  );
}

function DisclosuresEditor() {
  const store = useAppStore();
  const me = store.state.me;
  const [label, setLabel] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [visibility, setVisibility] = React.useState<Visibility>("after_match");
  const [searchable, setSearchable] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function addDisclosure() {
    const parsed = disclosureSchema.safeParse({ label, description: description || undefined, visibility, searchable });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Bitte prüfe deine Eingabe.");
      return;
    }
    const d: SensitiveDisclosure = {
      id: `d-${Date.now()}`,
      label: parsed.data.label,
      description: parsed.data.description,
      visibility: parsed.data.visibility,
      searchable: parsed.data.searchable,
    };
    store.updateProfile({ disclosures: [...me.disclosures, d] });
    setLabel("");
    setDescription("");
    setSearchable(false);
    setError(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Freiwillige Angaben zu Behinderung, Erkrankung oder Neurodivergenz</CardTitle>
        <CardDescription>
          Du musst hier nichts angeben — eine Diagnose ist nie verpflichtend. Du wählst deine
          eigenen Worte und bestimmst für jede Angabe einzeln, wer sie sieht.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {me.disclosures.length > 0 ? (
          <ul className="space-y-3">
            {me.disclosures.map((d) => (
              <li key={d.id} className="space-y-2 rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{d.label}</p>
                    {d.description ? (
                      <p className="text-sm text-muted-foreground">{d.description}</p>
                    ) : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Angabe „${d.label}“ löschen`}
                    onClick={() =>
                      store.updateProfile({
                        disclosures: me.disclosures.filter((x) => x.id !== d.id),
                      })
                    }
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
                <VisibilitySelect
                  id={`disclosure-vis-${d.id}`}
                  label={`Wer sieht „${d.label}“?`}
                  value={d.visibility}
                  onChange={(v) =>
                    store.updateProfile({
                      disclosures: me.disclosures.map((x) =>
                        x.id === d.id ? { ...x, visibility: v, searchable: v === "public" ? x.searchable : false } : x,
                      ),
                    })
                  }
                />
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor={`disclosure-search-${d.id}`} className="text-sm font-normal">
                    Darf über Suchfilter gefunden werden (nur bei öffentlicher Sichtbarkeit)
                  </Label>
                  <Switch
                    id={`disclosure-search-${d.id}`}
                    checked={d.searchable && d.visibility === "public"}
                    disabled={d.visibility !== "public"}
                    onCheckedChange={(v) =>
                      store.updateProfile({
                        disclosures: me.disclosures.map((x) =>
                          x.id === d.id ? { ...x, searchable: v } : x,
                        ),
                      })
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Du hast aktuell keine Angaben hinterlegt.</p>
        )}

        <fieldset className="space-y-3 rounded-md border border-border p-4">
          <legend className="px-1 font-semibold">Neue Angabe hinzufügen</legend>
          {error ? <Alert variant="destructive">{error}</Alert> : null}
          <FormField label="Bezeichnung" htmlFor="new-disclosure-label" hint="Deine eigenen Worte, z. B. „ADHS“ oder „chronische Schmerzen“.">
            <Input id="new-disclosure-label" value={label} onChange={(e) => setLabel(e.target.value)} />
          </FormField>
          <FormField label="Beschreibung" htmlFor="new-disclosure-desc" optional>
            <Textarea
              id="new-disclosure-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
          <VisibilitySelect
            id="new-disclosure-vis"
            label="Sichtbarkeit"
            value={visibility}
            onChange={setVisibility}
          />
          <Button onClick={addDisclosure}>
            <Plus aria-hidden="true" /> Angabe hinzufügen
          </Button>
        </fieldset>
      </CardContent>
    </Card>
  );
}

function StatusFlagsCard() {
  const store = useAppStore();
  const me = store.state.me;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="flag-slow" className="font-normal">
            Status „Meine Antwort kann etwas dauern“ im Profil zeigen
          </Label>
          <Switch
            id="flag-slow"
            checked={me.statusFlags.slowReplies}
            onCheckedChange={(v) =>
              store.updateProfile({ statusFlags: { ...me.statusFlags, slowReplies: v } })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
