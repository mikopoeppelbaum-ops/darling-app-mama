"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Calendar,
  Compass,
  Heart,
  MessageCircle,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { unreadCount, useAppStore } from "@/lib/store";

const NAV_ITEMS = [
  { href: "/entdecken", label: "Entdecken", icon: Compass },
  { href: "/matches", label: "Matches", icon: Heart },
  { href: "/nachrichten", label: "Nachrichten", icon: MessageCircle },
  { href: "/dates", label: "Dates", icon: Calendar },
  { href: "/profil", label: "Profil", icon: User },
] as const;

const SIDE_ITEMS = [
  { href: "/gespeichert", label: "Gespeicherte Profile", icon: Bookmark },
  { href: "/hilfe-sicherheit", label: "Hilfe & Sicherheit", icon: Shield },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
] as const;

/**
 * App-Rahmen für angemeldete Ansichten:
 * mobil eine große Bottom-Navigation, ab md zusätzlich eine Seitenleiste.
 * Im Fokusmodus (ADHS-Einstellung) wird die Navigation ausgeblendet.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useAppStore();
  const totalUnread = state.matches
    .filter((m) => m.status === "active")
    .reduce((sum, m) => sum + unreadCount(state, m.id), 0);
  const focusMode = state.adhsSettings.focusMode;

  return (
    <div className="flex min-h-dvh w-full">
      {!focusMode && (
        <nav
          aria-label="Hauptnavigation"
          className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-1 border-r border-border bg-card p-4 md:flex"
        >
          <Link href="/entdecken" className="mb-4 px-3 py-2 text-xl font-bold text-primary">
            EchtNah
          </Link>
          {[...NAV_ITEMS, ...SIDE_ITEMS].map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-base font-medium",
                  active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
                {label}
                {href === "/nachrichten" && totalUnread > 0 ? (
                  <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                    {totalUnread} neu
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <main
          id="hauptinhalt"
          className={cn(
            "mx-auto w-full max-w-3xl flex-1 p-4 md:p-8",
            !focusMode && "pb-24 md:pb-8",
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
                        "relative flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-medium",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-6" />
                      {/* Aktiver Punkt wird zusätzlich durch Unterstreichung markiert, nicht nur Farbe */}
                      <span className={cn(active && "underline underline-offset-4")}>{label}</span>
                      {href === "/nachrichten" && totalUnread > 0 ? (
                        <span className="absolute top-1.5 right-1/2 -mr-7 rounded-full bg-accent px-1.5 text-[0.65rem] font-bold text-accent-foreground">
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
