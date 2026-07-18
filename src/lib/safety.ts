/**
 * Sicherheitsfunktionen: Erkennung riskanter Inhalte in Nachrichten.
 * Die Warnungen werden der empfangenden UND der sendenden Person angezeigt —
 * es wird nichts blockiert, sondern verständlich gewarnt.
 */

export type ContentWarningType = "phone_number" | "link" | "bank_data" | "money_request";

export interface ContentWarning {
  type: ContentWarningType;
  message: string;
}

const PHONE_RE = /(\+?\d[\d\s\-/()]{7,}\d)/;
const LINK_RE = /(https?:\/\/|www\.)\S+|\b\S+\.(de|com|net|org|io|app)\b/i;
const IBAN_RE = /\b[A-Z]{2}\d{2}[\sA-Z0-9]{10,30}\b/;
const MONEY_REQUEST_RE =
  /(geld\s*(leihen|schicken|senden|überweisen)|überweis|paypal|western union|gutschein(karte)?|krypto|bitcoin|notfall.*geld|geld.*notfall)/i;

export function detectContentWarnings(text: string): ContentWarning[] {
  const warnings: ContentWarning[] = [];

  if (IBAN_RE.test(text)) {
    warnings.push({
      type: "bank_data",
      message:
        "Diese Nachricht enthält vermutlich Bankdaten. Teile niemals Kontodaten mit Personen, die du noch nicht gut kennst.",
    });
  }
  if (MONEY_REQUEST_RE.test(text)) {
    warnings.push({
      type: "money_request",
      message:
        "Vorsicht: Hier geht es um Geld. Seriöse Kontakte bitten nicht um Geld, Gutscheine oder Überweisungen. Du kannst das Profil jederzeit melden.",
    });
  }
  if (PHONE_RE.test(text)) {
    warnings.push({
      type: "phone_number",
      message:
        "Diese Nachricht enthält vermutlich eine Telefonnummer. Teile deine Nummer nur, wenn du dich damit wirklich wohlfühlst.",
    });
  }
  if (LINK_RE.test(text)) {
    warnings.push({
      type: "link",
      message:
        "Diese Nachricht enthält einen Link. Öffne Links nur, wenn du der Person vertraust.",
    });
  }

  return warnings;
}

/**
 * Einfaches Rate-Limiting (z. B. gegen massenhaftes Liken oder Nachrichten-Spam).
 * Serverseitig wird dies zusätzlich durch Datenbank-Constraints ergänzt.
 */
export function isRateLimited(
  actionTimestamps: string[],
  windowMs: number,
  maxActions: number,
  now: Date = new Date(),
): boolean {
  const windowStart = now.getTime() - windowMs;
  const recent = actionTimestamps.filter((t) => new Date(t).getTime() >= windowStart);
  return recent.length >= maxActions;
}

/**
 * Gliedert lange Nachrichten in gut lesbare Absätze
 * (ADHS-freundliche Anzeige, freiwillig aktivierbar).
 */
export function chunkLongMessage(text: string, maxChunkLength = 280): string[] {
  if (text.length <= maxChunkLength) return [text];
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && (current + " " + sentence).length > maxChunkLength) {
      chunks.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
