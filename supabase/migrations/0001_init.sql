-- ShelfAI / BookHaven schema + RLS + pgvector

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  reading_goal int default 12,
  created_at timestamptz default now()
);

-- books (cached from Google Books)
create table if not exists public.books (
  id text primary key,
  title text not null,
  author text not null,
  cover_url text,
  description text,
  genres text[] default '{}',
  published_year int,
  page_count int,
  isbn text,
  average_rating numeric(3,2),
  ratings_count int,
  embedding vector(1536)
);

create index if not exists books_embedding_idx on public.books using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- shelf items
do $$ begin
  if not exists (select 1 from pg_type where typname = 'shelf_status') then
    create type public.shelf_status as enum ('want_to_read','reading','read');
  end if;
end $$;

create table if not exists public.shelf_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  status public.shelf_status not null,
  progress int default 0,
  user_rating int check (user_rating between 1 and 5),
  added_at timestamptz default now(),
  unique(user_id, book_id)
);

-- reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text not null check (char_length(body) >= 20),
  likes_count int default 0,
  created_at timestamptz default now()
);

-- taste profiles
create table if not exists public.taste_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  rated_books jsonb default '[]'::jsonb,
  moods text[] default '{}',
  goals text[] default '{}',
  last_updated timestamptz default now()
);

-- lists
create table if not exists public.book_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  book_ids text[] default '{}',
  is_public boolean default true,
  likes_count int default 0,
  created_at timestamptz default now()
);

-- follows
create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  primary key (follower_id, following_id)
);

-- notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, is_read, created_at desc);

-- chat sessions
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_key text not null,
  messages jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- user settings (LLM config)
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  llm_provider text default 'openai',
  llm_model text default 'gpt-4o',
  llm_api_key_encrypted text,
  llm_base_url text,
  notification_prefs jsonb default '{"email": true, "inapp": true}'::jsonb,
  updated_at timestamptz default now()
);

-- Limit chat session messages to last 50
create or replace function public.trim_chat_messages()
returns trigger language plpgsql as $$
begin
  if jsonb_typeof(new.messages) = 'array' and jsonb_array_length(new.messages) > 50 then
    new.messages := (
      select jsonb_agg(value)
      from (
        select value
        from jsonb_array_elements(new.messages) with ordinality as t(value, ord)
        order by ord desc
        limit 50
      ) s
    );
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trim_chat_messages_trigger on public.chat_sessions;
create trigger trim_chat_messages_trigger
before insert or update on public.chat_sessions
for each row execute function public.trim_chat_messages();

-- match_books RPC for vector similarity search
create or replace function public.match_books(query_embedding vector(1536), match_count int)
returns table (
  id text,
  title text,
  author text,
  description text,
  genres text[],
  average_rating numeric
)
language sql stable as $$
  select b.id, b.title, b.author, b.description, b.genres, b.average_rating
  from public.books b
  where b.embedding is not null
  order by b.embedding <=> query_embedding
  limit match_count;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.shelf_items enable row level security;
alter table public.reviews enable row level security;
alter table public.taste_profiles enable row level security;
alter table public.book_lists enable row level security;
alter table public.follows enable row level security;
alter table public.notifications enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.user_settings enable row level security;

-- profiles policies
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public" on public.profiles
for select using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

-- books: read-only for everyone (writes via service role)
drop policy if exists "books_select_public" on public.books;
create policy "books_select_public" on public.books
for select using (true);

-- shelf_items
drop policy if exists "shelf_select_own" on public.shelf_items;
create policy "shelf_select_own" on public.shelf_items
for select using (auth.uid() = user_id);

drop policy if exists "shelf_write_own" on public.shelf_items;
create policy "shelf_write_own" on public.shelf_items
for insert with check (auth.uid() = user_id);

drop policy if exists "shelf_update_own" on public.shelf_items;
create policy "shelf_update_own" on public.shelf_items
for update using (auth.uid() = user_id);

drop policy if exists "shelf_delete_own" on public.shelf_items;
create policy "shelf_delete_own" on public.shelf_items
for delete using (auth.uid() = user_id);

-- reviews
drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public" on public.reviews
for select using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews
for insert with check (auth.uid() = user_id);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own" on public.reviews
for update using (auth.uid() = user_id);

-- taste_profiles
drop policy if exists "taste_select_own" on public.taste_profiles;
create policy "taste_select_own" on public.taste_profiles
for select using (auth.uid() = user_id);

drop policy if exists "taste_upsert_own" on public.taste_profiles;
create policy "taste_upsert_own" on public.taste_profiles
for insert with check (auth.uid() = user_id);

drop policy if exists "taste_update_own" on public.taste_profiles;
create policy "taste_update_own" on public.taste_profiles
for update using (auth.uid() = user_id);

-- lists
drop policy if exists "lists_select_public" on public.book_lists;
create policy "lists_select_public" on public.book_lists
for select using (is_public = true or auth.uid() = user_id);

drop policy if exists "lists_write_own" on public.book_lists;
create policy "lists_write_own" on public.book_lists
for insert with check (auth.uid() = user_id);

drop policy if exists "lists_update_own" on public.book_lists;
create policy "lists_update_own" on public.book_lists
for update using (auth.uid() = user_id);

-- follows
drop policy if exists "follows_select_public" on public.follows;
create policy "follows_select_public" on public.follows
for select using (true);

drop policy if exists "follows_write_own" on public.follows;
create policy "follows_write_own" on public.follows
for insert with check (auth.uid() = follower_id);

drop policy if exists "follows_delete_own" on public.follows;
create policy "follows_delete_own" on public.follows
for delete using (auth.uid() = follower_id);

-- notifications
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
for select using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
for update using (auth.uid() = user_id);

-- chat sessions
drop policy if exists "chat_select_own" on public.chat_sessions;
create policy "chat_select_own" on public.chat_sessions
for select using (auth.uid() = user_id);

drop policy if exists "chat_write_own" on public.chat_sessions;
create policy "chat_write_own" on public.chat_sessions
for insert with check (auth.uid() = user_id);

drop policy if exists "chat_update_own" on public.chat_sessions;
create policy "chat_update_own" on public.chat_sessions
for update using (auth.uid() = user_id);

-- user settings
drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own" on public.user_settings
for select using (auth.uid() = user_id);

drop policy if exists "user_settings_upsert_own" on public.user_settings;
create policy "user_settings_upsert_own" on public.user_settings
for insert with check (auth.uid() = user_id);

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own" on public.user_settings
for update using (auth.uid() = user_id);

