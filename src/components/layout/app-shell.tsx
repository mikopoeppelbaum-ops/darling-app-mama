"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  BookOpen,
  Calendar,
  Compass,
  Heart,
  LifeBuoy,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { unreadCount, unreadNotificationCount, useAppStore } from "@/lib/store";

const NAV_ITEMS = [
  { href: "/entdecken", label: "Entdecken", icon: Compass },
  { href: "/matches", label: "Matches", icon: Heart },
  { href: "/nachrichten", label: "Nachrichten", icon: MessageCircle },
  { href: "/dates", label: "Dates", icon: Calendar },
  { href: "/profil", label: "Profil", icon: User },
] as const;

const SIDE_ITEMS = [
  { href: "/benachrichtigungen", label: "Benachrichtigungen", icon: Bell },
  { href: "/gespeichert", label: "Gespeicherte Profile", icon: Bookmark },
  { href: "/wissen", label: "Wissen & Quellen", icon: BookOpen },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
] as const;

function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground"
      >
        e
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">EchtNah</span>
    </span>
  );
}

function CountBadge({ count, label }: { count: number; label: string }) {
  if (count <= 0) return null;
  return (
    <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
      {count}
      <span className="sr-only"> {label}</span>
    </span>
  );
}

/**
 * App-Rahmen für angemeldete Ansichten.
 * - Mobil: Kopfzeile mit Hilfe und Benachrichtigungen an immer gleicher
 *   Stelle (WCAG 2.2 SC 3.2.6 "Konsistente Hilfe") und große Bottom-Navigation.
 * - Ab md: Seitenleiste. Hilfe & Sicherheit steht dort immer ganz unten.
 * - Fokusmodus (ADHS-Einstellung): Navigation ausgeblendet, nur ein
 *   deutlicher Weg zurück.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, updateAdhsSettings } = useAppStore();
  const totalUnread = state.matches
    .filter((m) => m.status === "active")
    .reduce((sum, m) => sum + unreadCount(state, m.id), 0);
  const totalNotifications = unreadNotificationCount(state);
  const focusMode = state.adhsSettings.focusMode;

  return (
    <div className="flex min-h-dvh w-full">
      {!focusMode && (
        <nav
          aria-label="Hauptnavigation"
          className="sticky top-0 hidden h-dvh w-68 shrink-0 flex-col gap-1 border-r border-border bg-card px-4 py-6 md:flex"
        >
          <Link href="/entdecken" className="mb-6 rounded-xl px-3 py-1">
            <Logo />
          </Link>
          {[...NAV_ITEMS, ...SIDE_ITEMS].map(({ href, label, icon: Icon }, i) => {
            const active = pathname.startsWith(href);
            return (
              <React.Fragment key={href}>
                {i === NAV_ITEMS.length ? (
                  <hr className="my-3 border-border" aria-hidden="true" />
                ) : null}
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "transition-calm flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-base font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  {label}
                  {href === "/nachrichten" ? (
                    <CountBadge count={totalUnread} label="ungelesene Nachrichten" />
                  ) : null}
                  {href === "/benachrichtigungen" ? (
                    <CountBadge count={totalNotifications} label="offene Benachrichtigungen" />
                  ) : null}
                </Link>
              </React.Fragment>
            );
          })}
          <div className="mt-auto pt-4">
            <Link
              href="/hilfe-sicherheit"
              aria-current={pathname.startsWith("/hilfe-sicherheit") ? "page" : undefined}
              className="transition-calm flex min-h-11 items-center gap-3 rounded-xl border border-border bg-accent-soft px-3 py-2 font-medium hover:bg-muted"
            >
              <LifeBuoy aria-hidden="true" className="size-5" />
              Hilfe & Sicherheit
            </Link>
          </div>
        </nav>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {!focusMode ? (
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-2 backdrop-blur md:hidden">
            <Link href="/entdecken" className="rounded-xl py-1">
              <Logo />
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/benachrichtigungen"
                className="relative flex size-11 items-center justify-center rounded-xl hover:bg-muted"
                aria-label={
                  totalNotifications > 0
                    ? `Benachrichtigungen, ${totalNotifications} offen`
                    : "Benachrichtigungen"
                }
              >
                <Bell aria-hidden="true" className="size-6" />
                {totalNotifications > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 right-1.5 rounded-full bg-accent px-1.5 text-[0.7rem] font-bold text-accent-foreground"
                  >
                    {totalNotifications}
                  </span>
                ) : null}
              </Link>
              <Link
                href="/hilfe-sicherheit"
                className="flex size-11 items-center justify-center rounded-xl hover:bg-muted"
                aria-label="Hilfe und Sicherheit"
              >
                <LifeBuoy aria-hidden="true" className="size-6" />
              </Link>
              <Link
                href="/einstellungen"
                className="flex size-11 items-center justify-center rounded-xl hover:bg-muted"
                aria-label="Einstellungen"
              >
                <Settings aria-hidden="true" className="size-6" />
              </Link>
            </div>
          </header>
        ) : (
          <div className="border-b border-border bg-primary-soft px-4 py-2 text-sm">
            Fokusmodus ist an.{" "}
            <button
              type="button"
              className="cursor-pointer font-semibold underline underline-offset-4"
              onClick={() => updateAdhsSettings({ focusMode: false })}
            >
              Navigation wieder einblenden
            </button>
          </div>
        )}

        <main
          id="hauptinhalt"
          className={cn(
            "mx-auto w-full max-w-3xl flex-1 px-4 py-6 md:px-8 md:py-10",
            !focusMode && "pb-28 md:pb-10",
          )}
        >
          {children}
        </main>

        {!focusMode && (
          <nav
            aria-label="Hauptnavigation (mobil)"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden"
          >
            <ul className="flex">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <li key={href} className="flex-1">
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-semibold",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-14 items-center justify-center rounded-full",
                          active && "bg-primary-soft",
                        )}
                      >
                        <Icon aria-hidden="true" className="size-6" />
                      </span>
                      {/* Aktiver Punkt zusätzlich durch Unterstreichung, nicht nur Farbe */}
                      <span className={cn(active && "underline underline-offset-4")}>{label}</span>
                      {href === "/nachrichten" && totalUnread > 0 ? (
                        <span className="absolute top-1 right-1/2 -mr-8 rounded-full bg-accent px-1.5 text-[0.7rem] font-bold text-accent-foreground">
                          {totalUnread}
                          <span className="sr-only"> ungelesene Nachrichten</span>
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
