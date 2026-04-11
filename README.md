# BooksyAI

AI-assisted book discovery with a warm, editorial UI: browse a curated catalog, save books to your shelf, get recommendations from onboarding taste data, join the community feed (reviews and follows), and chat with an assistant grounded in your real book catalog.

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI | React 18, Tailwind CSS, Radix UI, Framer Motion |
| Data | [Supabase](https://supabase.com/) (Postgres, Auth, Row Level Security) |
| Client state | TanStack Query, Zustand (shelf) |
| AI | OpenAI-compatible APIs (`LLM_*` env) for chat and “why you’ll love it” streams |

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** (or npm / yarn)
- A **Supabase** project for auth, database, and (optionally) realtime

## Quick start

```bash
git clone <repository-url>
cd shelfai
pnpm install
```

Create `.env.local` in the project root (see [Environment variables](#environment-variables)). Then:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

Apply SQL migrations to your Supabase project (order matters):

1. `supabase/migrations/0001_init.sql` — schema, RLS, extensions  
2. `supabase/migrations/0002_drop_book_lists.sql` — removes legacy `book_lists` if present  
3. `supabase/migrations/0003_profiles_and_follow_notifications.sql` — profile bootstrap for new users, follow notifications, optional realtime on `notifications`

You can run these in the Supabase SQL Editor or via the [Supabase CLI](https://supabase.com/docs/guides/cli) (`supabase db push` / linked project).

Optional demo data: `supabase/seed.sql` (edit placeholder user UUIDs before running).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server with Turbopack |
| `pnpm dev:safe` | Dev server without `--turbo` |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | ESLint |

`postbuild` runs `next-sitemap` to regenerate sitemaps.

## Environment variables

Copy this checklist into `.env.local` and fill in values.

### Required for core app (auth + database)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |

### Recommended for server APIs that bypass RLS safely

| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — used by some routes (shelf, onboarding, reviews) when needed. **Never expose to the browser.** |

### Site URLs

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin (e.g. `https://your-domain.com`) for metadata and absolute links |
| `VERCEL_URL` | Set automatically on Vercel; used as fallback for site URL |

### AI (chat & streaming features)

| Variable | Purpose |
|----------|---------|
| `LLM_API_KEY` | API key for the configured provider |
| `LLM_PROVIDER` | e.g. `openai` (default) |
| `LLM_MODEL` | Chat model (default `gpt-4o`) |
| `LLM_BASE_URL` | Optional custom API base URL |
| `LLM_EMBEDDING_MODEL` | Embeddings model name |

### Rate limiting (optional)

| Variable | Purpose |
|----------|---------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash token |

### Optional integrations

| Variable | Purpose |
|----------|---------|
| `STATIC_AUTH_EMAIL` / `STATIC_AUTH_PASSWORD` | Demo static login used by `/api/auth/static-login` (hackathon / staging) |
| `N8N_FEEDBACK_WORKFLOW_URL` or `N8N_FEEDBACK_WEBHOOK_URL` | Feedback form webhook |
| `ENCRYPTION_SECRET` | Used where `src/lib/crypto/encrypt.ts` applies |

## Project layout (high level)

```
src/
  app/           # App Router: pages, layouts, API routes
  components/    # UI: layout, books, community, chat, auth, etc.
  lib/           # Supabase clients, hooks, validations, LLM adapter
  data/          # Curated book knowledge JSON (catalog / chat context)
supabase/
  migrations/    # SQL migrations (run in order)
  seed.sql       # Optional seed data
```

## Authentication

Sign-in uses Supabase Auth with session cookies (`@supabase/ssr`). A global auth dialog is wired through the app provider; legacy `/auth/login` and `/auth/signup` paths redirect home with query params that open the same dialog.

Email confirmation and OAuth flows use `/auth/callback`.

## Security notes

- **RLS** is enabled on user data tables; the anon key is safe for the browser only within those policies.
- **Service role** key must only run on the server. Do not prefix with `NEXT_PUBLIC_`.
- Review `next.config.mjs` CSP headers when adding new external image domains or API hosts.

## Troubleshooting

- **Build errors referencing missing pages**: delete `.next` and run `pnpm build` again.
- **Supabase “permission denied”**: confirm RLS policies and that the user has a row in `public.profiles` (migrations include triggers/backfill for follows and notifications).
- **Chat / AI errors**: verify `LLM_API_KEY` and provider settings; chat route returns a clear error if the key is missing.

## License

Private project unless otherwise noted.
