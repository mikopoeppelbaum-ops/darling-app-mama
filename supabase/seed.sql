-- ============================================================
-- EchtNah — Seed-Daten (nur für lokale Entwicklung!)
-- Vollständig fiktive Personen. Passwort aller Demo-Konten: "demo-passwort-123"
-- ============================================================

-- ---------- Kataloge ----------

insert into interests (name) values
  ('Musik'), ('Kochen'), ('Gaming'), ('Lesen'), ('Natur'), ('Filme & Serien'),
  ('Kunst'), ('Handarbeit & Basteln'), ('Sport'), ('Schwimmen'), ('Fotografie'),
  ('Brettspiele'), ('Tiere'), ('Gärtnern'), ('Podcasts'), ('Wissenschaft'),
  ('Reisen'), ('Sprachen'), ('Ehrenamt'), ('Museen'), ('Konzerte'), ('Tanzen'),
  ('Schreiben'), ('Technik')
on conflict (name) do nothing;

insert into values_catalog (name) values
  ('Ehrlichkeit'), ('Verlässlichkeit'), ('Humor'), ('Geduld'), ('Offenheit'),
  ('Empathie'), ('Selbstbestimmung'), ('Gerechtigkeit'), ('Familie'),
  ('Freundschaft'), ('Ruhe'), ('Abenteuerlust'), ('Kreativität'),
  ('Nachhaltigkeit'), ('Direkte Kommunikation'), ('Gleichberechtigung')
on conflict (name) do nothing;

-- ---------- Demo-Konten (auth.users) ----------
-- Funktioniert mit "supabase db reset" in der lokalen Entwicklungsumgebung.

do $$
declare
  demo_users constant jsonb := '[
    {"id": "00000000-0000-4000-a000-000000000001", "email": "mara@example.test",   "name": "Mara"},
    {"id": "00000000-0000-4000-a000-000000000002", "email": "jonas@example.test",  "name": "Jonas"},
    {"id": "00000000-0000-4000-a000-000000000003", "email": "ricky@example.test",  "name": "Ricky"},
    {"id": "00000000-0000-4000-a000-000000000004", "email": "selin@example.test",  "name": "Selin"},
    {"id": "00000000-0000-4000-a000-000000000005", "email": "tom@example.test",    "name": "Tom"},
    {"id": "00000000-0000-4000-a000-000000000006", "email": "ivy@example.test",    "name": "Ivy"},
    {"id": "00000000-0000-4000-a000-000000000007", "email": "daniel@example.test", "name": "Daniel"},
    {"id": "00000000-0000-4000-a000-000000000008", "email": "frida@example.test",  "name": "Frida"},
    {"id": "00000000-0000-4000-a000-000000000099", "email": "admin@example.test",  "name": "Admin"}
  ]';
  u jsonb;
begin
  for u in select * from jsonb_array_elements(demo_users) loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000',
      (u->>'id')::uuid,
      'authenticated', 'authenticated',
      u->>'email',
      crypt('demo-passwort-123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('display_name', u->>'name'),
      now(), now()
    )
    on conflict (id) do nothing;

    insert into app_users (id, role)
    values ((u->>'id')::uuid, case when u->>'email' = 'admin@example.test' then 'admin' else 'member' end::app_role_type)
    on conflict (id) do nothing;
  end loop;
end $$;

-- ---------- Profile ----------

