-- =============================================================
-- ShelfAI — Seed Data (corrected)
-- Run in Supabase SQL Editor (Project → SQL Editor → Run)
-- =============================================================
-- BEFORE running:
--   1. Create 3 users manually via Authentication → Users → Add user:
--        maya@demo.shelfai.app   / ShelfAI2026!
--        jordan@demo.shelfai.app / ShelfAI2026!
--        priya@demo.shelfai.app  / ShelfAI2026!
--   2. Copy their UUIDs and replace the 3 placeholders below.
-- =============================================================

-- ── Replace these with your actual UUIDs from the Auth dashboard ──
DO $$
DECLARE
  maya_id   uuid := 'ce75f1a8-cd7f-4e7f-a145-6c5ed442603d';
  jordan_id uuid := '73a20c9d-aa90-4364-938e-c741c73874e7';
  priya_id  uuid := '912303cd-e617-4ad0-a7a1-a6dcdb70540c';
BEGIN

-- ── 0. Drop unused tables ─────────────────────────────────────
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;

-- ── 1. Add slug column to books if missing ────────────────────
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS slug text;
CREATE INDEX IF NOT EXISTS books_slug_idx ON public.books (slug) WHERE slug IS NOT NULL;

-- ── 2. Profiles ───────────────────────────────────────────────
INSERT INTO public.profiles (id, username, display_name, bio, reading_goal)
VALUES
  (maya_id,   'maya_reads',  'Maya L.',   'Literary fiction devotee. Sucker for messy friendships and slow burns.', 24),
  (jordan_id, 'jk_stacks',   'Jordan K.', 'Mostly sci-fi and weird fiction. If it has footnotes I''m already in.', 20),
  (priya_id,  'priya_books', 'Priya S.',  'Reads everything. Obsessed with translated fiction and cozy mysteries.', 30)
ON CONFLICT (id) DO UPDATE
  SET display_name = EXCLUDED.display_name,
      bio          = EXCLUDED.bio,
      reading_goal = EXCLUDED.reading_goal;

