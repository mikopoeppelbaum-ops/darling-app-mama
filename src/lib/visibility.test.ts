import { describe, expect, it } from "vitest";
import { isVisible, profileForViewer, visibleDisclosures } from "@/lib/visibility";
import { DEMO_ME, DEMO_PROFILES } from "@/lib/demo-data";
import type { SensitiveDisclosure } from "@/lib/types";

const disclosures: SensitiveDisclosure[] = [
  { id: "1", label: "Öffentlich", visibility: "public", searchable: false },
  { id: "2", label: "Nach Match", visibility: "after_match", searchable: false },
  { id: "3", label: "Versteckt", visibility: "hidden", searchable: false },
];

describe("isVisible", () => {
  it("zeigt public immer, hidden nie (außer für die eigene Person)", () => {
    expect(isVisible("public", "public")).toBe(true);
    expect(isVisible("hidden", "public")).toBe(false);
    expect(isVisible("hidden", "matched")).toBe(false);
    expect(isVisible("hidden", "self")).toBe(true);
  });

  it("zeigt after_match nur für Matches", () => {
    expect(isVisible("after_match", "public")).toBe(false);
    expect(isVisible("after_match", "matched")).toBe(true);
  });
});

describe("visibleDisclosures", () => {
  it("filtert je nach Kontext", () => {
    expect(visibleDisclosures(disclosures, "public").map((d) => d.label)).toEqual(["Öffentlich"]);
    expect(visibleDisclosures(disclosures, "matched").map((d) => d.label)).toEqual([
      "Öffentlich",
      "Nach Match",
    ]);
    expect(visibleDisclosures(disclosures, "self")).toHaveLength(3);
  });
});

describe("profileForViewer", () => {
  it("verbirgt sensible Angaben vor einem Match", () => {
    // Alex' ADHS-Angabe ist erst nach Match sichtbar.
    const publicView = profileForViewer(DEMO_ME, "public");
    expect(publicView.disclosures).toHaveLength(0);
    // Barrierefreiheitsbedürfnisse sind after_match → vor Match leer.
    expect(publicView.accessibilityNeeds).toHaveLength(0);

    const matchedView = profileForViewer(DEMO_ME, "matched");
    expect(matchedView.disclosures.map((d) => d.label)).toContain("ADHS");
    expect(matchedView.accessibilityNeeds.length).toBeGreaterThan(0);
  });

  it("maskiert die Orientierung, wenn sie nicht sichtbar ist", () => {
    const tom = DEMO_PROFILES.find((p) => p.displayName === "Tom")!;
    expect(profileForViewer(tom, "public").orientation).toBe("prefer_not_to_say");
    expect(profileForViewer(tom, "matched").orientation).toBe("gay");
  });

  it("zeigt der eigenen Person alles", () => {
    expect(profileForViewer(DEMO_ME, "self")).toEqual(DEMO_ME);
  });
});
