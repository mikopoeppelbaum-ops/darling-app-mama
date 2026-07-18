import { describe, expect, it } from "vitest";
import {
  applyDiscoverFilters,
  distanceKm,
  isMutualCandidate,
  likesRemainingToday,
  matchesPreferences,
  matchReasons,
  violatesDealbreakers,
  FREE_DAILY_LIKE_LIMIT,
} from "@/lib/matching";
import { DEMO_ME, DEMO_MY_PREFERENCES, DEMO_PROFILES } from "@/lib/demo-data";
import type { Preferences, Profile } from "@/lib/types";

const mara = DEMO_PROFILES.find((p) => p.displayName === "Mara")!;
const frida = DEMO_PROFILES.find((p) => p.displayName === "Frida")!;

const openPrefs = (profileId: string): Preferences => ({
  profileId,
  seekingGenders: [],
  ageMin: 18,
  ageMax: 99,
  maxDistanceKm: 500,
  relationshipGoals: [],
  dealbreakers: [],
});

describe("matchesPreferences", () => {
  it("akzeptiert ein Profil innerhalb der Präferenzen", () => {
    expect(matchesPreferences(DEMO_ME, DEMO_MY_PREFERENCES, mara)).toBe(true);
  });

  it("lehnt Profile außerhalb der Altersgrenzen ab", () => {
    const prefs: Preferences = { ...DEMO_MY_PREFERENCES, ageMin: 18, ageMax: 25 };
    expect(matchesPreferences(DEMO_ME, prefs, mara)).toBe(false);
  });

  it("lehnt Profile mit nicht gesuchtem Geschlecht ab", () => {
    const prefs: Preferences = { ...DEMO_MY_PREFERENCES, seekingGenders: ["man"] };
    expect(matchesPreferences(DEMO_ME, prefs, mara)).toBe(false);
  });

  it("lehnt zu weit entfernte Profile ab", () => {
    const prefs: Preferences = { ...DEMO_MY_PREFERENCES, maxDistanceKm: 1 };
    const selin = DEMO_PROFILES.find((p) => p.displayName === "Selin")!;
    expect(matchesPreferences(DEMO_ME, prefs, selin)).toBe(false);
  });
});

describe("isMutualCandidate", () => {
  it("verlangt Gegenseitigkeit in beide Richtungen", () => {
    expect(isMutualCandidate(DEMO_ME, DEMO_MY_PREFERENCES, mara, openPrefs(mara.id))).toBe(true);
    const strengePrefs: Preferences = { ...openPrefs(mara.id), seekingGenders: ["woman"] };
    // Mara sucht nur Frauen → Alex (nicht-binär) ist kein gegenseitiger Kandidat.
    expect(isMutualCandidate(DEMO_ME, DEMO_MY_PREFERENCES, mara, strengePrefs)).toBe(false);
  });
});

describe("matchReasons", () => {
  it("erzeugt verständliche Sätze für Gemeinsamkeiten", () => {
    const reasons = matchReasons(DEMO_ME, mara);
    expect(reasons).toContain("Ihr sucht beide eine langfristige Beziehung.");
    expect(reasons).toContain("Ihr wünscht euch ähnlich viel Kontakt.");
    expect(reasons).toContain("Ihr plant Verabredungen gerne frühzeitig.");
    expect(reasons.some((r) => r.startsWith("Euch beiden ist wichtig:"))).toBe(true);
  });

  it("liefert keine Prozentwerte", () => {
    for (const r of matchReasons(DEMO_ME, mara)) {
      expect(r).not.toMatch(/%/);
    }
  });

  it("erkennt gemeinsames Ruhebedürfnis", () => {
    expect(matchReasons(DEMO_ME, frida)).toContain("Ihr mögt beide ruhige Treffen.");
  });
});

describe("violatesDealbreakers", () => {
  it("filtert Rauchen als Dealbreaker", () => {
    const smoker: Profile = { ...mara, lifestyle: { ...mara.lifestyle, smoking: "yes" } };
    expect(violatesDealbreakers(DEMO_MY_PREFERENCES, smoker)).toBe(true);
    expect(violatesDealbreakers(DEMO_MY_PREFERENCES, mara)).toBe(false);
  });
});

describe("applyDiscoverFilters", () => {
  it("filtert nach Interessen", () => {
    const result = applyDiscoverFilters(DEMO_PROFILES, { interests: ["Gaming"] });
    expect(result.map((p) => p.displayName)).toEqual(["Ricky"]);
  });

  it("filtert sensible Angaben nur bei ausdrücklicher Freigabe (searchable + public)", () => {
    const result = applyDiscoverFilters(DEMO_PROFILES, { disclosureLabels: ["ADHS"] });
    const names = result.map((p) => p.displayName);
    // Ivy: ADHS public + searchable → gefunden.
    expect(names).toContain("Ivy");
    // Ricky: ADHS nur after_match und nicht searchable → nicht über ADHS auffindbar.
    expect(names).not.toContain("Ricky");
  });

  it("filtert Orientierung nur bei öffentlicher Sichtbarkeit", () => {
    const result = applyDiscoverFilters(DEMO_PROFILES, { orientations: ["gay"] });
    // Tom ist schwul, aber seine Orientierung ist erst nach Match sichtbar.
    expect(result.map((p) => p.displayName)).not.toContain("Tom");
  });
});

describe("likesRemainingToday", () => {
  it("zählt nur Likes von heute", () => {
    const now = new Date("2026-07-18T12:00:00Z");
    const timestamps = [
      "2026-07-18T08:00:00Z", // heute
      "2026-07-17T23:00:00Z", // gestern
    ];
    expect(likesRemainingToday(timestamps, now)).toBe(FREE_DAILY_LIKE_LIMIT - 1);
  });

  it("geht nie unter null", () => {
    const now = new Date("2026-07-18T12:00:00Z");
    const timestamps = Array.from({ length: 50 }, () => "2026-07-18T08:00:00Z");
    expect(likesRemainingToday(timestamps, now)).toBe(0);
  });
});

describe("distanceKm", () => {
  it("berechnet plausible Entfernungen", () => {
    const koeln = { approxLat: 50.94, approxLng: 6.96 };
    const bonn = { approxLat: 50.73, approxLng: 7.1 };
    const d = distanceKm(koeln, bonn);
    expect(d).toBeGreaterThan(15);
    expect(d).toBeLessThan(40);
  });
});
