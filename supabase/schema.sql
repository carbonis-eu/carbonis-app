-- Carbonis database schema
-- Run this in Supabase SQL Editor

-- Users profile (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  company_name text,
  vat_number text,
  country text default 'SI',
  role text not null default 'buyer' check (role in ('seller', 'buyer', 'compliance', 'admin')),
  tier text not null default 'free' check (tier in ('free', 'seller', 'pro_compliance', 'pro_trading')),
  payment_method text default 'xolo' check (payment_method in ('xolo', 'stripe')),
  trial_ends_at timestamptz default (now() + interval '30 days'),
  subscription_active boolean default false,
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admin can view all profiles
create policy "Admin can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Listings (OTC bulletin board)
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade,
  certificate_type text not null check (certificate_type in ('CBAM', 'GO', 'EUA', 'RED3', 'RFNBO')),
  title text not null,
  description text,
  quantity numeric not null,
  quantity_available numeric not null,
  min_order numeric default 1,
  price_per_unit numeric,
  currency text default 'EUR',
  country_of_origin text,
  valid_from date,
  valid_until date,
  expires_at timestamptz default (now() + interval '90 days'),
  status text default 'active' check (status in ('active', 'sold', 'expired', 'withdrawn')),
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.listings enable row level security;

-- Everyone can view active listings (but NOT seller contact info)
create policy "Anyone can view active listings"
  on public.listings for select
  using (status = 'active');

-- Only seller can manage own listings
create policy "Sellers can manage own listings"
  on public.listings for all
  using (auth.uid() = seller_id);

-- Subscriptions log
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  tier text not null,
  payment_method text not null default 'xolo',
  amount numeric,
  currency text default 'EUR',
  xolo_invoice_id text,
  stripe_subscription_id text,
  period_start timestamptz,
  period_end timestamptz,
  status text default 'active' check (status in ('active', 'cancelled', 'expired')),
  created_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger listings_updated_at
  before update on public.listings
  for each row execute procedure public.handle_updated_at();
