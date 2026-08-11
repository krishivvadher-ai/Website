import type { OnTrackEvent, Profile } from "./types";

// Presentation bands for listings and for users who prefer not to enter a
// date of birth. Filtering itself uses the event's min/max ages directly.
export const AGE_BANDS: { label: string; min: number; max: number }[] = [
  { label: "12–14", min: 12, max: 14 },
  { label: "15–16", min: 15, max: 16 },
  { label: "17–18", min: 17, max: 18 },
  { label: "19–21", min: 19, max: 21 },
  { label: "22–25", min: 22, max: 25 },
];

/** Badge text for a listing's age eligibility — shown on every card. */
export function eventAgeBadge(e: Pick<OnTrackEvent, "minAge" | "maxAge">): string {
  if (e.minAge <= 13 && e.maxAge === undefined) return "All ages";
  if (e.minAge >= 18 && e.maxAge === undefined) return `${e.minAge}+`;
  if (e.maxAge === undefined) return `${e.minAge}+`;
  return `${e.minAge}–${e.maxAge}`;
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
