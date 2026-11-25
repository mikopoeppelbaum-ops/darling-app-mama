import type { Metadata } from "next";
import { BookOpen, ExternalLink, FlaskConical, Scale, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Wissen & Quellen" };

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 underline underline-offset-4"
    >
      {children}
      <ExternalLink aria-hidden="true" className="size-3.5" />
      <span className="sr-only">(öffnet in neuem Tab)</span>
    </a>
  );
}

const NUMBERS = [
  {
    value: "12 %",
    text: "der Menschen in Deutschland beschreiben sich als lesbisch, schwul, bisexuell, trans, nicht-binär, pansexuell oder asexuell (Online-Befragung).",
    source: {
      label: "Ipsos LGBT+ Pride Report 2025",
      href: "https://www.csdmuenchen.de/files/presse_downloads/Ipsos-PM_LGBT-Pride_2025-06-10.pdf",
    },
  },
  {
    value: "57 %",
    text: "der LGBTIQ-Befragten in Deutschland wurden im Jahr vor der Befragung belästigt (EU-Durchschnitt 54 %); 21 % meiden oft oder immer bestimmte Orte aus Angst vor Übergriffen.",
    source: {
      label: "EU-Grundrechteagentur, LGBTIQ-Survey III (2024), Länderblatt Deutschland",
      href: "https://fra.europa.eu/sites/default/files/fra_uploads/lgbtiq_survey-2024-country_sheet-germany.pdf",
    },
  },
  {
    value: "7,9 Millionen",
    text: "Menschen mit anerkannter Schwerbehinderung in Deutschland (Ende 2023), rund 9,3 % der Bevölkerung. Viele Behinderungen — etwa psychische Erkrankungen oder Neurodivergenz ohne Schwerbehindertenausweis — sind darin gar nicht erfasst.",
    source: {
      label: "Destatis",
      href: "https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Gesundheit/Behinderte-Menschen/_inhalt.html",
    },
  },
  {
    value: "2,58 % / 6,76 %",
    text: "der Erwachsenen weltweit haben eine seit der Kindheit bestehende ADHS bzw. ADHS-Symptome (Meta-Analyse, Stand 2020).",
    source: {
      label: "Song et al., J Glob Health 2021",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7916320",
    },
  },
  {
    value: "≈ 1 von 127",
    text: "Menschen ist laut Schätzung für 2021 autistisch. Die WHO weist darauf hin, dass Zahlen je nach Studie stark schwanken.",
    source: {
      label: "WHO-Faktenblatt Autismus",
      href: "https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders",
    },
  },
  {
    value: "88 %",
    text: "von 1.155 Dating-App-Nutzenden mit Behinderung berichteten in einer australischen Befragung von digital vermittelter sexueller Belästigung oder Gewalt.",
    source: {
      label: "Australian Institute of Criminology 2024",
      href: "https://aic.gov.au/publications/tandi/tandi695",
    },
  },
] as const;

