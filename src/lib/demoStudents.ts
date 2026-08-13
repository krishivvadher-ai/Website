import { publishedEvents } from "./events";
import type { OnTrackEvent } from "./types";

// Demo student roster for the school dashboard.
//
// HOW SCHOOLS SEE INDIVIDUAL STUDENTS — the consent model, recorded here
// because it is the load-bearing decision:
// A school never sees a student silently. A student (or their parent, for
// under-16s) chooses "Share my record with my school" from their own device;
// sharing is visible to them, revocable at any time, and covers only their
// activity record — saved, booked and attended events and their own notes.
// Safeguarding concern reports are NEVER visible to schools under any
// setting: they go to onTrack's DSL and statutory services only.
// Everything below is generated demo data illustrating that model.

const FIRST = ["Amara", "Tayo", "Maryam", "Jakub", "Leon", "Fatima", "Ruby", "Yusuf", "Grace", "Daniel", "Aisha", "Marcus", "Zainab", "Oliver", "Nia", "Hasan", "Ella", "Kofi", "Sofia", "Ibrahim", "Mia", "Tomasz", "Layla", "Jayden"];
const LAST = ["Okafor", "Adeyemi", "Begum", "Kowalski", "Mitchell", "Rahman", "Clarke", "Ali", "Osei", "Nowak", "Hussain", "Thompson", "Ahmed", "Baker", "Mensah", "Khan", "Roberts", "Boateng", "Silva", "Malik", "Turner", "Wisniewski", "Hassan", "Campbell"];

function h(s: string): number {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
  return x;
}

export interface DemoStudent {
  id: string;
  name: string;
  yearGroup: 12 | 13;
  /** consent: the student chose to share their record with the school */
  sharing: boolean;
  sharedSince?: string;
  lastActiveDays: number;
  saved: OnTrackEvent[];
  booked: OnTrackEvent[];
  attended: { event: OnTrackEvent; note: string }[];
}

const NOTES = [
  "Got feedback on my portfolio and used it in my application.",
  "First time doing anything like this — went back twice.",
  "Talked to an apprentice about the selection process.",
  "Helped run the beginners' group by week three.",
  "Made something I actually kept. Counted it for DofE.",
  "Met two people from other schools I still work with.",
  "",
];

export const DEMO_STUDENTS: DemoStudent[] = Array.from({ length: 24 }, (_, i) => {
  const events = publishedEvents();
  const seed = h(`student-${i}`);
  const name = `${FIRST[i % FIRST.length]} ${LAST[h(`surname-${i}`) % LAST.length]}`;
  const sharing = seed % 4 !== 0; // three quarters have chosen to share
  const pick = (salt: string, n: number) =>
    Array.from({ length: n }, (_, k) => events[(h(`${i}-${salt}-${k}`) % events.length)]).filter(
      (e, idx, arr) => arr.findIndex((x) => x.id === e.id) === idx
    );
  const attendedEvents = pick("att", 1 + (seed % 3));
  return {
    id: `stu_${String(i + 1).padStart(2, "0")}`,
    name,
    yearGroup: seed % 3 === 0 ? 13 : 12,
    sharing,
    sharedSince: sharing ? `${3 + (seed % 20)} weeks ago` : undefined,
    lastActiveDays: seed % 13,
    saved: pick("sav", 2 + (seed % 4)),
    booked: pick("bok", 1 + (seed % 2)),
    attended: attendedEvents.map((event, k) => ({
      event,
      note: NOTES[h(`${i}-note-${k}`) % NOTES.length],
    })),
  };
});
