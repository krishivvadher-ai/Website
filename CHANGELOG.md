# Changelog

## pitch-prep — 13 August 2026

Everything below was built on the `pitch-prep` branch, grouped by package.
Lines marked **⚠ review** are decisions a reviewer should double-check.

### Package 1 — London demo
- Rewrote all seed data: 35 events across Tower Hamlets, Newham, Hackney,
  Waltham Forest and Redbridge, real venues with real coordinates, TfL
  journey times from Stratford, East London organisers, varied age bands,
  ~even fun/useful/both mix, 17 events with separate application deadlines.
- Default map centre moved to Stratford; distance filter defaults to "All
  of London"; copy swept from 13–25/UK to 13–18/East London everywhere.
- Age bands changed to 13–14 / 15–16 / 17–18 to match the 13–18 product.
- **⚠ review**: venue coordinates were entered from knowledge, not a
  geocoder — spot-check a handful on the map before the demo.

### Package 2 — Legal pages
- New `(policy)` route group with a quiet shared layout, TOC and
  last-updated dates: `/privacy` (child-readable short version first,
  field-by-field table, legitimate-interests basis), `/terms` (listings-
  platform position on the first screen), `/safeguarding` (escalation
  routes; DSL and deputy left as explicit TODO placeholders),
  `/organiser-terms` (Tier A list, code of conduct, £5m PLI, immediate
  no-notice no-refund suspension), `/cookies`, `/accessibility` (GDS
  format, WCAG 2.2 AA). All six linked from the footer.
- **⚠ review**: retention periods and the supplier list in `/privacy` are
  drafted, not lawyered — legal must sign off before launch.

### Package 3 — Report a concern + data rights
- "Report a concern" in persistent chrome: header link (desktop), fixed
  button (mobile) — one tap from every page. `/report` opens with the
  in-danger-now panel (999, Childline) before the form; no account needed;
  stated response times; reports persist locally with a server-side TODO.
- `/you` gained one-tap Download my data (JSON), Correct my details, and
  Delete my account — deletion clears every `ontrack.*` localStorage key.

### Package 4 — Age gate
- Neutral DOB entry (no defaults, no pre-ticks); under-13 dates store a
  rejection flag and block re-entry on the device for 24 hours.
- Children's Code Standard 3 option (b) reasoning recorded as a comment in
  `src/lib/age.ts`; plain-language storage line added to the gate itself.
- "Also show events I'm not old enough for" unchanged: off, in settings.

### Package 5 — Organiser products
- `/for-organisers` sales page: List (free) / Boost (£29/mo) / Partner
  (£149/mo), reach-100-teenagers arithmetic, why-free-to-list.
- Data-driven `/boroughs/[slug]` (five boroughs; Tower Hamlets is the demo
  focus) with impact strip and youth-services panel; `/schools/[slug]`
  template with one demo school.
- `verified: "self-certified" | "verified"` added to the data model; badge
  on cards and detail pages linking to the `/verification` explainer. The
  words "safe", "trusted", "approved", "vetted" are never rendered.
- `/organiser/onboarding` collects the full Tier A self-certification,
  including the post-1-September-2026 Enhanced DBS + barred list test.
- **⚠ review**: borough "young people reached" figures are demo numbers
  (derived, labelled as term reach) — replace with real aggregates.

### Package 6 — Provider content
- `status: draft | pending | published | suspended` on the event model;
  browse, map, ticker, landing, hero, detail and chat all query only
  published listings via `publishedEvents()`.
- Both organiser submission paths (assistant and manual) create pending
  listings with an audit trail (local, with `// TODO: persist server-side`)
  and show the review-and-publish message.
- Publisher paragraphs added to `/terms` and `/organiser-terms`; product
  boundary comment (no user-to-user features, and why) at the top of
  `src/lib/types.ts`.

### Package 7 — Cookies, analytics, chat
- Confirmed zero third-party cookies; `/cookies` lists the complete
  storage inventory (two localStorage keys). No consent banner because
  there is nothing to consent to — reasoning on the page.
- Chat route: mental-health/medical/self-harm topics refused outright with
  Childline / Samaritans / 111 / 999 hand-offs; hand-offs logged (kind +
  timestamp only); 90-day transcript retention stated in the panel; no
  share surface exists for chat output.

### Package 8 — UCAS export
- "What I've done" on `/you`: chronological attended list (marked from the
  event page or from saved events), one-line personal notes, "Copy for my
  application" plain-text export, print stylesheet. Entirely local; the
  page says so.

### Package 9 — Accessibility and polish
- Skip-to-content link; coral small text replaced with a darker AA-passing
  `coral-deep` token (coral stays as fill/border accent); Signal-as-text
  audited (only ever on Ink). Titles and descriptions per route, including
  the client-component routes via layout metadata.
- Open Graph images per event via `next/og` (font fetched at render with a
  markless fallback so previews never break a page).
- `/about` with mission, three founder slots (TODO placeholder names) and
  press contact.
- ESLint configured (`next/core-web-vitals`); `npm run lint` and
  `npm run build` both clean.
- **⚠ review**: the OG image route fetches the display font from Google
  Fonts at render time; if the deploy environment blocks that, previews
  fall back to the markless brand image (pages are unaffected).

### Deliberately left as TODO
- DSL and deputy names/contacts on `/safeguarding`; founder names on
  `/about`; supplier list in `/privacy`.
- Server-side persistence for concern reports, pending-listing audit
  trails, and onboarding submissions (all currently local demo state).
- External accessibility audit; real borough reach aggregates.
