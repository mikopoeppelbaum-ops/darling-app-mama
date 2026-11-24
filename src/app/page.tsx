import Link from "next/link";
import {
  Accessibility,
  BookOpen,
  Brain,
  CalendarCheck,
  HandHeart,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FACTS = [
  {
    value: "7,9 Mio.",
    text: "Menschen in Deutschland lebten Ende 2023 mit einer anerkannten Schwerbehinderung.",
    source: "Destatis, Statistik der schwerbehinderten Menschen",
  },
  {
    value: "≈ 1 von 127",
    text: "Menschen weltweit ist autistisch — so die aktuelle Schätzung für 2021.",
    source: "WHO / Global Burden of Disease 2021",
  },
  {
    value: "2,6 %",
    text: "der Erwachsenen weltweit haben eine seit der Kindheit bestehende ADHS, mit Symptomen sogar 6,8 %.",
    source: "Song et al., Journal of Global Health 2021",
  },
  {
    value: "88 %",
    text: "der Dating-App-Nutzenden mit Behinderung erlebten in einer großen Befragung digitale Belästigung oder Übergriffe.",
    source: "Australian Institute of Criminology 2024",
  },
] as const;

const FEATURES = [
  {
    icon: Sun,
    title: "Eine ruhige Auswahl am Tag",
    text: "Statt endlosem Wischen schlagen wir dir täglich wenige, passende Menschen vor. Studien zeigen: Wer aus sehr vielen Profilen wählt, ist mit der Wahl später unzufriedener.",
  },
  {
    icon: Sparkles,
    title: "Gemeinsamkeiten statt Prozentwerte",
    text: "Wir zeigen in klaren Sätzen, was ihr teilt — Werte, Tempo, Kommunikationsstil. Keine erfundenen Kompatibilitäts-Scores, keine Foto-Lotterie.",
  },
  {
    icon: HandHeart,
    title: "Du entscheidest, was du teilst",
    text: "Angaben zu Behinderung, Erkrankung oder Neurodivergenz sind freiwillig — für jede einzeln: sofort sichtbar, erst nach einem Match oder gar nicht. Und du legst fest, ob Fragen dazu willkommen sind.",
  },
  {
    icon: MessageCircle,
    title: "Kommunikation ohne Rätselraten",
    text: "Tone-Tags wie „/j“ (Spaß) oder „/gen“ (ernst gemeinte Frage) mit deutscher Erklärung. Eine Studie zeigt: Sie senken die Anstrengung beim Deuten von Nachrichten.",
  },
  {
    icon: Brain,
    title: "ADHS-freundlich im Alltag",
    text: "„Später beantworten“ mit Erinnerung, gespeicherte Entwürfe, Fokusmodus, gebündelte Benachrichtigungen und der Status „Meine Antwort kann dauern“.",
  },
  {
    icon: CalendarCheck,
    title: "Treffen, die für euch beide passen",
    text: "Der Date-Planer legt eure Barrierefreiheits- und Reizbedürfnisse zusammen, verlinkt zur Wheelmap und hilft mit Pausenzeichen, Sicherheitskontakt und Check-in.",
  },
] as const;

const FAQ = [
  {
    q: "Muss ich eine Diagnose angeben?",
    a: "Nein, niemals. Alle Angaben zu Behinderung, Erkrankung oder Neurodivergenz sind freiwillig. Bevor du so etwas speicherst, fragen wir ausdrücklich nach deiner Einwilligung, wie es die DSGVO für Gesundheitsdaten verlangt.",
  },
  {
    q: "Ist EchtNah nur für Menschen mit Behinderungen?",
    a: "EchtNah ist für alle, die wertschätzendes Kennenlernen suchen. Die App ist so gebaut, dass Barrierefreiheit und verschiedene Arten zu kommunizieren selbstverständlich sind — nicht die Ausnahme.",
  },
  {
    q: "Warum sehe ich nur wenige Profile pro Tag?",
    a: "Weil weniger oft besser ist. Forschung zu „Choice Overload“ beim Online-Dating zeigt, dass eine sehr große Auswahl zu weniger Zufriedenheit und oberflächlicheren Nachrichten führt. Eine ruhige Auswahl schützt außerdem vor Reizüberflutung.",
  },
  {
    q: "Was kostet EchtNah?",
    a: "Profil, Matches, Chat und grundlegende Filter sind kostenlos. Sicherheits- und Barrierefreiheitsfunktionen kosten niemals etwas.",
  },
  {
    q: "Wie schützt ihr meine Daten?",
    a: "Wir speichern nur, was nötig ist. Dein genauer Standort wird nie gespeichert, dein Geburtsdatum nie angezeigt. Du kannst alle Daten jederzeit herunterladen oder löschen.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground"
            >
              e
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">EchtNah</span>
          </span>
          <nav aria-label="Startseiten-Navigation" className="flex items-center gap-2">
            <Link href="/wissen" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
              Wissen
            </Link>
            <Link href="/anmelden" className={buttonVariants({ variant: "ghost" })}>
              Anmelden
            </Link>
            <Link href="/registrieren" className={buttonVariants()}>
              Registrieren
            </Link>
          </nav>
        </div>
      </header>

      <main id="hauptinhalt" className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.15fr_1fr] md:py-24">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold">
              Barrierearm · ADHS-freundlich · ohne Druck
            </p>
            <h1 className="text-4xl leading-tight font-semibold text-balance md:text-6xl">
              Dating, das dich als ganzen Menschen sieht.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Lerne Menschen kennen, die zu deinem Alltag, deinen Werten und deiner Art zu
              kommunizieren passen. Für Menschen mit und ohne Behinderungen, mit ADHS,
              neurodivergent — oder einfach auf der Suche nach echter Nähe.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/registrieren" className={buttonVariants({ size: "lg" })}>
                Kostenlos starten
              </Link>
              <Link href="/entdecken" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                Demo ansehen
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Ab 18 Jahren. Sicherheits- und Barrierefreiheitsfunktionen sind immer kostenlos.
            </p>
          </div>

          {/* Beispiel-Profilkarte: zeigt, dass Persönlichkeit vor Fotos kommt */}
          <figure className="rounded-xl border border-border bg-card p-6" aria-labelledby="beispiel-caption">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex size-16 items-center justify-center rounded-full bg-primary-soft font-display text-2xl"
              >
                M
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">Mara, 34</p>
                <p className="text-muted-foreground">sie/ihr · Köln (ungefähr)</p>
              </div>
            </div>
            <p className="mt-4">
              Illustratorin mit Vorliebe für Museen, Pflanzen und lange Gespräche über Bücher.
            </p>
            <div className="mt-4 rounded-xl bg-primary-soft p-4">
              <p className="font-semibold">Warum ihr zusammenpassen könntet</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Ihr sucht beide eine langfristige Beziehung.</li>
                <li>Ihr plant Verabredungen gerne frühzeitig.</li>
                <li>Euch beiden ist wichtig: Ehrlichkeit, Geduld.</li>
              </ul>
            </div>
            <figcaption id="beispiel-caption" className="mt-3 text-sm text-muted-foreground">
              Beispiel einer Profilkarte (fiktive Person)
            </figcaption>
          </figure>
        </section>

        {/* Fakten */}
        <section aria-labelledby="facts-heading" className="border-y border-border bg-card py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="facts-heading" className="text-3xl font-semibold md:text-4xl">
              Warum es EchtNah braucht
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Viele Menschen, wenig passende Angebote — und mehr Risiken auf gewöhnlichen
              Dating-Apps. Jede Zahl mit Quelle.
            </p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FACTS.map((f) => (
                <div key={f.value} className="rounded-xl border border-border bg-background p-5">
                  <dt className="font-display text-4xl font-semibold text-primary">{f.value}</dt>
                  <dd className="mt-2">{f.text}</dd>
                  <dd className="mt-3 text-sm text-muted-foreground">Quelle: {f.source}</dd>
                </div>
              ))}
            </dl>
            <Link href="/wissen" className={cn(buttonVariants({ variant: "link" }), "mt-4 px-0")}>
              <BookOpen aria-hidden="true" /> Alle Quellen und Hintergründe
            </Link>
          </div>
        </section>

        {/* Funktionsweise */}
        <section aria-labelledby="how-heading" className="py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="how-heading" className="text-3xl font-semibold md:text-4xl">
              So funktioniert EchtNah
            </h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { step: "1", title: "Erzähl von dir", text: "In kurzen, freiwilligen Schritten — in deinem Tempo, mit Pausen." },
                { step: "2", title: "Entdecke Menschen", text: "Eine ruhige Auswahl pro Tag, mit nachvollziehbaren Gemeinsamkeiten." },
                { step: "3", title: "Lernt euch kennen", text: "Chat ohne Druck, Date-Planung mit Rücksicht auf eure Bedürfnisse." },
              ].map((s) => (
                <li key={s.step} className="rounded-xl border border-border bg-card p-6">
                  <p
                    aria-hidden="true"
                    className="flex size-11 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground"
                  >
                    {s.step}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Funktionen */}
        <section aria-labelledby="features-heading" className="bg-primary-soft py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="features-heading" className="text-3xl font-semibold md:text-4xl">
              Gebaut für echte Menschen mit echtem Alltag
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <Card key={f.title}>
                  <CardHeader className="pb-2">
                    <CardTitle as="h3" className="flex items-center gap-3 font-sans text-lg">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                        <f.icon aria-hidden="true" className="size-5 text-accent" />
                      </span>
                      {f.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">{f.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sicherheit & Barrierefreiheit */}
        <section aria-labelledby="safety-heading" className="py-14">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 id="safety-heading" className="flex items-center gap-3 text-2xl font-semibold">
                <ShieldCheck aria-hidden="true" className="size-7 text-primary" />
                Sicherheit zuerst
              </h2>
              <ul className="mt-4 space-y-2">
                <li>Blockieren und Melden mit zwei Klicks — vertraulich</li>
                <li>Warnungen bei Geldforderungen, Krypto-Angeboten und Druck zu anderen Messengern</li>
                <li>Kein exakter Standort — niemals</li>
                <li>Sicherheitskontakt, Sicherheitscode und Check-in für Dates</li>
                <li>Klare Regeln gegen Ableismus und Fetischisierung</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-3 text-2xl font-semibold">
                <Accessibility aria-hidden="true" className="size-7 text-primary" />
                Barrierearm von Grund auf
              </h2>
              <ul className="mt-4 space-y-2">
                <li>Orientierung an WCAG 2.2 AA, vollständig per Tastatur bedienbar</li>
                <li>Schrift Atkinson Hyperlegible, entwickelt für gute Lesbarkeit</li>
                <li>Schriftgröße, Textabstand, Kontrast und Dark Mode einstellbar</li>
                <li>Reduzierte Ansicht und Einfache Sprache</li>
                <li>Pflicht-Bildbeschreibungen für alle Profilfotos</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="border-t border-border bg-card py-14">
          <div className="mx-auto max-w-3xl px-4">
            <h2 id="faq-heading" className="text-3xl font-semibold md:text-4xl">
              Häufige Fragen
            </h2>
            <div className="mt-8 space-y-3">
              {FAQ.map((item) => (
                <details key={item.q} className="rounded-xl border border-border bg-background p-5">
                  <summary className="cursor-pointer text-lg font-semibold">{item.q}</summary>
                  <p className="mt-3 text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Abschluss */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground">
            <HeartHandshake aria-hidden="true" className="mx-auto size-10" />
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Bereit für echte Nähe?</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg opacity-90">
              Registrieren dauert zwei Minuten. Alles Weitere machst du in deinem Tempo.
            </p>
            <Link
              href="/registrieren"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-8")}
            >
              Kostenlos registrieren
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-2 px-4 text-sm text-muted-foreground">
          <Link href="/wissen" className="hover:underline">
            Wissen & Quellen
          </Link>
          <Link href="/community-regeln" className="hover:underline">
            Community-Regeln
          </Link>
          <Link href="/hilfe-sicherheit" className="hover:underline">
            Hilfe & Sicherheit
          </Link>
          <span>Demo-Version — alle Profile sind fiktiv</span>
        </div>
      </footer>
    </div>
  );
}
