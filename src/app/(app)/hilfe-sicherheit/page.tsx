import type { Metadata } from "next";
import { AlertTriangle, HeartHandshake, PhoneCall, ShieldCheck } from "lucide-react";
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
            <li>Teile Telefonnummer, Adresse oder Bankdaten erst, wenn du der Person wirklich vertraust.</li>
            <li>Sende niemals Geld, Gutscheine oder Kryptowährung — egal, wie dringend die Geschichte klingt.</li>
            <li>Die App warnt dich automatisch, wenn Nachrichten Telefonnummern, Links oder Geldforderungen enthalten.</li>
            <li>Du darfst jederzeit aufhören zu antworten. Du schuldest niemandem eine Erklärung.</li>
            <li>Blockieren und Melden geht in jedem Profil und in jedem Chat — die Person erfährt es nicht.</li>
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
            <li>Hinterlege im Date-Planer einen Sicherheitskontakt — eine Person, die weiß, wo du bist.</li>
            <li>Nutze den optionalen Sicherheitscode: eine Vertrauensperson kennt ihn und du meldest dich nach dem Date.</li>
            <li>Der Check-in nach dem Date erinnert dich, kurz „Mir geht es gut“ zu bestätigen.</li>
            <li>Plane Pausen ein und sage ab, wenn du dich nicht wohlfühlst — dafür gibt es vorformulierte, freundliche Absagen.</li>
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
            <li>Die Person drängt dich, die App schnell zu verlassen (z. B. zu einem Messenger).</li>
            <li>Die Person setzt dich unter Druck, eine Diagnose oder private Details offenzulegen.</li>
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
            Ob langsame Antworten, Pausen oder kurze Treffen: Du bestimmst das Tempo. Funktionen
            wie „Match pausieren“, „Meine Antwort kann etwas dauern“ und flexible Absagen sind
            genau dafür da — und niemals kostenpflichtig.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
