import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessibilityProvider } from "@/components/a11y/accessibility-provider";
import { CommunityRulesContent } from "@/components/community-rules-content";

beforeEach(() => {
  window.localStorage.clear();
});

describe("CommunityRulesContent", () => {
  it("zeigt standardmäßig die normale Sprache", () => {
    render(
      <AccessibilityProvider>
        <CommunityRulesContent />
      </AccessibilityProvider>,
    );
    expect(
      screen.getByText(/Keine Beleidigungen, Abwertungen oder Demütigungen\./),
    ).toBeInTheDocument();
  });

  it("zeigt kurze, einfache Sätze, wenn Einfache Sprache aktiviert ist", async () => {
    window.localStorage.setItem("echtnah.accessibility", JSON.stringify({ simpleLanguage: true }));
    render(
      <AccessibilityProvider>
        <CommunityRulesContent />
      </AccessibilityProvider>,
    );
    expect(await screen.findByText("Beleidige niemanden.")).toBeInTheDocument();
    expect(screen.queryByText(/Keine Beleidigungen, Abwertungen/)).not.toBeInTheDocument();
  });
});
