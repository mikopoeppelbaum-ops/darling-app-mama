"use client";

import * as React from "react";
import type {
  ConversationSettings,
  DatePlan,
  Match,
  Message,
  ModerationAction,
  NotificationSettings,
  Preferences,
  PrivacySettings,
  Profile,
  Report,
  ReportCategory,
} from "@/lib/types";
import {
  DEMO_MATCHES,
  DEMO_ME,
  DEMO_MESSAGES,
  DEMO_MY_PREFERENCES,
  DEMO_PROFILES,
} from "@/lib/demo-data";
import { likesRemainingToday } from "@/lib/matching";
import { isRateLimited } from "@/lib/safety";

/**
 * Zentrale Client-Datenschicht.
 *
 * Im Demo-Modus (ohne Supabase-Konfiguration) werden alle Daten lokal im
 * Browser gehalten und in localStorage gespeichert. Die Struktur entspricht
 * dem Supabase-Schema, sodass die Datenschicht später 1:1 gegen
 * Supabase-Aufrufe getauscht werden kann (siehe supabase/migrations).
 */

export interface AdhsSettings {
  remindersEnabled: boolean;
  defaultReminderHours: number;
  autoChunkLongMessages: boolean;
  focusMode: boolean;
}

interface AppState {
  me: Profile;
  myPreferences: Preferences;
  profiles: Profile[];
  likesGiven: { toProfileId: string; createdAt: string }[];
  likesReceived: string[]; // Profil-IDs, die "mich" geliked haben (Demo)
  skipped: string[];
  skipHistory: string[]; // für die Zurück-Funktion
  saved: string[];
  blocked: string[];
  matches: Match[];
  messages: Message[];
  conversationSettings: ConversationSettings[];
  reports: Report[];
  moderationActions: ModerationAction[];
  datePlans: DatePlan[];
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  adhsSettings: AdhsSettings;
  isAdmin: boolean;
}

const initialState: AppState = {
  me: DEMO_ME,
  myPreferences: DEMO_MY_PREFERENCES,
  profiles: DEMO_PROFILES,
  likesGiven: [],
  // Jonas und Frida haben "mich" bereits geliked → Like zurück ergibt sofort ein Match.
  likesReceived: ["p2", "p8"],
  skipped: [],
  skipHistory: [],
  saved: [],
  blocked: [],
  matches: DEMO_MATCHES,
  messages: DEMO_MESSAGES,
  conversationSettings: [],
  reports: [],
  moderationActions: [],
  datePlans: [],
  notificationSettings: {
    profileId: "me",
    newMatches: true,
    newMessages: true,
    dateReminders: true,
    bundled: false,
    bundleIntervalMinutes: 60,
  },
  privacySettings: {
    profileId: "me",
    showAge: true,
    showCity: true,
    showPronouns: true,
    showLastActive: false,
    incognito: false,
  },
  adhsSettings: {
    remindersEnabled: false,
    defaultReminderHours: 24,
    autoChunkLongMessages: false,
    focusMode: false,
  },
  isAdmin: true, // Demo-Modus: Admin-Dashboard ist erreichbar
};

