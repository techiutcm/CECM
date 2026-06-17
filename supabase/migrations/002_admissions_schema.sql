-- Admisiones online: tabla principal y bucket de documentos

create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  status text not null default 'pending',
  student_data jsonb not null,
  academic_data jsonb not null,
  tutor_data jsonb not null,
  documents jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admissions_session_id_idx on public.admissions (session_id);
create index if not exists admissions_status_idx on public.admissions (status);
create index if not exists admissions_created_at_idx on public.admissions (created_at desc);

alter table public.admissions enable row level security;

-- Solo operaciones vía service role (API de servidor)
create policy "admissions_service_insert"
  on public.admissions
  for insert
  to service_role
  with check (true);

create policy "admissions_service_select"
  on public.admissions
  for select
  to service_role
  using (true);

-- Bucket para documentos de admisión
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admission-documents',
  'admission-documents',
  true,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lectura pública de documentos (URLs públicas)
create policy "admission_documents_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'admission-documents');

-- Escritura solo vía service role
create policy "admission_documents_service_insert"
  on storage.objects
  for insert
  to service_role
  with check (bucket_id = 'admission-documents');

create policy "admission_documents_service_update"
  on storage.objects
  for update
  to service_role
  using (bucket_id = 'admission-documents');

create policy "admission_documents_service_delete"
  on storage.objects
  for delete
  to service_role
  using (bucket_id = 'admission-documents');
