import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase-Browser-Client. Die App läuft ohne Konfiguration im Demo-Modus —
 * dann liefert diese Funktion null und die Demo-Datenschicht übernimmt.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
