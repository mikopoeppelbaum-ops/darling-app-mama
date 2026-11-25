/**
 * Optionskataloge mit deutschen, respektvollen Bezeichnungen.
 * Die Werte (value) entsprechen den Enum-Werten der Datenbank.
 */

import type {
  CommunicationStyle,
  ContactFrequency,
  EnergyLevel,
  Gender,
  Orientation,
  PlanningStyle,
  RelationshipGoal,
  RelationshipStructure,
  ReportCategory,
  RomanticOrientation,
  ResponsePace,
} from "@/lib/types";

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "woman", label: "Frau" },
  { value: "man", label: "Mann" },
  { value: "trans_woman", label: "Trans Frau" },
  { value: "trans_man", label: "Trans Mann" },
  { value: "nonbinary", label: "Nicht-binär" },
  { value: "genderfluid", label: "Genderfluid" },
  { value: "agender", label: "Agender" },
  { value: "self_described", label: "Selbst beschrieben" },
  { value: "prefer_not_to_say", label: "Keine Angabe" },
];

export const ORIENTATION_OPTIONS: { value: Orientation; label: string }[] = [
  { value: "hetero", label: "Heterosexuell" },
  { value: "gay", label: "Schwul" },
  { value: "lesbian", label: "Lesbisch" },
  { value: "bi", label: "Bisexuell" },
  { value: "pan", label: "Pansexuell" },
  { value: "ace", label: "Asexuell" },
  { value: "demi", label: "Demisexuell" },
  { value: "queer", label: "Queer" },
  { value: "questioning", label: "Noch am Herausfinden" },
  { value: "prefer_not_to_say", label: "Keine Angabe" },
];

export const ROMANTIC_ORIENTATION_OPTIONS: { value: RomanticOrientation; label: string }[] = [
  { value: "aromantic", label: "Aromantisch" },
  { value: "heteroromantic", label: "Heteroromantisch" },
  { value: "homoromantic", label: "Homoromantisch" },
  { value: "biromantic", label: "Biromantisch" },
  { value: "panromantic", label: "Panromantisch" },
  { value: "demiromantic", label: "Demiromantisch" },
  { value: "prefer_not_to_say", label: "Keine Angabe" },
];

export const RELATIONSHIP_STRUCTURE_OPTIONS: {
  value: RelationshipStructure;
  label: string;
  description?: string;
}[] = [
  { value: "monogamous", label: "Monogam" },
  { value: "open", label: "Offene Beziehung" },
  { value: "polyamorous", label: "Polyamor", description: "Mehrere Beziehungen, offen und einvernehmlich." },
  { value: "figuring_out", label: "Finde ich noch heraus" },
];

/** Vorschläge — eigene Pronomen sind jederzeit frei eintragbar. */
export const PRONOUN_SUGGESTIONS = [
  "sie/ihr",
  "er/ihm",
  "they/them",
  "dey/dem",
  "xier/xiem",
  "keine Pronomen — bitte meinen Namen",
] as const;

export const RELATIONSHIP_GOAL_OPTIONS: {
  value: RelationshipGoal;
  label: string;
  description?: string;
}[] = [
  { value: "long_term", label: "Langfristige Beziehung" },
  { value: "open_to_anything", label: "Offen für alles" },
  { value: "friendship_first", label: "Erst Freundschaft, dann sehen" },
  { value: "casual", label: "Lockeres Kennenlernen" },
  { value: "companionship", label: "Gemeinsame Zeit und Nähe" },
];

export const CONTACT_FREQUENCY_OPTIONS: {
  value: ContactFrequency;
  label: string;
  description?: string;
}[] = [
  { value: "daily", label: "Täglich", description: "Ich schreibe gerne jeden Tag." },
  { value: "few_times_week", label: "Mehrmals pro Woche" },
  { value: "weekly", label: "Etwa einmal pro Woche" },
  { value: "flexible", label: "Flexibel", description: "Mal mehr, mal weniger — beides ist okay." },
];

export const PLANNING_STYLE_OPTIONS: {
  value: PlanningStyle;
  label: string;
  description?: string;
}[] = [
  { value: "spontaneous", label: "Spontan", description: "Ich entscheide gerne kurzfristig." },
  {
    value: "semi_planned",
    label: "Teilweise geplant",
    description: "Grober Plan, Details flexibel.",
  },
  {
    value: "structured",
    label: "Stark strukturiert",
    description: "Ich plane gerne frühzeitig mit festen Zeiten.",
  },
];

export const ENERGY_LEVEL_OPTIONS: { value: EnergyLevel; label: string }[] = [
  { value: "low", label: "Eher ruhig" },
  { value: "medium", label: "Ausgeglichen" },
  { value: "high", label: "Viel Energie" },
  { value: "varies", label: "Unterschiedlich je nach Tag" },
];

