import Link from "next/link";
import {
  Accessibility,
  Brain,
  Calendar,
  Eye,
  HandHeart,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Matching mit Tiefe",
    text: "Wir zeigen dir verständlich, warum ihr zusammenpassen könntet: gemeinsame Werte, ähnliche Kommunikationswünsche, gleiches Tempo. Keine erfundenen Prozentwerte, keine Foto-Lotterie.",
  },
  {
    icon: HandHeart,
    title: "Freiwillige Angaben",
    text: "Ob du eine Behinderung, ADHS oder Neurodivergenz erwähnst, entscheidest nur du — für jede Angabe einzeln: sofort sichtbar, erst nach einem Match oder gar nicht. Eine Diagnose ist nie verpflichtend.",
  },
  {
    icon: MessageCircle,
    title: "Kommunikation, die passt",
    text: "Sag, wie du am liebsten kommunizierst: schriftlich, per Sprachnachricht, ausführlich oder kurz. Der Status „Meine Antwort kann etwas dauern“ nimmt den Druck raus.",
  },
  {
    icon: Accessibility,
    title: "Barrierearm von Grund auf",
    text: "Tastaturbedienung, Screenreader-Unterstützung, einstellbare Schriftgröße, hoher Kontrast, Dark Mode und eine reduzierte Ansicht für reizarme Momente — alles kostenlos, für immer.",
  },
  {
    icon: Brain,
    title: "ADHS-freundlich",
    text: "Nachrichten als „Später beantworten“ markieren, Erinnerungen in deinem Rhythmus, automatische Entwürfe, Fokusmodus und ein Onboarding in kurzen Etappen. Keine manipulativen Belohnungen, kein endloses Scrollen.",
  },
  {
    icon: Calendar,
    title: "Date-Planer mit Rücksicht",
    text: "Plant Treffen mit Zeit, Dauer, Ort und Barrierefreiheits-Anforderungen. Mit Check-in, Sicherheitskontakt und vorformulierten, freundlichen Absagen — Absagen ist immer okay.",
  },
] as const;

