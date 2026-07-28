"use client";

import Link from "next/link";
import { useAccessibility } from "@/components/a11y/accessibility-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

const RULES = [
  {
    title: "Respekt ist die Grundlage",
    items: [
      "Keine Beleidigungen, Abwertungen oder Demütigungen.",
      "Kein Ableismus: Behinderung oder Neurodivergenz sind nie ein Makel und kein Thema für Witze auf Kosten anderer.",
      "Keine Diskriminierung — egal ob wegen Behinderung, Geschlecht, Orientierung, Herkunft, Religion oder Aussehen.",
    ],
  },
  {
    title: "Grenzen gelten",
    items: [
      "Keine sexuelle Belästigung. Kein ungefragtes Zusenden intimer Inhalte.",
      "Keine Fetischisierung von Behinderungen. Menschen sind keine Kategorie.",
      "Kein Stalking: Wenn jemand nicht mehr antwortet oder blockiert, ist das zu respektieren.",
      "Kein Druck, eine Diagnose oder medizinische Details offenzulegen. Was jemand teilt, entscheidet nur diese Person.",
      "Keine ungefragten medizinischen Ratschläge oder Heilungstipps.",
    ],
  },
  {
    title: "Ehrlichkeit schützt alle",
    items: [
      "Keine Fake-Profile, keine fremden Fotos, keine falschen Identitäten.",
      "Keine Manipulation, kein emotionaler Druck, keine Spielchen.",
      "Kein Betrug: Wer um Geld, Gutscheine oder Überweisungen bittet, fliegt raus.",
    ],
  },
  {
    title: "Konsequenzen",
    items: [
      "Verstöße führen je nach Schwere zu Verwarnung, vorübergehender oder dauerhafter Sperre.",
      "Meldungen werden vertraulich geprüft. Die gemeldete Person erfährt nicht, wer gemeldet hat.",
      "Gegen Entscheidungen kann Einspruch eingelegt werden (in Vorbereitung).",
    ],
  },
];

/**
 * Vereinfachte Fassung: kurze Sätze, eine Aussage pro Satz, aktive statt
 * passive Formulierungen. Eine Annäherung an Leichte Sprache, aber keine
 * geprüfte Übersetzung nach dem Regelwerk des Netzwerks Leichte Sprache.
 */
const SIMPLE_RULES = [
  {
    title: "Sei respektvoll",
    items: [
      "Beleidige niemanden.",
      "Werte niemanden ab.",
      "Eine Behinderung ist kein Fehler. Mach keine Witze darüber.",
      "Diskriminiere niemanden. Zum Beispiel nicht wegen Behinderung, Geschlecht, Herkunft oder Religion.",
    ],
  },
  {
    title: "Halte Grenzen ein",
    items: [
      "Belästige niemanden sexuell.",
      "Schicke keine intimen Bilder ohne Nachfrage.",
      "Reduziere niemanden auf seine Behinderung.",
      "Wenn jemand nicht mehr antwortet: Lass die Person in Ruhe.",
      "Wenn jemand dich blockiert: Akzeptiere das.",
      "Zwinge niemanden, eine Diagnose zu erzählen.",
      "Gib keine ungefragten medizinischen Tipps.",
    ],
  },
  {
    title: "Sei ehrlich",
    items: [
      "Nutze nur echte Fotos von dir.",
      "Gib dich nicht als andere Person aus.",
      "Manipuliere niemanden.",
      "Setze niemanden unter Druck.",
      "Bitte niemanden um Geld. Das ist verboten.",
    ],
  },
  {
    title: "Was bei einem Verstoß passiert",
    items: [
      "Wir prüfen jede Meldung.",
      "Bei einem Verstoß gibt es eine Verwarnung oder eine Sperre.",
      "Meldungen sind geheim. Die gemeldete Person erfährt nicht, wer sie gemeldet hat.",
      "Du kannst gegen eine Sperre Einspruch einlegen. Diese Funktion bauen wir gerade.",
    ],
  },
];

export function CommunityRulesContent() {
  const { settings } = useAccessibility();
  const rules = settings.simpleLanguage ? SIMPLE_RULES : RULES;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Community-Regeln</h1>
      <p className="text-muted-foreground">
        {settings.simpleLanguage
          ? "EchtNah soll ein sicherer Ort sein. Alle sollen sich hier wohlfühlen. Wenn du dich registrierst, akzeptierst du diese Regeln."
          : "EchtNah soll ein Ort sein, an dem sich alle sicher und respektiert fühlen. Mit deiner Registrierung stimmst du diesen Regeln zu."}
      </p>

      {settings.simpleLanguage ? (
        <Alert variant="info">
          Du siehst gerade die Regeln in einfacher Sprache.{" "}
          <Link href="/einstellungen/barrierefreiheit" className="underline">
            Zur normalen Sprache wechseln
          </Link>
        </Alert>
      ) : (
        <Alert variant="info">
          Diese Regeln gibt es auch in einfacher Sprache.{" "}
          <Link href="/einstellungen/barrierefreiheit" className="underline">
            Einfache Sprache einschalten
          </Link>
        </Alert>
      )}

      {rules.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
