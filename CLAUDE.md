# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page app that pulls a random release from Discogs (filterable by year/genre/style)
and surfaces a listen-now preview via YouTube/Apple Music, with search-link fallbacks for
Spotify/SoundCloud. React 19 + TypeScript + Vite + Tailwind v4, deployed on Vercel as a
static build plus one Edge Function that proxies Discogs.

## Commands

```bash
npm install
cp .env.local.example .env.local   # then paste a DISCOGS_TOKEN in
npm run dev       # vite dev server; server.proxy in vite.config.ts handles the Discogs proxy locally
npm run lint       # eslint
npm run build      # tsc -b && vite build — this is what CI/Vercel run; treat a failing build as a real bug
```

No test suite. `npm run build` failing (a TypeScript error, not just a lint warning) is the
thing to check after any nontrivial change — it's happened before that dead/unused files
had type errors nobody noticed because they were never imported into the `tsc -b` project.

### `DISCOGS_TOKEN`

Optional but recommended: a free Discogs Personal Access Token
([discogs.com/settings/developers](https://www.discogs.com/settings/developers)) raises the
API quota from 25 to 60 req/min. Needed in `.env.local` for dev and in Vercel's Environment
Variables for prod — they're two separate places, both read the same variable name.

## Architecture

### Genres/styles are static data, not an API call

`src/data/genreStyleMap.ts` is a hand-built `Record<Genre, Style[]>` (15 genres, 757 styles,
cross-checked against Discogs' live taxonomy) that `useGenreOptions`/`useStylesOptions(genre)`
read synchronously. This exists because Discogs has no endpoint that lists genres/styles —
the tempting-looking alternative is sampling `/database/search` results and reducing out the
unique `genre`/`style` fields, which is what an earlier version of this app did: 20
sequential search requests *on every page load* just to populate two `<select>`s, which by
itself blew through the unauthenticated rate limit before a single "find an album" click.
`getStylesForGenre(genre)` filters the style list to the ones that actually belong to that
genre (falls back to all 757 when no genre is picked). If Discogs styles look wrong or
missing for some genre, the fix is editing this file, not adding an API call.

### The Discogs proxy is not a catch-all route — on purpose

`api/discogs.ts` is a flat Vercel Edge Function; the frontend calls
`/api/discogs?path=<url-encoded target path+query>` (see `discogsFetch` in
`src/services/discogsApi.ts`), and the function does `fetch(\`https://api.discogs.com${path}\`)`
with the auth header attached server-side.

This is deliberately *not* `api/discogs/[...path].ts` (the standard Vercel catch-all
convention). That was the original implementation and it silently never deployed on this
project — the build succeeded, no error surfaced anywhere in the logs, but the route just
404'd in production with zero functions showing up for it. Isolated with throwaway
diagnostic functions before concluding the bracket syntax itself was the problem here (a flat
file in the same subfolder deployed fine). If you ever add another dynamic API route, prefer
the query-param trick over `[...x].ts` unless you've confirmed catch-all routes work in this
specific project again.

`vite.config.ts`'s `server.proxy` mirrors this exact same query-param contract for local dev
(decodes `?path=` and forwards to `api.discogs.com`, injecting `DISCOGS_TOKEN` from
`.env.local` via `loadEnv`) — it and `api/discogs.ts` need to be kept in sync if the proxy
contract ever changes, since they're two independent implementations of the same protocol.

### Vercel project settings that aren't obvious from the repo

**Framework Preset must be "Other", not "Vite"**, in Vercel's Project Settings → Build and
Deployment. A plain Vite project (no Nitro/SvelteKit/etc.) does not get zero-config `/api`
Function detection under the "Vite" preset — confirmed via Vercel's own docs, which say to
use a Vite plugin or Nitro for that instead. "Other" is the generic static-site-plus-`/api`
zero-config path, which is what this app actually needs; it does *not* auto-detect the
output directory correctly for Vite though, so **Output Directory must be explicitly
overridden to `dist`** (its default guess for "Other" is `public` or `.`, neither of which
apply here).

### `getOneRandomAlbum` returns a discriminated result, not `Album | null`

`{ status: "ok", album } | { status: "empty" } | { status: "error" }` — a genuinely empty
result set (a real but overly-specific filter combo, e.g. a style that didn't exist yet in
the chosen year) and an actual fetch/rate-limit failure are different situations and
`AlbumFinder` shows a different message for each. Don't collapse these back into a single
`null`/truthy check.

### EmbedTabs decides tab visibility, not the embed components

`YouTubeVideoPlayer` and `AppleMusicEmbed` are purely presentational (they render *given* a
videoId/embedUrl) — `EmbedTabs` owns the availability check for each and only renders a tab
for it when there's content: YouTube synchronously (from `album.videos[0].uri`), Apple Music
via the `useAppleMusicEmbedUrl` hook (iTunes Search API, no key — the search happens whether
or not that tab ends up shown, since the tab list itself depends on the result). Spotify and
SoundCloud always show a tab (they're just external search links, via the shared
`ExternalSearchLink` component) because both platforms locked their APIs behind paid tiers in
2026 (Spotify: the *account creating the app* needs Premium; SoundCloud: needs an Artist Pro
subscription) — there's no free/keyless search alternative for either that isn't scraping an
undocumented endpoint, which is deliberately not what's implemented here.

### State resets happen during render, not in a `useEffect`

Search the codebase for the pattern `if (x !== prevX) { setPrevX(x); setY(...) }` (used in
`App.tsx` for resetting `style` when `genre` changes, in `EmbedTabs` for resetting the active
tab when the album changes, and inside `useAppleMusicEmbedUrl`/would-be loading states). This
is intentional — `react-hooks/set-state-in-effect` (from `eslint-plugin-react-hooks`) flags a
synchronous `setState` inside a `useEffect` body, and the React-docs-recommended fix for "some
state needs to reset when a prop/value changes" is adjusting state during render instead of
in an effect. Don't reintroduce `useEffect(() => setX(...), [dep])` for this class of
problem — it'll fail lint.

### Windows-95 UI kit

`src/index.css` defines `.win95-raised` / `.win95-sunken` / `.win95-tab(-active|-inactive)` /
`.win95-groupbox` — reusable 3D-bevel classes (the classic light-top-left/dark-bottom-right
border trick) standing in for what would otherwise be Tailwind's `rounded-*`/`shadow-*`. The
whole app intentionally has zero border-radius. `react-select` (used by `SelectComponent`)
ships its own default theme that would clash badly, so it's fully recolored via the `styles`
prop in `src/component/selectComponent.tsx` referencing the same CSS custom properties
(`var(--win95-*)`) defined in `index.css`, rather than Tailwind classes (react-select's
`styles` API takes inline style objects, not classNames).
