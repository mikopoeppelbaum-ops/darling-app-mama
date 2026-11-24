# EchtNah — Dating, das dich als ganzen Menschen sieht

EchtNah ist eine barrierearme Dating-App für Menschen mit körperlichen, sensorischen,
psychischen oder kognitiven Behinderungen, für Menschen mit ADHS und neurodivergente
Personen — und für alle, die wertschätzendes Kennenlernen suchen.

Im Vordergrund stehen Persönlichkeit, Interessen, Werte, Kommunikation und Alltag.
Angaben zu Behinderung, Erkrankung oder Neurodivergenz sind **immer freiwillig** und
für jede Angabe **einzeln** sichtbar oder unsichtbar schaltbar. Eine Diagnose ist
niemals verpflichtend.

## Schnellstart (Demo-Modus, ohne Backend)

Voraussetzungen: Node.js ≥ 20, npm.

```bash
npm install
npm run dev
```

Öffne <http://localhost:3000>. **Ohne Supabase-Konfiguration läuft die App im
Demo-Modus**: Alle Daten sind fiktiv, werden lokal im Browser (localStorage)
gehalten und du kannst jede Funktion ausprobieren — Entdecken, Likes, Matches,
Chat, Date-Planer, Einstellungen, Onboarding und das Moderations-Dashboard.

Demo-Tipp: Die Profile „Jonas“ und „Frida“ haben dich bereits geliked — ein Like
zurück erzeugt sofort ein Match.

## Version 2: Design- und Fakten-Überarbeitung

**Design.** Neue, ruhige Farbwelt („warmes Papier, tiefes Petrol, Terrakotta“), jedes Farbpaar
rechnerisch gegen WCAG 2.2 AA geprüft (hell, dunkel, hoher Kontrast). Fließtext in
_Atkinson Hyperlegible Next_ (Braille Institute, für gute Lesbarkeit entworfen), Überschriften
in _Fraunces_. Mobile Kopfzeile mit Hilfe an immer gleicher Stelle (WCAG 2.2 SC 3.2.6),
fokussierte Elemente werden nicht von der Navigation verdeckt (SC 2.4.11).

**Neue, belegte Funktionen** (alle Quellen auch in der App unter `/wissen`):

