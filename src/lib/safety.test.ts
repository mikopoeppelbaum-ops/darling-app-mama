import { describe, expect, it } from "vitest";
import { chunkLongMessage, detectContentWarnings, isRateLimited } from "@/lib/safety";

describe("detectContentWarnings", () => {
  it("warnt vor Telefonnummern", () => {
    const warnings = detectContentWarnings("Ruf mich an: 0171 2345678");
    expect(warnings.some((w) => w.type === "phone_number")).toBe(true);
  });

  it("warnt vor Links", () => {
    expect(
      detectContentWarnings("Schau mal: https://beispiel.de/xyz").some((w) => w.type === "link"),
    ).toBe(true);
    expect(
      detectContentWarnings("Auf www.beispiel.com gibts das").some((w) => w.type === "link"),
    ).toBe(true);
  });

  it("warnt vor Bankdaten (IBAN)", () => {
    const warnings = detectContentWarnings("Meine IBAN ist DE89370400440532013000");
    expect(warnings.some((w) => w.type === "bank_data")).toBe(true);
  });

  it("warnt vor Geldforderungen", () => {
    const warnings = detectContentWarnings(
      "Ich habe einen Notfall, kannst du mir Geld schicken? Gerne per PayPal.",
    );
    expect(warnings.some((w) => w.type === "money_request")).toBe(true);
  });

  it("warnt nicht bei harmlosen Nachrichten", () => {
    expect(detectContentWarnings("Magst du am Samstag ins Museum?")).toHaveLength(0);
  });
});

describe("isRateLimited", () => {
  it("limitiert massenhafte Aktionen im Zeitfenster", () => {
    const now = new Date("2026-07-18T12:00:00Z");
    const recent = Array.from({ length: 10 }, (_, i) =>
      new Date(now.getTime() - i * 1000).toISOString(),
    );
    expect(isRateLimited(recent, 60_000, 10, now)).toBe(true);
    expect(isRateLimited(recent.slice(0, 5), 60_000, 10, now)).toBe(false);
  });

  it("ignoriert alte Aktionen außerhalb des Fensters", () => {
    const now = new Date("2026-07-18T12:00:00Z");
    const old = Array.from({ length: 20 }, () => "2026-07-18T10:00:00Z");
    expect(isRateLimited(old, 60_000, 10, now)).toBe(false);
  });
});

describe("chunkLongMessage", () => {
  it("lässt kurze Nachrichten unverändert", () => {
    expect(chunkLongMessage("Hallo!")).toEqual(["Hallo!"]);
  });

  it("teilt lange Nachrichten an Satzgrenzen", () => {
    const long = Array.from(
      { length: 10 },
      (_, i) => `Das ist Satz Nummer ${i + 1} mit etwas Inhalt.`,
    ).join(" ");
    const chunks = chunkLongMessage(long, 120);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join(" ")).toBe(long);
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(120);
  });
});
