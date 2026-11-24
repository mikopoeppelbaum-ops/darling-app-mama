"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { readFileAsDataUrl, validateImageFile } from "@/lib/files";
import type { ProfilePhoto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

const MAX_PHOTOS = 6;

/**
 * Foto-Verwaltung im eigenen Profil. Im Demo-Modus werden Bilder lokal als
 * Data-URL gespeichert; Format- und Größengrenzen entsprechen den späteren
 * Supabase-Storage-Regeln. Die Bildbeschreibung ist ein eigenes Pflichtfeld:
 * nur die Person selbst kann sinnvoll beschreiben, was zu sehen ist.
 * Reihenfolge per Schaltflächen statt Ziehen (WCAG 2.2 SC 2.5.7).
 */
export function PhotosManager() {
  const store = useAppStore();
  const photos = store.state.me.photos;
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function updatePhotos(next: ProfilePhoto[]) {
    store.updateProfile({ photos: next.map((p, i) => ({ ...p, sortOrder: i })) });
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    if (photos.length >= MAX_PHOTOS) {
      setError(`Du kannst höchstens ${MAX_PHOTOS} Fotos hochladen.`);
      return;
    }
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setBusy(true);
    try {
      const url = await readFileAsDataUrl(file);
      updatePhotos([
        ...photos,
        {
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url,
          altText: "",
          sortOrder: photos.length,
        },
      ]);
    } catch {
      setError("Das Bild konnte nicht gelesen werden. Bitte versuche es erneut.");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    updatePhotos(next);
  }

  return (
    <div className="space-y-4">
      {error ? <Alert variant="destructive">{error}</Alert> : null}
      {photos.length === 0 ? (
        <p className="text-muted-foreground">Du hast noch keine Fotos hochgeladen. Das ist okay.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {photos.map((photo, index) => {
            const missingAlt = photo.altText.trim().length === 0;
            return (
              <li key={photo.id} className="space-y-3 rounded-xl border border-border p-3">
                <Image
                  src={photo.url}
                  alt={photo.altText || "Profilbild ohne Beschreibung"}
                  width={240}
                  height={240}
                  unoptimized
                  className="aspect-square w-full rounded-xl object-cover"
                />
                <div className="space-y-1.5">
                  <Label htmlFor={`alt-${photo.id}`} className="text-sm">
                    Bildbeschreibung für Screenreader
                  </Label>
                  <Input
                    id={`alt-${photo.id}`}
                    value={photo.altText}
                    onChange={(e) =>
                      updatePhotos(
                        photos.map((p) =>
                          p.id === photo.id ? { ...p, altText: e.target.value } : p,
                        ),
                      )
                    }
                    placeholder="z. B. Ich lächle in einem Park, im Hintergrund Bäume."
                    aria-invalid={missingAlt}
                    aria-describedby={missingAlt ? `alt-${photo.id}-hint` : undefined}
                  />
                  {missingAlt ? (
                    <p id={`alt-${photo.id}-hint`} className="text-sm text-muted-foreground">
                      Ohne Beschreibung ist das Foto für blinde Menschen nicht zugänglich.
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {index === 0 ? (
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold">
                      Hauptfoto
                    </span>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => move(index, -1)}>
                      <ArrowUp aria-hidden="true" className="size-4" /> Nach vorne
                    </Button>
                  )}
                  {index < photos.length - 1 ? (
                    <Button variant="secondary" size="sm" onClick={() => move(index, 1)}>
                      <ArrowDown aria-hidden="true" className="size-4" /> Nach hinten
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updatePhotos(photos.filter((p) => p.id !== photo.id))}
                    aria-label={`Foto ${index + 1} entfernen`}
                  >
                    <Trash2 aria-hidden="true" className="size-4" /> Entfernen
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onFileSelected}
        />
        <Button
          variant="soft"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy || photos.length >= MAX_PHOTOS}
        >
          <ImagePlus aria-hidden="true" /> Foto hinzufügen
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          JPEG, PNG oder WebP bis 5 MB, höchstens {MAX_PHOTOS} Fotos. Fotos sind freiwillig — dein
          Profiltext zählt genauso.
        </p>
      </div>
    </div>
  );
}
