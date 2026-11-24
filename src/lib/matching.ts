import type { DiscoverFilters, Preferences, Profile } from "@/lib/types";
import { ageFromBirthdate } from "@/lib/utils";
import { labelFor, PLANNING_STYLE_OPTIONS, RELATIONSHIP_GOAL_OPTIONS } from "@/lib/options";

/**
 * Matching-Logik von EchtNah.
 *
 * Bewusste Entscheidung: kein pseudowissenschaftlicher Kompatibilitätswert.
 * Stattdessen werden konkrete, nachvollziehbare Übereinstimmungen als
 * verständliche Sätze angezeigt.
 */

/** Entfernung in Kilometern zwischen zwei ungefähren Koordinaten (Haversine). */
export function distanceKm(
  a: { approxLat: number; approxLng: number },
  b: { approxLat: number; approxLng: number },
): number {
  const R = 6371;
  const dLat = ((b.approxLat - a.approxLat) * Math.PI) / 180;
  const dLng = ((b.approxLng - a.approxLng) * Math.PI) / 180;
  const la1 = (a.approxLat * Math.PI) / 180;
  const la2 = (b.approxLat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/** Prüft, ob `candidate` den Suchpräferenzen von `seeker` entspricht. */
export function matchesPreferences(
  seekerProfile: Profile,
  seekerPrefs: Preferences,
  candidate: Profile,
): boolean {
  const age = ageFromBirthdate(candidate.birthdate);
  if (age < seekerPrefs.ageMin || age > seekerPrefs.ageMax) return false;
  if (
    seekerPrefs.seekingGenders.length > 0 &&
    !seekerPrefs.seekingGenders.includes(candidate.gender)
  ) {
    return false;
  }
  if (distanceKm(seekerProfile, candidate) > seekerPrefs.maxDistanceKm) return false;
  return true;
}

/** Gegenseitigkeit: beide müssen in die Präferenzen der jeweils anderen Person passen. */
export function isMutualCandidate(
  a: Profile,
  aPrefs: Preferences,
  b: Profile,
  bPrefs: Preferences,
): boolean {
  return matchesPreferences(a, aPrefs, b) && matchesPreferences(b, bPrefs, a);
}

/**
 * Erzeugt verständliche Sätze über Gemeinsamkeiten zweier Profile.
 * Nur ehrliche, konkrete Übereinstimmungen — keine Prozentwerte.
 */
export function matchReasons(a: Profile, b: Profile): string[] {
  const reasons: string[] = [];

  if (a.relationshipGoal === b.relationshipGoal) {
    const goal = labelFor(RELATIONSHIP_GOAL_OPTIONS, a.relationshipGoal).toLowerCase();
    reasons.push(
      a.relationshipGoal === "long_term"
        ? "Ihr sucht beide eine langfristige Beziehung."
        : `Ihr wünscht euch beide: ${goal}.`,
    );
  }

  const sharedInterests = a.interests.filter((i) => b.interests.includes(i));
  if (sharedInterests.length > 0) {
    reasons.push(`Gemeinsame Interessen: ${sharedInterests.slice(0, 3).join(", ")}.`);
  }

  const sharedValues = a.values.filter((v) => b.values.includes(v));
  if (sharedValues.length > 0) {
    reasons.push(`Euch beiden ist wichtig: ${sharedValues.slice(0, 3).join(", ")}.`);
  }

  const sharedComms = a.communicationStyles.filter((c) => b.communicationStyles.includes(c));
  if (sharedComms.length > 0) {
    reasons.push("Eure Kommunikationswünsche passen gut zusammen.");
  }

  if (a.contactFrequency === b.contactFrequency) {
    reasons.push("Ihr wünscht euch ähnlich viel Kontakt.");
  }

  if (a.planningStyle === b.planningStyle) {
    reasons.push(
      a.planningStyle === "structured"
        ? "Ihr plant Verabredungen gerne frühzeitig."
        : a.planningStyle === "spontaneous"
          ? "Ihr mögt beide spontane Verabredungen."
          : `Ihr plant beide gerne: ${labelFor(PLANNING_STYLE_OPTIONS, a.planningStyle).toLowerCase()}.`,
    );
  }

  if (a.energyLevel === b.energyLevel && a.energyLevel === "low") {
    reasons.push("Ihr mögt beide ruhige Treffen.");
  }

  const sharedActivities = a.socialActivities.filter((s) => b.socialActivities.includes(s));
  if (sharedActivities.length > 0 && !reasons.some((r) => r.startsWith("Ihr mögt beide ruhige"))) {
    reasons.push(`Ihr unternehmt beide gerne: ${sharedActivities.slice(0, 2).join(", ")}.`);
  }

  if (a.responsePace === "takes_time" && b.responsePace === "takes_time") {
    reasons.push("Ihr lasst euch beide gerne Zeit beim Antworten — kein Druck.");
  }

  return reasons;
}

/** Prüft, ob ein Profil die Dealbreaker einer Person berührt. */
export function violatesDealbreakers(prefs: Preferences, candidate: Profile): boolean {
  const d = prefs.dealbreakers;
  if (d.includes("Rauchen") && candidate.lifestyle.smoking === "yes") return true;
  if (d.includes("Häufiger Alkohol") && candidate.lifestyle.alcohol === "yes") return true;
  if (d.includes("Kein Interesse an fester Beziehung") && candidate.relationshipGoal === "casual") {
    return true;
  }
  return false;
}

/**
 * Wendet die Entdecken-Filter an. Sensible Angaben (disclosureLabels) werden
 * nur berücksichtigt, wenn die betroffene Person sie ausdrücklich als
 * "searchable" freigegeben hat.
 */
export function applyDiscoverFilters(
  profiles: Profile[],
  filters: DiscoverFilters,
  viewer?: Profile,
): Profile[] {
  return profiles.filter((p) => {
    const age = ageFromBirthdate(p.birthdate);
    if (filters.ageMin !== undefined && age < filters.ageMin) return false;
    if (filters.ageMax !== undefined && age > filters.ageMax) return false;
    if (filters.genders?.length && !filters.genders.includes(p.gender)) return false;
    if (
      filters.orientations?.length &&
      // Orientierung darf nur gefiltert werden, wenn sie öffentlich sichtbar ist.
      (p.orientationVisibility !== "public" || !filters.orientations.includes(p.orientation))
    ) {
      return false;
    }
    if (
      filters.relationshipGoals?.length &&
      !filters.relationshipGoals.includes(p.relationshipGoal)
    ) {
      return false;
    }
    if (filters.interests?.length && !filters.interests.some((i) => p.interests.includes(i))) {
      return false;
    }
    if (filters.values?.length && !filters.values.some((v) => p.values.includes(v))) {
      return false;
    }
    if (
      filters.communicationStyles?.length &&
      !filters.communicationStyles.some((c) => p.communicationStyles.includes(c))
    ) {
      return false;
    }
    if (filters.planningStyles?.length && !filters.planningStyles.includes(p.planningStyle)) {
      return false;
    }
    if (
      filters.contactFrequencies?.length &&
      !filters.contactFrequencies.includes(p.contactFrequency)
    ) {
      return false;
    }
    if (
      filters.maxDistanceKm !== undefined &&
      viewer &&
      distanceKm(viewer, p) > filters.maxDistanceKm
    ) {
      return false;
    }
    if (
      filters.accessibleMeetingPlaces &&
      p.accessibilityVisibility === "public" &&
      p.accessibilityNeeds.length === 0
    ) {
      // Filter "barrierearme Treffpunkte" zeigt nur Profile, die selbst
      // barrierearme Orte brauchen oder bevorzugen.
      return false;
    }
    if (
      filters.childrenWish?.length &&
      (!p.lifestyle.childrenWish || !filters.childrenWish.includes(p.lifestyle.childrenWish))
    ) {
      return false;
    }
    if (
      filters.smoking?.length &&
      (!p.lifestyle.smoking || !filters.smoking.includes(p.lifestyle.smoking))
    ) {
      return false;
    }
    if (
      filters.alcohol?.length &&
      (!p.lifestyle.alcohol || !filters.alcohol.includes(p.lifestyle.alcohol))
    ) {
      return false;
    }
    if (filters.pets?.length && (!p.lifestyle.pets || !filters.pets.includes(p.lifestyle.pets))) {
      return false;
    }
    if (filters.disclosureLabels?.length) {
      // Nur ausdrücklich freigegebene (searchable) UND öffentlich sichtbare
      // Angaben dürfen als Suchkriterium wirken.
      const searchable = p.disclosures.filter((d) => d.searchable && d.visibility === "public");
      const hit = filters.disclosureLabels.some((label) =>
        searchable.some((d) => d.label.toLowerCase().includes(label.toLowerCase())),
      );
      if (!hit) return false;
    }
    return true;
  });
}

/** Tageslimit für Likes im kostenlosen Modell (Freemium technisch vorbereitet). */
export const FREE_DAILY_LIKE_LIMIT = 20;

export function likesRemainingToday(
  likeTimestamps: string[],
  now: Date = new Date(),
  limit: number = FREE_DAILY_LIKE_LIMIT,
): number {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const usedToday = likeTimestamps.filter((t) => new Date(t) >= startOfDay).length;
  return Math.max(0, limit - usedToday);
}

/**
 * Sortiert Kandidat:innen nach Anzahl nachvollziehbarer Übereinstimmungen
 * (siehe matchReasons). Die Zahl selbst wird nie angezeigt — sie bestimmt nur
 * die Reihenfolge. Stabil: Gleichstände behalten die ursprüngliche Ordnung.
 */
export function sortByMatchQuality(profiles: Profile[], me: Profile): Profile[] {
  return profiles
    .map((p, index) => ({ p, index, count: matchReasons(me, p).length }))
    .sort((a, b) => b.count - a.count || a.index - b.index)
    .map((x) => x.p);
}

/**
 * Tägliche Auswahl statt endlosem Wischen.
 * Grundlage: In einem Experiment (D'Angelo & Toma, Media Psychology,
 * 2016/2017) waren Teilnehmende, die aus 24 statt aus 6 Profilen wählten,
 * eine Woche später unzufriedener mit ihrer Wahl und schrieben weniger
 * sorgfältige Nachrichten ("Choice Overload"). Eine überschaubare tägliche
 * Auswahl schützt außerdem vor Reizüberflutung und ist ADHS-freundlich.
 */
export const DAILY_SUGGESTIONS = 8;

/** Wie viele Profile heute noch vorgeschlagen werden (Likes + Überspringen zählen). */
export function suggestionsLeftToday(
  decisionTimestamps: string[],
  now: Date = new Date(),
  limit: number = DAILY_SUGGESTIONS,
): number {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const decidedToday = decisionTimestamps.filter((t) => new Date(t) >= startOfDay).length;
  return Math.max(0, limit - decidedToday);
}

/**
 * Gemeinsame Bedürfnisse für ein Treffen: Vereinigung der Barrierefreiheits-
 * und Reizbedürfnisse beider Personen. Erwartet das Profil der anderen
 * Person bereits in der Sicht, die die eigene Person sehen darf
 * (profileForViewer(..., "matched")) — verborgene Angaben fließen so nie ein.
 */
export function sharedMeetingNeeds(
  me: Profile,
  otherAsVisibleToMe: Profile,
): { need: string; fromMe: boolean; fromOther: boolean }[] {
  const mine = new Set([...me.accessibilityNeeds, ...me.sensoryNeeds]);
  const theirs = new Set([
    ...otherAsVisibleToMe.accessibilityNeeds,
    ...otherAsVisibleToMe.sensoryNeeds,
  ]);
  return [...new Set([...mine, ...theirs])].map((need) => ({
    need,
    fromMe: mine.has(need),
    fromOther: theirs.has(need),
  }));
}
