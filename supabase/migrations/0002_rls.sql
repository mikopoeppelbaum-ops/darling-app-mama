-- ============================================================
-- EchtNah — Migration 0002: Row Level Security
--
-- Grundsätze:
--  * Standard ist "alles verboten"; jede Erlaubnis ist explizit.
--  * Sensible Angaben (disclosures, accessibility_needs) sind nur für die
--    eigene Person, Matches (je nach Sichtbarkeit) und Moderation lesbar.
--  * Blockierte Personen sehen einander nicht.
-- ============================================================

-- ---------- Hilfsfunktionen ----------

create or replace function current_profile_id()
returns uuid language sql stable as $$
  select auth.uid()
$$;

create or replace function is_admin_or_moderator()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from app_users
    where id = auth.uid() and role in ('admin', 'moderator')
  )
$$;

create or replace function is_matched_with(other uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from matches
    where status <> 'ended'
      and ((profile_a = auth.uid() and profile_b = other)
        or (profile_b = auth.uid() and profile_a = other))
  )
$$;

create or replace function is_blocked_between(a uuid, b uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from blocked_users
    where (blocker_profile_id = a and blocked_profile_id = b)
       or (blocker_profile_id = b and blocked_profile_id = a)
  )
$$;

create or replace function is_member_of_match(m uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from matches
    where id = m and (profile_a = auth.uid() or profile_b = auth.uid())
  )
$$;

-- ---------- app_users ----------

alter table app_users enable row level security;

create policy "eigene Rolle lesen" on app_users
  for select using (id = auth.uid() or is_admin_or_moderator());

-- Rollen werden ausschließlich serverseitig (service_role) vergeben.

-- ---------- profiles ----------

alter table profiles enable row level security;

create policy "Profile lesen" on profiles
  for select using (
    id = auth.uid()
    or is_admin_or_moderator()
    or (
      onboarding_completed
      and not is_blocked_between(auth.uid(), id)
    )
  );

create policy "eigenes Profil anlegen" on profiles
  for insert with check (id = auth.uid());

create policy "eigenes Profil ändern" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "eigenes Profil löschen" on profiles
  for delete using (id = auth.uid());

-- ---------- profile_photos ----------

alter table profile_photos enable row level security;

create policy "Fotos lesen" on profile_photos
  for select using (
    profile_id = auth.uid()
    or is_admin_or_moderator()
    or not is_blocked_between(auth.uid(), profile_id)
  );

create policy "eigene Fotos verwalten" on profile_photos
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- preferences ----------

alter table preferences enable row level security;

create policy "eigene Präferenzen" on preferences
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- communication_preferences ----------

alter table communication_preferences enable row level security;

create policy "Kommunikationsstile lesen" on communication_preferences
  for select using (
    profile_id = auth.uid() or not is_blocked_between(auth.uid(), profile_id)
  );

create policy "eigene Kommunikationsstile verwalten" on communication_preferences
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- accessibility_needs (sensibel) ----------

alter table accessibility_needs enable row level security;

create policy "Barrierefreiheitsbedürfnisse lesen" on accessibility_needs
  for select using (
    profile_id = auth.uid()
    or (visibility = 'public' and not is_blocked_between(auth.uid(), profile_id))
    or (visibility = 'after_match' and is_matched_with(profile_id))
  );

create policy "eigene Barrierefreiheitsbedürfnisse verwalten" on accessibility_needs
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- disclosures (besonders sensibel) ----------

alter table disclosures enable row level security;

-- Bewusst KEIN Moderationszugriff auf freiwillige Diagnose-Angaben.
create policy "Disclosures lesen" on disclosures
  for select using (
    profile_id = auth.uid()
    or (visibility = 'public' and not is_blocked_between(auth.uid(), profile_id))
    or (visibility = 'after_match' and is_matched_with(profile_id))
  );

create policy "eigene Disclosures verwalten" on disclosures
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- interests / values ----------

alter table interests enable row level security;
alter table values_catalog enable row level security;

create policy "Katalog lesen (interests)" on interests for select using (true);
create policy "Katalog lesen (values)" on values_catalog for select using (true);

alter table profile_interests enable row level security;

create policy "Profil-Interessen lesen" on profile_interests
  for select using (
    profile_id = auth.uid() or not is_blocked_between(auth.uid(), profile_id)
  );

create policy "eigene Interessen verwalten" on profile_interests
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

alter table profile_values enable row level security;

create policy "Profil-Werte lesen" on profile_values
  for select using (
    profile_id = auth.uid() or not is_blocked_between(auth.uid(), profile_id)
  );

create policy "eigene Werte verwalten" on profile_values
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- likes ----------

alter table likes enable row level security;

