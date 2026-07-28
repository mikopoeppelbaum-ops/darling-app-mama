"use client";

import * as React from "react";

export type FontSize = "normal" | "large" | "xlarge";
export type ThemeSetting = "system" | "light" | "dark";

export interface AccessibilitySettings {
  fontSize: FontSize;
  theme: ThemeSetting;
  highContrast: boolean;
  /** Reduzierte Ansicht: keine Animationen, weniger gleichzeitige Reize. */
  reducedView: boolean;
  /**
   * Kürzere Sätze und einfachere Wörter auf zentralen Seiten. Eine Annäherung
   * an Leichte Sprache — keine geprüfte Übersetzung nach dem Regelwerk des
   * Netzwerks Leichte Sprache (das verlangt eine Prüfung durch eine
   * Prüfgruppe aus der Zielgruppe selbst, die wir hier nicht leisten können).
   */
  simpleLanguage: boolean;
}

const DEFAULTS: AccessibilitySettings = {
  fontSize: "normal",
  theme: "system",
  highContrast: false,
  reducedView: false,
  simpleLanguage: false,
};

const STORAGE_KEY = "echtnah.accessibility";

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  update: (patch: Partial<AccessibilitySettings>) => void;
}

const AccessibilityContext = React.createContext<AccessibilityContextValue>({
  settings: DEFAULTS,
  update: () => {},
});

function applyToDocument(settings: AccessibilitySettings) {
  const root = document.documentElement;
  root.dataset.fontSize = settings.fontSize;
  root.dataset.contrast = settings.highContrast ? "high" : "normal";
  root.dataset.reduced = settings.reducedView ? "true" : "false";
  root.dataset.simpleLanguage = settings.simpleLanguage ? "true" : "false";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = settings.theme === "dark" || (settings.theme === "system" && prefersDark);
  root.classList.toggle("dark", dark);
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<AccessibilitySettings>(DEFAULTS);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<AccessibilitySettings>) });
    } catch {
      // Beschädigte Einstellungen ignorieren und Standardwerte verwenden.
    }
  }, []);

  React.useEffect(() => {
    applyToDocument(settings);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyToDocument(settings);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [settings]);

  const update = React.useCallback((patch: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Speichern ist optional; Anzeige funktioniert trotzdem.
      }
      return next;
    });
  }, []);

  const value = React.useMemo(() => ({ settings, update }), [settings, update]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  return React.useContext(AccessibilityContext);
}

/**
 * Inline-Skript für das Root-Layout: wendet gespeicherte Einstellungen an,
 * bevor die Seite rendert (verhindert Aufblitzen des falschen Themes).
 */
export const accessibilityInitScript = `
(function () {
  try {
    var s = JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}) || "{}");
    var root = document.documentElement;
    root.dataset.fontSize = s.fontSize || "normal";
    root.dataset.contrast = s.highContrast ? "high" : "normal";
    root.dataset.reduced = s.reducedView ? "true" : "false";
    root.dataset.simpleLanguage = s.simpleLanguage ? "true" : "false";
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (s.theme === "dark" || ((!s.theme || s.theme === "system") && prefersDark)) {
      root.classList.add("dark");
    }
  } catch (e) {}
})();
`;
