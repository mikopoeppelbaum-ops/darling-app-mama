-- ============================================================
-- EchtNah — Schema-Migration 0001
-- Tabellen, Enums, Indizes, Trigger
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- Enums ----------

create type visibility_level as enum ('public', 'after_match', 'hidden');

create type gender_type as enum (
  'woman', 'man', 'nonbinary', 'genderfluid', 'agender', 'self_described', 'prefer_not_to_say'
);

create type orientation_type as enum (
  'hetero', 'gay', 'lesbian', 'bi', 'pan', 'ace', 'demi', 'queer', 'questioning', 'prefer_not_to_say'
);

create type relationship_goal_type as enum (
  'long_term', 'open_to_anything', 'friendship_first', 'casual', 'companionship'
);

create type contact_frequency_type as enum ('daily', 'few_times_week', 'weekly', 'flexible');

create type planning_style_type as enum ('spontaneous', 'semi_planned', 'structured');

create type energy_level_type as enum ('low', 'medium', 'high', 'varies');

create type response_pace_type as enum ('fast', 'same_day', 'takes_time');

create type match_status_type as enum ('active', 'paused', 'ended');

create type message_status_type as enum ('sent', 'read', 'deleted');

create type report_category_type as enum (
  'harassment', 'ableism', 'discrimination', 'sexual_harassment', 'fetishization',
  'manipulation', 'scam', 'stalking', 'unwanted_medical_advice', 'diagnosis_pressure',
  'fake_profile', 'other'
);

create type report_status_type as enum ('open', 'in_review', 'resolved', 'dismissed');

create type date_plan_status_type as enum (
  'proposed', 'confirmed', 'rescheduled', 'cancelled', 'completed'
);

create type moderation_action_type as enum ('warning', 'temp_ban', 'perma_ban', 'note', 'dismissed');

create type app_role_type as enum ('member', 'moderator', 'admin');

create type consent_type as enum ('privacy_policy', 'terms', 'community_rules', 'sensitive_data');

-- ---------- Hilfsfunktion: updated_at automatisch pflegen ----------

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- users (Rollen; Auth-Daten liegen in auth.users) ----------

