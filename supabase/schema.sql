create table if not exists public.entitlements (
  email text primary key,
  plan text not null check (plan in ('essential', 'pro')),
  status text not null default 'active' check (status in ('active', 'revoked')),
  transaction_id text,
  product_name text,
  updated_at timestamptz not null default now()
);

alter table public.entitlements enable row level security;
revoke all on table public.entitlements from anon;
grant select on table public.entitlements to authenticated;

drop policy if exists "Cliente consulta somente o próprio plano" on public.entitlements;
create policy "Cliente consulta somente o próprio plano"
on public.entitlements for select to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

create unique index if not exists entitlements_transaction_id_idx
on public.entitlements (transaction_id)
where transaction_id is not null;