const FAQ = [
  {
    q: "Muss ich meine Diagnose angeben?",
    a: "Nein, niemals. Alle Angaben zu Behinderung, Erkrankung oder Neurodivergenz sind freiwillig. Du bestimmst für jede Angabe einzeln, wer sie sieht — und kannst das jederzeit ändern.",
  },
  {
    q: "Ist EchtNah nur für Menschen mit Behinderungen?",
    a: "EchtNah ist für alle, die wertschätzendes Kennenlernen suchen. Die App ist so gebaut, dass Barrierefreiheit und unterschiedliche Kommunikationsbedürfnisse selbstverständlich sind — nicht die Ausnahme.",
  },
  {
    q: "Was kostet EchtNah?",
    a: "Profil, Matches, Chat und grundlegende Filter sind kostenlos. Später kommen optionale Premium-Funktionen dazu. Versprochen: Sicherheits- und Barrierefreiheitsfunktionen kosten niemals etwas.",
  },
  {
    q: "Wie schützt ihr meine Daten?",
    a: "Wir speichern nur, was nötig ist. Dein genauer Standort wird nie gespeichert, dein Geburtsdatum nie angezeigt. Sensible Angaben sind besonders geschützt und du kannst alle Daten jederzeit herunterladen oder löschen.",
  },
  {
    q: "Was passiert bei respektlosem Verhalten?",
    a: "Melden geht überall mit zwei Klicks und ist vertraulich. Unser Moderationsteam prüft jede Meldung. Ableismus, Fetischisierung und Grenzverletzungen führen zu Verwarnung oder Sperre.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
          <p className="text-xl font-bold text-primary">EchtNah</p>
          <nav aria-label="Startseiten-Navigation" className="flex items-center gap-2">
            <Link href="/anmelden" className={buttonVariants({ variant: "ghost" })}>
              Anmelden
            </Link>
            <Link href="/registrieren" className={buttonVariants()}>
              Kostenlos registrieren
            </Link>
          </nav>
        </div>
      </header>

      <main id="hauptinhalt" className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
          <h1 className="text-4xl font-bold text-balance md:text-5xl">
            Dating, das dich als ganzen Menschen sieht.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Lerne Menschen kennen, die zu deinem Alltag, deinen Werten und deiner Art zu
            kommunizieren passen. Für Menschen mit und ohne Behinderungen, mit ADHS, neurodivergent
            oder einfach auf der Suche nach echter Nähe.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/registrieren" className={buttonVariants({ size: "lg" })}>
              Jetzt kostenlos starten
            </Link>
            <Link href="/entdecken" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Demo ansehen
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Ab 18 Jahren. Kostenlos im Basis-Umfang.
          </p>
        </section>

        {/* Funktionsweise */}
        <section aria-labelledby="how-heading" className="border-t border-border bg-card py-14">
          <div className="mx-auto max-w-5xl px-4">
            <h2 id="how-heading" className="text-center text-3xl font-bold">
              So funktioniert EchtNah
            </h2>
            <ol className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Erzähl von dir",
                  text: "In kurzen, freiwilligen Schritten — in deinem Tempo, mit Pausen.",
                },
                {
                  step: "2",
                  title: "Entdecke Menschen",
                  text: "Mit nachvollziehbaren Gemeinsamkeiten statt reiner Foto-Auswahl.",
                },
                {
                  step: "3",
                  title: "Lernt euch kennen",
                  text: "Chat ohne Druck, Date-Planung mit Rücksicht auf eure Bedürfnisse.",
                },
              ].map((s) => (
                <li key={s.step} className="text-center">
                  <p
                    aria-hidden="true"
                    className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
                  >
                    {s.step}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section aria-labelledby="features-heading" className="py-14">
          <div className="mx-auto max-w-5xl px-4">
            <h2 id="features-heading" className="text-center text-3xl font-bold">
              Gebaut für echte Menschen mit echtem Alltag
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <Card key={f.title}>
                  <CardHeader className="pb-2">
                    <CardTitle as="h3" className="flex items-center gap-2 text-base">
                      <f.icon aria-hidden="true" className="size-5 text-primary" />
                      {f.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sicherheit */}
        <section aria-labelledby="safety-heading" className="border-t border-border bg-card py-14">
          <div className="mx-auto max-w-3xl px-4">
            <h2
              id="safety-heading"
              className="flex items-center justify-center gap-2 text-center text-3xl font-bold"
            >
              <ShieldCheck aria-hidden="true" className="size-8 text-primary" />
              Sicherheit zuerst
            </h2>
            <ul className="mt-6 grid gap-3 text-lg sm:grid-cols-2">
              <li>Blockieren und Melden mit zwei Klicks</li>
              <li>Automatische Warnung bei Geldforderungen und Links</li>
              <li>Kein exakter Standort — niemals</li>
              <li>Sicherheitskontakt und Check-in für Dates</li>
              <li>Klare Community-Regeln gegen Ableismus</li>
              <li>Aktive Moderation aller Meldungen</li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="py-14">
          <div className="mx-auto max-w-3xl px-4">
            <h2 id="faq-heading" className="text-center text-3xl font-bold">
              Häufige Fragen
            </h2>
            <div className="mt-8 space-y-3">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-lg border border-border bg-card p-4">
                  <summary className="cursor-pointer text-lg font-semibold">{item.q}</summary>
                  <p className="mt-2 text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Registrierung CTA */}
        <section className="border-t border-border bg-card py-14 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="flex items-center justify-center gap-2 text-3xl font-bold">
              <HeartHandshake aria-hidden="true" className="size-8 text-primary" />
              Bereit für echte Nähe?
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Registrieren dauert zwei Minuten. Alles Weitere machst du in deinem Tempo.
            </p>
            <Link href="/registrieren" className={`${buttonVariants({ size: "lg" })} mt-6`}>
              Kostenlos registrieren
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-2 px-4 text-sm text-muted-foreground">
          <Link href="/community-regeln" className="hover:underline">
            Community-Regeln
          </Link>
          <Link href="/hilfe-sicherheit" className="hover:underline">
            Hilfe & Sicherheit
          </Link>
          <span aria-hidden="true">·</span>
          <span>
            <Eye aria-hidden="true" className="mr-1 inline size-4" />
            Demo-Version — alle Profile sind fiktiv
          </span>
        </div>
      </footer>
    </div>
  );
}
