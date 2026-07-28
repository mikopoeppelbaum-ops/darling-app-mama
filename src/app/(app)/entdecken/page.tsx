"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  BookmarkCheck,
  Compass,
  Flag,
  Heart,
  LayoutGrid,
  List,
  RotateCcw,
  ShieldOff,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import {
  applyDiscoverFilters,
  distanceKm,
  isMutualCandidate,
  matchReasons,
  violatesDealbreakers,
} from "@/lib/matching";
import type { DiscoverFilters, Profile } from "@/lib/types";
import { ageFromBirthdate } from "@/lib/utils";
import { labelFor, RELATIONSHIP_GOAL_OPTIONS } from "@/lib/options";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
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
  // Dealbreaker, noch nicht geliked/übersprungen/gematcht.
  const candidates = React.useMemo(() => {
    const base = state.profiles.filter(
      (p) =>
        !state.blocked.includes(p.id) &&
        !state.skipped.includes(p.id) &&
        !state.likesGiven.some((l) => l.toProfileId === p.id) &&
        !state.matches.some((m) => m.profileIds.includes(p.id) && m.status !== "ended") &&
        isMutualCandidate(state.me, state.myPreferences, p, {
          // Demo: andere Profile akzeptieren alle Geschlechter — echte Präferenzen
          // der Gegenseite kämen aus der Datenbank.
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
    return applyDiscoverFilters(base, filters, state.me);
  }, [state, filters]);

  const current = candidates[0];

  function handleLike(p: Profile) {
    const result = store.like(p.id);
    if (result.rateLimited) {
      setNotice("Zu viele Likes in kurzer Zeit. Bitte mache eine kurze Pause.");
      return;
    }
    if (result.limitReached) {
      setNotice(
        "Dein Tageslimit an Likes ist erreicht. Morgen kannst du wieder liken — Qualität vor Menge.",
      );
      return;
    }
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

  const likesLeft = store.likesLeftToday;

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Entdecken</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-pressed={view === "cards"}
            onClick={() => setView("cards")}
          >
            <LayoutGrid aria-hidden="true" className="size-4" /> Karten
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List aria-hidden="true" className="size-4" /> Liste
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" /> Filter
          </Button>
        </div>
      </header>

      <p className="text-sm text-muted-foreground">
        Heute noch {likesLeft} Likes übrig (kostenloses Konto).
      </p>

      {notice ? (
        <Alert variant="info" role="status">
          {notice}
        </Alert>
      ) : null}

      {newMatchName ? (
        <Alert variant="success" title={`Es ist ein Match mit ${newMatchName}!`}>
          Ihr habt euch gegenseitig geliked.{" "}
          <Link className="font-medium underline" href="/matches">
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

      {candidates.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="Gerade keine neuen Profile"
          description="Du hast alle passenden Profile gesehen. Du kannst deine Filter anpassen oder später wiederkommen — neue Menschen kommen laufend dazu."
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
          {candidates.map((p) => (
            <li key={p.id}>
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <Image
                    src={p.photos[0]?.url ?? ""}
                    alt={p.photos[0]?.altText ?? ""}
                    width={64}
                    height={64}
                    className="size-16 rounded-md border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Link href={`/profil/${p.id}`} className="font-semibold hover:underline">
                      {p.displayName}, {ageFromBirthdate(p.birthdate)}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground">
                      {p.city} · {labelFor(RELATIONSHIP_GOAL_OPTIONS, p.relationshipGoal)} ·{" "}
                      {distanceKm(state.me, p)} km entfernt
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleLike(p)}
                    aria-label={`${p.displayName} liken`}
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
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        {/* Text und Bild gleichwertig: kleines Bild, Persönlichkeit im Fokus */}
        <div className="flex items-start gap-4">
          <Image
            src={profile.photos[0]?.url ?? ""}
            alt={profile.photos[0]?.altText ?? ""}
            width={96}
            height={96}
            className="size-24 rounded-lg border border-border object-cover"
          />
          <div className="min-w-0">
            <h2 className="text-xl font-bold">
              <Link href={`/profil/${profile.id}`} className="hover:underline">
                {profile.displayName}
              </Link>
              <span className="font-normal text-muted-foreground">
                , {ageFromBirthdate(profile.birthdate)}
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              {profile.pronouns ? `${profile.pronouns} · ` : ""}
              {profile.city} (ungefähr) · {distanceKm(me, profile)} km entfernt
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.interests.slice(0, 4).map((i) => (
                <Badge key={i}>{i}</Badge>
              ))}
            </div>
          </div>
        </div>

        <p className="leading-relaxed">{profile.bio}</p>

        {reasons.length > 0 ? <MatchReasonsList reasons={reasons} /> : null}

        <Link
          href={`/profil/${profile.id}`}
          className="inline-block font-medium text-primary underline underline-offset-4"
        >
          Ganzes Profil ansehen
        </Link>

        <div
          className="flex flex-wrap gap-3 border-t border-border pt-4"
          role="group"
          aria-label={`Aktionen für ${profile.displayName}`}
        >
          <Button size="lg" onClick={onLike}>
            <Heart aria-hidden="true" /> Gefällt mir
          </Button>
          <Button size="lg" variant="secondary" onClick={onSkip}>
            <X aria-hidden="true" /> Überspringen
          </Button>
          <Button variant="outline" onClick={onSave} aria-pressed={saved}>
            {saved ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
            {saved ? "Gespeichert" : "Speichern"}
          </Button>
          <Button variant="ghost" onClick={onUndo}>
            <RotateCcw aria-hidden="true" /> Zurück
          </Button>
          <Button variant="ghost" onClick={onReport}>
            <Flag aria-hidden="true" /> Melden
          </Button>
          <Button variant="ghost" onClick={onBlock}>
            <ShieldOff aria-hidden="true" /> Blockieren
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
