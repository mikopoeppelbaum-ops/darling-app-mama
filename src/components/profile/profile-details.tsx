"use client";

import Image from "next/image";
import {
  Accessibility,
  CalendarClock,
  Ear,
  HandHeart,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Profile } from "@/lib/types";
import { profileForViewer, type ViewerContext } from "@/lib/visibility";
import { ageFromBirthdate } from "@/lib/utils";
import {
  COMMUNICATION_STYLE_OPTIONS,
  CONTACT_FREQUENCY_OPTIONS,
  ENERGY_LEVEL_OPTIONS,
  ORIENTATION_OPTIONS,
  PLANNING_STYLE_OPTIONS,
  RELATIONSHIP_GOAL_OPTIONS,
  RESPONSE_PACE_OPTIONS,
  labelFor,
} from "@/lib/options";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon aria-hidden="true" className="size-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

/**
 * Vollständige Profilansicht. `context` steuert, welche sensiblen Angaben
 * sichtbar sind — dieselbe Komponente rendert auch die eigene Vorschau
 * ("exakt das, was andere sehen").
 */
export function ProfileDetails({
  profile: rawProfile,
  context,
}: {
  profile: Profile;
  context: ViewerContext;
}) {
  const profile = profileForViewer(rawProfile, context);
  const age = ageFromBirthdate(profile.birthdate);
  const orientationLabel =
    profile.orientation !== "prefer_not_to_say"
      ? labelFor(ORIENTATION_OPTIONS, profile.orientation)
      : null;

  const promptItems: { label: string; value?: string }[] = [
    { label: "Das hilft mir bei einem Treffen", value: profile.prompts.helpsMeOnDates },
    {
      label: "Das solltest du über meine Kommunikation wissen",
      value: profile.prompts.aboutMyCommunication,
    },
    { label: "So zeige ich Interesse", value: profile.prompts.howIShowInterest },
    { label: "Das gibt mir Sicherheit", value: profile.prompts.whatGivesMeSafety },
    { label: "Meine Grenzen", value: profile.prompts.myBoundaries },
    { label: "Mein perfektes erstes Date", value: profile.prompts.perfectFirstDate },
  ];

  return (
    <div className="space-y-4">
      {/* Kopfbereich: Text zuerst, Bild bewusst klein — Infos stehen im Vordergrund */}
      <div className="flex items-start gap-4">
        {profile.photos[0] ? (
          <Image
            src={profile.photos[0].url}
            alt={profile.photos[0].altText}
            width={112}
            height={112}
            className="size-24 shrink-0 rounded-lg border border-border object-cover md:size-28"
          />
        ) : null}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">
            {profile.displayName}
            <span className="font-normal text-muted-foreground">, {age}</span>
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
            {profile.pronouns ? <span>{profile.pronouns}</span> : null}
            {orientationLabel ? <span>{orientationLabel}</span> : null}
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-4" />
              {profile.city} (ungefähr)
            </span>
          </p>
          {profile.statusFlags.slowReplies ? (
            <Badge className="mt-2" variant="outline">
              <Ear aria-hidden="true" className="size-3.5" />
              Meine Antwort kann etwas dauern
            </Badge>
          ) : null}
        </div>
      </div>

      <p className="text-lg leading-relaxed">{profile.bio}</p>

      <div className="flex flex-wrap gap-2">
        <Badge variant="primary">
          <Heart aria-hidden="true" className="size-3.5" />
          {labelFor(RELATIONSHIP_GOAL_OPTIONS, profile.relationshipGoal)}
        </Badge>
        <Badge>
          <CalendarClock aria-hidden="true" className="size-3.5" />
          {labelFor(PLANNING_STYLE_OPTIONS, profile.planningStyle)}
        </Badge>
        <Badge>{labelFor(ENERGY_LEVEL_OPTIONS, profile.energyLevel)}</Badge>
        <Badge>{labelFor(CONTACT_FREQUENCY_OPTIONS, profile.contactFrequency)}</Badge>
      </div>

      <Section icon={Sparkles} title="Interessen & Werte">
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((i) => (
            <Badge key={i}>{i}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.values.map((v) => (
            <Badge key={v} variant="outline">
              {v}
            </Badge>
          ))}
        </div>
      </Section>

      <Section icon={MessageCircle} title="Kommunikation">
        <p>
          Mag am liebsten:{" "}
          {profile.communicationStyles
            .map((c) => labelFor(COMMUNICATION_STYLE_OPTIONS, c))
            .join(", ")}
        </p>
        <p>{labelFor(RESPONSE_PACE_OPTIONS, profile.responsePace)}.</p>
        {profile.socialActivities.length > 0 ? (
          <p>Gerne dabei: {profile.socialActivities.join(", ")}.</p>
        ) : null}
      </Section>

      {profile.accessibilityNeeds.length > 0 ? (
        <Section icon={Accessibility} title="Das brauche ich für ein gutes Treffen">
          <ul className="list-inside list-disc space-y-1">
            {profile.accessibilityNeeds.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {profile.sensoryNeeds.length > 0 ? (
        <Section icon={Info} title="Reizempfindlichkeiten">
          <ul className="list-inside list-disc space-y-1">
            {profile.sensoryNeeds.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {profile.disclosures.length > 0 ? (
        <Section icon={HandHeart} title="Was ich über mich teile">
          <ul className="space-y-2">
            {profile.disclosures.map((d) => (
              <li key={d.id}>
                <span className="font-medium">{d.label}</span>
                {d.description ? (
                  <span className="text-muted-foreground"> — {d.description}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {promptItems.some((p) => p.value) ? (
        <Section icon={ShieldCheck} title="Gut zu wissen">
          <dl className="space-y-3">
            {promptItems
              .filter((p) => p.value)
              .map((p) => (
                <div key={p.label}>
                  <dt className="text-sm font-semibold text-muted-foreground">{p.label}</dt>
                  <dd>{p.value}</dd>
                </div>
              ))}
          </dl>
        </Section>
      ) : null}
    </div>
  );
}
