import type { OnTrackEvent } from "./types";

// Seed listings for the launch area: Hertfordshire and the London commuter
// belt. Dates are offsets from "now" so the demo feed always has upcoming
// events and live application deadlines.
//
// Balance rule (section 3 of the product brief): leisure and opportunity are
// equal citizens. This set is roughly half fun, half useful, with a good
// share tagged both — keep that mix when adding or removing seed events.

const now = new Date();

function inDays(days: number, hour = 19, minute = 0): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, hour, minute);
  return d.toISOString();
}

interface Seed {
  slug: string;
  title: string;
  category: string;
  intent: OnTrackEvent["intent"];
  description: string;
  venue: OnTrackEvent["venue"];
  daysAway: number;
  hour?: number;
  deadlineDaysAway?: number;
  minAge: number;
  maxAge?: number;
  price: number;
  feeBreakdown?: string;
  journeyMins?: number;
  organiser: string;
  tags: string[];
}

const seeds: Seed[] = [
  {
    slug: "open-decks-st-albans",
    title: "Open decks night — bring a USB, play a set",
    category: "music",
    intent: "fun",
    description:
      "A friendly open decks night for new and first-time DJs. Sign up on the door for a 20-minute slot, or just come to listen. CDJs and a mixer provided, and there's always someone happy to show you the basics. No experience needed and nobody is judging — half the room is playing out for the first time.",
    venue: { name: "The Horn", area: "St Albans", lat: 51.7488, lng: -0.3426 },
    daysAway: 3,
    hour: 19,
    minAge: 16,
    price: 500,
    feeBreakdown: "£4.50 ticket + £0.50 booking fee",
    journeyMins: 24,
    organiser: "Herts DJ Collective",
    tags: ["dj", "music", "beginners"],
  },
  {
    slug: "uh-engineering-lecture",
    title: "Open lecture: how F1 teams use simulation",
    category: "talks",
    intent: "useful",
    description:
      "A free open lecture at the University of Hertfordshire from a race strategy engineer. How teams model tyre wear, fuel loads and safety cars in real time — and what maths and software skills get you into the pit wall. Open to anyone, aimed at school and college students thinking about engineering. Stays useful for a personal statement; no booking pressure, but seats are allocated in advance.",
    venue: { name: "University of Hertfordshire, College Lane", area: "Hatfield", lat: 51.7526, lng: -0.2411 },
    daysAway: 6,
    hour: 18,
    deadlineDaysAway: 4,
    minAge: 14,
    price: 0,
    journeyMins: 12,
    organiser: "University of Hertfordshire",
    tags: ["engineering", "lecture", "ucas"],
  },
  {
    slug: "games-night-hatfield",
    title: "Board games and pizza night",
    category: "social",
    intent: "fun",
    description:
      "A chill games night in the community hall — shelves of board games, a few consoles, and pizza at half time. Come alone or bring a mate; the first half hour is set up so newcomers get pulled into a game rather than left standing around. Runs every fortnight.",
    venue: { name: "Birchwood Leisure Centre", area: "Hatfield", lat: 51.7715, lng: -0.2288 },
    daysAway: 2,
    hour: 18,
    minAge: 13,
    maxAge: 19,
    price: 300,
    feeBreakdown: "£3 on the door, pizza included",
    journeyMins: 15,
    organiser: "Hatfield Youth Collective",
    tags: ["games", "social", "food"],
  },
  {
    slug: "kpmg-insight-day",
    title: "KPMG apprenticeship insight day",
    category: "careers",
    intent: "useful",
    description:
      "A day inside KPMG's Watford office for students in Years 12–13 considering an apprenticeship instead of (or as well as) university. Shadow a current apprentice, hear what the selection process actually involves, and get your questions answered by people two years into the job. Travel costs reimbursed. Applications close well before the day — apply early.",
    venue: { name: "KPMG Watford", area: "Watford", lat: 51.6565, lng: -0.3903 },
    daysAway: 18,
    hour: 9,
    deadlineDaysAway: 5,
    minAge: 16,
    maxAge: 18,
    price: 0,
    journeyMins: 34,
    organiser: "KPMG Early Careers",
    tags: ["apprenticeship", "insight-day", "business"],
  },
  {
    slug: "parkrun-panshanger",
    title: "Saturday parkrun — beginners' pace group",
    category: "sport",
    intent: "both",
    description:
      "The regular Saturday 5k in Panshanger Park, with a dedicated beginners' pace group so nobody finishes alone. Free, timed if you want it to be, ignored if you don't. A surprising number of people come for the coffee van afterwards — that counts too. Register once online for a barcode, then just turn up.",
    venue: { name: "Panshanger Park", area: "Welwyn Garden City", lat: 51.7996, lng: -0.1859 },
    daysAway: 4,
    hour: 9,
    minAge: 13,
    price: 0,
    journeyMins: 22,
    organiser: "parkrun UK",
    tags: ["running", "outdoors", "free"],
  },
  {
    slug: "screenprint-workshop",
    title: "Screenprint your own tote bag",
    category: "workshops",
    intent: "both",
    description:
      "A two-hour screenprinting workshop where you design, expose and pull your own print onto a tote bag. All materials included and you leave with the bag plus the screen file to reuse. Small group of ten, so booking closes early. Great fun, and genuinely a making skill — a few past attendees have used their prints in art school portfolios.",
    venue: { name: "Watford Makers", area: "Watford", lat: 51.6553, lng: -0.396 },
    daysAway: 9,
    hour: 14,
    deadlineDaysAway: 6,
    minAge: 14,
    price: 1200,
    feeBreakdown: "£10 workshop + £2 materials",
    journeyMins: 34,
    organiser: "Watford Makers",
    tags: ["printing", "crafts", "portfolio"],
  },
  {
    slug: "riverside-cleanup",
    title: "River Lea cleanup morning",
    category: "volunteering",
    intent: "both",
    description:
      "Two hours in waders (provided) pulling trolleys and litter out of the River Lea, followed by bacon or veggie rolls on the bank. Counts towards DofE volunteering hours and the organisers will sign whatever forms you bring. Honestly more fun than it sounds — there's a leaderboard for weirdest find.",
    venue: { name: "Hartham Common", area: "Hertford", lat: 51.7986, lng: -0.0788 },
    daysAway: 11,
    hour: 10,
    minAge: 13,
    price: 0,
    journeyMins: 30,
    organiser: "Herts River Trust",
    tags: ["environment", "dofe", "outdoors"],
  },
  {
    slug: "camden-assembly-gig",
    title: "New music night: four local bands",
    category: "music",
    intent: "fun",
    description:
      "Four bands, all under 20, all playing their first proper venue show. The Assembly's new music night has a good record of booking acts just before they get big — and tickets are cheap because nobody's heard of anyone yet. That's the point.",
    venue: { name: "Camden Assembly", area: "Camden, London", lat: 51.5433, lng: -0.1525 },
    daysAway: 8,
    hour: 19,
    minAge: 18,
    price: 800,
    feeBreakdown: "£7 ticket + £1 booking fee",
    journeyMins: 48,
    organiser: "Camden Assembly",
    tags: ["gig", "live-music", "london"],
  },
  {
    slug: "nhs-work-experience",
    title: "NHS healthcare careers work experience week",
    category: "careers",
    intent: "useful",
    description:
      "A five-day placement across Lister Hospital departments for students seriously considering medicine, nursing or allied health. Includes a mock MMI interview and a reference letter on completion. Places are limited and the application asks for a short statement — the deadline is firm, and it's earlier than you think.",
    venue: { name: "Lister Hospital", area: "Stevenage", lat: 51.9224, lng: -0.2119 },
    daysAway: 24,
    hour: 9,
    deadlineDaysAway: 3,
    minAge: 16,
    maxAge: 18,
    price: 0,
    journeyMins: 26,
    organiser: "East and North Herts NHS Trust",
    tags: ["medicine", "work-experience", "ucas"],
  },
  {
    slug: "junior-park-tennis",
    title: "Free park tennis — rackets provided",
    category: "sport",
    intent: "both",
    description:
      "Drop-in tennis sessions in Verulamium Park run by LTA-qualified coaches. Rackets and balls provided, all standards welcome, and it's genuinely free — funded by the council's summer programme. Just register once so they know numbers.",
    venue: { name: "Verulamium Park", area: "St Albans", lat: 51.7476, lng: -0.3567 },
    daysAway: 5,
    hour: 17,
    minAge: 13,
    maxAge: 17,
    price: 0,
    journeyMins: 25,
    organiser: "St Albans Council",
    tags: ["tennis", "free", "outdoors"],
  },
  {
    slug: "code-first-girls-taster",
    title: "Intro to coding taster: build a page in an evening",
    category: "workshops",
    intent: "both",
    description:
      "A free two-hour taster session where you build and publish a real web page from nothing. Laptops provided if you need one. Aimed at girls and non-binary young people aged 15–19 who've never written a line of code — the room is set up for absolute beginners and it's more social than it sounds. Pizza at the break.",
    venue: { name: "Watford Central Library", area: "Watford", lat: 51.6603, lng: -0.3964 },
    daysAway: 13,
    hour: 17,
    deadlineDaysAway: 10,
    minAge: 15,
    maxAge: 19,
    price: 0,
    journeyMins: 34,
    organiser: "Code First Girls",
    tags: ["coding", "beginners", "tech"],
  },
  {
    slug: "open-mic-hertford",
    title: "Open mic: music, poetry, comedy, whatever",
    category: "music",
    intent: "fun",
    description:
      "Hertford's longest-running open mic. Five-minute slots, sign up from 7pm, kind crowd. Music, poetry, comedy and things that defy category all welcome. Under-18s get priority slots before 9pm.",
    venue: { name: "Hertford Corn Exchange", area: "Hertford", lat: 51.7959, lng: -0.0784 },
    daysAway: 7,
    hour: 19,
    minAge: 14,
    price: 0,
    journeyMins: 30,
    organiser: "Corn Exchange Live",
    tags: ["open-mic", "performance", "free"],
  },
  {
    slug: "uni-taster-day-ucl",
    title: "UCL taster day: psychology and behavioural science",
    category: "talks",
    intent: "useful",
    description:
      "A full taster day at UCL for Year 12s curious about psychology — two mini-lectures, a lab visit, and a session on what admissions tutors actually read in a personal statement. Free, but massively oversubscribed, so the application window matters more than the event date.",
    venue: { name: "UCL, Bloomsbury", area: "Bloomsbury, London", lat: 51.5246, lng: -0.134 },
    daysAway: 21,
    hour: 10,
    deadlineDaysAway: 7,
    minAge: 16,
    maxAge: 17,
    price: 0,
    journeyMins: 45,
    organiser: "UCL Outreach",
    tags: ["psychology", "university", "taster-day"],
  },
  {
    slug: "community-kitchen",
    title: "Community kitchen: cook and eat together",
    category: "social",
    intent: "fun",
    description:
      "A pay-what-you-can community kitchen where everyone cooks one dish together and then sits down to eat it. Recipes change weekly, no cooking skill assumed, and you'll leave knowing how to make at least one thing properly. A genuinely easy place to show up alone.",
    venue: { name: "The Hub, Welwyn Garden City", area: "Welwyn Garden City", lat: 51.8016, lng: -0.2065 },
    daysAway: 10,
    hour: 18,
    minAge: 15,
    price: 0,
    feeBreakdown: "Pay what you can on the night",
    journeyMins: 20,
    organiser: "WGC Community Trust",
    tags: ["food", "cooking", "community"],
  },
  {
    slug: "warner-bros-studio-careers",
    title: "Behind the scenes: film production careers evening",
    category: "careers",
    intent: "both",
    description:
      "An evening at the Warner Bros. studio complex in Leavesden with people who actually make films for a living — a set builder, a production accountant, a VFX artist and a runner who started three years ago. Short talks, then open questions. The point: film is a real local industry with real entry-level jobs, and most of them aren't 'director'.",
    venue: { name: "Warner Bros. Studios Leavesden", area: "Leavesden", lat: 51.6906, lng: -0.4172 },
    daysAway: 15,
    hour: 18,
    deadlineDaysAway: 12,
    minAge: 15,
    maxAge: 21,
    price: 0,
    journeyMins: 38,
    organiser: "Herts Film Office",
    tags: ["film", "careers", "creative"],
  },
  {
    slug: "climbing-taster-harlow",
    title: "Indoor climbing taster session",
    category: "sport",
    intent: "both",
    description:
      "A 90-minute beginners' climbing session — harness, shoes and instructor included. You'll top out on a real wall by the end, whatever shape you're in. Book ahead; sessions cap at eight so the instructor can actually watch everyone.",
    venue: { name: "Harlow Climbing Centre", area: "Harlow", lat: 51.7676, lng: 0.0894 },
    daysAway: 12,
    hour: 16,
    minAge: 13,
    price: 900,
    feeBreakdown: "£8 session + £1 kit hire",
    journeyMins: 40,
    organiser: "Harlow Climbing Centre",
    tags: ["climbing", "beginners", "indoor"],
  },
  {
    slug: "vinyl-fair-stalbans",
    title: "Record fair and listening corner",
    category: "music",
    intent: "fun",
    description:
      "Forty crates of secondhand vinyl, a listening deck in the corner, and sellers who will happily talk you through where to start. Entry is free and the £1 crates are the good bit. Runs 10–4 in the Alban Arena foyer.",
    venue: { name: "The Alban Arena", area: "St Albans", lat: 51.7517, lng: -0.339 },
    daysAway: 16,
    hour: 10,
    minAge: 13,
    price: 0,
    journeyMins: 25,
    organiser: "Herts Record Fairs",
    tags: ["vinyl", "music", "free"],
  },
  {
    slug: "stem-big-bang",
    title: "Big Bang STEM fair — hands-on exhibits",
    category: "talks",
    intent: "both",
    description:
      "A hands-on STEM fair with forty exhibitor stands, live demonstrations, and universities and employers actually worth talking to. Somewhere between a science museum and a careers fair, and better than both. Free with registration; school groups dominate mornings, afternoons are quieter.",
    venue: { name: "Hertfordshire Showground", area: "Redbourn", lat: 51.7822, lng: -0.4022 },
    daysAway: 27,
    hour: 10,
    deadlineDaysAway: 20,
    minAge: 13,
    maxAge: 19,
    price: 0,
    journeyMins: 42,
    organiser: "The Big Bang",
    tags: ["stem", "fair", "science"],
  },
  {
    slug: "youth-theatre-audition",
    title: "Youth theatre: open auditions for autumn show",
    category: "workshops",
    intent: "both",
    description:
      "Open auditions for the autumn production — no experience or prepared piece needed; the audition is a workshop, so you'll act for two hours either way. Backstage, lighting and set-design roles are also open, no audition required for those. A proper credit for a drama school application, and a very fast way to know thirty people.",
    venue: { name: "Campus West", area: "Welwyn Garden City", lat: 51.8039, lng: -0.2078 },
    daysAway: 14,
    hour: 18,
    deadlineDaysAway: 13,
    minAge: 13,
    maxAge: 21,
    price: 0,
    journeyMins: 20,
    organiser: "WGC Youth Theatre",
    tags: ["theatre", "audition", "creative"],
  },
  {
    slug: "food-bank-shift",
    title: "Food bank warehouse shift — Saturday crew",
    category: "volunteering",
    intent: "useful",
    description:
      "Three-hour Saturday shifts sorting and packing at the regional food bank warehouse. Music on, teams of four, and a rota you control from your phone. Counts for DofE and looks like what it is on any application: showing up reliably to do something real.",
    venue: { name: "Herts Food Bank Warehouse", area: "Stevenage", lat: 51.9038, lng: -0.1966 },
    daysAway: 4,
    hour: 10,
    minAge: 14,
    price: 0,
    journeyMins: 26,
    organiser: "Trussell Trust",
    tags: ["dofe", "volunteering", "weekend"],
  },
  {
    slug: "silent-disco-1825",
    title: "Silent disco in the park — three channels",
    category: "social",
    intent: "fun",
    description:
      "Three channels, three DJs, three hundred pairs of headphones in Cassiobury Park after dark. The channel battle gets genuinely competitive. 18–25 night — bring ID. Headphone deposit refunded on return.",
    venue: { name: "Cassiobury Park", area: "Watford", lat: 51.6636, lng: -0.4104 },
    daysAway: 19,
    hour: 20,
    minAge: 18,
    maxAge: 25,
    price: 1500,
    feeBreakdown: "£12.50 ticket + £2.50 booking fee",
    journeyMins: 36,
    organiser: "Parklife Events",
    tags: ["disco", "night", "music"],
  },
  {
    slug: "first-aid-course",
    title: "One-day first aid certificate (St John Ambulance)",
    category: "workshops",
    intent: "useful",
    description:
      "A full one-day Emergency First Aid at Work certificate, subsidised for under-25s. CPR, defib, bleeds, choking — taught properly, with assessment on the day and a certificate valid three years. The single most useful thing on this app, and employers genuinely notice it.",
    venue: { name: "St John Ambulance Hall", area: "St Albans", lat: 51.752, lng: -0.336 },
    daysAway: 23,
    hour: 9,
    deadlineDaysAway: 16,
    minAge: 16,
    price: 2000,
    feeBreakdown: "£20 subsidised course fee, certificate included",
    journeyMins: 25,
    organiser: "St John Ambulance",
    tags: ["first-aid", "certificate", "skills"],
  },
  {
    slug: "kings-cross-networking",
    title: "Free food lol and networking: tech social",
    category: "careers",
    intent: "both",
    description:
      "A monthly social for 18–25s curious about tech careers, hosted in a King's Cross office with genuinely good free food. Ten minutes of lightning talks, then it's just a room of interesting people and no lanyards. Half the value is the pizza; the other half is that recruiters actually come to these.",
    venue: { name: "Google, King's Cross", area: "King's Cross, London", lat: 51.5333, lng: -0.1242 },
    daysAway: 17,
    hour: 18,
    deadlineDaysAway: 14,
    minAge: 18,
    maxAge: 25,
    price: 0,
    journeyMins: 42,
    organiser: "KX Tech Socials",
    tags: ["tech", "networking", "free-food"],
  },
  {
    slug: "repair-cafe",
    title: "Repair café: fix it, don't bin it",
    category: "volunteering",
    intent: "both",
    description:
      "Bring something broken — headphones, a lamp, a jacket with a rip — and fix it with a volunteer fixer, or come to learn fixing and stay to help others. Tools, parts, tea and biscuits supplied. Nobody leaves without learning something with their hands.",
    venue: { name: "Hitchin Town Hall", area: "Hitchin", lat: 51.9494, lng: -0.2803 },
    daysAway: 20,
    hour: 10,
    minAge: 13,
    price: 0,
    journeyMins: 35,
    organiser: "Repair Café Herts",
    tags: ["repair", "skills", "environment"],
  },
  {
    slug: "summer-closing-party",
    title: "Summer closing party — rooftop, all ages till 9",
    category: "social",
    intent: "fun",
    description:
      "The summer programme's closing party on the rooftop terrace: food trucks, two live acts, and a proper view. All ages until 9pm, then 18+ only. Tickets include a food voucher. Last year sold out a week ahead.",
    venue: { name: "BOXPARK Wembley", area: "Wembley, London", lat: 51.5563, lng: -0.2837 },
    daysAway: 26,
    hour: 17,
    deadlineDaysAway: 22,
    minAge: 13,
    price: 1000,
    feeBreakdown: "£8.50 ticket + £1.50 booking fee, includes £5 food voucher",
    journeyMins: 50,
    organiser: "Summer Sessions",
    tags: ["party", "food", "rooftop"],
  },
];

let counter = 0;
export const EVENTS: OnTrackEvent[] = seeds.map((s) => {
  counter += 1;
  return {
    id: `evt_${String(counter).padStart(3, "0")}`,
    slug: s.slug,
    title: s.title,
    category: s.category,
    intent: s.intent,
    description: s.description,
    venue: s.venue,
    date: inDays(s.daysAway, s.hour ?? 19),
    applicationDeadline: s.deadlineDaysAway === undefined ? undefined : inDays(s.deadlineDaysAway, 23, 59),
    minAge: s.minAge,
    maxAge: s.maxAge,
    price: s.price,
    feeBreakdown: s.feeBreakdown,
    journeyMins: s.journeyMins,
    organiser: s.organiser,
    tags: s.tags,
  };
});

export function eventBySlug(slug: string): OnTrackEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export function eventById(id: string): OnTrackEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
