import type { OnTrackEvent, Profile } from "./types";

// ---------------------------------------------------------------------------
// Children's Code position (record of reasoning — keep this comment):
// onTrack applies Standard 3 ("Age appropriate application"), option (b):
// rather than attempting hard age verification, we apply the HIGHEST
// protections to every user regardless of stated age — high-privacy
// defaults, no precise location, no profiling, no behavioural advertising,
// and no public visibility of any user data. Age self-declaration here is
// used only to FILTER OUT content a younger user should not see; entering
// an older age never unlocks lower protections, because there are no lower
// protections to unlock. Under-13 dates of birth are rejected and re-entry
// is blocked on the device for 24 hours (see AgePrompt / You).
// ---------------------------------------------------------------------------

// Presentation bands for listings and for users who prefer not to enter a
// date of birth. Filtering itself uses the event's min/max ages directly.
// The product serves 13–18 year olds.
export const AGE_BANDS: { label: string; min: number; max: number }[] = [
  { label: "13–14", min: 13, max: 14 },
  { label: "15–16", min: 15, max: 16 },
  { label: "17–18", min: 17, max: 18 },
];

/** Badge text for a listing's age eligibility — shown on every card. */
export function eventAgeBadge(e: Pick<OnTrackEvent, "minAge" | "maxAge">): string {
  if (e.minAge <= 13 && e.maxAge === undefined) return "All ages";
  if (e.minAge >= 18 && e.maxAge === undefined) return `${e.minAge}+`;
  if (e.maxAge === undefined) return `${e.minAge}+`;
  return `${e.minAge}–${e.maxAge}`;
}

// Under-13 gate: entering a date of birth below 13 stores a rejection flag
// on this device and blocks re-entry for 24 hours, rather than letting the
// same person immediately retry with a different year.
const GATE_KEY = "ontrack.agegate.v1";
const GATE_BLOCK_MS = 24 * 60 * 60 * 1000;

export function recordUnder13Rejection(): void {
  try {
    window.localStorage.setItem(GATE_KEY, JSON.stringify({ rejectedAt: Date.now() }));
  } catch {
    // storage unavailable — the block simply doesn't persist
  }
}

export function under13BlockActive(): boolean {
  try {
    const raw = window.localStorage.getItem(GATE_KEY);
    if (!raw) return false;
    const { rejectedAt } = JSON.parse(raw) as { rejectedAt: number };
    return Date.now() - rejectedAt < GATE_BLOCK_MS;
  } catch {
    return false;
  }
}

export function ageFromDob(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

/**
 * The user's age for filtering, or null when not set. From a band we use the
 * band's bounds rather than a point age (see profileEligible).
 */
export function profileAgeRange(profile: Profile): [number, number] | null {
  if (profile.dob) {
    const age = ageFromDob(profile.dob);
    return [age, age];
  }
  if (profile.band) return profile.band;
  return null;
}

/**
 * Hard eligibility filter, both directions: below a minimum OR above a
 * maximum means the event is absent, not greyed out. Unknown age passes —
 * there is nothing to filter on until the user tells us.
 */
export function isEligible(e: Pick<OnTrackEvent, "minAge" | "maxAge">, profile: Profile): boolean {
  const range = profileAgeRange(profile);
  if (range === null) return true;
  const [lo, hi] = range;
  if (hi < e.minAge) return false;
  if (e.maxAge !== undefined && lo > e.maxAge) return false;
  return true;
}

/** Eligibility including the buried "also show" escape hatch. */
export function visibleToProfile(e: Pick<OnTrackEvent, "minAge" | "maxAge">, profile: Profile): boolean {
  if (profile.showIneligible) return true;
  return isEligible(e, profile);
}
