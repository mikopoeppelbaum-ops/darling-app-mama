import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Community-Regeln" };

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

export default function CommunityRulesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Community-Regeln</h1>
      <p className="text-muted-foreground">
        EchtNah soll ein Ort sein, an dem sich alle sicher und respektiert fühlen. Mit deiner
        Registrierung stimmst du diesen Regeln zu.
      </p>
      {RULES.map((section) => (
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
