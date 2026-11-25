-- ============================================================
-- EchtNah — Migration 0004: LGBTQIA+-Inklusion
-- Ergänzt Geschlechter, Orientierungs-Angaben, Beziehungsform,
-- diskreten Modus und neue Meldegründe.
-- ============================================================

alter type gender_type add value if not exists 'trans_woman' after 'man';
alter type gender_type add value if not exists 'trans_man' after 'trans_woman';

alter type report_category_type add value if not exists 'queerphobia';
alter type report_category_type add value if not exists 'transphobia';
alter type report_category_type add value if not exists 'misgendering';
alter type report_category_type add value if not exists 'outing_threat';

create type romantic_orientation_type as enum (
  'aromantic', 'heteroromantic', 'homoromantic', 'biromantic', 'panromantic',
  'demiromantic', 'prefer_not_to_say'
);

create type relationship_structure_type as enum (
  'monogamous', 'open', 'polyamorous', 'figuring_out'
);

alter table profiles
  -- Mehrfachauswahl; `orientation` bleibt als primäre Angabe erhalten.
  add column orientations orientation_type[] not null default '{}',
  add column romantic_orientation romantic_orientation_type,
  -- Inter* ist eine körperliche Variante und damit Gesundheitsdatum (Art. 9 DSGVO):
  -- freiwillig, eigene Sichtbarkeit, standardmäßig verborgen.
  add column inter boolean not null default false,
  add column inter_visibility visibility_level not null default 'hidden',
  add column relationship_structure relationship_structure_type;

alter table privacy_settings
  add column discreet_mode boolean not null default false;

-- Diskreter Modus auf Datenbankebene: Ein Profil im diskreten Modus ist nur
-- für Personen lesbar, die zu den Suchkriterien der Inhaber:in passen
-- (Geschlecht; trans Frauen zählen als Frauen, trans Männer als Männer).
create or replace function passes_discreet_mode(owner uuid)
returns boolean language sql stable security definer as $$
  select
    not coalesce((select discreet_mode from privacy_settings where profile_id = owner), false)
    or owner = auth.uid()
    or exists (
      select 1
      from preferences pr
      join profiles viewer on viewer.id = auth.uid()
      where pr.profile_id = owner
        and (
          cardinality(pr.seeking_genders) = 0
          -- Vergleich als Text: neue Enum-Werte dürfen in derselben
          -- Transaktion nicht als Literal verwendet werden.
          or viewer.gender::text = any (pr.seeking_genders::text[])
          or (viewer.gender::text = 'trans_woman' and 'woman' = any (pr.seeking_genders::text[]))
          or (viewer.gender::text = 'trans_man' and 'man' = any (pr.seeking_genders::text[]))
        )
    )
$$;

drop policy if exists "Profile lesen" on profiles;
create policy "Profile lesen" on profiles
  for select using (
    id = auth.uid()
    or is_admin_or_moderator()
    or (
      onboarding_completed
      and not is_blocked_between(auth.uid(), id)
      and passes_discreet_mode(id)
    )
  );
