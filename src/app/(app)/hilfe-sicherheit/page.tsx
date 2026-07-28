import type { Metadata } from "next";
import {
  AlertTriangle,
  BookOpen,
  ExternalLink,
  HeartHandshake,
  PhoneCall,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Hilfe & Sicherheit" };

export default function SafetyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Hilfe & Sicherheit</h1>
      <p className="text-muted-foreground">
        Deine Sicherheit ist uns wichtig. Hier findest du unseren Leitfaden für sicheres
        Kennenlernen — in klarer, einfacher Sprache.
      </p>

      <Alert variant="warning" title="Im Notfall">
        Wenn du in Gefahr bist, rufe den Notruf 110 an. Bei seelischen Krisen erreichst du die
        Telefonseelsorge kostenlos rund um die Uhr: 0800 111 0 111.
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
            Sicher chatten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2">
            <li>
              Teile Telefonnummer, Adresse oder Bankdaten erst, wenn du der Person wirklich
              vertraust.
            </li>
            <li>
              Sende niemals Geld, Gutscheine oder Kryptowährung — egal, wie dringend die Geschichte
              klingt.
            </li>
            <li>
              Die App warnt dich automatisch, wenn Nachrichten Telefonnummern, Links oder
              Geldforderungen enthalten.
            </li>
            <li>
              Du darfst jederzeit aufhören zu antworten. Du schuldest niemandem eine Erklärung.
            </li>
            <li>
              Blockieren und Melden geht in jedem Profil und in jedem Chat — die Person erfährt es
              nicht.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall aria-hidden="true" className="size-5 text-primary" />
            Sicher treffen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2">
            <li>Triff dich zuerst an einem öffentlichen Ort oder per Videocall.</li>
            <li>
              Hinterlege im Date-Planer einen Sicherheitskontakt — eine Person, die weiß, wo du
              bist.
            </li>
            <li>
              Nutze den optionalen Sicherheitscode: eine Vertrauensperson kennt ihn und du meldest
              dich nach dem Date.
            </li>
            <li>Der Check-in nach dem Date erinnert dich, kurz „Mir geht es gut“ zu bestätigen.</li>
            <li>
              Plane Pausen ein und sage ab, wenn du dich nicht wohlfühlst — dafür gibt es
              vorformulierte, freundliche Absagen.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle aria-hidden="true" className="size-5 text-primary" />
            Warnsignale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2">
            <li>Die Person bittet um Geld oder erzählt von plötzlichen Notlagen.</li>
            <li>
              Die Person drängt dich, die App schnell zu verlassen (z. B. zu einem Messenger).
            </li>
            <li>
              Die Person setzt dich unter Druck, eine Diagnose oder private Details offenzulegen.
            </li>
            <li>Die Person reduziert dich auf deine Behinderung oder macht sie zum Fetisch.</li>
            <li>Die Person ignoriert deine Grenzen — auch kleine.</li>
          </ul>
          <p className="mt-3">
            Alles davon ist ein Grund zu melden. Du tust damit auch anderen einen Gefallen.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake aria-hidden="true" className="size-5 text-primary" />
            Dein Tempo zählt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Ob langsame Antworten, Pausen oder kurze Treffen: Du bestimmst das Tempo. Funktionen wie
            „Match pausieren“, „Meine Antwort kann etwas dauern“ und flexible Absagen sind genau
            dafür da — und niemals kostenpflichtig.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen aria-hidden="true" className="size-5 text-primary" />
            Wissenschaftlicher Hintergrund
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Warum wir Kommunikationsstil statt „Defizite“ matchen</h3>
            <p className="mt-1">
              Der Autismus-Forscher Damian Milton hat 2012 das „Double Empathy Problem“ beschrieben:
              Missverständnisse zwischen autistischen und nicht-autistischen Menschen entstehen auf
              beiden Seiten gleichermaßen — nicht, weil eine Seite „falsch“ kommuniziert. Deshalb
              fragen wir nach deinem Kommunikationsstil und deiner Kontaktfrequenz, statt
              anzunehmen, dass es eine „richtige“ Art gibt, miteinander zu sprechen.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Milton, D. (2012).{" "}
              <a
                href="https://kar.kent.ac.uk/62639/1/Double%20empathy%20problem.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                On the ontological status of autism: the &lsquo;double empathy problem&rsquo;
              </a>
              . Disability &amp; Society, 27(6).{" "}
              <a
                href="https://journals.sagepub.com/doi/10.1177/13623613221129123"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Zehn-Jahres-Folgestudie (Milton, Gurbuz &amp; López, 2022)
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Warum unsere Reizempfindlichkeiten so aufgeteilt sind</h3>
            <p className="mt-1">
              Die Auswahl bei „Reizempfindlichkeiten“ orientiert sich an Winnie Dunns
              Vier-Quadranten-Modell der sensorischen Verarbeitung: Menschen unterscheiden sich
              darin, wie schnell sie Reize bemerken und wie aktiv oder passiv sie darauf reagieren.
              Das ist keine Diagnose, sondern beschreibt normale Unterschiede in der
              Reizverarbeitung.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Jussila, K. et al. (2019).{" "}
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6406387/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Dunn&rsquo;s Model of Sensory Processing: An Investigation of the Axes of the
                Four-Quadrant Model in Healthy Adults
              </a>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Alle Angaben in deinem Profil sind Selbstauskünfte in deinen eigenen Worten — die App
            stellt keine Diagnosen und leitet auch keine aus deinen Angaben ab.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users aria-hidden="true" className="size-5 text-primary" />
            Weiterführende Anlaufstellen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <a
                href="https://adhs-deutschland.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline"
              >
                ADHS Deutschland e. V.
                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
              <p className="text-sm text-muted-foreground">
                Größte deutsche Selbsthilfeorganisation zu ADHS, mit bundesweitem
                Selbsthilfegruppen-Netzwerk und Telefonberatung.
              </p>
            </li>
            <li>
              <a
                href="https://autismus.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline"
              >
                Autismus Deutschland e. V.
                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
              <p className="text-sm text-muted-foreground">
                Größter deutscher Dachverband zu Autismus, gegründet 1970, mit Regionalverbänden und
                Beratungsangeboten.
              </p>
            </li>
            <li>
              <a
                href="https://autisticadvocacy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline"
              >
                Autistic Self Advocacy Network (ASAN)
                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
              <p className="text-sm text-muted-foreground">
                Selbstvertretungsorganisation autistischer Menschen (englischsprachig), u. a. mit
                Sprachleitfäden.
              </p>
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Diese Links ersetzen keine medizinische oder therapeutische Beratung.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
