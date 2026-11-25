"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  BookmarkCheck,
  Flag,
  Heart,
  LayoutGrid,
  List,
  MessageCircleQuestion,
  Moon,
  RotateCcw,
  ShieldOff,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { decisionTimestamps, useAppStore } from "@/lib/store";
import {
  applyDiscoverFilters,
  DAILY_SUGGESTIONS,
  distanceKm,
  isMutualCandidate,
  matchReasons,
  sortByMatchQuality,
  suggestionsLeftToday,
  violatesDealbreakers,
} from "@/lib/matching";
import type { DiscoverFilters, Profile } from "@/lib/types";
import { ageFromBirthdate } from "@/lib/utils";
import { labelFor, QUESTIONS_ABOUT_ME_OPTIONS, RELATIONSHIP_GOAL_OPTIONS } from "@/lib/options";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { ReportDialog } from "@/components/profile/report-dialog";
import { DiscoverFiltersPanel } from "@/components/discover/filters-panel";
import { MatchReasonsList } from "@/components/discover/match-reasons";

export default function DiscoverPage() {
  const store = useAppStore();
  const { state } = store;
  const [view, setView] = React.useState<"cards" | "list">("cards");
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<DiscoverFilters>({});
  const [reportTarget, setReportTarget] = React.useState<Profile | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [newMatchName, setNewMatchName] = React.useState<string | null>(null);

  // Kandidat:innen: gegenseitige Präferenzen, keine Blockierungen, keine
  // Dealbreaker, noch nicht entschieden. Danach nach Gemeinsamkeiten sortiert.
  const candidates = React.useMemo(() => {
    const base = state.profiles.filter(
      (p) =>
        !state.blocked.includes(p.id) &&
        !state.skipped.includes(p.id) &&
        !state.likesGiven.some((l) => l.toProfileId === p.id) &&
        !state.matches.some((m) => m.profileIds.includes(p.id) && m.status !== "ended") &&
        isMutualCandidate(state.me, state.myPreferences, p, {
          // Demo: Gegenseite akzeptiert alle — echte Präferenzen kämen aus der Datenbank.
          profileId: p.id,
          seekingGenders: [],
          ageMin: 18,
          ageMax: 99,
          maxDistanceKm: 500,
          relationshipGoals: [],
          dealbreakers: [],
        }) &&
        !violatesDealbreakers(state.myPreferences, p),
    );
    return sortByMatchQuality(applyDiscoverFilters(base, filters, state.me), state.me);
  }, [state, filters]);

  // Tägliche Auswahl (Choice-Overload-Forschung, siehe /wissen)
  const leftToday = suggestionsLeftToday(decisionTimestamps(state));
  const doneToday = DAILY_SUGGESTIONS - leftToday;
  const todays = candidates.slice(0, leftToday);
  const current = todays[0];

  function handleLike(p: Profile) {
    const result = store.like(p.id);
    if (result.rateLimited) {
      setNotice("Viele Likes in kurzer Zeit. Mach gern eine kleine Pause.");
      return;
    }
    if (result.limitReached) {
      setNotice("Für heute sind alle Likes verbraucht. Morgen geht es weiter.");
      return;
    }
    setNotice(null);
    if (result.match) setNewMatchName(p.displayName);
  }

  function handleUndo() {
    const restored = store.undoSkip();
    setNotice(
      restored
        ? "Das zuletzt übersprungene Profil ist wieder da."
        : "Es gibt nichts zum Zurückholen.",
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Entdecken</h1>
          <p className="text-muted-foreground">Deine ruhige Auswahl für heute</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Ansicht und Filter">
          <Button
            variant={view === "cards" ? "soft" : "ghost"}
            size="sm"
            aria-pressed={view === "cards"}
            onClick={() => setView("cards")}
          >
            <LayoutGrid aria-hidden="true" className="size-4" /> Karte
          </Button>
          <Button
            variant={view === "list" ? "soft" : "ghost"}
            size="sm"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List aria-hidden="true" className="size-4" /> Liste
          </Button>
          <Button
            variant="secondary"
            size="sm"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" /> Filter
          </Button>
        </div>
      </header>

      <Progress
        value={doneToday}
        max={DAILY_SUGGESTIONS}
        label={`${doneToday} von ${DAILY_SUGGESTIONS} Vorschlägen für heute angesehen`}
      />

      {notice ? (
        <Alert variant="info" role="status">
          {notice}
        </Alert>
      ) : null}

      {newMatchName ? (
        <Alert variant="success" title={`Es ist ein Match mit ${newMatchName}!`}>
          Ihr habt euch gegenseitig ein „Gefällt mir“ gegeben.{" "}
          <Link className="font-semibold underline" href="/matches">
            Zu deinen Matches
          </Link>
        </Alert>
      ) : null}

      {filtersOpen ? (
        <DiscoverFiltersPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setFiltersOpen(false)}
        />
      ) : null}

      {leftToday === 0 ? (
        <EmptyState
          icon={Moon}
          title="Für heute ist Schluss"
          description="Du hast deine Vorschläge für heute angesehen. Morgen gibt es neue — weniger Auswahl führt nachweislich zu bewussteren Entscheidungen und schützt vor Reizüberflutung."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/nachrichten" className={buttonVariants({ variant: "soft" })}>
                Zu deinen Nachrichten
              </Link>
              <Link href="/wissen" className={buttonVariants({ variant: "ghost" })}>
                Warum nur wenige Vorschläge?
              </Link>
            </div>
          }
        />
      ) : todays.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Gerade keine passenden Profile"
          description="Du hast alle passenden Profile gesehen. Passe gern deine Filter an oder schau später wieder vorbei — neue Menschen kommen laufend dazu."
          action={
            <Button variant="secondary" onClick={handleUndo}>
              <RotateCcw aria-hidden="true" /> Zuletzt Übersprungenes zurückholen
            </Button>
          }
        />
      ) : view === "cards" && current ? (
        <CandidateCard
          profile={current}
          me={state.me}
          saved={state.saved.includes(current.id)}
          onLike={() => handleLike(current)}
          onSkip={() => store.skip(current.id)}
          onSave={() => store.toggleSave(current.id)}
          onUndo={handleUndo}
          onReport={() => setReportTarget(current)}
          onBlock={() => store.block(current.id)}
        />
      ) : (
        <ul className="space-y-3">
          {todays.map((p) => (
            <li key={p.id}>
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <Image
                    src={p.photos[0]?.url ?? ""}
                    alt={p.photos[0]?.altText ?? ""}
                    width={64}
                    height={64}
                    unoptimized
                    className="size-16 rounded-full border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Link href={`/profil/${p.id}`} className="font-semibold hover:underline">
                      {p.displayName}, {ageFromBirthdate(p.birthdate)}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground">
                      {labelFor(RELATIONSHIP_GOAL_OPTIONS, p.relationshipGoal)} ·{" "}
                      {matchReasons(state.me, p).length} Gemeinsamkeiten · {distanceKm(state.me, p)}{" "}
                      km
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleLike(p)}
                    aria-label={`${p.displayName} gefällt mir`}
                  >
                    <Heart aria-hidden="true" className="size-4" /> Gefällt mir
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {reportTarget ? (
        <ReportDialog
          profileId={reportTarget.id}
          profileName={reportTarget.displayName}
          open={Boolean(reportTarget)}
          onClose={() => setReportTarget(null)}
        />
      ) : null}
    </div>
  );
}

function CandidateCard({
  profile,
  me,
  saved,
  onLike,
  onSkip,
  onSave,
  onUndo,
  onReport,
  onBlock,
}: {
  profile: Profile;
  me: Profile;
  saved: boolean;
  onLike: () => void;
  onSkip: () => void;
  onSave: () => void;
  onUndo: () => void;
  onReport: () => void;
  onBlock: () => void;
}) {
  const reasons = matchReasons(me, profile);
  const questions = profile.questionsAboutMe
    ? labelFor(QUESTIONS_ABOUT_ME_OPTIONS, profile.questionsAboutMe)
    : null;
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-5 md:p-7">
        {/* Text und Bild gleichwertig: kleines rundes Bild, Persönlichkeit im Fokus */}
        <div className="flex items-start gap-4">
          <Image
            src={profile.photos[0]?.url ?? ""}
            alt={profile.photos[0]?.altText ?? ""}
            width={96}
            height={96}
            unoptimized
            className="size-20 shrink-0 rounded-full border border-border object-cover md:size-24"
          />
          <div className="min-w-0">
            <h2 className="text-3xl font-semibold">
              <Link href={`/profil/${profile.id}`} className="hover:underline">
                {profile.displayName}
              </Link>
              <span className="font-normal text-muted-foreground">
                , {ageFromBirthdate(profile.birthdate)}
              </span>
            </h2>
            <p className="text-muted-foreground">
              {profile.pronouns ? `${profile.pronouns} · ` : ""}
              {profile.city} (ungefähr) · {distanceKm(me, profile)} km
            </p>
          </div>
        </div>

        <p className="text-lg leading-relaxed">{profile.bio}</p>

        <div className="flex flex-wrap gap-2">
          {profile.interests.slice(0, 5).map((i) => (
            <Badge key={i} variant="soft">
              {i}
            </Badge>
          ))}
        </div>

        {reasons.length > 0 ? <MatchReasonsList reasons={reasons} /> : null}

        {questions ? (
          <p className="flex items-start gap-2 text-sm">
            <MessageCircleQuestion
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
            />
            <span>
              <span className="font-semibold">Fragen zu Behinderung/Neurodivergenz:</span>{" "}
              {questions}
            </span>
          </p>
        ) : null}

        <Link
          href={`/profil/${profile.id}`}
          className="inline-block font-semibold text-primary underline underline-offset-4"
        >
          Ganzes Profil ansehen
        </Link>

        <div
          className="flex flex-wrap gap-3 border-t border-border pt-5"
          role="group"
          aria-label={`Entscheidung zu ${profile.displayName}`}
        >
          <Button size="lg" onClick={onLike}>
            <Heart aria-hidden="true" /> Gefällt mir
          </Button>
          <Button size="lg" variant="secondary" onClick={onSkip}>
            <X aria-hidden="true" /> Überspringen
          </Button>
          <Button variant="ghost" onClick={onSave} aria-pressed={saved}>
            {saved ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
            {saved ? "Gespeichert" : "Für später"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 text-sm">
          <Button variant="ghost" size="sm" onClick={onUndo}>
            <RotateCcw aria-hidden="true" className="size-4" /> Zurück
          </Button>
          <Button variant="ghost" size="sm" onClick={onReport}>
            <Flag aria-hidden="true" className="size-4" /> Melden
          </Button>
          <Button variant="ghost" size="sm" onClick={onBlock}>
            <ShieldOff aria-hidden="true" className="size-4" /> Blockieren
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
