# Zoive Movies

Find your next favorite movie: search any film, see what's trending, watch trailers, find where to stream it, keep a watchlist, rate movies and get personal suggestions.

## Tech stack (in plain words)

| Piece | What it does |
|---|---|
| **Next.js 16 + React + TypeScript** | Builds the pages and runs the small bits of server code (so secret keys stay hidden). |
| **Tailwind CSS** | Styling, plus the dark and light themes. |
| **TMDB API** | All movie data: posters, trending, ratings, trailers, streaming services. |
| **Supabase** | Sign-in (email link or Google) and the database for watchlists, ratings and recent searches. |
| **Vercel** | Hosts the site and redeploys it every time you push to GitHub. |

## Pages

- **Home** (`/`): search bar, your recent searches, mood shortcuts, *Suggested for you*, *Trending this week*, top rated.
- **Search** (`/search`): results update as you type.
- **Discover** (`/discover`): filter by mood, genre, decade, length and rating, and sort the results.
- **Movie** (`/movie/[id]`): trailer, where to stream, your star rating, an add-to-watchlist button, cast, and similar movies.
- **Watchlist** (`/watchlist`): "To watch" and "Watched" tabs, sorting, and undo after removing.
- **My ratings** (`/ratings`): everything you've rated, filterable by stars.
- **Settings** (`/settings`): theme, streaming country, clear your search history, sign out.
- **Sign in** (`/login`): email magic link or Google.

## Run it locally

1. Fill in `.env.local` (see `.env.example`):
   - `TMDB_READ_TOKEN`: themoviedb.org → Settings → API → **API Read Access Token**
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase → Project Settings → API
2. In Supabase → **SQL Editor**, paste all of `supabase/schema.sql` and click **Run**.
3. In Supabase → **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` to **Redirect URLs**.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
   Then open http://localhost:3000

## Deploy to Vercel

1. Push this repo to GitHub.
2. On vercel.com → **Add New → Project** → import `zoive-movies`.
3. Under **Environment Variables**, add the same keys as in `.env.local`, and set `NEXT_PUBLIC_SITE_URL` to your Vercel address (for example `https://zoive-movies.vercel.app`).
4. Click **Deploy**.
5. In Supabase → **Authentication → URL Configuration**:
   - set **Site URL** to your Vercel address
   - add `https://YOUR-APP.vercel.app/auth/callback` to **Redirect URLs**

## Optional: Google sign-in

In Supabase → **Authentication → Providers → Google**, turn it on and paste a Google Cloud OAuth client ID and secret. The email link works without this.

---

This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data comes from JustWatch via TMDB.
