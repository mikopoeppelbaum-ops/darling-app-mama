"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, PauseCircle } from "lucide-react";
import { otherProfileId, profileById, unreadCount, useAppStore } from "@/lib/store";
import { ageFromBirthdate, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function MatchesPage() {
  const { state } = useAppStore();
  const activeMatches = state.matches.filter((m) => m.status !== "ended");
  // Personen, die mich geliked haben, die ich aber noch nicht entschieden habe.
  const likers = state.likesReceived
    .filter(
      (id) =>
        !state.blocked.includes(id) &&
        !state.likesGiven.some((l) => l.toProfileId === id) &&
        !state.skipped.includes(id) &&
        !state.matches.some((m) => m.profileIds.includes(id)),
    )
    .map((id) => profileById(state, id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Deine Matches</h1>
      {likers.length > 0 ? (
        <section
          aria-labelledby="likes-teaser"
          className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-accent-soft p-5"
        >
          <div className="flex -space-x-3" aria-hidden="true">
            {likers.slice(0, 3).map((p) => (
              <Image
                key={p.id}
                src={p.photos[0]?.url ?? ""}
                alt=""
                width={48}
                height={48}
                unoptimized
                className="size-12 rounded-full border-2 border-card object-cover blur-[6px]"
              />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="likes-teaser" className="font-sans text-lg font-semibold">
              {likers.length === 1
                ? "1 Person mag dich bereits"
                : `${likers.length} Personen mögen dich bereits`}
            </h2>
            <p className="text-sm">
              Sie begegnen dir in deiner täglichen Auswahl. Wer dich mag, direkt zu sehen, ist als
              spätere Premium-Funktion geplant — Sicherheit und Barrierefreiheit bleiben immer
              kostenlos.
            </p>
          </div>
          <Link href="/entdecken" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            Zur Auswahl
          </Link>
        </section>
      ) : null}
      {activeMatches.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Noch keine Matches"
          description="Wenn ihr euch gegenseitig ein „Gefällt mir“ gebt, entsteht ein Match und ihr könnt schreiben. Schau im Entdecken-Bereich vorbei."
          action={
            <Link href="/entdecken" className={buttonVariants()}>
              Profile entdecken
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {activeMatches.map((match) => {
            const other = profileById(state, otherProfileId(match, state.me.id));
            if (!other) return null;
            const unread = unreadCount(state, match.id);
            return (
              <li key={match.id}>
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Image
                      src={other.photos[0]?.url ?? ""}
                      alt={other.photos[0]?.altText ?? ""}
                      width={64}
                      height={64}
                      className="size-16 rounded-md border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link href={`/profil/${other.id}`} className="font-semibold hover:underline">
                        {other.displayName}, {ageFromBirthdate(other.birthdate)}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Match seit {formatDate(match.createdAt)}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {match.status === "paused" ? (
                          <Badge variant="outline">
                            <PauseCircle aria-hidden="true" className="size-3.5" /> Pausiert
                          </Badge>
                        ) : null}
                        {unread > 0 ? (
                          <Badge variant="primary">
                            {unread} neue Nachricht{unread > 1 ? "en" : ""}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <Link
                      href={`/nachrichten/${match.id}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 font-medium text-primary-foreground"
                    >
                      <MessageCircle aria-hidden="true" className="size-4" />
                      Chat
                    </Link>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
