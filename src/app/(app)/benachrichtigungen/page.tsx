"use client";

import Link from "next/link";
import { AlarmClock, Bell, Calendar, CheckCheck, Heart, MapPin } from "lucide-react";
import { allNotifications, profileById, useAppStore } from "@/lib/store";
import type { AppNotification, NotificationKind } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const ICONS: Record<NotificationKind, typeof Heart> = {
  new_match: Heart,
  answer_later_due: AlarmClock,
  date_reminder: Calendar,
  date_checkin_due: MapPin,
};

function describe(n: AppNotification, name: string): { title: string; href: string } {
  switch (n.kind) {
    case "new_match":
      return { title: `Es ist ein Match mit ${name}!`, href: "/matches" };
    case "answer_later_due":
      return {
        title: `Erinnerung: Du wolltest ${name} noch antworten. Kein Druck — nur ein Hinweis.`,
        href: n.matchId ? `/nachrichten/${n.matchId}` : "/nachrichten",
      };
    case "date_reminder":
      return { title: `Bald: dein Date mit ${name}.`, href: "/dates" };
    case "date_checkin_due":
      return {
        title: `Wie war dein Date mit ${name}? Der Check-in steht noch aus.`,
        href: "/dates",
      };
  }
}

/**
 * Benachrichtigungs-Center: gespeicherte Ereignisse (neue Matches) plus live
 * abgeleitete Erinnerungen (Später beantworten, Date-Erinnerung, Check-in).
 * Abgeleitete Einträge verschwinden von selbst, sobald sie erledigt sind.
 */
export default function NotificationsPage() {
  const store = useAppStore();
  const { state } = store;
  const items = allNotifications(state);
  const hasUnreadStored = state.notifications.some((n) => !n.read);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Benachrichtigungen</h1>
        {hasUnreadStored ? (
          <Button variant="secondary" size="sm" onClick={store.markAllNotificationsRead}>
            <CheckCheck aria-hidden="true" /> Alle als gelesen markieren
          </Button>
        ) : null}
      </div>
      <p className="text-muted-foreground">
        Wenn dir einzelne Meldungen zu viel werden, kannst du sie unter Einstellungen →
        Benachrichtigungen bündeln.
      </p>

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Alles erledigt"
          description="Hier erscheinen neue Matches, Erinnerungen an Nachrichten, die du später beantworten wolltest, und Date-Erinnerungen."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const other = n.profileId ? profileById(state, n.profileId) : undefined;
            const { title, href } = describe(n, other?.displayName ?? "jemandem");
            const Icon = ICONS[n.kind];
            const isDerived = n.id.startsWith("derived-");
            const unread = !n.read;
            return (
              <li key={n.id}>
                <Card className={unread ? "border-l-4 border-l-primary" : undefined}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                      <Icon aria-hidden="true" className="size-5 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link href={href} className="font-semibold hover:underline">
                        {unread ? <span className="sr-only">Neu: </span> : null}
                        {title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                    </div>
                    {!isDerived && unread ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => store.markNotificationRead(n.id)}
                      >
                        Gelesen
                      </Button>
                    ) : null}
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