insert into profiles (
  id, display_name, birthdate, gender, pronouns, orientation, orientation_visibility,
  city, approx_lat, approx_lng, bio, relationship_goal, contact_frequency,
  planning_style, energy_level, response_pace, social_activities, sensory_needs,
  boundaries, prompts, lifestyle, slow_replies, onboarding_completed
) values
(
  '00000000-0000-4000-a000-000000000001', 'Mara', '1992-11-03', 'woman', 'sie/ihr', 'bi', 'public',
  'Köln', 50.95, 6.92,
  'Illustratorin mit Vorliebe für Museen, Pflanzen und lange Gespräche über Bücher.',
  'long_term', 'few_times_week', 'structured', 'low', 'same_day',
  array['Museen', 'Ruhige Cafés', 'Ausstellungen'],
  array['Menschenmengen sind anstrengend'],
  'Bitte keine ungefragten Ratschläge.',
  '{"perfectFirstDate": "Eine kleine Ausstellung und danach Kaffee.", "helpsMeOnDates": "Wenn der Ort rollstuhlgerecht ist, kann ich mich ganz aufs Gespräch freuen."}',
  '{"childrenWish": "open", "smoking": "no", "alcohol": "sometimes", "pets": "no_pets"}',
  false, true
),
(
  '00000000-0000-4000-a000-000000000002', 'Jonas', '1990-02-17', 'man', 'er/ihm', 'hetero', 'public',
  'Bonn', 50.73, 7.10,
  'Softwareentwickler, Hobbykoch und Brettspielfan.',
  'long_term', 'daily', 'semi_planned', 'medium', 'fast',
  array['Gemeinsames Kochen', 'Spaziergänge', 'Kleine Gruppen'],
  array[]::text[],
  'Ich möchte nicht als inspirierend bezeichnet werden, nur weil ich Hörgeräte trage.',
  '{"aboutMyCommunication": "In lauten Räumen verstehe ich schlechter — ruhige Orte sind super.", "perfectFirstDate": "Zusammen kochen und dabei quatschen."}',
  '{"childrenWish": "yes", "smoking": "no", "alcohol": "sometimes", "pets": "has_pets"}',
  false, true
),
(
  '00000000-0000-4000-a000-000000000003', 'Ricky', '1997-07-29', 'nonbinary', 'they/them', 'queer', 'public',
  'Köln', 50.92, 6.98,
  'Game-Design-Studi, nachts am kreativsten. Pixelart, Synthesizer, tiefe Gespräche.',
  'friendship_first', 'flexible', 'spontaneous', 'varies', 'takes_time',
  array['Online-Gaming', 'Videocalls', 'Zu Hause gemütlich'],
  array['Grelles Licht ist unangenehm', 'Ich brauche Pausen bei vielen Reizen'],
  'Bitte nicht anfassen ohne zu fragen.',
  '{"aboutMyCommunication": "Direkt, ehrlich, manchmal mit Verzögerung.", "whatGivesMeSafety": "Ein Plan B, falls mir ein Treffen zu viel wird."}',
  '{"childrenWish": "no", "smoking": "no", "alcohol": "no", "pets": "loves_pets"}',
  true, true
),
(
  '00000000-0000-4000-a000-000000000004', 'Selin', '1988-12-08', 'woman', 'sie/ihr', 'lesbian', 'public',
  'Düsseldorf', 51.23, 6.78,
  'Physiotherapeutin mit einem Faible für Schwimmen, Krimis und guten Kaffee.',
  'long_term', 'daily', 'semi_planned', 'high', 'fast',
  array['Spaziergänge', 'Ruhige Cafés', 'Natur & Ausflüge'],
  array[]::text[],
  'Absagen sind okay, Ghosting nicht.',
  '{"howIShowInterest": "Ich rufe lieber an, statt tagelang zu texten."}',
  '{"childrenWish": "no", "smoking": "sometimes", "alcohol": "sometimes", "pets": "allergic"}',
  false, true
),
(
  '00000000-0000-4000-a000-000000000005', 'Tom', '1985-04-21', 'man', 'er/ihm', 'gay', 'after_match',
  'Köln', 50.96, 6.94,
  'Bibliothekar, Teetrinker, Stadtgärtner. Ich mag es langsam und verbindlich.',
  'friendship_first', 'weekly', 'structured', 'low', 'takes_time',
  array['Ruhige Cafés', 'Museen', 'Zu Hause gemütlich'],
  array['Laute Umgebungen sind anstrengend', 'Menschenmengen sind anstrengend'],
  'Bitte keine Überraschungsbesuche oder spontanen Planänderungen.',
  '{"whatGivesMeSafety": "Ein fester Endzeitpunkt. Dann kann ich mich entspannen."}',
  '{"childrenWish": "no", "smoking": "no", "alcohol": "no", "pets": "has_pets"}',
  true, true
),
(
  '00000000-0000-4000-a000-000000000006', 'Ivy', '1995-09-14', 'genderfluid', 'sie/they', 'pan', 'public',
  'Leverkusen', 51.03, 6.98,
  'Tänzerin, Podcast-Junkie, immer auf der Suche nach dem besten veganen Essen.',
  'open_to_anything', 'daily', 'spontaneous', 'high', 'fast',
  array['Konzerte', 'Spaziergänge', 'Gemeinsames Kochen'],
  array[]::text[],
  'Ich brauche Ehrlichkeit, keine Spielchen.',
  '{"howIShowInterest": "Sprachnachrichten. Viele. Sag mir, wenn es zu viel wird!"}',
  '{"childrenWish": "open", "smoking": "no", "alcohol": "sometimes", "pets": "has_pets"}',
  false, true
),
(
  '00000000-0000-4000-a000-000000000007', 'Daniel', '1982-01-30', 'man', 'er/ihm', 'hetero', 'public',
  'Köln', 50.93, 6.99,
  'Sozialarbeiter, Vater eines Teenagers, Fan von Brettspielabenden.',
  'long_term', 'few_times_week', 'structured', 'medium', 'same_day',
  array['Kleine Gruppen', 'Spaziergänge', 'Zu Hause gemütlich'],
  array[]::text[],
  'Mein Kind hat Vorrang — wer das nicht respektiert, passt nicht zu mir.',
  '{"helpsMeOnDates": "Ein stufenfreier Ort — dann ist alles entspannt."}',
  '{"childrenWish": "have_children", "smoking": "no", "alcohol": "sometimes", "pets": "no_pets"}',
  false, true
),
(
  '00000000-0000-4000-a000-000000000008', 'Frida', '1999-06-25', 'woman', 'sie/ihr', 'bi', 'public',
  'Hürth', 50.87, 6.87,
  'Angehende Tierärztin mit zwei Katzen und einer Schwäche für Fantasy-Romane.',
  'long_term', 'few_times_week', 'semi_planned', 'low', 'takes_time',
  array['Zu Hause gemütlich', 'Natur & Ausflüge', 'Ruhige Cafés'],
  array['Laute Umgebungen sind anstrengend'],
  'Meine Gehörlosigkeit ist kein Schicksal — bitte kein Mitleid.',
  '{"aboutMyCommunication": "Schreiben ist meine Sprache. In DGS bringe ich dir gerne erste Gebärden bei."}',
  '{"childrenWish": "open", "smoking": "no", "alcohol": "no", "pets": "has_pets"}',
  true, true
)
on conflict (id) do nothing;

