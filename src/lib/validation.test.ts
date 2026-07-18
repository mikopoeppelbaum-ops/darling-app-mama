import { describe, expect, it } from "vitest";
import {
  datePlanSchema,
  disclosureSchema,
  messageSchema,
  profileBasicsSchema,
  registerSchema,
  reportSchema,
} from "@/lib/validation";

const validRegistration = {
  email: "test@example.com",
  password: "ein-langes-passwort",
  passwordConfirm: "ein-langes-passwort",
  birthdate: "1990-01-01",
  acceptPrivacy: true as const,
  acceptTerms: true as const,
  acceptCommunityRules: true as const,
};

describe("registerSchema", () => {
  it("akzeptiert gültige Registrierungen", () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it("verlangt ein Mindestalter von 18 Jahren", () => {
    const seventeenYearsAgo = new Date();
    seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17);
    const result = registerSchema.safeParse({
      ...validRegistration,
      birthdate: seventeenYearsAgo.toISOString().slice(0, 10),
    });
    expect(result.success).toBe(false);
  });

  it("verlangt alle Einwilligungen", () => {
    expect(
      registerSchema.safeParse({ ...validRegistration, acceptPrivacy: false }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({ ...validRegistration, acceptCommunityRules: false }).success,
    ).toBe(false);
  });

  it("prüft die Passwort-Wiederholung", () => {
    const result = registerSchema.safeParse({ ...validRegistration, passwordConfirm: "anders" });
    expect(result.success).toBe(false);
  });

  it("liefert verständliche deutsche Fehlermeldungen", () => {
    const result = registerSchema.safeParse({ ...validRegistration, email: "keine-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/E-Mail-Adresse/);
    }
  });
});

describe("profileBasicsSchema", () => {
  it("akzeptiert gültige Profildaten", () => {
    expect(
      profileBasicsSchema.safeParse({
        displayName: "Alex",
        pronouns: "they/them",
        city: "Köln",
        bio: "Hallo!",
      }).success,
    ).toBe(true);
  });

  it("lehnt zu kurze Anzeigenamen ab", () => {
    expect(
      profileBasicsSchema.safeParse({ displayName: "A", city: "Köln", bio: "" }).success,
    ).toBe(false);
  });
});

describe("disclosureSchema", () => {
  it("akzeptiert freiwillige Angaben mit Sichtbarkeit", () => {
    expect(
      disclosureSchema.safeParse({
        label: "ADHS",
        visibility: "after_match",
        searchable: false,
      }).success,
    ).toBe(true);
  });
});

describe("messageSchema", () => {
  it("lehnt leere Nachrichten ab", () => {
    expect(messageSchema.safeParse({ body: "   " }).success).toBe(false);
    expect(messageSchema.safeParse({ body: "Hi!" }).success).toBe(true);
  });
});

describe("datePlanSchema", () => {
  const base = {
    dateType: "quiet_cafe",
    startsAt: new Date(Date.now() + 86_400_000).toISOString().slice(0, 16),
    durationMinutes: 60,
    locationName: "Café Ruhepol",
    accessibilityRequirements: [],
    remindersEnabled: true,
    shareWithTrustedPerson: false,
  };

  it("akzeptiert gültige Pläne", () => {
    expect(datePlanSchema.safeParse(base).success).toBe(true);
  });

  it("lehnt Termine in der Vergangenheit ab", () => {
    expect(
      datePlanSchema.safeParse({ ...base, startsAt: "2020-01-01T10:00" }).success,
    ).toBe(false);
  });

  it("verlangt einen Treffpunkt", () => {
    expect(datePlanSchema.safeParse({ ...base, locationName: "" }).success).toBe(false);
  });
});

describe("reportSchema", () => {
  it("verlangt Kategorie und Beschreibung", () => {
    expect(
      reportSchema.safeParse({ category: "ableism", description: "Die Person hat mich wiederholt abgewertet." }).success,
    ).toBe(true);
    expect(reportSchema.safeParse({ category: "", description: "zu kurz" }).success).toBe(false);
  });
});
