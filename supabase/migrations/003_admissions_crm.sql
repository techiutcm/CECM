-- CRM de admisiones: estados, notas, historial, entrevistas y personal

create type public.admission_status as enum (
  'nueva',
  'documentos_pendientes',
  'documentos_verificados',
  'entrevista_agendada',
  'entrevista_realizada',
  'aprobado',
  'inscrito',
  'rechazado'
);

create type public.admission_priority as enum ('low', 'normal', 'high', 'urgent');

create type public.interview_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');

-- Migrar columna status existente
alter table public.admissions alter column status drop default;

alter table public.admissions
  alter column status type public.admission_status
  using (
    case status::text
      when 'pending' then 'nueva'::public.admission_status
      when 'nueva' then 'nueva'::public.admission_status
      when 'documentos_pendientes' then 'documentos_pendientes'::public.admission_status
      when 'documentos_verificados' then 'documentos_verificados'::public.admission_status
      when 'entrevista_agendada' then 'entrevista_agendada'::public.admission_status
      when 'entrevista_realizada' then 'entrevista_realizada'::public.admission_status
      when 'aprobado' then 'aprobado'::public.admission_status
      when 'inscrito' then 'inscrito'::public.admission_status
      when 'rechazado' then 'rechazado'::public.admission_status
      else 'nueva'::public.admission_status
    end
  );

alter table public.admissions
  alter column status set default 'nueva'::public.admission_status;

alter table public.admissions
  add column if not exists priority public.admission_priority not null default 'normal',
  add column if not exists assigned_to uuid references public.profiles (id) on delete set null,
  add column if not exists student_photo_url text,
  add column if not exists internal_notes text;

create table if not exists public.staff_users (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  department text not null default 'Admisiones',
  title text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admission_documents (
  id uuid primary key default gen_random_uuid(),
  admission_id uuid not null references public.admissions (id) on delete cascade,
  document_type text not null,
  url text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  is_verified boolean not null default false,
  verified_by uuid references public.profiles (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.admission_notes (
  id uuid primary key default gen_random_uuid(),
  admission_id uuid not null references public.admissions (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admission_status_history (
  id uuid primary key default gen_random_uuid(),
  admission_id uuid not null references public.admissions (id) on delete cascade,
  from_status public.admission_status,
  to_status public.admission_status not null,
  changed_by uuid references public.profiles (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.admission_activity (
  id uuid primary key default gen_random_uuid(),
  admission_id uuid references public.admissions (id) on delete cascade,
  event_type text not null,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  admission_id uuid not null references public.admissions (id) on delete cascade,
  scheduled_at timestamptz not null,
  assigned_to uuid references public.profiles (id) on delete set null,
  status public.interview_status not null default 'scheduled',
  notes text,
  notification_sent boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admission_documents_admission_id_idx on public.admission_documents (admission_id);
create index if not exists admission_notes_admission_id_idx on public.admission_notes (admission_id);
create index if not exists admission_status_history_admission_id_idx on public.admission_status_history (admission_id);
create index if not exists admission_activity_admission_id_idx on public.admission_activity (admission_id);
create index if not exists admission_activity_created_at_idx on public.admission_activity (created_at desc);
create index if not exists interviews_admission_id_idx on public.interviews (admission_id);
create index if not exists interviews_scheduled_at_idx on public.interviews (scheduled_at);
create index if not exists interviews_assigned_to_idx on public.interviews (assigned_to);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists admissions_updated_at on public.admissions;
create trigger admissions_updated_at
  before update on public.admissions
  for each row execute function public.set_updated_at();

drop trigger if exists staff_users_updated_at on public.staff_users;
create trigger staff_users_updated_at
  before update on public.staff_users
  for each row execute function public.set_updated_at();

drop trigger if exists interviews_updated_at on public.interviews;
create trigger interviews_updated_at
  before update on public.interviews
  for each row execute function public.set_updated_at();

-- RLS: operaciones vía service_role (API servidor)
alter table public.staff_users enable row level security;
alter table public.admission_documents enable row level security;
alter table public.admission_notes enable row level security;
alter table public.admission_status_history enable row level security;
alter table public.admission_activity enable row level security;
alter table public.interviews enable row level security;

create policy "admissions_service_update"
  on public.admissions for update to service_role using (true) with check (true);

create policy "staff_users_service_all"
  on public.staff_users for all to service_role using (true) with check (true);

create policy "admission_documents_service_all"
  on public.admission_documents for all to service_role using (true) with check (true);

create policy "admission_notes_service_all"
  on public.admission_notes for all to service_role using (true) with check (true);

create policy "admission_status_history_service_all"
  on public.admission_status_history for all to service_role using (true) with check (true);

create policy "admission_activity_service_all"
  on public.admission_activity for all to service_role using (true) with check (true);

create policy "interviews_service_all"
  on public.interviews for all to service_role using (true) with check (true);
