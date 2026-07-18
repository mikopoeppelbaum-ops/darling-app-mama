-- ============================================================
-- EchtNah — Migration 0003: Storage-Buckets und -Regeln
-- ============================================================

-- Profilfotos: privater Bucket, Zugriff nur über signierte URLs bzw. RLS.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-photos',
  'profile-photos',
  false,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Chat-Bilder: privater Bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-images',
  'chat-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Pfadkonvention: <profile_id>/<dateiname> — die erste Pfadkomponente
-- muss der eigenen Nutzer-ID entsprechen.

create policy "eigene Profilfotos hochladen" on storage.objects
  for insert with check (
    bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "eigene Profilfotos verwalten" on storage.objects
  for update using (
    bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "eigene Profilfotos löschen" on storage.objects
  for delete using (
    bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Profilfotos lesen (angemeldet)" on storage.objects
  for select using (
    bucket_id = 'profile-photos' and auth.role() = 'authenticated'
  );

create policy "Chat-Bilder hochladen" on storage.objects
  for insert with check (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Chat-Bilder lesen: nur Mitglieder des Matches (Pfad: <uid>/<match_id>/<datei>).
create policy "Chat-Bilder lesen" on storage.objects
  for select using (
    bucket_id = 'chat-images'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or is_member_of_match(((storage.foldername(name))[2])::uuid)
    )
  );
