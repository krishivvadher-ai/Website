import type { Borough, OnTrackEvent } from "./types";
import { publishedEvents } from "./events";

// Data-driven borough pages — these are the £6,000/year product, so each
// borough carries enough real detail to look like something a council would
// put its name on.

export interface BoroughInfo {
  slug: string;
  name: Borough;
  /** the council's own youth offer, shown in the "Youth services in X" panel */
  youthServices: { name: string; note: string }[];
}

export const BOROUGHS: BoroughInfo[] = [
  {
    slug: "tower-hamlets",
    name: "Tower Hamlets",
    youthServices: [
      { name: "Young Tower Hamlets", note: "The council's youth service — clubs, holiday programmes and youth workers across the borough." },
      { name: "Poplar HARCA youth centres", note: "Spotlight and neighbourhood centres with studios, sport and somewhere warm to be." },
      { name: "Tower Hamlets WorkPath", note: "Careers, apprenticeship and employability support for young residents." },
    ],
  },
  {
    slug: "newham",
    name: "Newham",
    youthServices: [
      { name: "Newham Youth Empowerment Service", note: "Youth zones, detached youth work and the Young Mayor programme." },
      { name: "Our Newham Work", note: "The council's employment service, with a dedicated under-25 offer." },
    ],
  },
  {
    slug: "hackney",
    name: "Hackney",
    youthServices: [
      { name: "Young Hackney", note: "Youth hubs, sport, music and health programmes for 6–19 year olds." },
      { name: "Hackney Works", note: "Employment and apprenticeship support for young residents." },
    ],
  },
  {
    slug: "waltham-forest",
    name: "Waltham Forest",
    youthServices: [
      { name: "Young Independent Lives", note: "The council's youth and family support offer." },
      { name: "BIG Creative Education", note: "Creative further education and youth programmes in Walthamstow." },
    ],
  },
  {
    slug: "redbridge",
    name: "Redbridge",
    youthServices: [
      { name: "Redbridge Youth Service", note: "Youth centres, holiday activities and targeted support." },
      { name: "Vision RCL", note: "Leisure, culture and libraries — including much of the borough's youth programme." },
    ],
  },
];

export function boroughBySlug(slug: string): BoroughInfo | undefined {
  return BOROUGHS.find((b) => b.slug === slug);
}

export function eventsInBorough(name: Borough): OnTrackEvent[] {
  return publishedEvents()
    .filter((e) => e.venue.borough === name)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