create policy "eigene Likes lesen" on likes
  for select using (from_profile_id = auth.uid());

create policy "Like senden" on likes
  for insert with check (
    from_profile_id = auth.uid()
    and not is_blocked_between(from_profile_id, to_profile_id)
  );

create policy "eigenes Like zurücknehmen" on likes
  for delete using (from_profile_id = auth.uid());

-- ---------- skips ----------

alter table skips enable row level security;

create policy "eigene Skips" on skips
  for all using (from_profile_id = auth.uid()) with check (from_profile_id = auth.uid());

-- ---------- matches ----------

alter table matches enable row level security;

create policy "eigene Matches lesen" on matches
  for select using (profile_a = auth.uid() or profile_b = auth.uid());

-- Matches entstehen nur über den Trigger (security definer); Status darf
-- von beiden Beteiligten geändert werden (pausieren/beenden).
create policy "Match-Status ändern" on matches
  for update using (profile_a = auth.uid() or profile_b = auth.uid())
  with check (profile_a = auth.uid() or profile_b = auth.uid());

-- ---------- conversation_settings ----------

alter table conversation_settings enable row level security;

create policy "eigene Chat-Einstellungen" on conversation_settings
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- messages ----------

alter table messages enable row level security;

create policy "Nachrichten im eigenen Match lesen" on messages
  for select using (is_member_of_match(match_id));

create policy "Nachricht senden" on messages
  for insert with check (
    sender_profile_id = auth.uid()
    and is_member_of_match(match_id)
    -- In beendeten oder pausierten Matches kann nicht geschrieben werden.
    and exists (select 1 from matches where id = match_id and status = 'active')
  );

create policy "eigene Nachricht löschen/ändern" on messages
  for update using (sender_profile_id = auth.uid())
  with check (sender_profile_id = auth.uid());

-- ---------- saved_profiles ----------

alter table saved_profiles enable row level security;

create policy "eigene gespeicherte Profile" on saved_profiles
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- blocked_users ----------

alter table blocked_users enable row level security;

create policy "eigene Blockliste" on blocked_users
  for all using (blocker_profile_id = auth.uid())
  with check (blocker_profile_id = auth.uid());

-- ---------- reports ----------

alter table reports enable row level security;

create policy "Meldung erstellen" on reports
  for insert with check (reporter_profile_id = auth.uid());

create policy "eigene Meldungen lesen" on reports
  for select using (reporter_profile_id = auth.uid() or is_admin_or_moderator());

create policy "Moderation bearbeitet Meldungen" on reports
  for update using (is_admin_or_moderator()) with check (is_admin_or_moderator());

-- ---------- date_plans ----------

alter table date_plans enable row level security;

create policy "Date-Pläne im eigenen Match" on date_plans
  for select using (is_member_of_match(match_id));

create policy "Date-Plan erstellen" on date_plans
  for insert with check (
    created_by_profile_id = auth.uid() and is_member_of_match(match_id)
  );

create policy "Date-Plan ändern" on date_plans
  for update using (is_member_of_match(match_id))
  with check (is_member_of_match(match_id));

-- Sicherheitskontakt & Sicherheitscode sind nur für die erstellende Person
-- gedacht; die Anwendung blendet diese Felder für die andere Person aus
-- (zusätzlich zur RLS wäre hier eine View möglich — offener Punkt).

-- ---------- notifications ----------

alter table notifications enable row level security;

create policy "eigene Benachrichtigungen" on notifications
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

alter table notification_settings enable row level security;

create policy "eigene Benachrichtigungs-Einstellungen" on notification_settings
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- privacy_settings ----------

alter table privacy_settings enable row level security;

create policy "eigene Privatsphäre-Einstellungen" on privacy_settings
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------- consent_records ----------

alter table consent_records enable row level security;

create policy "eigene Einwilligungen lesen" on consent_records
  for select using (profile_id = auth.uid());

create policy "Einwilligung protokollieren" on consent_records
  for insert with check (profile_id = auth.uid());

-- Einwilligungen können nicht gelöscht oder geändert werden (Nachweisbarkeit).

-- ---------- moderation_actions ----------

alter table moderation_actions enable row level security;

create policy "Moderation verwaltet Aktionen" on moderation_actions
  for all using (is_admin_or_moderator()) with check (is_admin_or_moderator());

create policy "eigene Verwarnungen lesen" on moderation_actions
  for select using (target_profile_id = auth.uid());

-- ---------- audit_log ----------

alter table audit_log enable row level security;

create policy "Audit-Log nur für Admins" on audit_log
  for select using (is_admin_or_moderator());

create policy "Audit-Einträge schreiben" on audit_log
  for insert with check (actor_id = auth.uid() or is_admin_or_moderator());
