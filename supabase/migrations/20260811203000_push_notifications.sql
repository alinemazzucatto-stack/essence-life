create table if not exists public.push_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  endpoint text not null unique,
  subscription jsonb not null,
  timezone text not null default 'America/Sao_Paulo',
  updated_at timestamptz not null default now()
);
create index if not exists push_devices_user_id_idx on public.push_devices(user_id);
alter table public.push_devices enable row level security;
revoke all on public.push_devices from anon, authenticated;

create table if not exists public.push_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  reminder_id text not null,
  title text not null,
  remind_at timestamptz not null,
  repeat_daily boolean not null default false,
  sent_at timestamptz,
  unique(user_id, reminder_id)
);
create index if not exists push_reminders_due_idx on public.push_reminders(remind_at) where sent_at is null;
alter table public.push_reminders enable row level security;
revoke all on public.push_reminders from anon, authenticated;
grant usage on schema public to service_role;
grant select, insert, update, delete on public.push_devices, public.push_reminders to service_role;