create table app_users (
  id uuid primary key references auth.users (id) on delete cascade,
  role app_role_type not null default 'member',
  -- Sperren durch Moderation
  banned_until timestamptz,
  banned_permanently boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger app_users_updated_at before update on app_users
  for each row execute function set_updated_at();

-- ---------- profiles ----------

create table profiles (
  id uuid primary key references app_users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  -- Geburtsdatum bleibt privat; nach außen wird nur das Alter berechnet.
  birthdate date not null check (birthdate <= (current_date - interval '18 years')),
  gender gender_type not null default 'prefer_not_to_say',
  gender_self_described text,
  pronouns text check (char_length(pronouns) <= 30),
  orientation orientation_type not null default 'prefer_not_to_say',
  orientation_visibility visibility_level not null default 'public',
  -- Nur ungefährer Standort: Stadtname + auf ~2 Nachkommastellen gerundete Koordinaten.
  city text not null default '',
  approx_lat numeric(5, 2),
  approx_lng numeric(5, 2),
  bio text not null default '' check (char_length(bio) <= 600),
  relationship_goal relationship_goal_type not null default 'open_to_anything',
  contact_frequency contact_frequency_type not null default 'flexible',
  planning_style planning_style_type not null default 'semi_planned',
  energy_level energy_level_type not null default 'varies',
  response_pace response_pace_type not null default 'same_day',
  social_activities text[] not null default '{}',
  sensory_needs text[] not null default '{}',
  boundaries text not null default '' check (char_length(boundaries) <= 600),
  prompts jsonb not null default '{}',
  lifestyle jsonb not null default '{}',
  slow_replies boolean not null default false,
  paused_need_time boolean not null default false,
  onboarding_step int not null default 0,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

create index profiles_city_idx on profiles (city);
create index profiles_gender_idx on profiles (gender);
create index profiles_goal_idx on profiles (relationship_goal);

-- ---------- profile_photos ----------

create table profile_photos (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles (id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '' check (char_length(alt_text) <= 200),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index profile_photos_profile_idx on profile_photos (profile_id);

-- ---------- preferences (Suchpräferenzen) ----------

create table preferences (
  profile_id uuid primary key references profiles (id) on delete cascade,
  seeking_genders gender_type[] not null default '{}',
  age_min int not null default 18 check (age_min >= 18),
  age_max int not null default 99 check (age_max >= 18),
  max_distance_km int not null default 50 check (max_distance_km between 1 and 500),
  relationship_goals relationship_goal_type[] not null default '{}',
  dealbreakers text[] not null default '{}',
  updated_at timestamptz not null default now(),
  check (age_min <= age_max)
);

create trigger preferences_updated_at before update on preferences
  for each row execute function set_updated_at();

-- ---------- communication_preferences ----------

create table communication_preferences (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles (id) on delete cascade,
  style text not null,
  unique (profile_id, style)
);

create index communication_preferences_profile_idx on communication_preferences (profile_id);

-- ---------- accessibility_needs ----------

create table accessibility_needs (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles (id) on delete cascade,
  need text not null,
  visibility visibility_level not null default 'after_match',
  unique (profile_id, need)
);

create index accessibility_needs_profile_idx on accessibility_needs (profile_id);

-- ---------- disclosures (freiwillige sensible Angaben) ----------

create table disclosures (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles (id) on delete cascade,
  label text not null check (char_length(label) between 2 and 80),
  description text check (char_length(description) <= 300),
  visibility visibility_level not null default 'hidden',
  -- Nur wenn true darf die Angabe in Suchfiltern anderer auftauchen.
  searchable boolean not null default false,
  created_at timestamptz not null default now()
);

create index disclosures_profile_idx on disclosures (profile_id);

-- ---------- interests / values (Kataloge + Zuordnung) ----------

create table interests (
  id serial primary key,
  name text not null unique
);

create table profile_interests (
  profile_id uuid not null references profiles (id) on delete cascade,
  interest_id int not null references interests (id) on delete cascade,
  primary key (profile_id, interest_id)
);

create table values_catalog (
  id serial primary key,
  name text not null unique
);

create table profile_values (
  profile_id uuid not null references profiles (id) on delete cascade,
  value_id int not null references values_catalog (id) on delete cascade,
  primary key (profile_id, value_id)
);

-- ---------- likes ----------

create table likes (
  id uuid primary key default uuid_generate_v4(),
  from_profile_id uuid not null references profiles (id) on delete cascade,
  to_profile_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (from_profile_id, to_profile_id),
  check (from_profile_id <> to_profile_id)
);

create index likes_to_idx on likes (to_profile_id);
create index likes_from_created_idx on likes (from_profile_id, created_at);

-- ---------- skips (Überspringen inkl. Zurück-Funktion) ----------

create table skips (
  id uuid primary key default uuid_generate_v4(),
  from_profile_id uuid not null references profiles (id) on delete cascade,
  to_profile_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (from_profile_id, to_profile_id)
);

-- ---------- matches ----------

create table matches (
  id uuid primary key default uuid_generate_v4(),
  profile_a uuid not null references profiles (id) on delete cascade,
  profile_b uuid not null references profiles (id) on delete cascade,
  status match_status_type not null default 'active',
  ended_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (profile_a < profile_b),
  unique (profile_a, profile_b)
);

create trigger matches_updated_at before update on matches
  for each row execute function set_updated_at();

create index matches_a_idx on matches (profile_a);
create index matches_b_idx on matches (profile_b);

-- Match automatisch anlegen, wenn beide sich geliked haben.
create or replace function create_match_on_mutual_like()
returns trigger language plpgsql security definer as $$
begin
  if exists (
    select 1 from likes
    where from_profile_id = new.to_profile_id and to_profile_id = new.from_profile_id
  ) then
    insert into matches (profile_a, profile_b)
    values (least(new.from_profile_id, new.to_profile_id),
            greatest(new.from_profile_id, new.to_profile_id))
    on conflict (profile_a, profile_b) do nothing;
  end if;
  return new;
end $$;

create trigger likes_create_match after insert on likes
  for each row execute function create_match_on_mutual_like();

-- ---------- conversations / conversation_settings ----------

-- Eine Konversation entspricht genau einem Match; eigene Einstellungen pro Person.
create table conversation_settings (
  match_id uuid not null references matches (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  muted boolean not null default false,
  important boolean not null default false,
  read_receipts boolean not null default true,
  typing_indicator boolean not null default true,
  draft text,
  updated_at timestamptz not null default now(),
  primary key (match_id, profile_id)
);

create trigger conversation_settings_updated_at before update on conversation_settings
  for each row execute function set_updated_at();

-- ---------- messages ----------

create table messages (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid not null references matches (id) on delete cascade,
  sender_profile_id uuid not null references profiles (id) on delete cascade,
  body text not null default '' check (char_length(body) <= 4000),
  image_path text,
  -- Sprachnachrichten: technisch vorbereitet, im MVP noch nicht aktiv.
  audio_path text,
  status message_status_type not null default 'sent',
  answer_later boolean not null default false,
  remind_at timestamptz,
  created_at timestamptz not null default now()
);

create index messages_match_created_idx on messages (match_id, created_at);
create index messages_sender_created_idx on messages (sender_profile_id, created_at);

-- ---------- saved_profiles ----------

create table saved_profiles (
  profile_id uuid not null references profiles (id) on delete cascade,
  saved_profile_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, saved_profile_id)
);

-- ---------- blocked_users ----------

create table blocked_users (
  blocker_profile_id uuid not null references profiles (id) on delete cascade,
  blocked_profile_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_profile_id, blocked_profile_id)
);

-- ---------- reports ----------

create table reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_profile_id uuid not null references profiles (id) on delete cascade,
  reported_profile_id uuid not null references profiles (id) on delete cascade,
  message_id uuid references messages (id) on delete set null,
  category report_category_type not null,
  description text not null check (char_length(description) between 10 and 2000),
  status report_status_type not null default 'open',
  moderator_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger reports_updated_at before update on reports
  for each row execute function set_updated_at();

create index reports_status_idx on reports (status);
create index reports_reported_idx on reports (reported_profile_id);

-- ---------- date_plans ----------

create table date_plans (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid not null references matches (id) on delete cascade,
  created_by_profile_id uuid not null references profiles (id) on delete cascade,
  date_type text not null,
  starts_at timestamptz not null,
  duration_minutes int not null default 60 check (duration_minutes between 15 and 600),
  location_name text not null,
  location_notes text,
  -- Vorbereitet für spätere Karten-/Location-Anbindung (z. B. OSM/Google Place-ID).
  external_place_id text,
  accessibility_requirements text[] not null default '{}',
  notes text,
  status date_plan_status_type not null default 'proposed',
  reminders_enabled boolean not null default true,
  safety_contact_name text,
  safety_contact_phone text,
  safety_code text,
  share_with_trusted_person boolean not null default false,
  check_in_done boolean not null default false,
  last_change_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger date_plans_updated_at before update on date_plans
  for each row execute function set_updated_at();

create index date_plans_match_idx on date_plans (match_id);
create index date_plans_starts_idx on date_plans (starts_at);

-- ---------- notifications ----------

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles (id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_profile_idx on notifications (profile_id, read);

create table notification_settings (
  profile_id uuid primary key references profiles (id) on delete cascade,
  new_matches boolean not null default true,
  new_messages boolean not null default true,
  date_reminders boolean not null default true,
  bundled boolean not null default false,
  bundle_interval_minutes int not null default 60,
  updated_at timestamptz not null default now()
);

create trigger notification_settings_updated_at before update on notification_settings
  for each row execute function set_updated_at();

-- ---------- privacy_settings ----------

create table privacy_settings (
  profile_id uuid primary key references profiles (id) on delete cascade,
  show_age boolean not null default true,
  show_city boolean not null default true,
  show_pronouns boolean not null default true,
  show_last_active boolean not null default false,
  incognito boolean not null default false,
  updated_at timestamptz not null default now()
);

create trigger privacy_settings_updated_at before update on privacy_settings
  for each row execute function set_updated_at();

-- ---------- consent_records (Einwilligungen protokollieren) ----------

create table consent_records (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references app_users (id) on delete cascade,
  consent consent_type not null,
  version text not null,
  given_at timestamptz not null default now()
);

create index consent_records_profile_idx on consent_records (profile_id);

-- ---------- moderation_actions + audit_log ----------

create table moderation_actions (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid references reports (id) on delete set null,
  target_profile_id uuid not null references profiles (id) on delete cascade,
  moderator_id uuid not null references app_users (id),
  action moderation_action_type not null,
  reason text not null,
  -- Einspruch: technisch vorbereitet
  appeal_text text,
  appeal_status text,
  created_at timestamptz not null default now()
);

create index moderation_actions_target_idx on moderation_actions (target_profile_id);

create table audit_log (
  id bigserial primary key,
  actor_id uuid references app_users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  -- Keine sensiblen Inhalte im Log — nur Metadaten.
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index audit_log_actor_idx on audit_log (actor_id, created_at);

-- ---------- Rate-Limiting (Schutz vor massenhaftem Liken / Spam) ----------

create or replace function enforce_like_rate_limit()
returns trigger language plpgsql as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from likes
  where from_profile_id = new.from_profile_id
    and created_at > now() - interval '1 minute';
  if recent_count >= 10 then
    raise exception 'Zu viele Likes in kurzer Zeit. Bitte mache eine kurze Pause.'
      using errcode = 'P0001';
  end if;
  return new;
end $$;

create trigger likes_rate_limit before insert on likes
  for each row execute function enforce_like_rate_limit();

create or replace function enforce_message_rate_limit()
returns trigger language plpgsql as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from messages
  where sender_profile_id = new.sender_profile_id
    and created_at > now() - interval '1 minute';
  if recent_count >= 30 then
    raise exception 'Zu viele Nachrichten in kurzer Zeit. Bitte mache eine kurze Pause.'
      using errcode = 'P0001';
  end if;
  return new;
end $$;

create trigger messages_rate_limit before insert on messages
  for each row execute function enforce_message_rate_limit();
