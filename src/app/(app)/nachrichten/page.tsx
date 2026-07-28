"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Star, BellOff } from "lucide-react";
import {
  otherProfileId,
  profileById,
  unreadCount,
  useAppStore,
  visibleMessages,
} from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function ConversationsPage() {
  const { state } = useAppStore();
  const matches = state.matches.filter((m) => m.status !== "ended");

  // Wichtige Chats zuerst (ADHS-Funktion "Chat als wichtig markieren").
  const sorted = [...matches].sort((a, b) => {
    const ai = state.conversationSettings.find((c) => c.matchId === a.id)?.important ? 1 : 0;
    const bi = state.conversationSettings.find((c) => c.matchId === b.id)?.important ? 1 : 0;
    return bi - ai;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nachrichten</h1>
      {sorted.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="Noch keine Unterhaltungen"
          description="Sobald du ein Match hast, könnt ihr hier miteinander schreiben."
        />
      ) : (
        <ul className="space-y-2">
          {sorted.map((match) => {
            const other = profileById(state, otherProfileId(match, state.me.id));
            if (!other) return null;
            const msgs = visibleMessages(state, match.id).filter((m) => m.status !== "deleted");
            const last = msgs[msgs.length - 1];
            const unread = unreadCount(state, match.id);
            const settings = state.conversationSettings.find((c) => c.matchId === match.id);
            return (
              <li key={match.id}>
                <Link href={`/nachrichten/${match.id}`} className="block rounded-lg">
                  <Card className="hover:bg-muted">
                    <CardContent className="flex items-center gap-4 p-4">
                      <Image
                        src={other.photos[0]?.url ?? ""}
                        alt=""
                        width={56}
                        height={56}
                        className="size-14 rounded-md border border-border object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 font-semibold">
                          {other.displayName}
                          {settings?.important ? (
                            <Star
                              aria-label="Als wichtig markiert"
                              className="size-4 text-accent"
                            />
                          ) : null}
                          {settings?.muted ? (
                            <BellOff
                              aria-label="Stummgeschaltet"
                              className="size-4 text-muted-foreground"
                            />
                          ) : null}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {last
                            ? `${last.senderProfileId === state.me.id ? "Du: " : ""}${last.body}`
                            : "Noch keine Nachrichten — sag hallo!"}
                        </p>
                      </div>
                      {unread > 0 ? <Badge variant="primary">{unread} neu</Badge> : null}
                      {match.status === "paused" ? <Badge variant="outline">Pausiert</Badge> : null}
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
