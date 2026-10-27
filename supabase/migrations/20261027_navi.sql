create table if not exists public.navi_knowledge (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  category    text not null default 'general',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.navi_knowledge enable row level security;
create policy "Public can read active knowledge"
  on public.navi_knowledge for select using (is_active = true);
create policy "Admins manage knowledge"
  on public.navi_knowledge for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create table if not exists public.navi_conversations (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  user_id     uuid references auth.users(id) on delete set null,
  messages    jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.navi_conversations enable row level security;
create policy "Users see own conversations"
  on public.navi_conversations for select
  using (user_id = auth.uid() or user_id is null);
create policy "Admins see all conversations"
  on public.navi_conversations for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index if not exists navi_conv_session_idx on public.navi_conversations (session_id);
create index if not exists navi_conv_user_idx    on public.navi_conversations (user_id);
