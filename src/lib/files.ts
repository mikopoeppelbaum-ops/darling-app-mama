/**
 * Client-seitige Datei-Hilfsfunktionen für Bild-Uploads im Demo-Modus.
 * Die Grenzen spiegeln die Supabase-Storage-Regeln in
 * supabase/migrations/0003_storage.sql (5 MB, JPEG/PNG/WebP), damit sich das
 * Verhalten nicht ändert, sobald echte Uploads angebunden werden.
 */

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Prüft eine Bilddatei und gibt eine verständliche Fehlermeldung zurück (oder null). */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Bitte wähle ein Bild im Format JPEG, PNG oder WebP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Das Bild ist zu groß. Bitte wähle eine Datei bis 5 MB.";
  }
  return null;
}

/** Liest eine Datei als Data-URL (im Demo-Modus statt eines echten Uploads). */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Datei konnte nicht gelesen werden."));
    reader.readAsDataURL(file);
  });
}
