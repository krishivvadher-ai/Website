# onTrack

One place to find and track things worth doing — for 13–25 year olds in
Hertfordshire and the London commuter belt. Split evenly between things that
are fun and things that get you somewhere, with plenty that are both.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

No environment variables are required to run the demo. To wire up the live
AI assistant, copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY`
(server-side only — see Security below). Without a key, the support chat and
listing assistant answer from grounded help content and heuristics, so every
flow works end-to-end.

## What's here

- **Browse feed** (`/browse`) — the intent toggle (Anything · Something fun ·
  Something useful), filters (age, price with one-tap Free, distance slider,
  date, "Still open" deadline toggle, categories), 1/2/3-column grid,
  named-filter empty states, skeleton loaders.
- **Map** (`/map`) — price-on-pin markers (Signal for free, Ink for paid),
  screen-space clustering with counts, "Search this area" on pan, live
  distance-radius circle, desktop split view with hover↔pin highlighting,
  mobile card carousel. Location is requested only on tap, never on load.
- **Event detail** (`/events/[slug]`) — separate event date and application
  deadline, sticky booking card (desktop) / sticky CTA bar (mobile), share +
  "Ask a mate" + 1080×1920 story-image generation, Open Graph metadata.
  Deep links outside the user's age band show a plain explanation plus three
  eligible alternatives — never the listing.
- **Deadlines** (`/deadlines`) — saved events sorted by what closes soonest,
  opt-in reminders (7 days / 2 days / morning of; off by default), closed
  items grouped rather than vanishing.
- **Saved** (`/saved`), **You** (`/you`) — age set once (DOB or band) and
  applied everywhere, both directions (minimum and maximum). The only escape
  hatch ("Also show events I'm not old enough for") is off by default and
  lives in settings.
- **Organiser dashboard** (`/organiser`) — behind (demo) auth: listing
  assistant with visible "AI-generated — please check" marker, undo, and a
  manual path; eligibility checker; fun/useful balance monitor; pricing
  guidance; timing and performance summaries.
- **Support chat** — floating widget, four suggested questions, streamed
  responses, "Talk to a person" always visible, crisis-content routing to
  real help lines, no PII collection in chat.

## Architecture notes

- Next.js App Router + Tailwind v4; static generation wherever possible.
- Categories are data (`src/lib/categories.ts`), not component code; each
  carries an intent tag (`fun` / `useful` / `both`) set per event.
- The schema models event date vs application deadline, and minimum vs
  maximum age, as separate fields (`src/lib/types.ts`).
- Seed data (`src/lib/events.ts`) keeps dates relative to now so the demo
  always has upcoming events and live deadlines — and keeps the fun/useful
  mix roughly even, which is a product requirement.
- User state (age, saved, reminders) lives in localStorage on the device.
  Age drives filtering only; it is never rendered for other users.

## Security

No API key appears in frontend code, in any `NEXT_PUBLIC_`-prefixed
variable, in this repository, or in any request originating from the
browser. The browser posts to `/api/chat` and `/api/organiser/assist`; those
server routes hold the key in server-only environment variables, call the
provider, and stream the response back. The routes rate-limit per IP, cap
input length, authenticate organiser tools before doing any work, and never
echo the key, the system prompt, or raw provider errors to the client.
