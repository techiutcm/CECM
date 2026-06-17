-- Personal de admisiones: lectura propia + guía para crear usuario administrativo

drop policy if exists "staff_users_select_own" on public.staff_users;

create policy "staff_users_select_own"
  on public.staff_users
  for select
  to authenticated
  using (profile_id = auth.uid());

-- Vista auxiliar para identificar panel asignado
create or replace view public.staff_panel_access as
select
  p.id as profile_id,
  p.full_name,
  p.username,
  su.department,
  array_agg(distinct ur.role) as roles,
  case
    when 'admin' = any(array_agg(ur.role)) then 'blog'
    when 'author' = any(array_agg(ur.role))
      and not ('editor' = any(array_agg(ur.role))) then 'blog'
    when 'editor' = any(array_agg(ur.role)) then 'admisiones'
    when su.department = 'Admisiones' then 'admisiones'
    else 'ninguno'
  end as default_panel
from public.profiles p
left join public.user_roles ur on ur.user_id = p.id
left join public.staff_users su on su.profile_id = p.id
group by p.id, p.full_name, p.username, su.department;

comment on view public.staff_panel_access is
  'Indica el panel por defecto según roles y departamento.';

-- INSTRUCCIONES (ejecutar después de crear el usuario en Auth):
--
-- 1. Crea el usuario en Supabase → Authentication → Users
--    o ejecuta: pnpm create:staff-user
--
-- 2. Asigna rol de admisiones (editor) + staff_users:
--
-- insert into public.user_roles (user_id, role)
-- values ('UUID-DEL-USUARIO', 'editor')
-- on conflict do nothing;
--
-- insert into public.staff_users (profile_id, department, title)
-- values ('UUID-DEL-USUARIO', 'Admisiones', 'Coordinador de Admisiones')
-- on conflict (profile_id) do update set department = excluded.department;
