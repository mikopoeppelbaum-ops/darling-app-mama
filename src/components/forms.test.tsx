import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/registrieren/page";
import { AppShell } from "@/components/layout/app-shell";
import { AppStoreProvider } from "@/lib/store";
import { ChipGroup } from "@/components/ui/chip-group";
import * as React from "react";

// next/navigation im Test ersetzen
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/entdecken",
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Registrierungsformular", () => {
  it("zeigt verständliche Fehlermeldungen bei leerem Absenden", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.click(screen.getByRole("button", { name: /konto erstellen/i }));
    expect(await screen.findByText(/E-Mail-Adresse ein/)).toBeInTheDocument();
    // Fehlermeldungen stehen in role="alert"-Elementen (Screenreader-freundlich).
    const alerts = await screen.findAllByRole("alert");
    const alertText = alerts.map((a) => a.textContent).join(" ");
    expect(alertText).toMatch(/mindestens 10 Zeichen/i);
    expect(alertText).toMatch(/Datenschutzerklärung/i);
  });

  it("lehnt Minderjährige mit klarer Meldung ab", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    const sixteenYearsAgo = new Date();
    sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
    await user.type(
      screen.getByLabelText(/geburtsdatum/i),
      sixteenYearsAgo.toISOString().slice(0, 10),
    );
    await user.click(screen.getByRole("button", { name: /konto erstellen/i }));
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.map((a) => a.textContent).join(" ")).toMatch(/noch nicht registrieren/);
  });

  it("ist vollständig per Tastatur bedienbar", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    const email = screen.getByLabelText(/e-mail-adresse/i);
    email.focus();
    await user.keyboard("test@example.com");
    await user.tab(); // → Passwort
    expect(screen.getByLabelText(/^passwort$/i)).toHaveFocus();
    await user.tab(); // → Passwort wiederholen
    expect(screen.getByLabelText(/passwort wiederholen/i)).toHaveFocus();
  });
});

describe("Hauptnavigation", () => {
  it("hat benannte Navigationsbereiche und aria-current", () => {
    render(
      <AppStoreProvider>
        <AppShell>
          <p>Inhalt</p>
        </AppShell>
      </AppStoreProvider>,
    );
    expect(screen.getByRole("navigation", { name: "Hauptnavigation" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /mobil/ })).toBeInTheDocument();
    const active = screen
      .getAllByRole("link", { name: /entdecken/i })
      .filter((el) => el.getAttribute("aria-current") === "page");
    expect(active.length).toBeGreaterThan(0);
  });
});

describe("ChipGroup (Mehrfachauswahl)", () => {
  function Wrapper() {
    const [selected, setSelected] = React.useState<string[]>([]);
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

  it("lässt sich per Tastatur bedienen (Space wählt aus)", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    const musik = screen.getByRole("checkbox", { name: "Musik" });
    musik.focus();
    await user.keyboard(" ");
    expect(musik).toBeChecked();
    await user.keyboard(" ");
    expect(musik).not.toBeChecked();
  });
});
