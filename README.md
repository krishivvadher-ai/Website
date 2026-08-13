# onTrack

One place to find and track things worth doing — for 13–18 year olds in
London, launching in five East London boroughs: Tower Hamlets, Newham,
Hackney, Waltham Forest and Redbridge. Split evenly between things that are
fun and things that get you somewhere, with plenty that are both.

Teenagers use onTrack free, forever. Revenue comes from the supply side:
organisers (£29/month Boost, £149/month Partner), borough partnerships
(£6,000/year) and school and college licences (£995/year). There are no
ads, no ticket fees, and no paywall on the consumer side.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint (next/core-web-vitals)
```

No environment variables are required to run the demo. To wire up the live
AI assistant, copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY`
(server-side only — see Security below). Without a key, the support chat and
listing assistant answer from grounded help content and heuristics, so every
flow works end-to-end.

## What's here

### For young people
- **Browse feed** (`/browse`) — the intent toggle (Anything · Something fun ·
  Something useful), filters (age, price with one-tap Free, distance, date,
  "Still open"), named-filter empty states, skeleton loaders.
- **Map** (`/map`) — price-on-pin markers, clustering, East London fitted on
  load, full list-view equivalent (nothing is map-only). Location requested
  only on tap, used once, never stored.
- **Event detail** (`/events/[slug]`) — separate event date and application
  deadline, embedded venue map, share + story image, OG preview images.
- **Deadlines** (`/deadlines`) — a month calendar plus a soonest-first list,
  opt-in reminders (off by default), closed items grouped, never vanished.
- **You** (`/you`) — age set once and applied everywhere (both directions);
  "What I've done", a UCAS-ready record of attended events with the user's
  own notes, copy-as-text and print — entirely local to the device; and the
  data rights: download, correct, delete (which really deletes).
- **Report a concern** (`/report`) — one tap from every page, no account
  needed, danger-now signposting (999, Childline) before the form.

### For the supply side (where the revenue is)
- **/for-organisers** — the sales page: List (free) / Boost (£29/mo) /
  Partner (£149/mo), the honest cost-to-reach-100-teenagers arithmetic, and
  why listing is free.
- **/boroughs/[slug]** and **/schools/[slug]** — data-driven partner pages
  (the £6,000/year and £995/year products). Tower Hamlets is the seeded demo.
- **/organiser** — dashboard with review-queue submission (every listing is
  pending until an onTrack reviewer publishes it, with an audit trail),
  stats, listings table, balance monitor, eligibility checker.
- **/organiser/onboarding** — safeguarding self-certification: named
  safeguarding contact, policy, Enhanced DBS with children's barred list
  check (post-1-Sept-2026 test), insurance, code of conduct.

### Legal and trust pages
`/privacy` (layered, child-readable short version first), `/terms`,
`/safeguarding`, `/organiser-terms`, `/cookies`, `/accessibility`,
`/verification` (what the safeguarding badges do and don't mean), `/about`.

## Compliance position (summary)

- **Children's Code**: highest protections for every user regardless of
  stated age (Standard 3, option (b) — reasoning recorded in
  `src/lib/age.ts`); child-readable transparency; no profiling; no nudge
  techniques; safety tools within two taps (Standard 15).
- **Online Safety Act**: every listing is provider content — organiser
  submissions are pending until onTrack reviews and publishes them, and
  there is deliberately **no user-to-user surface** (no messaging, comments,
  reviews, profiles or user uploads). See the boundary comment at the top of
  `src/lib/types.ts` before adding features.
- **No third-party cookies, no advertising, no data sold** — the complete
  storage list is on `/cookies`.
- **Age gate**: neutral date entry, under-13 rejection with a 24-hour
  device block, age never shown to anyone.

## Architecture notes

- Next.js App Router + Tailwind v4; static generation wherever possible.
- Categories are data (`src/lib/categories.ts`), not component code.
- The schema separates event date from application deadline, minimum from
  maximum age, and category from intent tag (`src/lib/types.ts`).
- Public queries only ever return `status: "published"` listings, via
  `publishedEvents()` in `src/lib/events.ts`.
- Seed data: 35 events across the five launch boroughs, real venues and
  coordinates, dates relative to now, roughly even fun/useful/both mix.
- User state lives in localStorage on the device. Age drives filtering
  only; it is never rendered for other users or sent to organisers.

## Security

No API key appears in frontend code, in any `NEXT_PUBLIC_`-prefixed
variable, in this repository, or in any request originating from the
browser. The browser posts to `/api/chat` and `/api/organiser/assist`; those
server routes hold the key in server-only environment variables, call the
provider, and stream the response back. The routes rate-limit per IP, cap
input length, authenticate organiser tools before doing any work, refuse
mental-health/medical/self-harm topics with signposted hand-offs, and never
echo the key, the system prompt, or raw provider errors to the client.
