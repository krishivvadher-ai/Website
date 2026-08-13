// ---------------------------------------------------------------------------
// PRODUCT BOUNDARY — READ BEFORE ADDING FEATURES
//
// onTrack deliberately has NO user-to-user features: no messaging, no
// comments, no reviews, no user profiles visible to other users, and no
// image uploads from users. This is a legal position, not a product gap.
// Every listing is provider content published by onTrack under editorial
// control, which keeps the service outside the Online Safety Act 2023
// user-to-user regime. Adding any user-to-user surface (a DM feature, a
// comment box, a public profile) changes onTrack's legal category and
// triggers a full OSA risk assessment — that is a decision for legal and
// the DSL, not a sprint. See /terms and /safeguarding.
// ---------------------------------------------------------------------------

export type Intent = "fun" | "useful" | "both";

export interface Category {
  slug: string;
  name: string;
  intent: Intent;
  examples: string;
}

export type Borough = "Tower Hamlets" | "Newham" | "Hackney" | "Waltham Forest" | "Redbridge";

export interface Venue {
  name: string;
  area: string;
  borough: Borough;
  lat: number;
  lng: number;
}

/**
 * Safeguarding verification level for an organiser.
 * "self-certified" = the organiser completed our self-certification form.
 * "verified" = onTrack has actually seen and checked the documents.
 * NEVER render the words "safe", "trusted", "approved" or "vetted" from
 * this field — overclaiming is a misrepresentation and ASA risk.
 */
export type VerificationLevel = "self-certified" | "verified";

/**
 * Listing lifecycle. Listings are provider content: nothing an organiser
 * submits is publicly visible until an onTrack reviewer moves it to
 * "published". Browse, map and detail queries must only ever return
 * "published" listings.
 */
export type ListingStatus = "draft" | "pending" | "published" | "suspended";

export interface OnTrackEvent {
  id: string;
  slug: string;
  title: string;
  category: string; // category slug — categories are data-driven, never hardcoded in components
  intent: Intent; // set per event by the organiser; may differ from the category default
  description: string;
  venue: Venue;
  /** ISO date-time of the event itself */
  date: string;
  /** ISO date-time when applications/booking close — modelled separately from the event date */
  applicationDeadline?: string;
  minAge: number;
  maxAge?: number;
  /** all-in price in pence; 0 = free */
  price: number;
  /** breakdown shown in small text under the price */
  feeBreakdown?: string;
  /** journey time by public transport (TfL) in minutes, where available */
  journeyMins?: number;
  organiser: string;
  /** safeguarding verification level of the organiser, if any */
  organiserVerified?: VerificationLevel;
  /** editorial state — only "published" listings are publicly visible */
  status: ListingStatus;
  tags: string[];
}

export type PriceBucket = "free" | "under10" | "10to25" | "over25";
export type DateRange = "any" | "today" | "week" | "month";

export interface Filters {
  intent: Intent | "anything";
  categories: string[];
  price: PriceBucket[];
  /** null = all of London (the default); a number narrows to that radius */
  distanceMiles: number | null;
  dateRange: DateRange;
  stillOpen: boolean;
  query: string;
}

export const DEFAULT_FILTERS: Filters = {
  intent: "anything",
  categories: [],
  price: [],
  distanceMiles: null,
  dateRange: "any",
  stillOpen: false,
  query: "",
};

export interface Profile {
  /** date of birth, ISO date — stored locally on this device only, never shown to other users */
  dob?: string;
  /** alternative to dob: a chosen age band [min, max] */
  band?: [number, number];
  /** "Also show events I'm not old enough for" — off by default, lives in settings */
  showIneligible: boolean;
}

export interface ReminderPrefs {
  sevenDays: boolean;
  twoDays: boolean;
  morningOf: boolean;
  channel: "email" | "push";
}

/** A "What I've done" entry — stored only on this device, never sent anywhere. */
export interface AttendedEntry {
  /** user's own one-line note on what they got from it */
  note: string;
  markedAt: string;
}

/** A safeguarding/concern report captured by /report. Demo: stored locally. */
export interface ConcernReport {
  id: string;
  kind: string;
  detail: string;
  replyEmail?: string;
  submittedAt: string;
}

/** Audit trail entry for the provider-content review workflow. */
export interface AuditEntry {
  at: string;
  by: string;
  action: string;
  detail?: string;
}