export const COMMUNICATION_STYLE_OPTIONS: { value: CommunicationStyle; label: string }[] = [
  { value: "texting", label: "Textnachrichten" },
  { value: "voice_messages", label: "Sprachnachrichten" },
  { value: "calls", label: "Telefonieren" },
  { value: "video_calls", label: "Videoanrufe" },
  { value: "in_person", label: "Persönlich treffen" },
  { value: "written_detailed", label: "Ausführlich schreiben" },
  { value: "short_messages", label: "Kurze Nachrichten" },
];

export const RESPONSE_PACE_OPTIONS: { value: ResponsePace; label: string }[] = [
  { value: "fast", label: "Ich antworte meist schnell" },
  { value: "same_day", label: "Ich antworte meist am selben Tag" },
  { value: "takes_time", label: "Meine Antwort kann etwas dauern" },
];

export const INTEREST_OPTIONS = [
  "Musik",
  "Kochen",
  "Gaming",
  "Lesen",
  "Natur",
  "Filme & Serien",
  "Kunst",
  "Handarbeit & Basteln",
  "Sport",
  "Schwimmen",
  "Fotografie",
  "Brettspiele",
  "Tiere",
  "Gärtnern",
  "Podcasts",
  "Wissenschaft",
  "Reisen",
  "Sprachen",
  "Ehrenamt",
  "Museen",
  "Konzerte",
  "Tanzen",
  "Schreiben",
  "Technik",
] as const;

export const VALUE_OPTIONS = [
  "Ehrlichkeit",
  "Verlässlichkeit",
  "Humor",
  "Geduld",
  "Offenheit",
  "Empathie",
  "Selbstbestimmung",
  "Gerechtigkeit",
  "Familie",
  "Freundschaft",
  "Ruhe",
  "Abenteuerlust",
  "Kreativität",
  "Nachhaltigkeit",
  "Direkte Kommunikation",
  "Gleichberechtigung",
] as const;

export const SOCIAL_ACTIVITY_OPTIONS = [
  "Ruhige Cafés",
  "Spaziergänge",
  "Zu Hause gemütlich",
  "Kino",
  "Museen",
  "Konzerte",
  "Gemeinsames Kochen",
  "Online-Gaming",
  "Videocalls",
  "Kleine Gruppen",
  "Ausstellungen",
  "Natur & Ausflüge",
] as const;

/**
 * Reizempfindlichkeiten, orientiert an Dunns Vier-Quadranten-Modell der
 * sensorischen Verarbeitung (Dunn, 1997; validiert u. a. bei Jussila et al.,
 * 2019, PMC6406387). Das Modell unterscheidet Reizschwelle (niedrig/hoch)
 * und Reaktionsstil (aktiv/passiv) — die vier Muster sind:
 * Low Registration, Sensation Seeking, Sensory Sensitivity, Sensation
 * Avoiding. Die Formulierungen hier sind eigene, alltagssprachliche
 * Selbstauskünfte und keine Wiedergabe des kommerziellen Testverfahrens.
 */
export const SENSORY_NEED_OPTIONS = [
  // Sensory Sensitivity — Reize werden schnell bemerkt und als belastend erlebt
  "Laute Umgebungen sind anstrengend",
  "Grelles Licht ist unangenehm",
  "Starke Gerüche sind unangenehm",
  "Bestimmte Stoffe/Texturen sind unangenehm",
  // Sensation Avoiding — Reize werden aktiv vermieden oder kontrolliert
  "Menschenmengen sind anstrengend",
  "Ich brauche Pausen bei vielen Reizen",
  "Berührungen nur nach Absprache",
  "Ich plane Rückzugsmöglichkeiten gerne im Voraus",
  // Low Registration — Reize werden erst spät oder schwach wahrgenommen
  "Ich merke Hunger, Kälte oder Müdigkeit oft erst spät",
  "Hintergrundgeräusche lenken mich kaum ab",
  // Sensation Seeking — intensive Reize werden aktiv gesucht
  "Ich mag intensive Musik, Licht oder Bewegung",
  "Ich brauche eher mehr als weniger Reize, um mich wohlzufühlen",
] as const;

/**
 * Barrierefreiheits- und Unterstützungsbedürfnisse für Treffen, gegliedert
 * nach Bereichen der ICF der WHO (International Classification of
 * Functioning, Disability and Health, 2001). Die ICF versteht Behinderung
 * als Wechselwirkung zwischen Person und Umwelt — deshalb beschreiben die
 * Einträge, was ein ORT oder ein TREFFEN braucht, nicht, was mit einer
 * Person "nicht stimmt". Die ICF-Codes dienen nur der Nachvollziehbarkeit.
 */
