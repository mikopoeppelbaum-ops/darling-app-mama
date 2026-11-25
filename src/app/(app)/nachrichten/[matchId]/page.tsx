"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlarmClock,
  ArrowLeft,
  Bell,
  BellOff,
  Calendar,
  Flag,
  ImagePlus,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Send,
  ShieldOff,
  Star,
  Trash2,
  UserX,
  X,
} from "lucide-react";
import { otherProfileId, profileById, useAppStore, visibleMessages } from "@/lib/store";
import { detectContentWarnings, chunkLongMessage, parseToneTags } from "@/lib/safety";
import { readFileAsDataUrl, validateImageFile } from "@/lib/files";
import { CONVERSATION_STARTERS, POLITE_UNMATCH_TEMPLATES, TONE_TAGS } from "@/lib/options";
import { messageSchema } from "@/lib/validation";
import { cn, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ReportDialog } from "@/components/profile/report-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { Message } from "@/lib/types";

export default function ChatPage() {
  const params = useParams<{ matchId: string }>();
  const router = useRouter();
  const store = useAppStore();
  const { state } = store;

  const match = state.matches.find((m) => m.id === params.matchId);
  const other = match ? profileById(state, otherProfileId(match, state.me.id)) : undefined;

  const settings = state.conversationSettings.find((c) => c.matchId === params.matchId);
  const [draft, setDraft] = React.useState("");
  const [draftLoaded, setDraftLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);
  const [pendingImage, setPendingImage] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const endRef = React.useRef<HTMLLIElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const messages = visibleMessages(state, params.matchId);
  const warnings = React.useMemo(
    () =>
      messages.flatMap((m) =>
        m.senderProfileId !== state.me.id && m.status !== "deleted"
          ? detectContentWarnings(m.body)
          : [],
      ),
    [messages, state.me.id],
  );

  // Entwurf automatisch speichern/laden (ADHS-Funktion).
  React.useEffect(() => {
    if (!draftLoaded && settings?.draft) {
      setDraft(settings.draft);
    }
    setDraftLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftLoaded]);

  React.useEffect(() => {
    if (!draftLoaded) return;
    const t = setTimeout(() => {
      store.updateConversationSettings(params.matchId, { draft });
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, draftLoaded, params.matchId]);

  // Eingehende Nachrichten als gelesen markieren.
  React.useEffect(() => {
    store.markConversationRead(params.matchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.matchId, messages.length]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  if (!match || !other) {
    return (
      <EmptyState
        icon={UserX}
        title="Unterhaltung nicht gefunden"
        description="Dieses Match existiert nicht mehr."
        action={
          <Button variant="secondary" onClick={() => router.push("/nachrichten")}>
            Zu deinen Nachrichten
          </Button>
        }
      />
    );
  }

  const isEnded = match.status === "ended";
  const isPaused = match.status === "paused";

  function send() {
    const trimmed = draft.trim();
    if (!trimmed && !pendingImage) {
      setError("Die Nachricht ist noch leer.");
      return;
    }
    if (trimmed) {
      const parsed = messageSchema.safeParse({ body: trimmed });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Die Nachricht kann nicht gesendet werden.");
        return;
      }
    }
    const result = store.sendMessage(match!.id, trimmed, pendingImage ?? undefined);
    if (result.rateLimited) {
      setError(
        "Du hast sehr viele Nachrichten in kurzer Zeit gesendet. Bitte mache eine kurze Pause.",
      );
      return;
    }
    setError(null);
    setDraft("");
    setPendingImage(null);
    store.updateConversationSettings(match!.id, { draft: "" });
  }

  async function onImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageError(null);
    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }
    try {
      setPendingImage(await readFileAsDataUrl(file));
    } catch {
      setImageError("Das Bild konnte nicht gelesen werden. Bitte versuche es erneut.");
    }
  }

  function addToneTag(tag: string) {
    setDraft((d) => (d.trim() ? `${d.trimEnd()} ${tag}` : tag));
  }

  const outgoingWarnings = detectContentWarnings(draft);

  return (
    <div className="flex min-h-[70vh] flex-col space-y-4">
      <header className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Zurück zu den Nachrichten"
            onClick={() => router.push("/nachrichten")}
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <div>
            <Link href={`/profil/${other.id}`} className="text-lg font-semibold hover:underline">
              {other.displayName}
            </Link>
            {other.statusFlags.slowReplies ? (
              <p className="text-xs text-muted-foreground">
                Antwortet manchmal langsamer — kein Grund zur Sorge.
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dates?match=${match.id}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-input px-3 font-medium"
          >
            <Calendar aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Date planen</span>
          </Link>
          <Button
            variant="outline"
            size="icon"
            aria-label="Chat-Optionen öffnen"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </div>
      </header>

      {warnings.length > 0 ? (
        <Alert variant="warning" title="Sicherheitshinweis">
          {warnings[0].message}{" "}
          <Link href="/hilfe-sicherheit" className="font-medium underline">
            Mehr im Sicherheitsleitfaden
          </Link>
        </Alert>
      ) : null}

      {isPaused ? (
        <Alert variant="info" title="Dieses Match ist pausiert">
          Ihr könnt gerade keine Nachrichten austauschen. Du kannst das Match jederzeit fortsetzen.
        </Alert>
      ) : null}

      {isEnded ? (
        <Alert variant="info" title="Dieser Kontakt wurde beendet">
          Diese Unterhaltung ist nur noch lesbar.
        </Alert>
      ) : null}

      <ul className="flex-1 space-y-3" aria-label={`Nachrichten mit ${other.displayName}`}>
        {messages.length === 0 ? (
          <li>
            <div className="rounded-md border border-border bg-muted p-4">
              <p className="font-semibold">Gesprächseinstiege, falls du magst:</p>
              <ul className="mt-2 space-y-2">
                {CONVERSATION_STARTERS.slice(0, 4).map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className="cursor-pointer rounded-md border border-border bg-card px-3 py-2 text-left text-sm hover:bg-secondary"
                      onClick={() => setDraft(s)}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              mine={m.senderProfileId === state.me.id}
              authorName={m.senderProfileId === state.me.id ? "Du" : other.displayName}
              autoChunk={state.adhsSettings.autoChunkLongMessages}
              readReceipts={settings?.readReceipts ?? true}
              onDelete={() => store.deleteMessage(m.id)}
              onAnswerLater={() =>
                store.markAnswerLater(
                  m.id,
                  new Date(
                    Date.now() + state.adhsSettings.defaultReminderHours * 3600_000,
                  ).toISOString(),
                )
              }
            />
          ))
        )}
        <li ref={endRef} aria-hidden="true" />
      </ul>

      {!isEnded && !isPaused ? (
        <div className="sticky bottom-16 space-y-2 border-t border-border bg-background pt-3 md:bottom-0">
          {outgoingWarnings.length > 0 ? (
            <Alert variant="warning">{outgoingWarnings[0].message}</Alert>
          ) : null}
          {imageError ? <Alert variant="destructive">{imageError}</Alert> : null}
          {error ? <Alert variant="destructive">{error}</Alert> : null}
          {pendingImage ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2">
              <Image
                src={pendingImage}
                alt="Vorschau des ausgewählten Bildes"
                width={56}
                height={56}
                unoptimized
                className="size-14 rounded-lg object-cover"
              />
              <p className="flex-1 text-sm text-muted-foreground">
                Bild wird mit der Nachricht gesendet.
              </p>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Bild wieder entfernen"
                onClick={() => setPendingImage(null)}
              >
                <X aria-hidden="true" />
              </Button>
            </div>
          ) : null}
          <details className="rounded-xl border border-border bg-card px-3 py-2">
            <summary className="cursor-pointer text-sm font-semibold">
              Ton markieren (Tone-Tags)
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Ein kurzes Kürzel macht klar, wie du etwas meinst. Die Erklärung wird beim Gegenüber
              angezeigt.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TONE_TAGS.map((t) => (
                <Button
                  key={t.tag}
                  variant="soft"
                  size="sm"
                  onClick={() => addToneTag(t.tag)}
                  aria-label={`Tone-Tag ${t.tag} einfügen: ${t.description}`}
                >
                  {t.tag} · {t.label}
                </Button>
              ))}
            </div>
          </details>
          <div className="flex items-end gap-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={onImageSelected}
            />
            <Button
              variant="secondary"
              size="icon"
              aria-label="Bild anhängen"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImagePlus aria-hidden="true" />
            </Button>
            <Textarea
              aria-label={`Nachricht an ${other.displayName}`}
              placeholder="Deine Nachricht … (Entwurf wird automatisch gespeichert)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              className="min-h-14"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
              }}
            />
            <Button size="lg" onClick={send} aria-label="Nachricht senden">
              <Send aria-hidden="true" />
              <span className="hidden sm:inline">Senden</span>
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} title="Chat-Optionen">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="opt-important" className="font-normal">
              <Star aria-hidden="true" className="mr-2 inline size-4" />
              Chat als wichtig markieren
            </Label>
            <Switch
              id="opt-important"
              checked={settings?.important ?? false}
              onCheckedChange={(v) => store.updateConversationSettings(match.id, { important: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="opt-muted" className="font-normal">
              <BellOff aria-hidden="true" className="mr-2 inline size-4" />
              Chat stummschalten
            </Label>
            <Switch
              id="opt-muted"
              checked={settings?.muted ?? false}
              onCheckedChange={(v) => store.updateConversationSettings(match.id, { muted: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="opt-read" className="font-normal">
              <Bell aria-hidden="true" className="mr-2 inline size-4" />
              Gelesen-Status senden
            </Label>
            <Switch
              id="opt-read"
              checked={settings?.readReceipts ?? true}
              onCheckedChange={(v) =>
                store.updateConversationSettings(match.id, { readReceipts: v })
              }
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="opt-typing" className="font-normal">
              Tippanzeige senden
            </Label>
            <Switch
              id="opt-typing"
              checked={settings?.typingIndicator ?? true}
              onCheckedChange={(v) =>
                store.updateConversationSettings(match.id, { typingIndicator: v })
              }
            />
          </div>

          <hr className="border-border" />

          <div className="grid gap-2">
            {isPaused ? (
              <Button
                variant="secondary"
                onClick={() => {
                  store.pauseMatch(match.id, false);
                  setMenuOpen(false);
                }}
              >
                <PlayCircle aria-hidden="true" /> Match fortsetzen
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  store.pauseMatch(match.id, true);
                  setMenuOpen(false);
                }}
              >
                <PauseCircle aria-hidden="true" /> Match pausieren (ich brauche gerade Zeit)
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => {
                store.sendMessage(
                  match.id,
                  "Ich bin noch interessiert, brauche aber gerade etwas Zeit. Danke für deine Geduld!",
                );
                setMenuOpen(false);
              }}
            >
              „Ich bin noch interessiert, brauche aber gerade Zeit“ senden
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setMenuOpen(false);
                setEndOpen(true);
              }}
            >
              Kontakt freundlich beenden
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setMenuOpen(false);
                setReportOpen(true);
              }}
            >
              <Flag aria-hidden="true" /> {other.displayName} melden
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                store.block(other.id);
                router.push("/nachrichten");
              }}
            >
              <ShieldOff aria-hidden="true" /> {other.displayName} blockieren
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={endOpen}
        onClose={() => setEndOpen(false)}
        title="Kontakt freundlich beenden"
        description="Du kannst eine wertschätzende Abschiedsnachricht senden. Danach wird das Match beendet."
      >
        <div className="grid gap-2">
          {POLITE_UNMATCH_TEMPLATES.map((t) => (
            <button
              key={t}
              type="button"
              className="cursor-pointer rounded-md border border-border bg-card p-3 text-left text-sm hover:bg-secondary"
              onClick={() => {
                store.endMatch(match.id, t);
                setEndOpen(false);
              }}
            >
              {t}
            </button>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              store.endMatch(match.id);
              setEndOpen(false);
            }}
          >
            Ohne Nachricht beenden
          </Button>
        </div>
      </Dialog>

      <ReportDialog
        profileId={other.id}
        profileName={other.displayName}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}

