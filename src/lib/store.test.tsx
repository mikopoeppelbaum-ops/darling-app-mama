import { describe, expect, it, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  AppStoreProvider,
  allNotifications,
  decisionTimestamps,
  deriveLiveNotifications,
  useAppStore,
} from "@/lib/store";

function setup() {
  window.localStorage.clear();
  return renderHook(() => useAppStore(), {
    wrapper: ({ children }) => <AppStoreProvider>{children}</AppStoreProvider>,
  });
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("Likes und Matches", () => {
  it("erzeugt ein Match bei gegenseitigem Like", () => {
    const { result } = setup();
    // p2 (Jonas) hat "mich" im Demo-Zustand bereits geliked.
    let outcome: ReturnType<typeof result.current.like> | undefined;
    act(() => {
      outcome = result.current.like("p2");
    });
    expect(outcome?.match).toBeDefined();
    expect(
      result.current.state.matches.some(
        (m) => m.profileIds.includes("p2") && m.status === "active",
      ),
    ).toBe(true);
  });

  it("erzeugt kein Match ohne Gegenseitigkeit", () => {
    const { result } = setup();
    let outcome: ReturnType<typeof result.current.like> | undefined;
    act(() => {
      outcome = result.current.like("p4");
    });
    expect(outcome?.match).toBeUndefined();
  });

  it("verhindert doppelte Likes", () => {
    const { result } = setup();
    act(() => {
      result.current.like("p4");
      result.current.like("p4");
    });
    expect(result.current.state.likesGiven.filter((l) => l.toProfileId === "p4")).toHaveLength(1);
  });
});

describe("Blockieren", () => {
  it("beendet bestehende Matches beim Blockieren", () => {
    const { result } = setup();
    act(() => {
      result.current.block("p1"); // Mara — bestehendes Demo-Match m1
    });
    expect(result.current.state.blocked).toContain("p1");
    const match = result.current.state.matches.find((m) => m.id === "m1");
    expect(match?.status).toBe("ended");
  });

  it("kann Blockierungen wieder aufheben", () => {
    const { result } = setup();
    act(() => {
      result.current.block("p1");
      result.current.unblock("p1");
    });
    expect(result.current.state.blocked).not.toContain("p1");
  });
});

describe("Melden", () => {
  it("legt eine Meldung mit Kategorie, Beschreibung und Zeitstempel an", () => {
    const { result } = setup();
    act(() => {
      result.current.report("p1", "ableism", "Abwertende Nachrichten über meine Behinderung.");
    });
    const report = result.current.state.reports[0];
    expect(report).toMatchObject({
      reportedProfileId: "p1",
      category: "ableism",
      status: "open",
    });
    expect(report.createdAt).toBeTruthy();
  });
});

describe("Nachrichten", () => {
  it("sendet Nachrichten in ein aktives Match", () => {
    const { result } = setup();
    act(() => {
      result.current.sendMessage("m1", "Hallo Mara!");
    });
    const msgs = result.current.state.messages.filter((m) => m.matchId === "m1");
    expect(msgs[msgs.length - 1]?.body).toBe("Hallo Mara!");
  });

  it("löscht eigene Nachrichten (Inhalt wird entfernt)", () => {
    const { result } = setup();
    act(() => {
      result.current.sendMessage("m1", "Ups, falsch");
    });
    const sent = result.current.state.messages.filter((m) => m.matchId === "m1").at(-1)!;
    act(() => {
      result.current.deleteMessage(sent.id);
    });
    const deleted = result.current.state.messages.find((m) => m.id === sent.id)!;
    expect(deleted.status).toBe("deleted");
    expect(deleted.body).toBe("");
  });

  it("markiert Nachrichten als 'Später beantworten' mit Erinnerungszeit", () => {
    const { result } = setup();
    const incoming = result.current.state.messages.find((m) => m.id === "msg4")!;
    act(() => {
      result.current.markAnswerLater(incoming.id, "2026-07-20T10:00:00Z");
    });
    const updated = result.current.state.messages.find((m) => m.id === "msg4")!;
    expect(updated.answerLater).toBe(true);
    expect(updated.remindAt).toBe("2026-07-20T10:00:00Z");
  });
});

describe("Match pausieren und beenden", () => {
  it("pausiert und reaktiviert ein Match", () => {
    const { result } = setup();
    act(() => result.current.pauseMatch("m1", true));
    expect(result.current.state.matches.find((m) => m.id === "m1")?.status).toBe("paused");
    act(() => result.current.pauseMatch("m1", false));
    expect(result.current.state.matches.find((m) => m.id === "m1")?.status).toBe("active");
  });

  it("beendet ein Match mit freundlicher Abschiedsnachricht", () => {
    const { result } = setup();
    act(() => result.current.endMatch("m1", "Danke für den Austausch. Alles Gute!"));
    expect(result.current.state.matches.find((m) => m.id === "m1")?.status).toBe("ended");
    const last = result.current.state.messages.filter((m) => m.matchId === "m1").at(-1)!;
    expect(last.body).toContain("Danke für den Austausch");
  });
});

describe("Date-Planung", () => {
  it("legt einen Date-Plan mit Status 'proposed' an", () => {
    const { result } = setup();
    act(() => {
      result.current.createDatePlan({
        matchId: "m1",
        createdByProfileId: "me",
        dateType: "quiet_cafe",
        startsAt: "2026-08-01T15:00:00Z",
        durationMinutes: 60,
        locationName: "Café Ruhepol",
        accessibilityRequirements: ["Ruhige Umgebung"],
        remindersEnabled: true,
        shareWithTrustedPerson: false,
      });
    });
    const plan = result.current.state.datePlans[0];
    expect(plan.status).toBe("proposed");
    expect(plan.checkInDone).toBe(false);
  });

  it("bestätigt und storniert Pläne mit Änderungsnotiz", () => {
    const { result } = setup();
    act(() => {
      result.current.createDatePlan({
        matchId: "m1",
        createdByProfileId: "me",
        dateType: "walk",
        startsAt: "2026-08-01T15:00:00Z",
        durationMinutes: 45,
        locationName: "Stadtpark",
        accessibilityRequirements: [],
        remindersEnabled: true,
        shareWithTrustedPerson: false,
      });
    });
    const id = result.current.state.datePlans[0].id;
    act(() => result.current.updateDatePlan(id, { status: "cancelled" }, "Krank geworden"));
    const plan = result.current.state.datePlans[0];
    expect(plan.status).toBe("cancelled");
    expect(plan.lastChangeNote).toBe("Krank geworden");
  });
});

describe("Datenexport und Kontolöschung", () => {
  it("exportiert nur eigene Daten als JSON", () => {
    const { result } = setup();
    const data = JSON.parse(result.current.exportMyData());
    expect(data.profile.id).toBe("me");
    // Nachrichten anderer Personen sind nicht Teil des Exports.
    expect(
      (data.messages as { senderProfileId: string }[]).every((m) => m.senderProfileId === "me"),
    ).toBe(true);
  });

  it("setzt beim Löschen alle Daten zurück", () => {
    const { result } = setup();
    act(() => {
      result.current.like("p4");
      result.current.deleteAccount();
    });
    expect(result.current.state.likesGiven).toHaveLength(0);
  });
});

describe("Benachrichtigungs-Center", () => {
  const plan = (startsAt: string) => ({
    matchId: "m1",
    createdByProfileId: "me",
    dateType: "quiet_cafe",
    startsAt,
    durationMinutes: 60,
    locationName: "Café Ruhepol",
    accessibilityRequirements: [],
    remindersEnabled: true,
    shareWithTrustedPerson: false,
  });

  it("speichert eine Benachrichtigung bei einem neuen Match", () => {
    const { result } = setup();
    act(() => {
      result.current.like("p2");
    });
    const n = result.current.state.notifications.find((x) => x.kind === "new_match");
    expect(n?.profileId).toBe("p2");
    expect(n?.read).toBe(false);
  });

  it("leitet fällige 'Später beantworten'-Erinnerungen ab — aber nicht vor der Zeit", () => {
    const { result } = setup();
    act(() => result.current.markAnswerLater("msg4", "2026-01-01T00:00:00Z"));
    const due = deriveLiveNotifications(result.current.state, new Date("2026-02-01T00:00:00Z"));
    expect(due.some((n) => n.kind === "answer_later_due" && n.messageId === "msg4")).toBe(true);
    const early = deriveLiveNotifications(result.current.state, new Date("2025-12-01T00:00:00Z"));
    expect(early.some((n) => n.kind === "answer_later_due")).toBe(false);
  });

  it("leitet Date-Erinnerung (48 h vorher) und ausstehenden Check-in ab", () => {
    const { result } = setup();
    act(() => result.current.createDatePlan(plan("2026-01-02T10:00:00Z")));
    const before = deriveLiveNotifications(result.current.state, new Date("2026-01-01T00:00:00Z"));
    expect(before.some((n) => n.kind === "date_reminder")).toBe(true);
    const after = deriveLiveNotifications(result.current.state, new Date("2026-01-03T00:00:00Z"));
    expect(after.some((n) => n.kind === "date_checkin_due")).toBe(true);
  });

  it("sortiert die kombinierte Liste, neueste zuerst, und markiert als gelesen", () => {
    const { result } = setup();
    act(() => {
      result.current.like("p2");
      result.current.like("p8");
    });
    const all = allNotifications(result.current.state);
    for (let i = 1; i < all.length; i++)
      expect(all[i].createdAt <= all[i - 1].createdAt).toBe(true);
    act(() => result.current.markAllNotificationsRead());
    expect(result.current.state.notifications.every((n) => n.read)).toBe(true);
  });
});

describe("Tagesauswahl und Einwilligung", () => {
  it("zählt Überspringen als Entscheidung und gibt sie beim Zurückholen frei", () => {
    const { result } = setup();
    act(() => result.current.skip("p4"));
    expect(decisionTimestamps(result.current.state)).toHaveLength(1);
    let restored: string | null = null;
    act(() => {
      restored = result.current.undoSkip();
    });
    expect(restored).toBe("p4");
    expect(decisionTimestamps(result.current.state)).toHaveLength(0);
  });

  it("protokolliert die ausdrückliche Einwilligung nach Art. 9 DSGVO", () => {
    const { result } = setup();
    expect(result.current.state.me.sensitiveConsentGivenAt).toBeUndefined();
    act(() => result.current.giveSensitiveConsent());
    expect(result.current.state.me.sensitiveConsentGivenAt).toBeTruthy();
  });
});