const FEATURE_BASIS = [
  {
    feature: "Diskreter Modus gegen ungewolltes Outing",
    basis:
      "Gefälschte Profile, mit denen queere Menschen gezielt aufgespürt werden, sind dokumentiert. Deshalb kann das eigene Profil auf Menschen beschränkt werden, die zur eigenen Suche passen — kostenlos.",
    source: {
      label: "ARTICLE 19, Apps, arrests and abuse (2018)",
      href: "https://article19.org/resources/apps-traps-dating-apps-must-protect-communities-middle-east-north-africa",
    },
  },
  {
    feature: "Trans Frauen sind Frauen, trans Männer sind Männer",
    basis:
      "Wer „Frauen“ sucht, findet auch trans Frauen; wer „Männer“ sucht, auch trans Männer. Wer ausdrücklich nur nach „trans Frau“ sucht, kann das ebenfalls wählen. Geschlecht ist Selbstbeschreibung, wie es auch das Selbstbestimmungsgesetz vorsieht.",
    source: {
      label: "Bundesregierung zum Selbstbestimmungsgesetz",
      href: "https://www.bundesregierung.de/breg-de/aktuelles/selbstbestimmungsgesetz-2215426",
    },
  },
  {
    feature: "Tägliche Auswahl statt endlosem Wischen",
    basis:
      "Wer aus 24 statt 6 Profilen wählte, war eine Woche später unzufriedener mit der Wahl und schrieb weniger sorgfältige Nachrichten („Choice Overload“).",
    source: {
      label: "D'Angelo & Toma, Media Psychology",
      href: "https://news.wisc.edu/online-dating-study-shows-too-many-choices-can-lead-to-dissatisfaction",
    },
  },
  {
    feature: "Kommunikationsstil-Matching statt „Defizit“-Logik",
    basis:
      "Das Double-Empathy-Problem: Missverständnisse zwischen autistischen und nicht-autistischen Menschen entstehen auf beiden Seiten.",
    source: {
      label: "Milton 2012; Milton et al. 2022",
      href: "https://journals.sagepub.com/doi/10.1177/13623613221129123",
    },
  },
  {
    feature: "Tone-Tags im Chat (/j, /s, /gen …)",
    basis:
      "In einer Studie mit 18 Gesprächspaaren senkten Tone-Tags die kognitive Belastung beim Deuten des Tons.",
    source: {
      label: "Tone Indicators, CSCW 2025",
      href: "https://jeffhuang.com/papers/ToneIndicators_CSCW25.pdf",
    },
  },
  {
    feature: "Reizempfindlichkeiten in vier Mustern",
    basis:
      "Dunns Modell der sensorischen Verarbeitung (Reizschwelle × Reaktionsstil), validiert bei Erwachsenen.",
    source: {
      label: "Jussila et al. 2019",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6406387/",
    },
  },
  {
    feature: "Barrierefreiheit nach ICF-Bereichen",
    basis:
      "Die ICF der WHO beschreibt Behinderung als Wechselwirkung zwischen Person und Umwelt — wir fragen deshalb, was ein Ort braucht.",
    source: {
      label: "WHO ICF",
      href: "https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health",
    },
  },
  {
    feature: "Einstellung „Mehr Textabstand“",
    basis:
      "Größerer Buchstabenabstand halbierte in einer Studie Lesefehler bei Kindern mit Legasthenie. Spätere Studien bestätigen den Effekt auf Fehler, nicht auf Lesetempo.",
    source: { label: "Zorzi et al., PNAS 2012", href: "https://pubmed.ncbi.nlm.nih.gov/22665803/" },
  },
  {
    feature: "Warnung bei Krypto- und Investment-Angeboten",
    basis:
      "Die Bundesregierung beschreibt „Romance Baiting“ (Anlagebetrug mit Liebesmasche) als eigene Variante des Love Scams. In Bayern wurden 2023 über 450 Fälle mit mehr als 5 Mio. € Schaden angezeigt.",
    source: {
      label: "Bundestag hib 727/2025",
      href: "https://www.bundestag.de/presse/hib/kurzmeldungen-1134842",
    },
  },
] as const;

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold md:text-4xl">Wissen & Quellen</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Worauf EchtNah beruht — mit Quellen, und ehrlich dazu, wo die Belege noch dünn sind.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen aria-hidden="true" className="size-5 text-primary" />
            Zahlen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {NUMBERS.map((n) => (
              <div key={n.value} className="rounded-xl bg-primary-soft p-4">
                <dt className="font-display text-3xl font-semibold">{n.value}</dt>
                <dd className="mt-2">{n.text}</dd>
                <dd className="mt-2 text-sm">
                  Quelle: <Source href={n.source.href}>{n.source.label}</Source>
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical aria-hidden="true" className="size-5 text-primary" />
            Warum die App so funktioniert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {FEATURE_BASIS.map((f) => (
              <li key={f.feature} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <h3 className="font-semibold">{f.feature}</h3>
                <p className="mt-1">{f.basis}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quelle: <Source href={f.source.href}>{f.source.label}</Source>
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TriangleAlert aria-hidden="true" className="size-5 text-primary" />
            Wo die Belege dünn sind
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Tagesform / „Löffel“:</strong> Die Spoon Theory (Christine Miserandino, 2003)
              ist ein Community-Bild, keine wissenschaftliche Messgröße. Wir nutzen sie, weil viele
              Menschen mit chronischer Erkrankung sie als hilfreich beschreiben.
            </li>
            <li>
              <strong>Zurückweisungs-Empfindlichkeit bei ADHS:</strong> Gut belegt ist eine stärkere
              Emotionsregulations-Schwierigkeit bei Erwachsenen mit ADHS (Meta-Analyse, BMC
              Psychiatry 2020). Speziell zur „Rejection Sensitivity“ gibt es bisher vor allem kleine
              qualitative Studien. Deshalb vermeiden wir Lesebestätigungs-Druck und bieten „Ich
              brauche gerade Zeit“ an — ohne medizinische Versprechen.
            </li>
            <li>
              <strong>Atkinson Hyperlegible:</strong> Die Schrift wurde mit sehbeeinträchtigten
              Menschen entwickelt; veröffentlichte Wirksamkeitsstudien fehlen bisher.
            </li>
            <li>
              <strong>Spezielle „Legasthenie-Schriften“</strong> wie OpenDyslexic zeigten in einer
              Studie keinen Vorteil (Wery & Diliberto 2017). Wir bieten stattdessen mehr Textabstand
              an.
            </li>
            <li>
              <strong>Dating-Erfahrungen autistischer Erwachsener:</strong> Die Forschung zu Risiken
              auf Dating-Apps ist neu und uneinheitlich. Sicherheitsfunktionen sind deshalb für alle
              da — niemand wird als „gefährdet“ markiert.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale aria-hidden="true" className="size-5 text-primary" />
            Rechtlicher Rahmen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>DSGVO Art. 9:</strong> Angaben zu Gesundheit, Sexualleben und sexueller
              Orientierung sind besondere Kategorien personenbezogener Daten. Gesundheitsangaben
              speichern wir nur nach ausdrücklicher Einwilligung; Orientierung und Inter*-Angabe
              haben eine eigene, einzeln einstellbare Sichtbarkeit.
            </li>
            <li>
              <strong>Selbstbestimmungsgesetz (SBGG), § 13:</strong> Seit dem 1. November 2024
              dürfen frühere Geschlechtseinträge und Vornamen ohne Zustimmung nicht offenbart werden
              (Offenbarungsverbot). Outing und die Drohung damit sind deshalb in den
              Community-Regeln ausdrücklich verboten.{" "}
              <Source href="https://www.gesetze-im-internet.de/sbgg/__13.html">§ 13 SBGG</Source>
            </li>
            <li>
              <strong>WCAG 2.2 AA:</strong> Leitlinie für Bedienbarkeit, u. a. mit sichtbarem Fokus,
              der nicht verdeckt wird, konsistenter Hilfe und ausreichend großen Bedienelementen.
            </li>
            <li>
              <strong>Barrierefreiheitsstärkungsgesetz (BFSG):</strong> Gilt seit dem 28. Juni 2025
              für viele digitale Dienstleistungen gegenüber Verbraucher:innen. Ob und wie es auf
              eine Dating-App mit Bezahlfunktionen anwendbar ist, sollte vor dem Start rechtlich
              geprüft werden.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Alert variant="info" title="Hinweis">
        Diese Seite ersetzt keine medizinische, therapeutische oder rechtliche Beratung.
      </Alert>
    </div>
  );
}
