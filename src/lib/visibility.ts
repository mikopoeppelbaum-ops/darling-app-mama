import type { Profile, SensitiveDisclosure, Visibility } from "@/lib/types";

/**
 * Sichtbarkeitslogik für sensible Angaben.
 *
 * Grundsatz: Jede Person entscheidet selbst, welche Angaben
 * - sofort sichtbar sind ("public"),
 * - erst nach einem Match sichtbar werden ("after_match"),
 * - oder gar nicht angezeigt werden ("hidden").
 */

export type ViewerContext = "public" | "matched" | "self";

export function isVisible(visibility: Visibility, context: ViewerContext): boolean {
  if (context === "self") return true;
  if (visibility === "public") return true;
  if (visibility === "after_match") return context === "matched";
  return false;
}

export function visibleDisclosures(
  disclosures: SensitiveDisclosure[],
  context: ViewerContext,
): SensitiveDisclosure[] {
  return disclosures.filter((d) => isVisible(d.visibility, context));
}

/**
 * Erzeugt die Ansicht eines Profils, wie andere Personen es sehen.
 * Wird auch für die Profilvorschau verwendet ("exakt das, was andere sehen").
 */
export function profileForViewer(profile: Profile, context: ViewerContext): Profile {
  if (context === "self") return profile;
  return {
    ...profile,
    disclosures: visibleDisclosures(profile.disclosures, context),
    accessibilityNeeds: isVisible(profile.accessibilityVisibility, context)
      ? profile.accessibilityNeeds
      : [],
    orientation: isVisible(profile.orientationVisibility, context)
      ? profile.orientation
      : "prefer_not_to_say",
    orientations: isVisible(profile.orientationVisibility, context)
      ? profile.orientations
      : undefined,
    romanticOrientation: isVisible(profile.orientationVisibility, context)
      ? profile.romanticOrientation
      : undefined,
    // Inter* ist standardmäßig verborgen, solange nichts anderes gewählt ist.
    inter:
      profile.inter && isVisible(profile.interVisibility ?? "hidden", context) ? true : undefined,
    // Tagesform ist bewusst nur für Matches sichtbar.
    todayEnergy: context === "matched" ? profile.todayEnergy : undefined,
    // Einwilligungs-Zeitpunkt ist eine interne Angabe und nie öffentlich.
    sensitiveConsentGivenAt: undefined,
  };
}
