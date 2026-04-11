-- Remove curated book lists feature (reader-made lists / book_lists).

drop policy if exists "lists_select_public" on public.book_lists;
drop policy if exists "lists_write_own" on public.book_lists;
drop policy if exists "lists_update_own" on public.book_lists;

drop table if exists public.book_lists cascade;
