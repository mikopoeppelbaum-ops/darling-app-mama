"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, CalendarPlus, CheckCircle2, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otherProfileId, profileById, useAppStore } from "@/lib/store";
import {
  ACCESSIBILITY_NEED_OPTIONS,
  DATE_TYPE_OPTIONS,
  POLITE_CANCEL_TEMPLATES,
  labelFor,
} from "@/lib/options";
import { datePlanSchema, type DatePlanInput } from "@/lib/validation";
import { formatDateTime, generateSafetyCode, isPastDate } from "@/lib/utils";
import type { DatePlan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { ChipGroup } from "@/components/ui/chip-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";

export default function DatesPage() {
  return (
    <React.Suspense>
      <DatesPageInner />
    </React.Suspense>
  );
}

function DatesPageInner() {
  const store = useAppStore();
  const { state } = store;
  const searchParams = useSearchParams();
  const preselectedMatch = searchParams.get("match");
  const [creating, setCreating] = React.useState(Boolean(preselectedMatch));
  const [cancelTarget, setCancelTarget] = React.useState<DatePlan | null>(null);

  const activeMatches = state.matches.filter((m) => m.status === "active");
  const upcoming = state.datePlans
    .filter((d) => d.status !== "cancelled")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Date-Planer</h1>
        {activeMatches.length > 0 ? (
          <Button onClick={() => setCreating((v) => !v)} aria-expanded={creating}>
            <CalendarPlus aria-hidden="true" /> Date planen
          </Button>
        ) : null}
      </header>

      {creating ? (
        <DatePlanForm
          preselectedMatchId={preselectedMatch}
          onDone={() => setCreating(false)}
        />
      ) : null}

      {upcoming.length === 0 && !creating ? (
        <EmptyState
          icon={Calendar}
          title="Noch keine Dates geplant"
          description="Plane ein Treffen mit einem Match — mit Ort, Zeit, Dauer und allem, was du für ein gutes Treffen brauchst."
        />
      ) : (
        <ul className="space-y-3">
          {upcoming.map((plan) => {
            const match = state.matches.find((m) => m.id === plan.matchId);
            const other = match ? profileById(state, otherProfileId(match, state.me.id)) : undefined;
            return (
              <li key={plan.id}>
                <DatePlanCard
                  plan={plan}
                  otherName={other?.displayName ?? "Unbekannt"}
                  onConfirm={() => store.updateDatePlan(plan.id, { status: "confirmed" }, "Treffpunkt bestätigt")}
                  onCancel={() => setCancelTarget(plan)}
                  onCheckIn={() => store.updateDatePlan(plan.id, { checkInDone: true, status: "completed" })}
                />
              </li>
            );
          })}
        </ul>
      )}

      {cancelTarget ? (
        <Dialog
          open={Boolean(cancelTarget)}
          onClose={() => setCancelTarget(null)}
          title="Date absagen oder verschieben"
          description="Eine Absage ist völlig in Ordnung. Du kannst eine respektvolle Nachricht mitschicken."
        >
          <div className="grid gap-2">
            {POLITE_CANCEL_TEMPLATES.map((t) => (
              <button
                key={t}
                type="button"
                className="cursor-pointer rounded-md border border-border bg-card p-3 text-left text-sm hover:bg-secondary"
                onClick={() => {
                  store.updateDatePlan(cancelTarget.id, { status: "cancelled" }, t);
                  const match = state.matches.find((m) => m.id === cancelTarget.matchId);
                  if (match && match.status === "active") store.sendMessage(match.id, t);
                  setCancelTarget(null);
                }}
              >
                {t}
              </button>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                store.updateDatePlan(cancelTarget.id, { status: "cancelled" }, "Ohne Nachricht abgesagt");
                setCancelTarget(null);
              }}
            >
              Ohne Nachricht absagen
            </Button>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

function DatePlanCard({
  plan,
  otherName,
  onConfirm,
  onCancel,
  onCheckIn,
}: {
  plan: DatePlan;
  otherName: string;
  onConfirm: () => void;
  onCancel: () => void;
  onCheckIn: () => void;
}) {
  const statusLabel: Record<DatePlan["status"], string> = {
    proposed: "Vorgeschlagen",
    confirmed: "Bestätigt",
    rescheduled: "Verschoben",
    cancelled: "Abgesagt",
    completed: "Abgeschlossen",
  };
  const isPast = isPastDate(plan.startsAt);

  function downloadIcs() {
    // Kalendererinnerung: einfache ICS-Datei zum Import in jeden Kalender.
    const dt = (iso: string) =>
      new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(new Date(plan.startsAt).getTime() + plan.durationMinutes * 60000);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//EchtNah//DE",
      "BEGIN:VEVENT",
      `UID:${plan.id}@echtnah.example`,
      `DTSTART:${dt(plan.startsAt)}`,
      `DTEND:${dt(end.toISOString())}`,
      `SUMMARY:Date mit ${otherName} (${labelFor([...DATE_TYPE_OPTIONS], plan.dateType)})`,
      `LOCATION:${plan.locationName}`,
      `DESCRIPTION:${(plan.notes ?? "").replace(/\n/g, "\\n")}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT2H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Erinnerung an dein Date",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "echtnah-date.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2">
          Date mit {otherName}
          <Badge variant={plan.status === "confirmed" ? "success" : plan.status === "cancelled" ? "destructive" : "outline"}>
            {statusLabel[plan.status]}
          </Badge>
        </CardTitle>
        <CardDescription>
          {labelFor([...DATE_TYPE_OPTIONS], plan.dateType)} · {formatDateTime(plan.startsAt)} ·{" "}
          {plan.durationMinutes} Minuten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Zusammenfassung: Treffpunkt, Zeit und wichtige Infos auf einen Blick */}
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-muted-foreground">Treffpunkt</dt>
            <dd>{plan.locationName}</dd>
            {plan.locationNotes ? <dd className="text-muted-foreground">{plan.locationNotes}</dd> : null}
          </div>
          {plan.accessibilityRequirements.length > 0 ? (
            <div>
              <dt className="font-semibold text-muted-foreground">Barrierefreiheit</dt>
              <dd>{plan.accessibilityRequirements.join(", ")}</dd>
            </div>
          ) : null}
          {plan.notes ? (
            <div>
              <dt className="font-semibold text-muted-foreground">Notizen für euch beide</dt>
              <dd>{plan.notes}</dd>
            </div>
          ) : null}
          {plan.safetyContactName ? (
            <div>
              <dt className="font-semibold text-muted-foreground">Sicherheitskontakt</dt>
              <dd>
                {plan.safetyContactName}
                {plan.shareWithTrustedPerson ? " (Date-Infos werden geteilt)" : ""}
              </dd>
            </div>
          ) : null}
          {plan.safetyCode ? (
            <div>
              <dt className="font-semibold text-muted-foreground">Sicherheitscode</dt>
              <dd>{plan.safetyCode}</dd>
            </div>
          ) : null}
        </dl>

        {plan.lastChangeNote ? (
          <Alert variant="info" title="Letzte Änderung">
            {plan.lastChangeNote}
          </Alert>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-border pt-3">
          {plan.status === "proposed" ? (
            <Button size="sm" onClick={onConfirm}>
              <CheckCircle2 aria-hidden="true" /> Treffpunkt bestätigen
            </Button>
          ) : null}
          {plan.status !== "cancelled" && plan.status !== "completed" ? (
            <>
              <Button size="sm" variant="secondary" onClick={downloadIcs}>
                <Download aria-hidden="true" /> In Kalender speichern
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                Absagen / verschieben
              </Button>
            </>
          ) : null}
          {isPast && !plan.checkInDone && plan.status !== "cancelled" ? (
            <Button size="sm" variant="secondary" onClick={onCheckIn}>
              Check-in: Mir geht es gut
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function DatePlanForm({
  preselectedMatchId,
  onDone,
}: {
  preselectedMatchId: string | null;
  onDone: () => void;
}) {
  const store = useAppStore();
  const { state } = store;
  const activeMatches = state.matches.filter((m) => m.status === "active");
  const [matchId, setMatchId] = React.useState(preselectedMatchId ?? activeMatches[0]?.id ?? "");
  const [accessibility, setAccessibility] = React.useState<string[]>([]);
  const [safetyCodeEnabled, setSafetyCodeEnabled] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatePlanInput>({
    resolver: zodResolver(datePlanSchema),
    defaultValues: {
      dateType: "",
      startsAt: "",
      durationMinutes: 60,
      locationName: "",
      accessibilityRequirements: [],
      remindersEnabled: true,
      shareWithTrustedPerson: false,
    },
  });

  function onSubmit(data: DatePlanInput) {
    store.createDatePlan({
      matchId,
      createdByProfileId: state.me.id,
      dateType: data.dateType,
      startsAt: new Date(data.startsAt).toISOString(),
      durationMinutes: data.durationMinutes,
      locationName: data.locationName,
      locationNotes: data.locationNotes || undefined,
      accessibilityRequirements: accessibility,
      notes: data.notes || undefined,
      remindersEnabled: data.remindersEnabled,
      safetyContactName: data.safetyContactName || undefined,
      safetyContactPhone: data.safetyContactPhone || undefined,
      safetyCode: safetyCodeEnabled ? generateSafetyCode() : undefined,
      shareWithTrustedPerson: data.shareWithTrustedPerson,
    });
    onDone();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neues Date planen</CardTitle>
        <CardDescription>
          Alles Wichtige an einem Ort: Zeit, Treffpunkt, Barrierefreiheit und Sicherheit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Mit wem?" htmlFor="plan-match">
            <Select id="plan-match" value={matchId} onChange={(e) => setMatchId(e.target.value)}>
              {activeMatches.map((m) => {
                const other = profileById(state, otherProfileId(m, state.me.id));
                return (
                  <option key={m.id} value={m.id}>
                    {other?.displayName ?? "Unbekannt"}
                  </option>
                );
              })}
            </Select>
          </FormField>

          <FormField label="Art des Treffens" htmlFor="plan-type" error={errors.dateType?.message}>
            <Select id="plan-type" aria-invalid={Boolean(errors.dateType)} {...register("dateType")}>
              <option value="">Bitte auswählen …</option>
              {DATE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Datum und Uhrzeit" htmlFor="plan-start" error={errors.startsAt?.message}>
              <Input
                id="plan-start"
                type="datetime-local"
                aria-invalid={Boolean(errors.startsAt)}
                {...register("startsAt")}
              />
            </FormField>
            <FormField label="Dauer (Minuten)" htmlFor="plan-duration" error={errors.durationMinutes?.message}>
              <Input
                id="plan-duration"
                type="number"
                min={15}
                max={600}
                step={15}
                aria-invalid={Boolean(errors.durationMinutes)}
                {...register("durationMinutes", { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <FormField label="Treffpunkt" htmlFor="plan-location" hint="Name des Ortes reicht — z. B. ein Café. Keine privaten Adressen." error={errors.locationName?.message}>
            <Input id="plan-location" aria-invalid={Boolean(errors.locationName)} {...register("locationName")} />
          </FormField>

          <FormField label="Hinweise zum Ort" htmlFor="plan-location-notes" optional error={errors.locationNotes?.message}>
            <Input id="plan-location-notes" placeholder="z. B. Eingang über den Hof, Aufzug vorhanden" {...register("locationNotes")} />
          </FormField>

          <ChipGroup
            legend="Barrierefreiheit für dieses Treffen"
            hint="Was soll der Ort erfüllen?"
            options={ACCESSIBILITY_NEED_OPTIONS.map((o) => ({ value: o, label: o }))}
            selected={accessibility}
            onChange={setAccessibility}
          />

          <FormField label="Notizen für euch beide" htmlFor="plan-notes" optional error={errors.notes?.message}>
            <Textarea id="plan-notes" rows={2} {...register("notes")} />
          </FormField>

          <fieldset className="space-y-3 rounded-md border border-border p-4">
            <legend className="px-1 font-semibold">Sicherheit</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Sicherheitskontakt (Name)" htmlFor="plan-safety-name" optional hint="Eine Vertrauensperson, die weiß, wo du bist.">
                <Input id="plan-safety-name" {...register("safetyContactName")} />
              </FormField>
              <FormField label="Telefonnummer der Vertrauensperson" htmlFor="plan-safety-phone" optional>
                <Input id="plan-safety-phone" type="tel" {...register("safetyContactPhone")} />
              </FormField>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="plan-share" {...register("shareWithTrustedPerson")} />
              <Label htmlFor="plan-share" className="font-normal">
                Date-Informationen mit meiner Vertrauensperson teilen
              </Label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="plan-code"
                checked={safetyCodeEnabled}
                onChange={(e) => setSafetyCodeEnabled(e.target.checked)}
              />
              <Label htmlFor="plan-code" className="font-normal">
                Sicherheitscode für dieses Treffen erzeugen
              </Label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="plan-reminders" defaultChecked {...register("remindersEnabled")} />
              <Label htmlFor="plan-reminders" className="font-normal">
                Erinnerungen aktivieren (vor dem Date und Check-in danach)
              </Label>
            </div>
          </fieldset>

          <div className="flex gap-3">
            <Button type="submit">Date vorschlagen</Button>
            <Button type="button" variant="secondary" onClick={onDone}>
              Abbrechen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