-- ---------- Präferenzen ----------

insert into preferences (profile_id, seeking_genders, age_min, age_max, max_distance_km, relationship_goals, dealbreakers)
values
  ('00000000-0000-4000-a000-000000000001', array['woman','man','nonbinary']::gender_type[], 28, 45, 50, array['long_term']::relationship_goal_type[], array['Rauchen']),
  ('00000000-0000-4000-a000-000000000002', array['woman']::gender_type[], 28, 42, 60, array['long_term']::relationship_goal_type[], array[]::text[]),
  ('00000000-0000-4000-a000-000000000003', array['woman','man','nonbinary','genderfluid']::gender_type[], 22, 38, 40, array['friendship_first','open_to_anything']::relationship_goal_type[], array['Druck bei Antwortzeiten']),
  ('00000000-0000-4000-a000-000000000004', array['woman']::gender_type[], 30, 48, 80, array['long_term']::relationship_goal_type[], array['Unzuverlässigkeit']),
  ('00000000-0000-4000-a000-000000000005', array['man']::gender_type[], 30, 55, 30, array['friendship_first','long_term']::relationship_goal_type[], array[]::text[]),
  ('00000000-0000-4000-a000-000000000006', array['woman','man','nonbinary','genderfluid']::gender_type[], 24, 40, 50, array['open_to_anything']::relationship_goal_type[], array[]::text[]),
  ('00000000-0000-4000-a000-000000000007', array['woman']::gender_type[], 32, 50, 40, array['long_term']::relationship_goal_type[], array['Rauchen']),
  ('00000000-0000-4000-a000-000000000008', array['woman','man']::gender_type[], 22, 36, 50, array['long_term','friendship_first']::relationship_goal_type[], array[]::text[])
