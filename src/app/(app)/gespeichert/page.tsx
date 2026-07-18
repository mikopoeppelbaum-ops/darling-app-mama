"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, BookmarkX } from "lucide-react";
import { profileById, useAppStore } from "@/lib/store";
import { ageFromBirthdate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function SavedProfilesPage() {
  const store = useAppStore();
  const { state } = store;
  const savedProfiles = state.saved
    .map((id) => profileById(state, id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && !state.blocked.includes(p!.id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gespeicherte Profile</h1>
      <p className="text-muted-foreground">
        Profile, die du dir später in Ruhe ansehen möchtest.
      </p>
      {savedProfiles.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nichts gespeichert"
          description="Im Entdecken-Bereich kannst du Profile speichern, um sie später wiederzufinden — ganz ohne Zeitdruck."
        />
      ) : (
        <ul className="space-y-3">
          {savedProfiles.map((p) => (
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
                    <p className="truncate text-sm text-muted-foreground">{p.bio}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => store.toggleSave(p.id)}
                    aria-label={`${p.displayName} aus gespeicherten Profilen entfernen`}
                  >
                    <BookmarkX aria-hidden="true" /> Entfernen
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