-- ── 3. Books (KB mirror) ──────────────────────────────────────
INSERT INTO public.books (id, title, author, slug, cover_url, description, genres, published_year, page_count, isbn, average_rating, ratings_count)
VALUES
  ('kb-001','The Goldfinch','Donna Tartt','the-goldfinch-donna-tartt','https://covers.openlibrary.org/b/isbn/9780316055448-M.jpg','A boy drags a stolen painting through grief and the underworld.',ARRAY['Literary Fiction','Fiction'],2013,771,'9780316055448',3.70,320000),
  ('kb-002','A Little Life','Hanya Yanagihara','a-little-life-hanya-yanagihara','https://covers.openlibrary.org/b/isbn/9780385539258-M.jpg','Four friends in New York face trauma and devotion.',ARRAY['Literary Fiction','Fiction'],2015,720,'9780385539258',4.30,410000),
  ('kb-003','Normal People','Sally Rooney','normal-people-sally-rooney','https://covers.openlibrary.org/b/isbn/9781984822178-M.jpg','Irish teenagers weave class and desire into a modern love story.',ARRAY['Literary Fiction','Fiction'],2018,273,'9781984822178',4.00,890000),
  ('kb-004','The Overstory','Richard Powers','the-overstory-richard-powers','https://covers.openlibrary.org/b/isbn/9780393356687-M.jpg','Trees and activists intertwine in a sweeping environmental novel.',ARRAY['Literary Fiction','Fiction'],2018,502,'9780393356687',4.20,180000),
  ('kb-005','White Teeth','Zadie Smith','white-teeth-zadie-smith','https://covers.openlibrary.org/b/isbn/9780375703867-M.jpg','London families clash and blend across generations.',ARRAY['Literary Fiction','Fiction'],2000,448,'9780375703867',3.90,220000),
  ('kb-006','Foundation','Isaac Asimov','foundation-isaac-asimov','https://covers.openlibrary.org/b/isbn/9780553293357-M.jpg','Psychohistory guides a crumbling galactic empire.',ARRAY['Sci-Fi','Fiction'],1951,255,'9780553293357',4.40,89000),
  ('kb-007','The Three-Body Problem','Cixin Liu','the-three-body-problem-cixin-liu','https://covers.openlibrary.org/b/isbn/9780765377067-M.jpg','Astrophysics and alien contact in Cultural Revolution China.',ARRAY['Sci-Fi','Fiction'],2014,400,'9780765377067',4.10,280000),
  ('kb-008','Ender''s Game','Orson Scott Card','enders-game-orson-scott-card','https://covers.openlibrary.org/b/isbn/9780812550702-M.jpg','Child soldiers train to fight an insectoid threat.',ARRAY['Sci-Fi','Fiction'],1985,324,'9780812550702',4.30,1500000),
  ('kb-009','The Left Hand of Darkness','Ursula K. Le Guin','the-left-hand-of-darkness-ursula-k-le-guin','https://covers.openlibrary.org/b/isbn/9780441478125-M.jpg','A diplomat navigates genderless society on a frozen world.',ARRAY['Sci-Fi','Fiction'],1969,304,'9780441478125',4.20,95000),
  ('kb-010','Neuromancer','William Gibson','neuromancer-william-gibson','https://covers.openlibrary.org/b/isbn/9780441569595-M.jpg','Hackers and AI in a gritty cyberpunk sprawl.',ARRAY['Sci-Fi','Fiction'],1984,271,'9780441569595',3.90,210000),
  ('kb-011','The Way of Kings','Brandon Sanderson','the-way-of-kings-brandon-sanderson','https://covers.openlibrary.org/b/isbn/9780765326355-M.jpg','Knights and storms on a shattered world.',ARRAY['Fantasy','Fiction'],2010,1007,'9780765326355',4.70,520000),
  ('kb-083','Tomorrow, and Tomorrow, and Tomorrow','Gabrielle Zevin','tomorrow-and-tomorrow-and-tomorrow-gabrielle-zevin','https://covers.openlibrary.org/b/isbn/9780593321448-M.jpg','Two game designers build worlds and a complicated friendship across decades.',ARRAY['Literary Fiction','Fiction'],2022,416,'9780593321448',4.30,310000),
  ('kb-091','Circe','Madeline Miller','circe-madeline-miller','https://covers.openlibrary.org/b/isbn/9780316556347-M.jpg','The witch of Greek myth discovers her own power.',ARRAY['Fantasy','Fiction'],2018,400,'9780316556347',4.35,720000),
  ('kb-094','The Thursday Murder Club','Richard Osman','the-thursday-murder-club-richard-osman','https://covers.openlibrary.org/b/isbn/9780241425442-M.jpg','Four retirees solve cold cases and stumble into a live murder.',ARRAY['Mystery','Fiction'],2020,382,'9780241425442',4.35,290000)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug;

-- ── 4. Shelf Items ────────────────────────────────────────────
INSERT INTO public.shelf_items (user_id, book_id, status, progress, user_rating, added_at)
VALUES
  (maya_id, 'kb-083', 'read',         100, 5, now() - interval '2 days'),
  (maya_id, 'kb-003', 'read',         100, 4, now() - interval '10 days'),
  (maya_id, 'kb-002', 'read',         100, 5, now() - interval '20 days'),
  (maya_id, 'kb-091', 'reading',       65, NULL, now() - interval '3 days'),
  (maya_id, 'kb-001', 'want_to_read',   0, NULL, now() - interval '1 day'),

  (jordan_id, 'kb-007', 'read',       100, 5, now() - interval '5 days'),
  (jordan_id, 'kb-008', 'read',       100, 4, now() - interval '15 days'),
  (jordan_id, 'kb-009', 'read',       100, 4, now() - interval '25 days'),
  (jordan_id, 'kb-006', 'reading',     40, NULL, now() - interval '7 days'),
  (jordan_id, 'kb-010', 'want_to_read', 0, NULL, now() - interval '2 days'),

  (priya_id, 'kb-094', 'read',        100, 5, now() - interval '4 days'),
  (priya_id, 'kb-004', 'read',        100, 4, now() - interval '14 days'),
  (priya_id, 'kb-011', 'reading',      30, NULL, now() - interval '6 days'),
  (priya_id, 'kb-083', 'want_to_read',  0, NULL, now() - interval '1 day')
ON CONFLICT (user_id, book_id) DO NOTHING;

