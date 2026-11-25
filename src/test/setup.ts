import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// Automatisierte Barrierefreiheits-Prüfung (axe-core) als expect()-Matcher.
// Ersetzt keinen Test mit echtem Screenreader, findet aber verlässlich
// strukturelle Probleme (fehlende Labels, falsche ARIA-Attribute, Kontrast).
expect.extend(toHaveNoViolations);

// jsdom kennt matchMedia nicht — für den AccessibilityProvider nachrüsten.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
