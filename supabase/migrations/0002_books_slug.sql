-- Slug is required for deep links; KB sync fills this when a book is saved to a shelf.
alter table public.books add column if not exists slug text;

create index if not exists books_slug_idx on public.books (slug) where slug is not null;