-- ── 5. Reviews ────────────────────────────────────────────────
INSERT INTO public.reviews (user_id, book_id, rating, body, created_at)
VALUES
  (maya_id, 'kb-083', 5, 'ShelfAI suggested this after I said I wanted character-driven stories with messy friendships. I finished it in three days and immediately texted my book club. The game mechanics are a metaphor the whole way through and it earns every page.', now() - interval '2 days'),
  (maya_id, 'kb-003', 4, 'Deceptively simple prose hiding something very sharp underneath. The class dynamics hit harder than I expected. Rooney makes both characters frustrating and completely sympathetic at once.', now() - interval '10 days'),
  (maya_id, 'kb-002', 5, 'This book broke me in the best possible way. It asks a lot of the reader but gives back even more. The friendship at the center is one of the most fully realised I''ve ever read.', now() - interval '20 days'),
  (jordan_id, 'kb-007', 5, 'I asked for something eerie but grounded in real physics. The Cultural Revolution framing adds weight to what could''ve been pure genre. The science is dense but never cold.', now() - interval '5 days'),
  (jordan_id, 'kb-008', 4, 'Still holds up decades later. The twist reframes everything retroactively in the best way. Required reading if you''re getting into military sci-fi.', now() - interval '15 days'),
  (jordan_id, 'kb-009', 4, 'Le Guin builds a world so quietly you don''t realise how strange it is until you''re fully inside it. The gender exploration is still relevant and never feels like a lecture.', now() - interval '25 days'),
  (priya_id, 'kb-094', 5, 'I told ShelfAI I wanted cozy but clever and it nailed it. The banter between the four main characters is genuinely funny and the mystery actually holds together. Perfect weekend read.', now() - interval '4 days'),
  (priya_id, 'kb-004', 4, 'Slow to start but the payoff is enormous. Powers weaves nine storylines with more patience than most novelists manage with one. Environmentalism that doesn''t preach.', now() - interval '14 days')
ON CONFLICT DO NOTHING;

-- ── 6. Taste Profiles ─────────────────────────────────────────
INSERT INTO public.taste_profiles (user_id, rated_books, moods, goals, last_updated)
VALUES
  (maya_id,   '[{"bookId":"kb-002","rating":"love"},{"bookId":"kb-003","rating":"love"},{"bookId":"kb-083","rating":"love"},{"bookId":"kb-006","rating":"meh"}]', ARRAY['emotional','romantic','mind-bending'], ARRAY['read-more-women','finish-series'], now()),
  (jordan_id, '[{"bookId":"kb-007","rating":"love"},{"bookId":"kb-008","rating":"liked"},{"bookId":"kb-009","rating":"liked"}]',                                  ARRAY['mind-bending','dark-eerie','epic-adventure'], ARRAY['read-classics','explore-translated'], now()),
  (priya_id,  '[{"bookId":"kb-094","rating":"love"},{"bookId":"kb-004","rating":"liked"},{"bookId":"kb-091","rating":"liked"}]',                                  ARRAY['light-funny','dark-eerie','romantic'], ARRAY['read-more','diverse-voices'], now())
ON CONFLICT (user_id) DO UPDATE
  SET rated_books  = EXCLUDED.rated_books,
      moods        = EXCLUDED.moods,
      goals        = EXCLUDED.goals,
      last_updated = EXCLUDED.last_updated;

-- ── 7. Book Lists ─────────────────────────────────────────────
INSERT INTO public.book_lists (id, user_id, title, description, book_ids, is_public, created_at)
VALUES
  ('b1000000-0000-0000-0000-000000000001', maya_id,   'Character-driven stories with messy friendships', 'Books where the relationships are the plot. No clean arcs, no easy resolutions.', ARRAY['kb-083','kb-002','kb-003','kb-004'], true, now() - interval '3 days'),
  ('b1000000-0000-0000-0000-000000000002', jordan_id, 'Hard sci-fi that earns its ideas',                'No hand-waving. The science matters and so does the human cost.',                    ARRAY['kb-007','kb-009','kb-006','kb-008','kb-010'], true, now() - interval '8 days'),
  ('b1000000-0000-0000-0000-000000000003', priya_id,  'Cozy reads that are actually smart',              'Comfort reads that don''t talk down to you. Clever mysteries and warm worlds.',      ARRAY['kb-094','kb-091','kb-003'], true, now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- ── 8. Follows ────────────────────────────────────────────────
INSERT INTO public.follows (follower_id, following_id)
VALUES
  (maya_id,   jordan_id),
  (maya_id,   priya_id),
  (jordan_id, priya_id),
  (priya_id,  maya_id)
ON CONFLICT DO NOTHING;

END $$;
