import type { Category } from "./types";

// Data-driven category list. The order alternates fun and useful so neither
// type dominates a chip row — keep that property when editing.
export const CATEGORIES: Category[] = [
  { slug: "music", name: "Music & gigs", intent: "fun", examples: "Live sets, open decks, local nights" },
  { slug: "talks", name: "Talks & lectures", intent: "useful", examples: "University open lectures, guest speakers" },
  { slug: "social", name: "Social & community", intent: "fun", examples: "Games nights, meet-ups, food events" },
  { slug: "careers", name: "Careers & networking", intent: "useful", examples: "Insight days, apprenticeship fairs, employer sessions" },
  { slug: "sport", name: "Sport & outdoors", intent: "both", examples: "Casual runs, trials, club sessions" },
  { slug: "workshops", name: "Workshops & making", intent: "both", examples: "Screenprinting, coding, music production, crafts" },
  { slug: "volunteering", name: "Volunteering & causes", intent: "both", examples: "Local projects, fundraising, campaigns" },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