export const ACCESSIBILITY_NEED_GROUPS = [
  {
    id: "mobility",
    title: "Wege und Räume",
    icf: "ICF d4 Mobilität, e150 Gebäude",
    options: [
      "Rollstuhlgerechter Treffpunkt",
      "Stufenloser Eingang",
      "Wenig Treppen",
      "Sitzgelegenheiten in der Nähe",
      "Barrierefreies WC",
      "Barrierefrei mit Bus und Bahn erreichbar",
    ],
  },
  {
    id: "senses",
    title: "Licht, Geräusche und Reize",
    icf: "ICF e240 Licht, e250 Laute",
    options: [
      "Ruhige Umgebung",
      "Wenig Hintergrundgeräusche",
      "Gedämpftes Licht",
      "Gute Beleuchtung (z. B. zum Lippenlesen)",
      "Ruhiger Rückzugsort in der Nähe",
    ],
  },
  {
    id: "communication",
    title: "Verständigung",
    icf: "ICF d3 Kommunikation",
    options: [
      "Schriftliche Kommunikation bevorzugt",
      "Lippenlesen — bitte deutlich sprechen",
      "Gebärdensprache",
      "Höranlage / Induktionsschleife",
      "Leichte Sprache",
    ],
  },
  {
    id: "structure",
    title: "Ablauf und Energie",
    icf: "ICF d230 Tagesroutine, d240 Umgang mit Stress",
    options: [
      "Klare Absprachen vorab (Ablauf, Dauer, Ort)",
      "Pausen während des Treffens",
      "Kurze Treffen bevorzugt",
      "Flexible Absagemöglichkeit",
    ],
  },
  {
    id: "support",
    title: "Begleitung und Unterstützung",
    icf: "ICF e340 Assistenz, e350 Assistenztiere",
    options: ["Begleitperson möglich", "Assistenzhund willkommen"],
  },
] as const;

export const ACCESSIBILITY_NEED_OPTIONS: readonly string[] = ACCESSIBILITY_NEED_GROUPS.flatMap(
  (g) => g.options,
);

export const DEALBREAKER_OPTIONS = [
  "Rauchen",
  "Häufiger Alkohol",
  "Keine Haustiere möglich",
  "Unzuverlässigkeit",
  "Kein Interesse an fester Beziehung",
  "Ungefragte Ratschläge",
  "Druck bei Antwortzeiten",
] as const;

export const DATE_TYPE_OPTIONS = [
  { value: "quiet_cafe", label: "Ruhiges Café" },
  { value: "walk", label: "Spaziergang" },
  { value: "video_call", label: "Videocall" },
  { value: "museum", label: "Museum" },
  { value: "gaming", label: "Gemeinsames Gaming" },
  { value: "creative", label: "Kreatives Treffen" },
  { value: "short_coffee", label: "Kurzer Kaffee" },
  { value: "low_stimulus", label: "Reizarmes Treffen" },
  { value: "accessible_trip", label: "Barrierefreier Ausflug" },
] as const;

export const REPORT_CATEGORY_OPTIONS: { value: ReportCategory; label: string }[] = [
  { value: "harassment", label: "Beleidigung oder Belästigung" },
  { value: "ableism", label: "Ableismus" },
  { value: "discrimination", label: "Diskriminierung" },
  { value: "sexual_harassment", label: "Sexuelle Belästigung" },
  { value: "fetishization", label: "Fetischisierung (z. B. von Behinderung oder trans Personen)" },
  { value: "queerphobia", label: "Queerfeindlichkeit" },
  { value: "transphobia", label: "Trans- oder Interfeindlichkeit" },
  { value: "misgendering", label: "Absichtlich falsches Geschlecht oder früherer Name" },
  { value: "outing_threat", label: "Drohung mit Outing" },
  { value: "manipulation", label: "Manipulation oder Druck" },
  { value: "scam", label: "Betrug oder Geldforderung" },
  { value: "stalking", label: "Stalking" },
  { value: "unwanted_medical_advice", label: "Ungefragte medizinische Ratschläge" },
  { value: "diagnosis_pressure", label: "Druck, eine Diagnose offenzulegen" },
  { value: "fake_profile", label: "Gefälschtes Profil" },
  { value: "other", label: "Etwas anderes" },
];

