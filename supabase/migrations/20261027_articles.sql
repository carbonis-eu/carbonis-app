create table if not exists public.articles (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        unique not null,
  title            text        not null,
  excerpt          text        not null,
  content          text        not null default '',
  category         text        not null default 'regulation',
  author           text        not null default 'Carbonis Team',
  published_at     timestamptz,
  is_published     boolean     not null default false,
  hero_image_url   text,
  tags             text[]      default '{}',
  geo_targets      text[]      default '{}',
  reading_time_min int         not null default 5,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.articles enable row level security;

create policy "Public can read published articles"
  on public.articles for select
  using (is_published = true);

create policy "Admins can manage articles"
  on public.articles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create index if not exists articles_slug_idx      on public.articles (slug);
create index if not exists articles_published_idx on public.articles (is_published, published_at desc);
create index if not exists articles_category_idx  on public.articles (category);