const STORAGE_KEY = "echtnah.demo-state.v1";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface AppStoreValue {
  state: AppState;
  likesLeftToday: number;
  /** Like senden; gibt das neue Match zurück, wenn eines entstanden ist. */
  like: (profileId: string) => { match?: Match; limitReached?: boolean; rateLimited?: boolean };
  skip: (profileId: string) => void;
  undoSkip: () => string | null;
  toggleSave: (profileId: string) => void;
  block: (profileId: string) => void;
  unblock: (profileId: string) => void;
  report: (
    profileId: string,
    category: ReportCategory,
    description: string,
    messageId?: string,
  ) => void;
  sendMessage: (matchId: string, body: string, imageUrl?: string) => { rateLimited?: boolean };
  deleteMessage: (messageId: string) => void;
  markAnswerLater: (messageId: string, remindAt?: string) => void;
  markConversationRead: (matchId: string) => void;
  updateConversationSettings: (matchId: string, patch: Partial<ConversationSettings>) => void;
  pauseMatch: (matchId: string, paused: boolean) => void;
  endMatch: (matchId: string, politeMessage?: string) => void;
  createDatePlan: (plan: Omit<DatePlan, "id" | "createdAt" | "status" | "checkInDone">) => void;
  updateDatePlan: (id: string, patch: Partial<DatePlan>, changeNote?: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
  updateNotificationSettings: (patch: Partial<NotificationSettings>) => void;
  updatePrivacySettings: (patch: Partial<PrivacySettings>) => void;
  updateAdhsSettings: (patch: Partial<AdhsSettings>) => void;
  addModerationAction: (action: Omit<ModerationAction, "id" | "createdAt">) => void;
  updateReportStatus: (reportId: string, status: Report["status"], notes?: string) => void;
  exportMyData: () => string;
  deleteAccount: () => void;
  resetDemo: () => void;
}

const AppStoreContext = React.createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(initialState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        setState({ ...initialState, ...parsed });
      }
    } catch {
      // Beschädigte Daten: mit frischem Demo-Zustand starten.
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Speicher voll o. Ä. — App funktioniert weiter, nur ohne Persistenz.
    }
  }, [state, hydrated]);

  const likesLeftToday = likesRemainingToday(state.likesGiven.map((l) => l.createdAt));

  const value: AppStoreValue = {
    state,
    likesLeftToday,

    like: (profileId) => {
      const now = new Date().toISOString();
      // Schutz vor massenhaftem Liken: max. 10 Likes pro Minute.
      if (
        isRateLimited(
          state.likesGiven.map((l) => l.createdAt),
          60_000,
          10,
        )
      ) {
        return { rateLimited: true };
      }
      if (likesRemainingToday(state.likesGiven.map((l) => l.createdAt)) <= 0) {
        return { limitReached: true };
      }
      if (state.likesGiven.some((l) => l.toProfileId === profileId)) return {};
      // Match-Entstehung vor dem setState berechnen, damit der Rückgabewert
      // sofort stimmt (z. B. für die "Es ist ein Match!"-Anzeige).
      const match: Match | undefined = state.likesReceived.includes(profileId)
        ? {
            id: newId("match"),
            profileIds: [state.me.id, profileId] as [string, string],
            status: "active",
            createdAt: now,
          }
        : undefined;
      setState((s) => {
        if (s.likesGiven.some((l) => l.toProfileId === profileId)) return s;
        return {
          ...s,
          likesGiven: [...s.likesGiven, { toProfileId: profileId, createdAt: now }],
          matches: match ? [...s.matches, match] : s.matches,
        };
      });
      return { match };
    },

    skip: (profileId) =>
      setState((s) => ({
        ...s,
        skipped: [...s.skipped, profileId],
        skipHistory: [...s.skipHistory, profileId],
      })),

    undoSkip: () => {
      let restored: string | null = null;
      setState((s) => {
        const last = s.skipHistory[s.skipHistory.length - 1];
        if (!last) return s;
        restored = last;
        return {
          ...s,
          skipped: s.skipped.filter((id) => id !== last),
          skipHistory: s.skipHistory.slice(0, -1),
        };
      });
      return restored;
    },

    toggleSave: (profileId) =>
      setState((s) => ({
        ...s,
        saved: s.saved.includes(profileId)
          ? s.saved.filter((id) => id !== profileId)
          : [...s.saved, profileId],
      })),

    block: (profileId) =>
      setState((s) => ({
        ...s,
        blocked: [...new Set([...s.blocked, profileId])],
        // Bestehende Matches mit blockierten Personen werden beendet.
        matches: s.matches.map((m) =>
          m.profileIds.includes(profileId) ? { ...m, status: "ended" as const } : m,
        ),
      })),

    unblock: (profileId) =>
      setState((s) => ({ ...s, blocked: s.blocked.filter((id) => id !== profileId) })),

    report: (profileId, category, description, messageId) =>
      setState((s) => ({
        ...s,
        reports: [
          ...s.reports,
          {
            id: newId("report"),
            reporterProfileId: s.me.id,
            reportedProfileId: profileId,
            messageId,
            category,
            description,
            status: "open",
            createdAt: new Date().toISOString(),
          },
        ],
      })),

    sendMessage: (matchId, body, imageUrl) => {
      // Spam-Schutz: max. 30 Nachrichten pro Minute.
      const myRecent = state.messages
        .filter((m) => m.senderProfileId === state.me.id)
        .map((m) => m.createdAt);
      if (isRateLimited(myRecent, 60_000, 30)) return { rateLimited: true };
      setState((s) => ({
        ...s,
        messages: [
          ...s.messages,
          {
            id: newId("msg"),
            matchId,
            senderProfileId: s.me.id,
            body,
            imageUrl,
            status: "sent",
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      return {};
    },

    deleteMessage: (messageId) =>
      setState((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === messageId ? { ...m, status: "deleted" as const, body: "" } : m,
        ),
      })),

    markAnswerLater: (messageId, remindAt) =>
      setState((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === messageId ? { ...m, answerLater: !m.answerLater, remindAt } : m,
        ),
      })),

    markConversationRead: (matchId) =>
      setState((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.matchId === matchId && m.senderProfileId !== s.me.id && m.status === "sent"
            ? { ...m, status: "read" as const }
            : m,
        ),
      })),

    updateConversationSettings: (matchId, patch) =>
      setState((s) => {
        const existing = s.conversationSettings.find((c) => c.matchId === matchId);
        const next: ConversationSettings = existing
          ? { ...existing, ...patch }
          : {
              matchId,
              profileId: s.me.id,
              muted: false,
              important: false,
              readReceipts: true,
              typingIndicator: true,
              ...patch,
            };
        return {
          ...s,
          conversationSettings: [
            ...s.conversationSettings.filter((c) => c.matchId !== matchId),
            next,
          ],
        };
      }),

    pauseMatch: (matchId, paused) =>
      setState((s) => ({
        ...s,
        matches: s.matches.map((m) =>
          m.id === matchId
            ? { ...m, status: paused ? ("paused" as const) : ("active" as const) }
            : m,
        ),
      })),

    endMatch: (matchId, politeMessage) =>
      setState((s) => {
        let messages = s.messages;
        if (politeMessage) {
          messages = [
            ...messages,
            {
              id: newId("msg"),
              matchId,
              senderProfileId: s.me.id,
              body: politeMessage,
              status: "sent" as const,
              createdAt: new Date().toISOString(),
            },
          ];
        }
        return {
          ...s,
          messages,
          matches: s.matches.map((m) =>
            m.id === matchId ? { ...m, status: "ended" as const } : m,
          ),
        };
      }),

    createDatePlan: (plan) =>
      setState((s) => ({
        ...s,
        datePlans: [
          ...s.datePlans,
          {
            ...plan,
            id: newId("date"),
            status: "proposed",
            checkInDone: false,
            createdAt: new Date().toISOString(),
          },
        ],
      })),

    updateDatePlan: (id, patch, changeNote) =>
      setState((s) => ({
        ...s,
        datePlans: s.datePlans.map((d) =>
          d.id === id ? { ...d, ...patch, lastChangeNote: changeNote ?? d.lastChangeNote } : d,
        ),
      })),

    updateProfile: (patch) => setState((s) => ({ ...s, me: { ...s.me, ...patch } })),

    updatePreferences: (patch) =>
      setState((s) => ({ ...s, myPreferences: { ...s.myPreferences, ...patch } })),

    updateNotificationSettings: (patch) =>
      setState((s) => ({ ...s, notificationSettings: { ...s.notificationSettings, ...patch } })),

    updatePrivacySettings: (patch) =>
      setState((s) => ({ ...s, privacySettings: { ...s.privacySettings, ...patch } })),

    updateAdhsSettings: (patch) =>
      setState((s) => ({ ...s, adhsSettings: { ...s.adhsSettings, ...patch } })),

    addModerationAction: (action) =>
      setState((s) => ({
        ...s,
        moderationActions: [
          ...s.moderationActions,
          { ...action, id: newId("mod"), createdAt: new Date().toISOString() },
        ],
      })),

    updateReportStatus: (reportId, status, notes) =>
      setState((s) => ({
        ...s,
        reports: s.reports.map((r) =>
          r.id === reportId ? { ...r, status, moderatorNotes: notes ?? r.moderatorNotes } : r,
        ),
      })),

    exportMyData: () => {
      // DSGVO Art. 20: alle eigenen Daten als JSON.
      const {
        me,
        myPreferences,
        likesGiven,
        saved,
        matches,
        messages,
        datePlans,
        privacySettings,
        notificationSettings,
      } = state;
      return JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          profile: me,
          preferences: myPreferences,
          likesGiven,
          savedProfiles: saved,
          matches,
          messages: messages.filter((m) => m.senderProfileId === me.id),
          datePlans,
          privacySettings,
          notificationSettings,
        },
        null,
        2,
      );
    },

    deleteAccount: () => {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignorieren
      }
      setState(initialState);
    },

    resetDemo: () => {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignorieren
      }
      setState(initialState);
    },
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = React.useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore muss innerhalb von AppStoreProvider verwendet werden.");
  return ctx;
}

/** Hilfsfunktionen für abgeleitete Daten. */

export function profileById(state: AppState, id: string): Profile | undefined {
  if (id === state.me.id) return state.me;
  return state.profiles.find((p) => p.id === id);
}

export function otherProfileId(match: Match, myId: string): string {
  return match.profileIds[0] === myId ? match.profileIds[1] : match.profileIds[0];
}

export function visibleMessages(state: AppState, matchId: string): Message[] {
  return state.messages
    .filter((m) => m.matchId === matchId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function unreadCount(state: AppState, matchId: string): number {
  return state.messages.filter(
    (m) => m.matchId === matchId && m.senderProfileId !== state.me.id && m.status === "sent",
  ).length;
}
