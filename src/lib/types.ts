export type Intent = "fun" | "useful" | "both";

export interface Category {
  slug: string;
  name: string;
  intent: Intent;
  examples: string;
}

export interface Venue {
  name: string;
  area: string;
  lat: number;
  lng: number;
}

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
  /** journey time by public transport in minutes, where available */
  journeyMins?: number;
  organiser: string;
  tags: string[];
}

export type PriceBucket = "free" | "under10" | "10to25" | "over25";
export type DateRange = "any" | "today" | "week" | "month";

export interface Filters {
  intent: Intent | "anything";
  categories: string[];
  price: PriceBucket[];
  /** null = whole UK (the default); a number narrows to that radius */
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
