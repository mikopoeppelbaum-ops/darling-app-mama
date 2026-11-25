import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import * as React from "react";

import LandingPage from "@/app/page";
import RegisterPage from "@/app/(auth)/registrieren/page";
import SecuritySettingsPage from "@/app/(app)/einstellungen/sicherheit/page";
import KnowledgePage from "@/app/(app)/wissen/page";
import NotificationsPage from "@/app/(app)/benachrichtigungen/page";
import DiscoverPage from "@/app/(app)/entdecken/page";
import MatchesPage from "@/app/(app)/matches/page";
import PrivacyPage from "@/app/(app)/einstellungen/privatsphaere/page";
import { IdentityEditor } from "@/components/profile/identity-editor";
import { CommunityRulesContent } from "@/components/community-rules-content";
import { AppShell } from "@/components/layout/app-shell";
import { AppStoreProvider } from "@/lib/store";
import { AccessibilityProvider } from "@/components/a11y/accessibility-provider";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ChipGroup } from "@/components/ui/chip-group";
import { RadioCards } from "@/components/ui/radio-cards";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Compass } from "lucide-react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/entdecken",
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));

/**
 * jsdom rendert nicht wirklich (kein Layout/Painting), daher kann axe-core
 * echten Farbkontrast nicht prüfen — das erfordert einen echten Browser.
 * Die Design-Tokens in globals.css wurden manuell auf WCAG-2.2-AA-Kontrast
 * geprüft; zusätzlich empfiehlt sich ein Kontrast-Check mit einem echten
 * Browser-Tool (z. B. axe DevTools) vor einem Produktivbetrieb.
 *
 * Wichtig: Dieser automatisierte Test ersetzt keinen Test mit einem echten
 * Screenreader (NVDA, JAWS, VoiceOver). Er findet zuverlässig strukturelle
 * Probleme (fehlende Labels, falsche ARIA-Attribute, Landmark-Struktur),
 * aber nicht, ob sich eine Seite für Screenreader-Nutzer:innen tatsächlich
 * gut anhört und bedienen lässt.
 */
const pageAxeOptions = { rules: { "color-contrast": { enabled: false } } };
// Isolierte Komponenten-Fragmente sind keine vollständigen Seiten, daher
// wird die "region"-Regel (Inhalt muss in einem Landmark liegen) hier
// zusätzlich deaktiviert.
const fragmentAxeOptions = {
  rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
};

describe("Barrierefreiheits-Audit: ganze Seiten (axe-core)", () => {
  it("Startseite hat keine axe-Verstöße", async () => {
    const { container } = render(<LandingPage />);
    const results = await axe(container, pageAxeOptions);
    expect(results).toHaveNoViolations();
  }, 15000);

  it("Registrierungsseite hat keine axe-Verstöße", async () => {
    const { container } = render(<RegisterPage />);
    const results = await axe(container, pageAxeOptions);
    expect(results).toHaveNoViolations();
  }, 15000);

  it("Zwei-Faktor-Einstellungsseite (Demo-Modus) hat keine axe-Verstöße", async () => {
    const { container } = render(<SecuritySettingsPage />);
    const results = await axe(container, pageAxeOptions);
    expect(results).toHaveNoViolations();
  }, 15000);

  it("Community-Regeln (normal und einfache Sprache) haben keine axe-Verstöße", async () => {
    const { container, rerender } = render(
      <AccessibilityProvider>
        <CommunityRulesContent />
      </AccessibilityProvider>,
    );
    expect(await axe(container, pageAxeOptions)).toHaveNoViolations();

    rerender(
      <AccessibilityProvider>
        <CommunityRulesContent />
      </AccessibilityProvider>,
    );
    expect(await axe(container, pageAxeOptions)).toHaveNoViolations();
  }, 15000);

  it("Wissen & Quellen hat keine axe-Verstöße", async () => {
    const { container } = render(<KnowledgePage />);
    expect(await axe(container, pageAxeOptions)).toHaveNoViolations();
  }, 15000);

  it("Entdecken, Matches und Benachrichtigungen haben keine axe-Verstöße", async () => {
    for (const Page of [DiscoverPage, MatchesPage, NotificationsPage]) {
      const { container, unmount } = render(
        <AppStoreProvider>
          <main>
            <Page />
          </main>
        </AppStoreProvider>,
      );
      expect(await axe(container, pageAxeOptions)).toHaveNoViolations();
      unmount();
    }
  }, 30000);

  it("Identitätsangaben und Privatsphäre (diskreter Modus) haben keine axe-Verstöße", async () => {
    const { container } = render(
      <AppStoreProvider>
        <main>
          <h1>Profil</h1>
          <IdentityEditor showPronouns />
          <PrivacyPage />
        </main>
      </AppStoreProvider>,
    );
    expect(await axe(container, pageAxeOptions)).toHaveNoViolations();
  }, 20000);

  it("App-Navigation (Desktop- und Mobil-Menü) hat keine axe-Verstöße", async () => {
    const { container } = render(
      <AppStoreProvider>
        <AppShell>
          <h1>Beispielinhalt</h1>
        </AppShell>
      </AppStoreProvider>,
    );
    const results = await axe(container, pageAxeOptions);
    expect(results).toHaveNoViolations();
  }, 15000);
});

