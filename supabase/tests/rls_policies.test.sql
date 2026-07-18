-- ============================================================
-- RLS-Tests für EchtNah
--
-- Ausführen gegen die lokale Supabase-Datenbank (nach `supabase db reset`):
--   psql "$(supabase status -o env | grep DB_URL | cut -d= -f2-)" \
--     -v ON_ERROR_STOP=1 -f supabase/tests/rls_policies.test.sql
--
-- Jeder Test simuliert eine angemeldete Person über request.jwt.claims.
-- Das Skript bricht mit einer Exception ab, wenn ein Test fehlschlägt.
-- ============================================================

begin;

create or replace function test_assert(cond boolean, msg text)
returns void language plpgsql as $$
begin
  if not cond then
    raise exception 'RLS-TEST FEHLGESCHLAGEN: %', msg;
  end if;
  raise notice 'OK: %', msg;
end $$;

-- Als Mara (…0001) agieren
set local role authenticated;
set local request.jwt.claims to '{"sub": "00000000-0000-4000-a000-000000000001", "role": "authenticated"}';

-- 1. Eigenes Profil ist lesbar
select test_assert(
  exists (select 1 from profiles where id = '00000000-0000-4000-a000-000000000001'),
  'Eigenes Profil ist lesbar'
);

-- 2. Fremde Profile mit abgeschlossenem Onboarding sind lesbar
select test_assert(
  exists (select 1 from profiles where id = '00000000-0000-4000-a000-000000000002'),
  'Fremdes Profil (Onboarding abgeschlossen) ist lesbar'
);

-- 3. Fremdes Profil kann NICHT geändert werden
do $$
begin
  update profiles set bio = 'gehackt' where id = '00000000-0000-4000-a000-000000000002';
  if exists (
    select 1 from profiles
    where id = '00000000-0000-4000-a000-000000000002' and bio = 'gehackt'
  ) then
    raise exception 'RLS-TEST FEHLGESCHLAGEN: Fremdes Profil war änderbar';
  end if;
  raise notice 'OK: Fremdes Profil ist nicht änderbar';
end $$;

-- 4. Sensible Angaben: nur public-Disclosures anderer sichtbar
select test_assert(
  not exists (
    select 1 from disclosures
    where profile_id <> '00000000-0000-4000-a000-000000000001'
      and visibility <> 'public'
  ),
  'Nicht-öffentliche Disclosures anderer sind unsichtbar (ohne Match)'
);

-- 5. Fremde Präferenzen sind unsichtbar
select test_assert(
  not exists (
    select 1 from preferences where profile_id <> '00000000-0000-4000-a000-000000000001'
  ),
  'Fremde Suchpräferenzen sind unsichtbar'
);

-- 6. Like im fremden Namen ist unmöglich
do $$
begin
  begin
    insert into likes (from_profile_id, to_profile_id)
    values ('00000000-0000-4000-a000-000000000002', '00000000-0000-4000-a000-000000000001');
    raise exception 'RLS-TEST FEHLGESCHLAGEN: Like im fremden Namen war möglich';
  exception when insufficient_privilege or check_violation then
    raise notice 'OK: Like im fremden Namen wird abgelehnt';
  end;
end $$;

-- 7. Gegenseitige Likes erzeugen ein Match (Trigger, security definer)
insert into likes (from_profile_id, to_profile_id)
values ('00000000-0000-4000-a000-000000000001', '00000000-0000-4000-a000-000000000002');

set local request.jwt.claims to '{"sub": "00000000-0000-4000-a000-000000000002", "role": "authenticated"}';
insert into likes (from_profile_id, to_profile_id)
values ('00000000-0000-4000-a000-000000000002', '00000000-0000-4000-a000-000000000001');

select test_assert(
  exists (
    select 1 from matches
    where profile_a = '00000000-0000-4000-a000-000000000001'
      and profile_b = '00000000-0000-4000-a000-000000000002'
  ),
  'Gegenseitige Likes erzeugen ein Match'
);

-- 8. Nachricht in eigenes Match ist möglich, Status 'active' vorausgesetzt
insert into messages (match_id, sender_profile_id, body)
select id, '00000000-0000-4000-a000-000000000002', 'Hallo!'
from matches
where profile_a = '00000000-0000-4000-a000-000000000001'
  and profile_b = '00000000-0000-4000-a000-000000000002';

select test_assert(
  exists (select 1 from messages where body = 'Hallo!'),
  'Nachricht in eigenem Match ist möglich'
);

-- 9. Unbeteiligte sehen fremde Nachrichten nicht
set local request.jwt.claims to '{"sub": "00000000-0000-4000-a000-000000000003", "role": "authenticated"}';
select test_assert(
  not exists (select 1 from messages where body = 'Hallo!'),
  'Unbeteiligte sehen fremde Nachrichten nicht'
);

-- 10. Meldungen: nur eigene sichtbar, Admin sieht alle
set local request.jwt.claims to '{"sub": "00000000-0000-4000-a000-000000000003", "role": "authenticated"}';
insert into reports (reporter_profile_id, reported_profile_id, category, description)
values ('00000000-0000-4000-a000-000000000003', '00000000-0000-4000-a000-000000000002',
        'harassment', 'Testmeldung mit ausreichend langer Beschreibung.');

set local request.jwt.claims to '{"sub": "00000000-0000-4000-a000-000000000001", "role": "authenticated"}';
select test_assert(
  not exists (select 1 from reports where description like 'Testmeldung%'),
  'Fremde Meldungen sind für Mitglieder unsichtbar'
);

set local request.jwt.claims to '{"sub": "00000000-0000-4000-a000-000000000099", "role": "authenticated"}';
select test_assert(
  exists (select 1 from reports where description like 'Testmeldung%'),
  'Admin sieht Meldungen'
);

rollback;