on conflict (profile_id) do nothing;

-- ---------- Kommunikationsstile ----------

insert into communication_preferences (profile_id, style) values
  ('00000000-0000-4000-a000-000000000001', 'texting'),
  ('00000000-0000-4000-a000-000000000001', 'written_detailed'),
  ('00000000-0000-4000-a000-000000000002', 'texting'),
  ('00000000-0000-4000-a000-000000000002', 'in_person'),
  ('00000000-0000-4000-a000-000000000003', 'texting'),
  ('00000000-0000-4000-a000-000000000003', 'voice_messages'),
  ('00000000-0000-4000-a000-000000000004', 'calls'),
  ('00000000-0000-4000-a000-000000000005', 'written_detailed'),
  ('00000000-0000-4000-a000-000000000006', 'voice_messages'),
  ('00000000-0000-4000-a000-000000000007', 'texting'),
  ('00000000-0000-4000-a000-000000000008', 'texting'),
  ('00000000-0000-4000-a000-000000000008', 'written_detailed')
on conflict do nothing;

-- ---------- Barrierefreiheitsbedürfnisse ----------

insert into accessibility_needs (profile_id, need, visibility) values
  ('00000000-0000-4000-a000-000000000001', 'Rollstuhlgerechter Treffpunkt', 'public'),
  ('00000000-0000-4000-a000-000000000001', 'Barrierefreies WC', 'public'),
  ('00000000-0000-4000-a000-000000000001', 'Wenig Treppen', 'public'),
  ('00000000-0000-4000-a000-000000000002', 'Schriftliche Kommunikation bevorzugt', 'public'),
  ('00000000-0000-4000-a000-000000000003', 'Gedämpftes Licht', 'public'),
  ('00000000-0000-4000-a000-000000000003', 'Kurze Treffen bevorzugt', 'public'),
  ('00000000-0000-4000-a000-000000000005', 'Ruhige Umgebung', 'after_match'),
  ('00000000-0000-4000-a000-000000000005', 'Kurze Treffen bevorzugt', 'after_match'),
  ('00000000-0000-4000-a000-000000000006', 'Assistenzhund willkommen', 'public'),
  ('00000000-0000-4000-a000-000000000007', 'Rollstuhlgerechter Treffpunkt', 'public'),
  ('00000000-0000-4000-a000-000000000008', 'Schriftliche Kommunikation bevorzugt', 'public'),
  ('00000000-0000-4000-a000-000000000008', 'Ruhige Umgebung', 'public')
on conflict do nothing;

-- ---------- Freiwillige sensible Angaben ----------

insert into disclosures (profile_id, label, description, visibility, searchable) values
  ('00000000-0000-4000-a000-000000000002', 'Schwerhörigkeit', 'Mit Hörgeräten verstehe ich in ruhigen Räumen gut. Schreiben klappt immer.', 'public', true),
  ('00000000-0000-4000-a000-000000000003', 'Autistisch', 'Ich sage Dinge direkt und meine sie genau so.', 'public', true),
  ('00000000-0000-4000-a000-000000000003', 'ADHS', null, 'after_match', false),
  ('00000000-0000-4000-a000-000000000004', 'Chronische Erkrankung', 'An manchen Tagen habe ich weniger Energie.', 'after_match', false),
  ('00000000-0000-4000-a000-000000000005', 'Soziale Angst', 'Erste Treffen sind für mich aufregend. Kurz und ruhig ist perfekt.', 'after_match', false),
  ('00000000-0000-4000-a000-000000000006', 'ADHS', 'Ich habe tausend Ideen gleichzeitig.', 'public', true),
  ('00000000-0000-4000-a000-000000000008', 'Gehörlos', 'Ich kommuniziere in DGS und schriftlich.', 'public', true)
