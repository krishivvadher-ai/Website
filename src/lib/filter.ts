import type { Filters, OnTrackEvent, PriceBucket, Profile } from "./types";
import { visibleToProfile } from "./age";
import { DEFAULT_LOCATION, distanceMiles } from "./geo";
import { deadlinePassed, daysUntil } from "./format";

export interface Origin {
  lat: number;
  lng: number;
}

export function eventDistance(e: OnTrackEvent, origin: Origin = DEFAULT_LOCATION): number {
  return distanceMiles(origin.lat, origin.lng, e.venue.lat, e.venue.lng);
}

function inPriceBucket(price: number, bucket: PriceBucket): boolean {
  switch (bucket) {
    case "free":
      return price === 0;
    case "under10":
      return price > 0 && price < 1000;
    case "10to25":
      return price >= 1000 && price <= 2500;
    case "over25":
      return price > 2500;
  }
}

function inDateRange(e: OnTrackEvent, range: Filters["dateRange"]): boolean {
  if (range === "any") return true;
  const days = daysUntil(e.date);
  if (days < 0) return false;
  if (range === "today") return days === 0;
  if (range === "week") return days <= 7;
  return days <= 31;
}

function matchesIntent(e: OnTrackEvent, intent: Filters["intent"]): boolean {
  if (intent === "anything") return true;
  // Events tagged "both" appear under all three options — "free food and
  // networking" is genuinely both.
  return e.intent === intent || e.intent === "both";
}

function matchesQuery(e: OnTrackEvent, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return [e.title, e.description, e.venue.name, e.venue.area, e.organiser, ...e.tags]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export interface FilterResult {
  events: OnTrackEvent[];
  /** which filter dimension removed the most events — used by empty states */
  loosenHint: string | null;
}

export function applyFilters(
  all: OnTrackEvent[],
  filters: Filters,
  profile: Profile,
  origin: Origin = DEFAULT_LOCATION
): FilterResult {
  const upcoming = all.filter((e) => daysUntil(e.date) >= 0);
  // Age is applied first and unconditionally — it is a profile rule, not a
  // feed filter, and it applies everywhere in the app.
  const eligible = upcoming.filter((e) => visibleToProfile(e, profile));

  const checks: { name: string; hint: (f: Filters) => string; test: (e: OnTrackEvent) => boolean }[] = [
    { name: "intent", hint: () => "Try switching back to Anything", test: (e) => matchesIntent(e, filters.intent) },
    {
      name: "category",
      hint: (f) => `Clear the category filter${f.categories.length > 1 ? "s" : ""}`,
      test: (e) => filters.categories.length === 0 || filters.categories.includes(e.category),
    },
    {
      name: "price",
      hint: () => "Clear the price filter",
      test: (e) => filters.price.length === 0 || filters.price.some((b) => inPriceBucket(e.price, b)),
    },
    {
      name: "distance",
      hint: (f) => `Search the whole UK instead of ${f.distanceMiles} miles`,
      test: (e) => filters.distanceMiles === null || eventDistance(e, origin) <= filters.distanceMiles,
    },
    { name: "date", hint: () => "Try a wider date range", test: (e) => inDateRange(e, filters.dateRange) },
    {
      name: "deadline",
      hint: () => "Turn off Still open",
      test: (e) => !filters.stillOpen || !e.applicationDeadline || !deadlinePassed(e.applicationDeadline),
    },
    { name: "query", hint: (f) => `Clear the search for “${f.query.trim()}”`, test: (e) => matchesQuery(e, filters.query) },
  ];

  let events = eligible;
  let worst: { hint: string; removed: number } | null = null;
  for (const check of checks) {
    const next = events.filter(check.test);
    const removed = events.length - next.length;
    if (removed > 0 && (worst === null || removed > worst.removed)) {
      worst = { hint: check.hint(filters), removed };
    }
    events = next;
  }

  // Relevance-and-date sort, both intents interleaved — never grouped with
  // one type above the other.
  events = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return { events, loosenHint: events.length === 0 ? (worst?.hint ?? null) : null };
}