/** Hilfreiche Gesprächseinstiege für neue Matches. */
export const CONVERSATION_STARTERS = [
  "Was gibt dir bei einem ersten Treffen Sicherheit?",
  "Magst du spontane oder geplante Verabredungen lieber?",
  "Was ist ein Thema, über das du stundenlang reden könntest?",
  "Brauchst du manchmal länger, um auf Nachrichten zu antworten?",
  "Was ist dein liebster Ort, um zur Ruhe zu kommen?",
  "Worüber hast du dich diese Woche gefreut?",
  "Wie sieht für dich ein richtig guter, ruhiger Tag aus?",
  "Gibt es etwas, das dir hilft, wenn ein Gespräch ins Stocken gerät?",
] as const;

/**
 * Tone-Tags: in neurodivergenten Online-Communities verbreitete Kürzel, die
 * den Ton einer Nachricht ausdrücklich machen. Eine Studie (CSCW 2025,
 * "Tone Indicators", 18 Gesprächspaare) fand, dass sie die kognitive
 * Belastung beim Deuten des Tons senken. Wir zeigen das Kürzel immer
 * zusammen mit einer deutschen Erklärung, damit niemand raten muss.
 */
export const TONE_TAGS = [
  { tag: "/j", label: "Spaß", description: "Das ist als Scherz gemeint." },
  { tag: "/s", label: "Sarkasmus", description: "Das ist sarkastisch gemeint, nicht wörtlich." },
  { tag: "/gen", label: "ernst gemeinte Frage", description: "Ich frage wirklich, ohne Unterton." },
  { tag: "/srs", label: "ernst", description: "Das meine ich ernst." },
  { tag: "/pos", label: "positiv", description: "Das ist freundlich und positiv gemeint." },
  { tag: "/nm", label: "nicht sauer", description: "Ich bin nicht verärgert." },
  { tag: "/lh", label: "locker", description: "Das ist leicht und unbeschwert gemeint." },
] as const;

export const QUESTIONS_ABOUT_ME_OPTIONS = [
  {
    value: "welcome",
    label: "Fragen sind willkommen",
    description: "Frag ruhig, ich erzähle gern davon.",
  },
  {
    value: "after_getting_to_know",
    label: "Gern, wenn wir uns etwas kennen",
    description: "Lass uns erst über andere Dinge sprechen.",
  },
  {
    value: "not_wanted",
    label: "Lieber keine Fragen dazu",
    description: "Wenn ich etwas teilen möchte, mache ich das von selbst.",
  },
] as const;

export const TODAY_ENERGY_OPTIONS = [
  { value: "high", label: "Heute viel Energie" },
  { value: "medium", label: "Heute mittlere Energie" },
  { value: "low", label: "Heute wenig Energie — Antworten dauern" },
] as const;

/** Vorgefertigte respektvolle Absagen für den Date-Planer. */
export const POLITE_CANCEL_TEMPLATES = [
  "Es tut mir leid, ich muss unser Treffen absagen. Heute reicht meine Energie nicht. Magst du einen neuen Termin finden?",
  "Ich schaffe es diesmal leider nicht. Das hat nichts mit dir zu tun — ich melde mich bald mit einem neuen Vorschlag.",
  "Ich brauche gerade etwas mehr Zeit für mich und möchte unser Treffen verschieben. Danke für dein Verständnis.",
] as const;

/** Freundlich formulierte Beendigung eines Kontakts. */
export const POLITE_UNMATCH_TEMPLATES = [
  "Danke für den Austausch mit dir. Ich spüre aber nicht die passende Verbindung und beende den Kontakt. Alles Gute für dich!",
  "Ich habe gemerkt, dass es für mich nicht passt. Danke für deine Zeit und deine Offenheit — ich wünsche dir viel Glück bei der Suche.",
] as const;

export const CHILDREN_WISH_OPTIONS = [
  { value: "yes", label: "Ja, Kinderwunsch" },
  { value: "no", label: "Nein, kein Kinderwunsch" },
  { value: "open", label: "Offen dafür" },
  { value: "have_children", label: "Habe bereits Kinder" },
] as const;

export const SMOKING_OPTIONS = [
  { value: "no", label: "Nichtraucher:in" },
  { value: "sometimes", label: "Gelegentlich" },
  { value: "yes", label: "Ja" },
] as const;

export const ALCOHOL_OPTIONS = [
  { value: "no", label: "Kein Alkohol" },
  { value: "sometimes", label: "Gelegentlich" },
  { value: "yes", label: "Regelmäßig" },
] as const;

export const PET_OPTIONS = [
  { value: "has_pets", label: "Hat Haustiere" },
  { value: "loves_pets", label: "Mag Tiere" },
  { value: "allergic", label: "Allergie gegen Tiere" },
  { value: "no_pets", label: "Keine Haustiere" },
] as const;

export function labelFor<T extends string>(
  options: readonly { value: T; label: string }[],
  value: string | null | undefined,
): string {
  return options.find((o) => o.value === value)?.label ?? "";
}
