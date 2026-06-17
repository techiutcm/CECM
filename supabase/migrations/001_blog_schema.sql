-- Esquema del blog: perfiles, roles, posts, comentarios y media
-- Ejecutar en Supabase → SQL Editor

-- Enums
create type public.blog_role as enum ('reader', 'author', 'editor', 'admin');
create type public.post_status as enum ('draft', 'published', 'archived');
create type public.comment_status as enum ('pending', 'approved', 'rejected');
create type public.media_type as enum ('image', 'video');

-- Perfiles (extiende auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Roles de usuario
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.blog_role not null,
  granted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- Posts del blog
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  author_id uuid not null references public.profiles (id) on delete cascade,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Etiquetas
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Media asociada a posts
create table public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  media_type public.media_type not null,
  storage_path text not null,
  public_url text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Comentarios
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  content text not null,
  status public.comment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índices
create index posts_author_id_idx on public.posts (author_id);
create index posts_status_idx on public.posts (status);
create index posts_published_at_idx on public.posts (published_at desc);
create index comments_post_id_idx on public.comments (post_id);
create index comments_user_id_idx on public.comments (user_id);
create index post_media_post_id_idx on public.post_media (post_id);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create trigger comments_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();

-- Perfil automático al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'reader');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helpers de roles
create or replace function public.get_user_roles(target_user_id uuid default auth.uid())
returns public.blog_role[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(role order by role), '{}'::public.blog_role[])
  from public.user_roles
  where user_id = target_user_id;
$$;

create or replace function public.has_blog_role(required_role public.blog_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = any(
        case required_role
          when 'reader' then array['reader','author','editor','admin']::public.blog_role[]
          when 'author' then array['author','editor','admin']::public.blog_role[]
          when 'editor' then array['editor','admin']::public.blog_role[]
          when 'admin' then array['admin']::public.blog_role[]
        end
      )
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.posts enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.post_media enable row level security;
alter table public.comments enable row level security;

-- Profiles
create policy "Perfiles públicos visibles"
  on public.profiles for select
  using (true);

create policy "Usuario edita su perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- User roles
create policy "Usuario ve sus roles"
  on public.user_roles for select
  using (auth.uid() = user_id or public.has_blog_role('admin'));

create policy "Admin gestiona roles"
  on public.user_roles for all
  using (public.has_blog_role('admin'));

-- Posts
create policy "Posts publicados visibles"
  on public.posts for select
  using (
    status = 'published'
    or author_id = auth.uid()
    or public.has_blog_role('editor')
  );

create policy "Autores crean posts"
  on public.posts for insert
  with check (
    auth.uid() = author_id
    and public.has_blog_role('author')
  );

create policy "Autores editan sus posts"
  on public.posts for update
  using (
    author_id = auth.uid()
    or public.has_blog_role('editor')
  );

create policy "Autores eliminan sus posts"
  on public.posts for delete
  using (
    author_id = auth.uid()
    or public.has_blog_role('admin')
  );

-- Tags
create policy "Tags visibles"
  on public.tags for select
  using (true);

create policy "Editores gestionan tags"
  on public.tags for all
  using (public.has_blog_role('editor'));

-- Post tags
create policy "Post tags visibles"
  on public.post_tags for select
  using (true);

create policy "Editores gestionan post tags"
  on public.post_tags for all
  using (public.has_blog_role('editor'));

-- Post media
create policy "Media visible en posts accesibles"
  on public.post_media for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and (
          p.status = 'published'
          or p.author_id = auth.uid()
          or public.has_blog_role('editor')
        )
    )
  );

create policy "Autores gestionan media de sus posts"
  on public.post_media for insert
  with check (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and (p.author_id = auth.uid() or public.has_blog_role('editor'))
    )
  );

create policy "Autores eliminan media de sus posts"
  on public.post_media for delete
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and (p.author_id = auth.uid() or public.has_blog_role('editor'))
    )
  );

-- Comments
create policy "Comentarios aprobados visibles"
  on public.comments for select
  using (
    status = 'approved'
    or user_id = auth.uid()
    or public.has_blog_role('editor')
    or exists (
      select 1 from public.posts p
      where p.id = post_id and p.author_id = auth.uid()
    )
  );

create policy "Usuarios autenticados comentan"
  on public.comments for insert
  with check (
    auth.uid() = user_id
    and public.has_blog_role('reader')
    and exists (
      select 1 from public.posts p
      where p.id = post_id and p.status = 'published'
    )
  );

create policy "Usuario edita su comentario"
  on public.comments for update
  using (
    user_id = auth.uid()
    or public.has_blog_role('editor')
    or exists (
      select 1 from public.posts p
      where p.id = post_id and p.author_id = auth.uid()
    )
  );

create policy "Usuario elimina su comentario"
  on public.comments for delete
  using (
    user_id = auth.uid()
    or public.has_blog_role('editor')
  );

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('blog-images', 'blog-images', true),
  ('blog-videos', 'blog-videos', true)
on conflict (id) do nothing;

create policy "Imágenes públicas legibles"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Videos públicos legibles"
  on storage.objects for select
  using (bucket_id = 'blog-videos');

create policy "Autores suben imágenes"
  on storage.objects for insert
  with check (
    bucket_id = 'blog-images'
    and auth.role() = 'authenticated'
    and public.has_blog_role('author')
  );

create policy "Autores suben videos"
  on storage.objects for insert
  with check (
    bucket_id = 'blog-videos'
    and auth.role() = 'authenticated'
    and public.has_blog_role('author')
  );

create policy "Autores eliminan sus archivos"
  on storage.objects for delete
  using (
    bucket_id in ('blog-images', 'blog-videos')
    and auth.uid()::text = (storage.foldername(name))[1]
  );
