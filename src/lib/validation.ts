import { z } from "zod";
import { ageFromBirthdate } from "@/lib/utils";

/** Verständliche deutsche Fehlermeldungen in einfacher Sprache. */

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Bitte gib deine E-Mail-Adresse ein.")
  .email("Diese E-Mail-Adresse sieht nicht richtig aus. Bitte prüfe sie noch einmal.");

export const passwordSchema = z
  .string()
  .min(
    10,
    "Dein Passwort braucht mindestens 10 Zeichen. Ein längerer Satz ist leicht zu merken und sicher.",
  );

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
    birthdate: z
      .string()
      .min(1, "Bitte gib dein Geburtsdatum ein.")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Bitte gib ein gültiges Datum ein.")
      .refine(
        (v) => Number.isNaN(Date.parse(v)) || ageFromBirthdate(v) >= 18,
        "EchtNah ist ab 18 Jahren. Du kannst dich leider noch nicht registrieren.",
      )
      .refine(
        (v) => Number.isNaN(Date.parse(v)) || ageFromBirthdate(v) <= 120,
        "Bitte prüfe dein Geburtsdatum noch einmal.",
      ),
    acceptPrivacy: z.literal(true, {
      message: "Bitte stimme der Datenschutzerklärung zu.",
    }),
    acceptTerms: z.literal(true, {
      message: "Bitte stimme den Nutzungsbedingungen zu.",
    }),
    acceptCommunityRules: z.literal(true, {
      message: "Bitte stimme den Community-Regeln zu.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Die beiden Passwörter sind nicht gleich. Bitte gib sie noch einmal ein.",
    path: ["passwordConfirm"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Bitte gib dein Passwort ein."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const mfaCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Bitte gib den 6-stelligen Code aus deiner Authenticator-App ein.");

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, "Dein Anzeigename braucht mindestens 2 Zeichen.")
  .max(40, "Dein Anzeigename darf höchstens 40 Zeichen lang sein.");

export const bioSchema = z
  .string()
  .trim()
  .max(600, "Dein Profiltext darf höchstens 600 Zeichen lang sein.");

export const profileBasicsSchema = z.object({
  displayName: displayNameSchema,
  pronouns: z.string().trim().max(30, "Bitte höchstens 30 Zeichen.").optional().or(z.literal("")),
  city: z.string().trim().min(2, "Bitte gib deinen Ort an. Ein Stadtname reicht."),
  bio: bioSchema,
});

export type ProfileBasicsInput = z.infer<typeof profileBasicsSchema>;

export const visibilitySchema = z.enum(["public", "after_match", "hidden"]);

export const disclosureSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Bitte gib eine kurze Bezeichnung ein — deine eigenen Worte sind genau richtig.")
    .max(80, "Bitte höchstens 80 Zeichen."),
  description: z.string().trim().max(300, "Bitte höchstens 300 Zeichen.").optional(),
  visibility: visibilitySchema,
  searchable: z.boolean(),
});

export const messageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Die Nachricht ist noch leer.")
    .max(4000, "Die Nachricht ist zu lang. Bitte höchstens 4000 Zeichen."),
});

export const datePlanSchema = z.object({
  dateType: z.string().min(1, "Bitte wähle eine Art von Treffen aus."),
  startsAt: z
    .string()
    .min(1, "Bitte wähle Datum und Uhrzeit aus.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Bitte gib ein gültiges Datum ein.")
    .refine(
      (v) => Number.isNaN(Date.parse(v)) || Date.parse(v) > Date.now(),
      "Das Datum liegt in der Vergangenheit. Bitte wähle einen Termin in der Zukunft.",
    ),
  durationMinutes: z
    .number({ message: "Bitte gib die Dauer in Minuten an." })
    .int()
    .min(15, "Ein Treffen dauert mindestens 15 Minuten.")
    .max(600, "Bitte höchstens 10 Stunden eintragen."),
  locationName: z
    .string()
    .trim()
    .min(2, "Bitte gib einen Treffpunkt an — z. B. den Namen eines Cafés."),
  locationNotes: z
    .string()
    .trim()
    .max(300, "Bitte höchstens 300 Zeichen.")
    .optional()
    .or(z.literal("")),
  accessibilityRequirements: z.array(z.string()),
  notes: z.string().trim().max(500, "Bitte höchstens 500 Zeichen.").optional().or(z.literal("")),
  remindersEnabled: z.boolean(),
  safetyContactName: z.string().trim().max(80).optional().or(z.literal("")),
  safetyContactPhone: z.string().trim().max(30).optional().or(z.literal("")),
  shareWithTrustedPerson: z.boolean(),
});

export type DatePlanInput = z.infer<typeof datePlanSchema>;

export const reportSchema = z.object({
  category: z.string().min(1, "Bitte wähle aus, worum es geht."),
  description: z
    .string()
    .trim()
    .min(
      10,
      "Bitte beschreibe kurz, was passiert ist (mindestens 10 Zeichen). Das hilft uns bei der Prüfung.",
    )
    .max(2000, "Bitte höchstens 2000 Zeichen."),
});

export type ReportInput = z.infer<typeof reportSchema>;