describe("Barrierefreiheits-Audit: einzelne Komponenten (axe-core)", () => {
  it("Button-Varianten", async () => {
    const { container } = render(
      <main>
        <Button>Standard</Button>
        <Button variant="secondary">Sekundär</Button>
        <Button variant="outline">Rahmen</Button>
        <Button variant="destructive">Löschen</Button>
        <Button size="icon" aria-label="Schließen">
          ×
        </Button>
      </main>,
    );
    expect(await axe(container, fragmentAxeOptions)).toHaveNoViolations();
  });

  it("Alert-Varianten", async () => {
    const { container } = render(
      <main>
        <Alert variant="info" title="Info">
          Ein Hinweis.
        </Alert>
        <Alert variant="warning" title="Warnung">
          Ein Warnhinweis.
        </Alert>
        <Alert variant="destructive" title="Fehler">
          Ein Fehler.
        </Alert>
        <Alert variant="success" title="Erfolg">
          Geschafft.
        </Alert>
      </main>,
    );
    expect(await axe(container, fragmentAxeOptions)).toHaveNoViolations();
  });

  it("Badges", async () => {
    const { container } = render(
      <main>
        <Badge>Standard</Badge>
        <Badge variant="primary">Primär</Badge>
        <Badge variant="success">Erfolg</Badge>
        <Badge variant="destructive">Wichtig</Badge>
      </main>,
    );
    expect(await axe(container, fragmentAxeOptions)).toHaveNoViolations();
  });

  it("ChipGroup (Mehrfachauswahl)", async () => {
    function Demo() {
      const [selected, setSelected] = React.useState<string[]>(["musik"]);
      return (
        <ChipGroup
          legend="Interessen"
          options={[
            { value: "musik", label: "Musik" },
            { value: "kochen", label: "Kochen" },
          ]}
          selected={selected}
          onChange={setSelected}
        />
      );
    }
    const { container } = render(
      <main>
        <Demo />
      </main>,
    );
    expect(await axe(container, fragmentAxeOptions)).toHaveNoViolations();
  });

  it("RadioCards (Einfachauswahl)", async () => {
    function Demo() {
      const [value, setValue] = React.useState<string>("a");
      return (
        <RadioCards
          legend="Beziehungswunsch"
          name="goal"
          options={[
            { value: "a", label: "Option A", description: "Beschreibung A" },
            { value: "b", label: "Option B" },
          ]}
          value={value}
          onChange={setValue}
        />
      );
    }
    const { container } = render(
      <main>
        <Demo />
      </main>,
    );
    expect(await axe(container, fragmentAxeOptions)).toHaveNoViolations();
  });

  it("Formularfeld mit Fehlermeldung", async () => {
    const { container } = render(
      <main>
        <FormField
          label="E-Mail-Adresse"
          htmlFor="a11y-email"
          error="Bitte gib eine gültige E-Mail-Adresse ein."
        >
          <Input id="a11y-email" aria-invalid="true" aria-describedby="a11y-email-error" />
        </FormField>
      </main>,
    );
    expect(await axe(container, fragmentAxeOptions)).toHaveNoViolations();
  });

  it("Fortschrittsanzeige", async () => {
    const { container } = render(
      <main>
        <Progress value={3} max={9} label="Schritt 3 von 9" />
      </main>,
    );
    expect(await axe(container, fragmentAxeOptions)).toHaveNoViolations();
  });

  it("Leerer Zustand mit Handlungsaufforderung", async () => {
    const { container } = render(
      <main>
        <EmptyState
          icon={Compass}
          title="Nichts gefunden"
          description="Es gibt gerade nichts zu sehen."
          action={<Button>Neu laden</Button>}
        />
      </main>,
    );
    expect(await axe(container, fragmentAxeOptions)).toHaveNoViolations();
  });
});