| Funktion                                                                                                                    | Grundlage                                                              |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Tägliche Auswahl von 8 Vorschlägen statt endlosem Wischen                                                                   | Choice Overload beim Online-Dating (D'Angelo & Toma, Media Psychology) |
| Sortierung nach Anzahl nachvollziehbarer Gemeinsamkeiten (ohne Score-Anzeige)                                               | Bisheriges Matching-Prinzip                                            |
| Tone-Tags im Chat (/j, /s, /gen …) mit deutscher Erklärung                                                                  | Tone Indicators, CSCW 2025                                             |
| Barrierefreiheitsbedürfnisse nach ICF-Bereichen gegliedert                                                                  | WHO ICF (Behinderung als Wechselwirkung mit der Umwelt)                |
| Einstellung „Mehr Textabstand“                                                                                              | WCAG 2.2 SC 1.4.12; Zorzi et al., PNAS 2012                            |
| „Fragen zu Behinderung: willkommen / später / lieber nicht“                                                                 | Wunsch nach Selbstbestimmung über Offenlegung                          |
| Tagesform („Löffel“), nur für Matches sichtbar                                                                              | Spoon Theory — als Community-Konzept gekennzeichnet                    |
| Ausdrückliche Einwilligung vor Gesundheitsdaten                                                                             | DSGVO Art. 9 Abs. 2 lit. a                                             |
| Warnung vor Krypto-/Investment-Angeboten und Messenger-Druck                                                                | „Romance Baiting“ laut Bundestag hib 727/2025                          |
| Gemeinsamer Bedürfnis-Check im Date-Planer, Pausenzeichen, Wheelmap-Hinweis                                                 | Nur freigegebene Angaben fließen ein                                   |
| Benachrichtigungs-Center mit abgeleiteten Erinnerungen                                                                      | „Später beantworten“, Date-Erinnerung 48 h vorher, Check-in            |
| Fotos verwalten mit Pflicht-Bildbeschreibung, Bilder im Chat, Hinweis auf erhaltene Likes, Onboarding-Vorschau, Date-Reiter | —                                                                      |

**Zahlen auf der Startseite:** 7,9 Mio. Menschen mit Schwerbehinderung (Destatis, Ende 2023);
≈ 1 von 127 Menschen autistisch (WHO/GBD 2021); 2,58 % persistierende bzw. 6,76 % symptomatische
ADHS bei Erwachsenen (Song et al. 2021); 88 % der Dating-App-Nutzenden mit Behinderung berichten
digitale Übergriffe (Australian Institute of Criminology 2024). Wo Belege dünn sind (Spoon Theory,
Rejection Sensitivity, Atkinson-Wirksamkeit), sagt die App das ausdrücklich.

## Technischer Stack

| Bereich        | Technologie                                              | Anmerkung                                                                                                                                                                                                                                                       |
| -------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19 + TypeScript (strict) |                                                                                                                                                                                                                                                                 |
| Styling        | Tailwind CSS v4                                          | Design-Tokens in `globals.css`                                                                                                                                                                                                                                  |
| UI-Komponenten | Handgeschriebene Komponenten im shadcn/ui-Stil           | Bewusste Entscheidung: kein shadcn-CLI-Import nötig, dieselben Patterns (cva, cn, Radix-ähnliche Semantik) mit nativen Elementen (`<dialog>`, `<select>`, `<input type=checkbox>`) für maximale Screenreader-/Tastatur-Kompatibilität ohne Zusatzabhängigkeiten |
| Formulare      | React Hook Form + Zod (`@hookform/resolvers`)            |                                                                                                                                                                                                                                                                 |
| Icons          | Lucide                                                   |                                                                                                                                                                                                                                                                 |
| Backend        | Supabase (PostgreSQL, Auth, Storage, Realtime)           | Migrationen + RLS in `supabase/`; App läuft ohne Konfiguration im Demo-Modus                                                                                                                                                                                    |
| Tests          | Vitest + Testing Library (+ SQL-RLS-Testskript)          |                                                                                                                                                                                                                                                                 |

## Projektstruktur

```
supabase/
  migrations/0001_schema.sql   # Tabellen, Enums, Indizes, Trigger (Match-Erzeugung, Rate-Limits)
  migrations/0002_rls.sql      # Row Level Security für alle Tabellen
  migrations/0003_storage.sql  # Storage-Buckets + Zugriffsregeln für Fotos
  seed.sql                     # 8 fiktive Demo-Profile + Kataloge (nur lokale Entwicklung)
  tests/rls_policies.test.sql  # RLS-Tests (psql-Skript)
src/
  app/
    page.tsx                   # Startseite (öffentlich)
    (auth)/                    # Registrieren, Anmelden, Passwort vergessen
    (app)/                     # Angemeldeter Bereich mit App-Shell + Bottom-Navigation
      entdecken/  matches/  nachrichten/  dates/  gespeichert/
      profil/     onboarding/  einstellungen/  admin/
      hilfe-sicherheit/  community-regeln/
  components/
    ui/                        # Wiederverwendbare Basiskomponenten (Button, Card, Dialog, …)
    a11y/                      # AccessibilityProvider (Schriftgröße, Kontrast, Dark Mode, reduzierte Ansicht)
    layout/  profile/  discover/
  lib/
    types.ts                   # Domain-Typen (Spiegel des DB-Schemas)
    options.ts                 # Deutsche Optionskataloge (Gender, Interessen, Barrierefreiheit, …)
    validation.ts              # Zod-Schemas mit verständlichen deutschen Fehlermeldungen
    matching.ts                # Gegenseitigkeit, Filter, nachvollziehbare Match-Gründe, Like-Limit
    visibility.ts              # Sichtbarkeitslogik für sensible Angaben (public/after_match/hidden)
    safety.ts                  # Content-Warnungen (Telefon/Link/IBAN/Geld), Rate-Limiting, Nachrichten-Gliederung
    store.tsx                  # Client-Datenschicht (Demo-Modus, Struktur = DB-Schema)
    demo-data.ts               # 8 vollständig fiktive Profile
    supabase/                  # Browser-/Server-Clients (@supabase/ssr)
```

Klare Trennung: UI (`components/`), Geschäftslogik (`lib/*.ts`, pur und getestet),
Datenzugriff (`lib/store.tsx` bzw. Supabase-Clients).

## Supabase einrichten (echter Betrieb)

1. [Supabase CLI installieren](https://supabase.com/docs/guides/cli) und Docker starten.
2. Im Projektordner:

   ```bash
   supabase init          # einmalig, erzeugt supabase/config.toml
   supabase start         # lokale Supabase-Instanz
   supabase db reset      # führt migrations/ + seed.sql aus
   ```

3. `.env.local` anlegen (Vorlage: `.env.example`) und die Werte aus `supabase start` eintragen:

   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   ```

4. `npm run dev` — Registrierung/Login/Passwort-Reset laufen jetzt gegen Supabase
   (E-Mail-Bestätigung inklusive; lokal landen Mails im Inbucket von `supabase start`).

Demo-Konten aus dem Seed (Passwort jeweils `demo-passwort-123`):
`mara@example.test` … `frida@example.test`, Admin: `admin@example.test`.

RLS-Tests ausführen:

```bash
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" \
  -v ON_ERROR_STOP=1 -f supabase/tests/rls_policies.test.sql
```

## Skripte

| Befehl                        | Zweck                       |
| ----------------------------- | --------------------------- |
| `npm run dev`                 | Entwicklungsserver          |
| `npm run build` / `npm start` | Produktions-Build / -Server |
| `npm run lint`                | ESLint                      |
| `npm run typecheck`           | TypeScript ohne Emit        |
| `npm test`                    | Vitest (63 Tests)           |
| `npm run format`              | Prettier                    |

## Fertige Funktionen (MVP)

- **Startseite** mit Funktionsweise, Inklusion, Sicherheit, ADHS-Funktionen, FAQ
- **Registrierung** (E-Mail, Passwort, Mindestalter 18, drei protokollierte Einwilligungen),
  **Login**, **Passwort zurücksetzen**, E-Mail-Verifizierung (mit Supabase)
- **Onboarding** in 9 kurzen Etappen mit Fortschrittsanzeige und gespeichertem Zwischenstand
- **Profil**: Anzeigename, Pronomen, ungefährer Ort, Bio, Interessen, Werte,
  Kommunikationsstil, Kontaktfrequenz, Planungsstil, Energielevel, Antwort-Tempo,
  soziale Aktivitäten, Reizempfindlichkeiten, Barrierefreiheitsbedürfnisse,
  sechs „Gut zu wissen“-Prompts, Grenzen/No-Gos
- **Freiwillige sensible Angaben** mit Sichtbarkeit pro Angabe
  (sofort / nach Match / nie) und explizitem Opt-in für Suchbarkeit
- **Profilvorschau**, die exakt die Sicht anderer zeigt (vor und nach Match)
- **Profil-Checkliste** mit Fortschritt (ADHS-freundlich)
- **Entdecken**: Karten- und Listenansicht, Like/Überspringen/Speichern/Zurück,
  Melden, Blockieren, Tageslimit (Freemium vorbereitet), Rate-Limit gegen Massen-Likes
- **Nachvollziehbare Match-Gründe** („Ihr mögt beide ruhige Treffen.“) statt Pseudo-Prozentwerten
- **Filter**: Alter, Entfernung, Geschlecht, Orientierung (nur bei öffentlicher Sichtbarkeit),
  Beziehungsziel, Interessen, Werte, Kommunikationsstil, Planung, Kontaktfrequenz,
  barrierearme Treffpunkte, Kinderwunsch, Rauchen, Alkohol, Haustiere,
  freigegebene sensible Angaben
- **Matches & Chat**: Nachrichten, Gelesen-Status (abschaltbar), Entwürfe automatisch
  gespeichert, Nachricht löschen, „Später beantworten“ mit Erinnerungszeit,
  Gesprächseinstiege, Chat wichtig markieren/stummschalten, Match pausieren,
  freundliche Kontakt-Beendigung mit Textvorlagen, Sicherheitswarnungen
  (Telefonnummern, Links, IBAN, Geldforderungen)
- **Date-Planer**: Art des Treffens (9 Vorschläge inkl. reizarm/barrierefrei), Datum/Dauer/Ort,
  Barrierefreiheits-Anforderungen, Notizen, Bestätigen, respektvolle Absagen,
  Änderungs-Notizen, ICS-Kalenderexport, Sicherheitskontakt, Sicherheitscode,
  Teilen mit Vertrauensperson, Check-in nach dem Date
- **Einstellungen**: Barrierefreiheit (Schriftgröße, Dark Mode, hoher Kontrast,
  reduzierte Ansicht, Einfache Sprache), ADHS-Funktionen (Erinnerungen, Gliederung
  langer Nachrichten, Fokusmodus), **Zwei-Faktor-Anmeldung** (TOTP via Supabase Auth
  MFA, freiwillig, mit manueller Schlüsseleingabe als Alternative zum QR-Code),
  Privatsphäre (Sichtbarkeit, Datenexport), Benachrichtigungen (einzeln/gebündelt),
  blockierte Nutzer:innen, Konto löschen (mit Bestätigung)
- **Datenexport** (DSGVO Art. 20) und **Kontolöschung** (Art. 17)
- **Admin-Dashboard**: Meldungen mit Kategorie/Zeitstempel/Status, interne Notizen,
  Verwarnung, temporäre/dauerhafte Sperre, Audit-Log; Rollenkonzept in DB (`app_users.role`)
- **Community-Regeln** (gegen Ableismus, Fetischisierung, Diagnose-Druck u. a.) und
  **Sicherheitsleitfaden** in einfacher Sprache — beide auch als **Einfache-Sprache**-Fassung
  abrufbar (Einstellung „Barrierefreiheit“)
- **Wissenschaftlicher Hintergrund** auf `/hilfe-sicherheit`: erklärt das Double-Empathy-Problem
  (Milton, 2012) als Grundlage für Kommunikationsstil- statt Defizit-Matching und Dunns
  Vier-Quadranten-Modell als Grundlage der Reizempfindlichkeits-Optionen, mit Quellenangaben
  und Links zu ADHS Deutschland e. V., Autismus Deutschland e. V. und ASAN

## Barrierefreiheit (WCAG 2.2 AA als Leitlinie)

- Vollständige Tastaturbedienung, sichtbare Fokusringe (3 px, `:focus-visible`)
- Skip-Link, Landmark-Struktur, `aria-label`/`aria-current`/`role="alert"` durchgängig
- Korrekte, lückenlose Überschriften-Hierarchie (h1 → h2 → h3, konfigurierbar über
  `CardTitle`s `as`-Prop) — automatisiert geprüft, siehe unten
- Native Elemente (`<dialog>`, `<select>`, Checkboxen/Radios) statt Skript-Nachbauten
- Wichtige Zustände nie nur über Farbe (Häkchen, Unterstreichung, Text-Badges)
- Einstellbare Schriftgröße (100/112,5/125 %), Dark Mode, Modus für hohen Kontrast
- Reduzierte Ansicht: keine Animationen/Schatten; `prefers-reduced-motion` wird respektiert
- **Einfache Sprache** (Einstellung, wirkt auf Registrierung und Community-Regeln):
  kürzere Sätze, einfachere Wörter. Das ist eine Annäherung, keine geprüfte
  „Leichte Sprache“ nach dem Regelwerk des Netzwerks Leichte Sprache — dafür wäre eine
  Prüfung durch eine Prüfgruppe aus der Zielgruppe selbst nötig, die dieses Projekt
  nicht leisten kann.
- Mindest-Zielgrößen 44 px, klare deutsche Sprache, verständliche Fehlermeldungen
- Alt-Texte für alle Bilder (Profilfotos haben ein Pflicht-Alt-Text-Feld im Schema)

**Automatisierte Prüfung**: `npm test` schließt axe-core-Audits (`jest-axe`) für die
Startseite, Registrierung, Community-Regeln (beide Sprachvarianten), die
Zwei-Faktor-Einstellungsseite, die App-Navigation und alle zentralen UI-Bausteine ein
(`src/components/a11y-audit.test.tsx`). Diese Prüfung hat bereits einen echten Fehler
gefunden und behoben (übersprungene Überschriften-Ebene bei Card-Titeln). Wichtige
Grenze: axe-core in jsdom kann weder echten Farbkontrast prüfen (kein Rendering/Painting)
noch ersetzt es einen Test mit einem echten Screenreader (NVDA, JAWS, VoiceOver) — das
steht als offener Punkt weiterhin aus.

## Sicherheit & Datenschutz

- **Optionale Zwei-Faktor-Anmeldung** (TOTP) über die offizielle Supabase-Auth-MFA-API
  (`auth.mfa.enroll/challenge/verify/unenroll/listFactors`) unter
  „Einstellungen → Zwei-Faktor-Anmeldung“; Login-Flow fragt bei aktivierter MFA einen
  Code ab, bevor die Sitzung auf AAL2 hochgestuft wird. Freiwillig und kostenlos.
- **Row Level Security** auf allen Tabellen; Default „alles verboten“
  - Sensible Angaben (Disclosures, Barrierefreiheitsbedürfnisse) folgen der
    gewählten Sichtbarkeit auch auf Datenbankebene; Moderation hat **keinen**
    Zugriff auf freiwillige Diagnose-Angaben
  - Nachrichten nur für Match-Mitglieder; Schreiben nur in aktiven Matches
- Rate-Limits als DB-Trigger (Likes, Nachrichten) und clientseitig
- Warnungen bei Telefonnummern, Links, Bankdaten, Geldforderungen
- Nur ungefähre Standorte (Stadt + gerundete Koordinaten), Geburtsdatum nie öffentlich
- Storage: private Buckets, 5-MB-Limit, nur Bildformate, Pfad an Nutzer-ID gebunden
- Einwilligungen mit Version und Zeitstempel, nicht lösch-/änderbar (`consent_records`)
- Security-Header (nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy)
- Keine Geheimnisse im Code; `.env.example` dokumentiert alle Variablen
- Keine Diagnosen in URLs; keine sensiblen Daten in Logs

## Freemium (vorbereitet, keine echten Zahlungen)

Kostenlos: Profil, 20 Likes/Tag, Matches, Chat, grundlegende Filter.
Vorbereitet für Premium: Inkognito-Modus (Schalter vorhanden, deaktiviert),
unbegrenzte Likes (`FREE_DAILY_LIKE_LIMIT` konfigurierbar), erweiterte Filter.
**Sicherheits- und Barrierefreiheitsfunktionen bleiben immer kostenlos.**

## Bewusste technische Entscheidungen

- **Demo-Modus als First-Class-Betriebsart**: Die App ist ohne Backend voll bedienbar.
  Die Client-Datenschicht (`lib/store.tsx`) spiegelt das DB-Schema, sodass der Tausch
  gegen Supabase-Queries pro Funktion erfolgen kann.
- **Handgeschriebene UI-Komponenten statt shadcn-CLI**: gleiche API-Idee, aber ohne
  Radix-Abhängigkeiten; native Browser-Semantik ist für Screenreader am robustesten.
- **Kein Kompatibilitäts-Score**: bewusst nur konkrete, ehrliche Übereinstimmungssätze.
- **2FA ohne QR-Code-Bibliothek**: Supabase liefert den QR-Code bereits als fertiges
  Daten-URI-SVG (`data.totp.qr_code`); zusätzlich wird der Schlüssel als Text zur
  manuellen Eingabe angezeigt — wichtig für Screenreader-Nutzer:innen, die den QR-Code
  nicht scannen können.
- **npm audit**: Next.js wurde auf 16.2.12 aktualisiert (behebt mehrere High-Severity-CVEs,
  u. a. Middleware-Bypass und SSRF). Verbleibend: `postcss`/`sharp` sind intern in Next.js
  selbst gebündelt (`next/node_modules/...`) und nicht ohne ein weiteres Next-Update
  fixbar; `brace-expansion` steckt in einer Dev-Abhängigkeit von ESLint (nicht im
  Produktions-Bundle). Alle drei werden beobachtet.

## Offene Punkte / nächste Schritte

1. **Supabase-Anbindung der Datenschicht**: `store.tsx` gegen Supabase-Queries +
   Realtime-Subscriptions (Chat) tauschen; Auth-Middleware für geschützte Routen.
2. **Foto-Upload** mit Alt-Text-Pflicht, serverseitiger Bildprüfung (Inhaltsprüfung
   ist im Schema vorbereitet) und signierten URLs.
3. **Sprachnachrichten** (Spalte `audio_path` existiert bereits) inkl. automatischer Transkription.
4. **Benachrichtigungen** real ausliefern (Web Push), Bündelung serverseitig.
5. **Erinnerungs-Jobs**: „Später beantworten“-Reminder und Date-Check-in als Cron/Edge Functions.
6. **Karten-/Location-Anbindung** für barrierearme Treffpunkte (`external_place_id` vorbereitet,
   z. B. Wheelmap-API).
7. **Einspruchsverfahren** für Moderationsentscheidungen (Felder `appeal_*` vorhanden).
8. **Test mit echtem Screenreader** (NVDA, JAWS, VoiceOver) mit echten Nutzer:innen —
   axe-core (siehe oben) ist integriert, ersetzt das aber nicht. E2E-Tests (Playwright)
   in CI wären der nächste Ausbauschritt für die automatisierte Seite.
9. **Zahlungsanbindung** (z. B. Stripe) für das vorbereitete Freemium-Modell.
10. **Geprüfte Leichte Sprache**: Die aktuelle „Einfache Sprache“ ist eine Annäherung.
    Für echte, zertifizierte Leichte Sprache nach dem Regelwerk des Netzwerks Leichte
    Sprache bräuchte es eine Prüfung durch eine Prüfgruppe aus der Zielgruppe selbst,
    zusätzliche Piktogramme und eine Ausweitung auf weitere Seiten.
11. **Barrierefreiheitsbedürfnisse wissenschaftlich fundieren**: analog zu den
    Reizempfindlichkeiten (Dunn-Modell) ließe sich `ACCESSIBILITY_NEED_OPTIONS` an der
    ICF der WHO (International Classification of Functioning, Disability and Health)
    ausrichten, die Behinderung explizit relational statt medizinisch definiert.

## Rechtlicher Hinweis

Dies ist ein MVP mit ausschließlich fiktiven Demo-Daten. Vor einem echten Betrieb
sind u. a. Datenschutzerklärung, AVV mit Supabase, DSFA (besondere Kategorien
personenbezogener Daten nach Art. 9 DSGVO!) und ein Impressum erforderlich.