on conflict do nothing;

-- ---------- Interessen / Werte-Zuordnungen ----------

insert into profile_interests (profile_id, interest_id)
select p.id, i.id from (values
  ('00000000-0000-4000-a000-000000000001', 'Kunst'),
  ('00000000-0000-4000-a000-000000000001', 'Lesen'),
  ('00000000-0000-4000-a000-000000000001', 'Museen'),
  ('00000000-0000-4000-a000-000000000002', 'Kochen'),
  ('00000000-0000-4000-a000-000000000002', 'Brettspiele'),
  ('00000000-0000-4000-a000-000000000003', 'Gaming'),
  ('00000000-0000-4000-a000-000000000003', 'Musik'),
  ('00000000-0000-4000-a000-000000000004', 'Schwimmen'),
  ('00000000-0000-4000-a000-000000000004', 'Lesen'),
  ('00000000-0000-4000-a000-000000000005', 'Lesen'),
  ('00000000-0000-4000-a000-000000000005', 'Gärtnern'),
  ('00000000-0000-4000-a000-000000000006', 'Tanzen'),
  ('00000000-0000-4000-a000-000000000006', 'Podcasts'),
  ('00000000-0000-4000-a000-000000000007', 'Brettspiele'),
  ('00000000-0000-4000-a000-000000000007', 'Ehrenamt'),
  ('00000000-0000-4000-a000-000000000008', 'Tiere'),
  ('00000000-0000-4000-a000-000000000008', 'Lesen')
) as v(pid, iname)
join profiles p on p.id = v.pid::uuid
join interests i on i.name = v.iname
on conflict do nothing;

insert into profile_values (profile_id, value_id)
select p.id, w.id from (values
  ('00000000-0000-4000-a000-000000000001', 'Ehrlichkeit'),
  ('00000000-0000-4000-a000-000000000001', 'Kreativität'),
  ('00000000-0000-4000-a000-000000000002', 'Verlässlichkeit'),
  ('00000000-0000-4000-a000-000000000002', 'Humor'),
  ('00000000-0000-4000-a000-000000000003', 'Offenheit'),
  ('00000000-0000-4000-a000-000000000003', 'Selbstbestimmung'),
  ('00000000-0000-4000-a000-000000000004', 'Direkte Kommunikation'),
  ('00000000-0000-4000-a000-000000000005', 'Ruhe'),
  ('00000000-0000-4000-a000-000000000005', 'Geduld'),
  ('00000000-0000-4000-a000-000000000006', 'Abenteuerlust'),
  ('00000000-0000-4000-a000-000000000006', 'Empathie'),
  ('00000000-0000-4000-a000-000000000007', 'Familie'),
  ('00000000-0000-4000-a000-000000000007', 'Verlässlichkeit'),
  ('00000000-0000-4000-a000-000000000008', 'Empathie'),
  ('00000000-0000-4000-a000-000000000008', 'Ruhe')
) as v(pid, wname)
join profiles p on p.id = v.pid::uuid
join values_catalog w on w.name = v.wname
on conflict do nothing;

-- ---------- Einwilligungen (Beispiel-Protokoll) ----------

insert into consent_records (profile_id, consent, version)
select id, c.consent, '2026-01'
from app_users,
  (values ('privacy_policy'::consent_type), ('terms'::consent_type), ('community_rules'::consent_type)) as c(consent)
on conflict do nothing;
