-- Comentarios de visitantes sin cuenta registrada

alter table public.comments
  alter column user_id drop not null;

alter table public.comments
  add column if not exists guest_name text,
  add column if not exists guest_email text;

alter table public.comments
  drop constraint if exists comments_author_check;

alter table public.comments
  add constraint comments_author_check
  check (
    user_id is not null
    or (
      guest_name is not null
      and length(trim(guest_name)) >= 2
    )
  );

drop policy if exists "Usuarios autenticados comentan" on public.comments;

create policy "Usuarios registrados comentan"
  on public.comments for insert
  with check (
    auth.uid() = user_id
    and public.has_blog_role('reader')
    and exists (
      select 1 from public.posts p
      where p.id = post_id and p.status = 'published'
    )
  );

create index if not exists comments_guest_name_idx on public.comments (guest_name);