function MessageBubble({
  message,
  mine,
  authorName,
  autoChunk,
  readReceipts,
  onDelete,
  onAnswerLater,
}: {
  message: Message;
  mine: boolean;
  authorName: string;
  autoChunk: boolean;
  readReceipts: boolean;
  onDelete: () => void;
  onAnswerLater: () => void;
}) {
  if (message.status === "deleted") {
    return (
      <li className={cn("flex", mine && "justify-end")}>
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground italic">
          Nachricht gelöscht
        </p>
      </li>
    );
  }

  const paragraphs = autoChunk ? chunkLongMessage(message.body) : [message.body];
  const toneTags = TONE_TAGS.filter((t) =>
    parseToneTags(
      message.body,
      TONE_TAGS.map((x) => x.tag),
    ).includes(t.tag),
  );

  return (
    <li className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] space-y-2 rounded-2xl border px-4 py-3",
          mine ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
        )}
      >
        <p className="sr-only">{authorName}:</p>
        {message.imageUrl ? (
          <Image
            src={message.imageUrl}
            alt={`Bild, gesendet von ${authorName}`}
            width={240}
            height={240}
            unoptimized
            className="max-w-full rounded-lg object-cover"
          />
        ) : null}
        {message.body
          ? paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed whitespace-pre-wrap">
                {p}
              </p>
            ))
          : null}
      </div>
      {toneTags.length > 0 ? (
        <p className="flex flex-wrap gap-1 text-xs">
          {toneTags.map((t) => (
            <span key={t.tag} className="rounded-full bg-accent-soft px-2 py-0.5">
              <span aria-hidden="true">{t.tag} = </span>
              {t.description}
            </span>
          ))}
        </p>
      ) : null}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{formatDateTime(message.createdAt)}</span>
        {mine && readReceipts && message.status === "read" ? <span>· Gelesen</span> : null}
        {message.answerLater ? (
          <span className="inline-flex items-center gap-1 font-medium text-accent">
            <AlarmClock aria-hidden="true" className="size-3.5" /> Später beantworten
          </span>
        ) : null}
        {!mine ? (
          <button
            type="button"
            className="cursor-pointer underline underline-offset-2"
            onClick={onAnswerLater}
            aria-pressed={message.answerLater ?? false}
          >
            {message.answerLater ? "Erinnerung entfernen" : "Später beantworten"}
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 underline underline-offset-2"
            onClick={onDelete}
          >
            <Trash2 aria-hidden="true" className="size-3.5" /> Löschen
          </button>
        )}
      </div>
    </li>
  );
}
