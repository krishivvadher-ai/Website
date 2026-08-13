import type { OnTrackEvent, VerificationLevel } from "./types";

// Seed listings for the launch area: five East London boroughs — Tower
// Hamlets, Newham, Hackney, Waltham Forest and Redbridge. Dates are offsets
// from "now" so the demo feed always has upcoming events and live
// application deadlines.
//
// Balance rule (section 3 of the product brief): leisure and opportunity are
// equal citizens. This set is roughly a third fun, a third useful, a third
// both — keep that mix when adding or removing seed events.
//
// Venues are real, with real coordinates — the map is the demo. Journey
// times are realistic TfL estimates from Stratford.

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
  organiserVerified?: VerificationLevel;
  tags: string[];
}

const seeds: Seed[] = [
  // ------------------------------------------------------------ Tower Hamlets
  {
    slug: "open-decks-poplar-union",
    title: "Open decks night — bring a USB, play a set",
    category: "music",
    intent: "fun",
    description:
      "A friendly open decks night for new and first-time DJs at Poplar Union. Sign up on the door for a 20-minute slot, or just come to listen. CDJs and a mixer provided, and there's always someone happy to show you the basics. No experience needed and nobody is judging — half the room is playing out for the first time.",
    venue: { name: "Poplar Union", area: "Poplar", borough: "Tower Hamlets", lat: 51.5155, lng: -0.0206 },
    daysAway: 3,
    hour: 18,
    minAge: 14,
    price: 300,
    feeBreakdown: "£3 on the door",
    journeyMins: 14,
    organiser: "Poplar Union",
    organiserVerified: "verified",
    tags: ["dj", "music", "beginners"],
  },
  {
    slug: "qmul-engineering-lecture",
    title: "Open lecture: how F1 teams use simulation",
    category: "talks",
    intent: "useful",
    description:
      "A free open lecture at Queen Mary University of London from a race strategy engineer. How teams model tyre wear, fuel loads and safety cars in real time — and what maths and software skills get you onto the pit wall. Open to anyone, aimed at school students thinking about engineering. Seats are allocated in advance, so the application date matters more than the event date.",
    venue: { name: "Queen Mary University of London", area: "Mile End", borough: "Tower Hamlets", lat: 51.5246, lng: -0.0384 },
    daysAway: 6,
    hour: 18,
    deadlineDaysAway: 4,
    minAge: 14,
    price: 0,
    journeyMins: 12,
    organiser: "Queen Mary University of London Outreach",
    organiserVerified: "verified",
    tags: ["engineering", "lecture", "ucas"],
  },
  {
    slug: "games-night-spotlight",
    title: "Games night and pizza at Spotlight",
    category: "social",
    intent: "fun",
    description:
      "A chill games night at Spotlight in Langdon Park — consoles, board games, a music studio you can wander into, and pizza at half time. Come alone or bring a mate; the first half hour is set up so newcomers get pulled into a game rather than left standing around. Runs every fortnight.",
    venue: { name: "Spotlight, Langdon Park", area: "Poplar", borough: "Tower Hamlets", lat: 51.5158, lng: -0.0147 },
    daysAway: 2,
    hour: 18,
    minAge: 13,
    maxAge: 19,
    price: 0,
    journeyMins: 15,
    organiser: "Poplar HARCA",
    organiserVerified: "verified",
    tags: ["games", "social", "food"],
  },
  {
    slug: "canary-wharf-insight-day",
    title: "Barclays insight day: a bank from the inside",
    category: "careers",
    intent: "useful",
    description:
      "A day inside Barclays' Canary Wharf office for Years 11–13 curious about apprenticeships in finance and tech. Shadow a current apprentice, hear what the selection process actually involves, and get your questions answered by people two years into the job. Travel costs reimbursed. Applications close well before the day — apply early.",
    venue: { name: "Barclays, One Churchill Place", area: "Canary Wharf", borough: "Tower Hamlets", lat: 51.5045, lng: -0.0146 },
    daysAway: 18,
    hour: 9,
    deadlineDaysAway: 5,
    minAge: 16,
    maxAge: 18,
    price: 0,
    journeyMins: 18,
    organiser: "Barclays Early Careers",
    organiserVerified: "verified",
    tags: ["apprenticeship", "insight-day", "finance"],
  },
  {
    slug: "mile-end-junior-parkrun",
    title: "Sunday junior parkrun — beginners' pace group",
    category: "sport",
    intent: "both",
    description:
      "The regular Sunday 2k in Mile End Park, with a dedicated beginners' pace group so nobody finishes alone. Free, timed if you want it to be, ignored if you don't. Register once online for a barcode, then just turn up. A surprising number of people come for the bagels afterwards — that counts too.",
    venue: { name: "Mile End Park", area: "Mile End", borough: "Tower Hamlets", lat: 51.5199, lng: -0.0332 },
    daysAway: 4,
    hour: 9,
    minAge: 13,
    price: 0,
    journeyMins: 12,
    organiser: "parkrun UK",
    organiserVerified: "self-certified",
    tags: ["running", "outdoors", "free"],
  },
  {
    slug: "screenprint-bow-arts",
    title: "Screenprint your own tote bag",
    category: "workshops",
    intent: "both",
    description:
      "A two-hour screenprinting workshop at Bow Arts where you design, expose and pull your own print onto a tote bag. All materials included and you leave with the bag plus the screen file to reuse. Small group of ten, so booking closes early. Great fun, and genuinely a making skill — past attendees have used their prints in art school portfolios.",
    venue: { name: "Bow Arts", area: "Bow", borough: "Tower Hamlets", lat: 51.5279, lng: -0.0209 },
    daysAway: 9,
    hour: 14,
    deadlineDaysAway: 6,
    minAge: 14,
    price: 800,
    feeBreakdown: "£6 workshop + £2 materials",
    journeyMins: 10,
    organiser: "Bow Arts",
    organiserVerified: "verified",
    tags: ["printing", "crafts", "portfolio"],
  },
  {
    slug: "whitechapel-portfolio-crit",
    title: "Portfolio crit afternoon with working artists",
    category: "workshops",
    intent: "useful",
    description:
      "Bring whatever you make — drawings, photos, a sketchbook, work on your phone — and get twenty minutes of honest, kind feedback from a working artist at Whitechapel Gallery. Built for people applying to art foundation courses, open to anyone deciding whether to. Slots are limited and allocated by application.",
    venue: { name: "Whitechapel Gallery", area: "Whitechapel", borough: "Tower Hamlets", lat: 51.5159, lng: -0.0708 },
    daysAway: 13,
    hour: 14,
    deadlineDaysAway: 10,
    minAge: 15,
    maxAge: 18,
    price: 0,
    journeyMins: 20,
    organiser: "Whitechapel Gallery Youth Forum",
    organiserVerified: "verified",
    tags: ["art", "portfolio", "feedback"],
  },
  {
    slug: "genesis-teen-film-club",
    title: "Teen film club: cult classics on the big screen",
    category: "social",
    intent: "fun",
    description:
      "A monthly film club at Genesis on Mile End Road — a cult classic on the big screen, then half an hour in the café arguing about it, gently. Tickets are kept at £4 for under-18s and the programme is picked by the club, so come once and you get a vote on what's next.",
    venue: { name: "Genesis Cinema", area: "Stepney Green", borough: "Tower Hamlets", lat: 51.5205, lng: -0.0522 },
    daysAway: 5,
    hour: 18,
    minAge: 13,
    maxAge: 17,
    price: 400,
    feeBreakdown: "£4 ticket, no booking fee",
    journeyMins: 15,
    organiser: "Genesis Cinema",
    organiserVerified: "self-certified",
    tags: ["film", "cinema", "social"],
  },
  {
    slug: "york-hall-boxing-taster",
    title: "Boxing taster session at York Hall",
    category: "sport",
    intent: "fun",
    description:
      "A 90-minute beginners' boxing session at the most famous boxing hall in Britain — footwork, pads and bag work with qualified coaches. Gloves and wraps provided. Nobody spars; this is fitness and fundamentals, whatever shape you're in.",
    venue: { name: "York Hall", area: "Bethnal Green", borough: "Tower Hamlets", lat: 51.5277, lng: -0.0553 },
    daysAway: 7,
    hour: 17,
    minAge: 13,
    price: 200,
    feeBreakdown: "£2 session, kit included",
    journeyMins: 16,
    organiser: "Repton Boxing Club",
    organiserVerified: "self-certified",
    tags: ["boxing", "fitness", "beginners"],
  },
  {
    slug: "regents-canal-cleanup",
    title: "Canal cleanup morning on the Regent's Canal",
    category: "volunteering",
    intent: "both",
    description:
      "Two hours pulling litter (and the occasional shopping trolley) out of the Regent's Canal by Mile End, followed by bacon or veggie rolls on the towpath. Gloves, grabbers and waders provided. Counts towards DofE volunteering hours and the organisers sign whatever forms you bring. There's a leaderboard for weirdest find.",
    venue: { name: "Regent's Canal, Mile End", area: "Mile End", borough: "Tower Hamlets", lat: 51.523, lng: -0.0345 },
    daysAway: 11,
    hour: 10,
    minAge: 13,
    price: 0,
    journeyMins: 13,
    organiser: "Canal & River Trust",
    organiserVerified: "verified",
    tags: ["environment", "dofe", "outdoors"],
  },
  {
    slug: "rich-mix-open-studio",
    title: "Open studio: photography walk and edit session",
    category: "workshops",
    intent: "fun",
    description:
      "Meet at Rich Mix, walk Brick Lane and the Shoreditch backstreets with a photographer, then come back and edit your best three shots on the big screen. Phones are fine — this is about seeing, not kit. Finishes with a mini exhibition on the café wall that stays up for a week.",
    venue: { name: "Rich Mix", area: "Shoreditch", borough: "Tower Hamlets", lat: 51.5237, lng: -0.0714 },
    daysAway: 15,
    hour: 11,
    minAge: 14,
    price: 0,
    journeyMins: 22,
    organiser: "Rich Mix",
    organiserVerified: "verified",
    tags: ["photography", "walk", "creative"],
  },

  // ------------------------------------------------------------------ Newham
  {
    slug: "olympic-park-skate-jam",
    title: "Skate jam and open barbecue",
    category: "social",
    intent: "fun",
    description:
      "An afternoon takeover of the plaza by the ArcelorMittal Orbit — skate jam with loaner boards and pads, music from an open decks table, and a free barbecue while it lasts. Absolute beginners get their own corner and a patient coach. No competition, no heats, just a good afternoon.",
    venue: { name: "Queen Elizabeth Olympic Park", area: "Stratford", borough: "Newham", lat: 51.5386, lng: -0.0116 },
    daysAway: 8,
    hour: 13,
    minAge: 13,
    price: 0,
    journeyMins: 8,
    organiser: "Mayor of London — Peer Outreach Team",
    organiserVerified: "verified",
    tags: ["skate", "bbq", "music"],
  },
  {
    slug: "copper-box-badminton",
    title: "Pay-and-play badminton at the Copper Box",
    category: "sport",
    intent: "fun",
    description:
      "Friday evening pay-and-play badminton in the arena that hosted the 2012 Olympics. Rackets provided, all standards welcome, courts mixed by ability so you always get a real game. £3 covers the whole evening.",
    venue: { name: "Copper Box Arena", area: "Hackney Wick", borough: "Newham", lat: 51.5449, lng: -0.0173 },
    daysAway: 5,
    hour: 18,
    minAge: 13,
    maxAge: 18,
    price: 300,
    feeBreakdown: "£3 evening pass, racket included",
    journeyMins: 12,
    organiser: "Better — Copper Box Arena",
    organiserVerified: "self-certified",
    tags: ["badminton", "sport", "friday"],
  },
  {
    slug: "here-east-game-jam",
    title: "48-hour game jam — teams formed on the day",
    category: "workshops",
    intent: "both",
    description:
      "Build a game in a weekend at Here East. Teams form on Friday night around whoever shows up — artists, coders, musicians and people who've never made anything all get slotted in. Mentors from the studios upstairs float between teams, food is provided, and everything ships by Sunday 6pm, playable at the closing arcade. A finished jam game is a real portfolio piece.",
    venue: { name: "Here East", area: "Hackney Wick", borough: "Newham", lat: 51.5468, lng: -0.0221 },
    daysAway: 16,
    hour: 18,
    deadlineDaysAway: 11,
    minAge: 15,
    maxAge: 18,
    price: 0,
    journeyMins: 14,
    organiser: "Plexal",
    organiserVerified: "verified",
    tags: ["gamedev", "coding", "weekend"],
  },
  {
    slug: "uel-taster-day",
    title: "UEL taster day: sports science and physio",
    category: "talks",
    intent: "useful",
    description:
      "A half-day taster at the University of East London's Docklands campus — a biomechanics lab session, a lecture on what sports science actually covers, and a Q&A with current students about money, accommodation and whether the chemistry is survivable. Free, aimed at Years 11–13, and the application is one short form.",
    venue: { name: "University of East London, Docklands", area: "Royal Docks", borough: "Newham", lat: 51.5074, lng: 0.0653 },
    daysAway: 21,
    hour: 10,
    deadlineDaysAway: 7,
    minAge: 15,
    maxAge: 18,
    price: 0,
    journeyMins: 25,
    organiser: "University of East London Outreach",
    organiserVerified: "verified",
    tags: ["university", "sport-science", "taster-day"],
  },
  {
    slug: "stratford-young-writers",
    title: "Young writers' room — bring anything with words",
    category: "workshops",
    intent: "both",
    description:
      "A weekly writing room at Stratford Library — poetry, lyrics, scripts, fanfic, anything with words in it. Half the session is quiet writing time, half is optional sharing with a visiting writer. Kind crowd, no grades, free tea. Turn up to any week; nobody takes a register of your talent.",
    venue: { name: "Stratford Library", area: "Stratford", borough: "Newham", lat: 51.5416, lng: 0.0009 },
    daysAway: 10,
    hour: 17,
    minAge: 13,
    maxAge: 19,
    price: 0,
    journeyMins: 5,
    organiser: "Newham Libraries",
    organiserVerified: "verified",
    tags: ["writing", "poetry", "weekly"],
  },
  {
    slug: "stratford-east-young-company",
    title: "Young Company open auditions — autumn show",
    category: "music",
    intent: "both",
    description:
      "Open auditions for Theatre Royal Stratford East's Young Company autumn production. No experience or prepared piece needed — the audition is a workshop, so you'll act for two hours either way. Backstage, lighting and design roles are also open, no audition required for those. A proper credit for a drama school application, and a very fast way to know thirty people.",
    venue: { name: "Theatre Royal Stratford East", area: "Stratford", borough: "Newham", lat: 51.5417, lng: -0.0028 },
    daysAway: 14,
    hour: 18,
    deadlineDaysAway: 12,
    minAge: 13,
    maxAge: 19,
    price: 0,
    journeyMins: 6,
    organiser: "Theatre Royal Stratford East",
    organiserVerified: "verified",
    tags: ["theatre", "audition", "creative"],
  },
  {
    slug: "skills-london-excel",
    title: "Skills London — 200 employers under one roof",
    category: "careers",
    intent: "useful",
    description:
      "The biggest jobs and careers fair for young Londoners: two hundred employers, colleges and training providers at ExCeL, CV clinics that actually rewrite your CV with you, and current apprentices on every stand answering the questions the brochures don't. Free with registration; mornings are school groups, afternoons are quieter.",
    venue: { name: "ExCeL London", area: "Royal Docks", borough: "Newham", lat: 51.5083, lng: 0.029 },
    daysAway: 24,
    hour: 10,
    deadlineDaysAway: 14,
    minAge: 15,
    maxAge: 18,
    price: 0,
    journeyMins: 22,
    organiser: "Skills London",
    organiserVerified: "verified",
    tags: ["careers", "fair", "cv"],
  },
  {
    slug: "plexal-tech-social",
    title: "Free food lol and networking: tech social",
    category: "careers",
    intent: "both",
    description:
      "A monthly social at Plexal for 16–18s curious about tech careers, with genuinely good free food. Ten minutes of lightning talks from people who build things at Here East, then it's just a room of interesting people and no lanyards. Half the value is the pizza; the other half is that apprenticeship recruiters actually come to these.",
    venue: { name: "Plexal, Here East", area: "Hackney Wick", borough: "Newham", lat: 51.5464, lng: -0.0218 },
    daysAway: 17,
    hour: 17,
    deadlineDaysAway: 14,
    minAge: 16,
    maxAge: 18,
    price: 0,
    journeyMins: 14,
    organiser: "Plexal",
    organiserVerified: "verified",
    tags: ["tech", "networking", "free-food"],
  },

  // ----------------------------------------------------------------- Hackney
  {
    slug: "hackney-empire-open-mic",
    title: "Open mic on the Hackney Empire stage",
    category: "music",
    intent: "fun",
    description:
      "Five-minute slots on the actual Hackney Empire stage — music, poetry, comedy and things that defy category all welcome. Sign up from 6pm, kind crowd, house band available if you want backing. Under-18s get priority slots before 9pm. The green room alone is worth the trip.",
    venue: { name: "Hackney Empire", area: "Hackney Central", borough: "Hackney", lat: 51.545, lng: -0.0553 },
    daysAway: 7,
    hour: 18,
    minAge: 14,
    price: 0,
    journeyMins: 18,
    organiser: "Hackney Empire — Creative Futures",
    organiserVerified: "verified",
    tags: ["open-mic", "performance", "free"],
  },
  {
    slug: "yard-theatre-scratch-night",
    title: "Scratch night: new work in progress",
    category: "music",
    intent: "fun",
    description:
      "Five new pieces of theatre, dance and performance, each fifteen minutes, each unfinished on purpose — the point is you tell the makers what landed. The Yard's scratch nights are where half of East London's best shows started. Cheap tickets, loud opinions welcome.",
    venue: { name: "The Yard Theatre", area: "Hackney Wick", borough: "Hackney", lat: 51.5438, lng: -0.0243 },
    daysAway: 12,
    hour: 19,
    minAge: 16,
    price: 500,
    feeBreakdown: "£5 ticket, no booking fee",
    journeyMins: 13,
    organiser: "The Yard Theatre",
    organiserVerified: "self-certified",
    tags: ["theatre", "new-work", "hackney-wick"],
  },
  {
    slug: "hackney-marshes-football",
    title: "Sunday football on the Marshes — turn up and play",
    category: "sport",
    intent: "fun",
    description:
      "Casual 7-a-side on the most famous Sunday league pitches in the world. Teams are shuffled on the day so you don't need to bring anyone, and there's a beginners' pitch where the only rule is nobody shouts. Boots help; trainers are fine. Run by Young Hackney coaches.",
    venue: { name: "Hackney Marshes", area: "Hackney Wick", borough: "Hackney", lat: 51.556, lng: -0.025 },
    daysAway: 4,
    hour: 10,
    minAge: 13,
    maxAge: 18,
    price: 0,
    journeyMins: 16,
    organiser: "Young Hackney",
    organiserVerified: "verified",
    tags: ["football", "sunday", "casual"],
  },
  {
    slug: "dalston-music-production",
    title: "Music production taster: build a beat from nothing",
    category: "workshops",
    intent: "both",
    description:
      "A two-hour production taster at Dalston CLR James Library's studio room — build a beat from nothing in Ableton, layer a hook, and leave with the project file and a bounce of your track. Headphones and laptops provided. No experience needed; strong opinions about drums encouraged.",
    venue: { name: "Dalston CLR James Library", area: "Dalston", borough: "Hackney", lat: 51.5461, lng: -0.0754 },
    daysAway: 13,
    hour: 17,
    deadlineDaysAway: 9,
    minAge: 13,
    maxAge: 17,
    price: 0,
    journeyMins: 24,
    organiser: "Young Hackney Music",
    organiserVerified: "verified",
    tags: ["music-production", "ableton", "beginners"],
  },
  {
    slug: "london-fields-repair-cafe",
    title: "Repair café: fix it, don't bin it",
    category: "volunteering",
    intent: "both",
    description:
      "Bring something broken — headphones, a lamp, a jacket with a rip — and fix it with a volunteer fixer by London Fields, or come to learn fixing and stay to help others. Tools, parts, tea and biscuits supplied. Nobody leaves without learning something with their hands.",
    venue: { name: "London Fields", area: "London Fields", borough: "Hackney", lat: 51.5416, lng: -0.0611 },
    daysAway: 20,
    hour: 11,
    minAge: 13,
    price: 0,
    journeyMins: 20,
    organiser: "Sustainable Hackney",
    organiserVerified: "self-certified",
    tags: ["repair", "skills", "environment"],
  },
  {
    slug: "hackney-youth-parliament",
    title: "Hackney Youth Parliament — open session",
    category: "talks",
    intent: "useful",
    description:
      "Sit in on a real Youth Parliament session at Hackney Town Hall, then stay for the bit where they explain how to stand in the next election. Members shape actual council decisions on transport, safety and youth services — this is the front door. Applications for observer places close a week ahead.",
    venue: { name: "Hackney Town Hall", area: "Hackney Central", borough: "Hackney", lat: 51.5453, lng: -0.0565 },
    daysAway: 15,
    hour: 17,
    deadlineDaysAway: 8,
    minAge: 13,
    maxAge: 18,
    price: 0,
    journeyMins: 18,
    organiser: "Hackney Council — Young Hackney",
    organiserVerified: "verified",
    tags: ["politics", "council", "voice"],
  },

  // ---------------------------------------------------------- Waltham Forest
  {
    slug: "wetlands-conservation-day",
    title: "Conservation morning at Walthamstow Wetlands",
    category: "volunteering",
    intent: "both",
    description:
      "Two hours of reed-bed clearing and bird-box building at Europe's largest urban wetland, ten minutes from Blackhorse Road. Waders and tools provided, and the rangers are generous with the good stories. Counts for DofE, and the volunteer team writes references that actually say something.",
    venue: { name: "Walthamstow Wetlands", area: "Walthamstow", borough: "Waltham Forest", lat: 51.5866, lng: -0.045 },
    daysAway: 11,
    hour: 10,
    minAge: 13,
    price: 0,
    journeyMins: 28,
    organiser: "London Wildlife Trust",
    organiserVerified: "verified",
    tags: ["conservation", "dofe", "outdoors"],
  },
  {
    slug: "william-morris-print-workshop",
    title: "Pattern and print workshop at William Morris Gallery",
    category: "workshops",
    intent: "both",
    description:
      "Design a repeating pattern the William Morris way, then block-print it onto paper and fabric in the gallery's studio. All materials included; you leave with your print and the block. Small groups, booking closes early, and yes — the peacocks in the garden are real.",
    venue: { name: "William Morris Gallery", area: "Walthamstow", borough: "Waltham Forest", lat: 51.5859, lng: -0.018 },
    daysAway: 9,
    hour: 14,
    deadlineDaysAway: 6,
    minAge: 13,
    maxAge: 16,
    price: 400,
    feeBreakdown: "£4 including all materials",
    journeyMins: 30,
    organiser: "William Morris Gallery",
    organiserVerified: "verified",
    tags: ["printing", "design", "crafts"],
  },
  {
    slug: "fellowship-square-silent-disco",
    title: "Silent disco takeover — three channels",
    category: "social",
    intent: "fun",
    description:
      "Three channels, three DJs, three hundred pairs of headphones in Fellowship Square under the lights of Walthamstow Town Hall. The channel battle gets genuinely competitive. Alcohol-free bar, headphone deposit refunded on return, and the fountains stay on.",
    venue: { name: "Fellowship Square", area: "Walthamstow", borough: "Waltham Forest", lat: 51.5889, lng: -0.0114 },
    daysAway: 19,
    hour: 19,
    minAge: 14,
    maxAge: 18,
    price: 600,
    feeBreakdown: "£5 ticket + £1 booking fee",
    journeyMins: 30,
    organiser: "Waltham Forest Council Events",
    organiserVerified: "verified",
    tags: ["disco", "music", "night"],
  },
  {
    slug: "big-creative-open-day",
    title: "Big Creative open day: music, media and fashion courses",
    category: "careers",
    intent: "useful",
    description:
      "An open day at Big Creative Academy in Walthamstow for anyone considering a creative route after GCSEs — music, media, games, fashion and esports courses, taught by people still working in those industries. Tour the studios, meet current students, and leave knowing whether it's for you. Register ahead; places are capped.",
    venue: { name: "Big Creative Academy", area: "Walthamstow", borough: "Waltham Forest", lat: 51.583, lng: -0.0202 },
    daysAway: 22,
    hour: 16,
    deadlineDaysAway: 15,
    minAge: 15,
    maxAge: 18,
    price: 0,
    journeyMins: 29,
    organiser: "Big Creative Education",
    organiserVerified: "verified",
    tags: ["college", "creative", "open-day"],
  },
  {
    slug: "leyton-street-tennis",
    title: "Street tennis drop-in — rackets provided",
    category: "sport",
    intent: "both",
    description:
      "Free drop-in tennis in Leyton Jubilee Park run by LTA-qualified coaches. Rackets and balls provided, all standards welcome, and it's genuinely free — funded by the council's summer programme. Just register once so they know numbers.",
    venue: { name: "Leyton Jubilee Park", area: "Leyton", borough: "Waltham Forest", lat: 51.57, lng: -0.014 },
    daysAway: 5,
    hour: 17,
    minAge: 13,
    maxAge: 17,
    price: 0,
    journeyMins: 22,
    organiser: "Waltham Forest Sport",
    organiserVerified: "self-certified",
    tags: ["tennis", "free", "outdoors"],
  },

  // --------------------------------------------------------------- Redbridge
  {
    slug: "redbridge-library-coding",
    title: "Intro to coding: build a page in an evening",
    category: "workshops",
    intent: "useful",
    description:
      "A free two-hour taster at Redbridge Central Library where you build and publish a real web page from nothing. Laptops provided if you need one. Set up for absolute beginners and more social than it sounds — pizza at the break, and the librarians pretend not to notice.",
    venue: { name: "Redbridge Central Library", area: "Ilford", borough: "Redbridge", lat: 51.5588, lng: 0.0725 },
    daysAway: 13,
    hour: 17,
    deadlineDaysAway: 10,
    minAge: 13,
    maxAge: 17,
    price: 0,
    journeyMins: 18,
    organiser: "Redbridge Libraries & Code Club",
    organiserVerified: "verified",
    tags: ["coding", "beginners", "tech"],
  },
  {
    slug: "fairlop-waters-sailing",
    title: "Sailing taster on Fairlop Waters",
    category: "sport",
    intent: "both",
    description:
      "Two hours in a proper dinghy on Fairlop Waters with RYA instructors — wetsuits, buoyancy aids and boats all provided, subsidised down to £9 by the council's holiday programme. You will get wet and you will want to come back. Swimming ability required; experience not.",
    venue: { name: "Fairlop Waters", area: "Barkingside", borough: "Redbridge", lat: 51.5957, lng: 0.1052 },
    daysAway: 12,
    hour: 10,
    deadlineDaysAway: 8,
    minAge: 13,
    maxAge: 18,
    price: 900,
    feeBreakdown: "£9 subsidised, all kit included",
    journeyMins: 34,
    organiser: "Fairlop Sailing Centre",
    organiserVerified: "verified",
    tags: ["sailing", "water", "taster"],
  },
  {
    slug: "valentines-mansion-takeover",
    title: "Summer arts takeover at Valentines Mansion",
    category: "workshops",
    intent: "fun",
    description:
      "A whole Georgian mansion handed over to young artists for a day — zine-making in the kitchen, life drawing in the ballroom, sound art in the cellar, and a garden stage programmed by last year's takeover crew. Drop into anything; £3 covers every room.",
    venue: { name: "Valentines Mansion", area: "Ilford", borough: "Redbridge", lat: 51.5748, lng: 0.067 },
    daysAway: 26,
    hour: 11,
    deadlineDaysAway: 22,
    minAge: 13,
    price: 300,
    feeBreakdown: "£3 day pass, all rooms",
    journeyMins: 24,
    organiser: "Vision RCL",
    organiserVerified: "self-certified",
    tags: ["arts", "zines", "takeover"],
  },
  {
    slug: "redbridge-drama-audition",
    title: "Youth theatre open audition — winter show",
    category: "music",
    intent: "both",
    description:
      "Open auditions at Redbridge Drama Centre for the winter production — no experience or prepared piece needed; the audition is a workshop, so you'll act for two hours either way. Backstage, lighting and set-design roles are open too, no audition required for those.",
    venue: { name: "Redbridge Drama Centre", area: "South Woodford", borough: "Redbridge", lat: 51.592, lng: 0.027 },
    daysAway: 14,
    hour: 18,
    deadlineDaysAway: 13,
    minAge: 13,
    maxAge: 19,
    price: 0,
    journeyMins: 26,
    organiser: "Redbridge Drama Centre",
    organiserVerified: "verified",
    tags: ["theatre", "audition", "creative"],
  },
  {
    slug: "ilford-foodbank-shift",
    title: "Food bank warehouse shift — Saturday crew",
    category: "volunteering",
    intent: "useful",
    description:
      "Three-hour Saturday shifts sorting and packing at the Redbridge food bank warehouse. Music on, teams of four, and a rota you control from your phone. Counts for DofE and looks like what it is on any application: showing up reliably to do something real.",
    venue: { name: "Redbridge Foodbank", area: "Ilford", borough: "Redbridge", lat: 51.559, lng: 0.0698 },
    daysAway: 4,
    hour: 10,
    minAge: 14,
    price: 0,
    journeyMins: 20,
    organiser: "Redbridge Foodbank (Trussell Trust)",
    organiserVerified: "verified",
    tags: ["dofe", "volunteering", "weekend"],
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
    organiserVerified: s.organiserVerified,
    // Every seed listing has been through the editorial review flow —
    // provider content is only ever publicly visible once published.
    status: "published",
    tags: s.tags,
  };
});

/**
 * The only queries the public product may use. Browse, map, ticker, landing
 * and detail all go through these so that non-published listings are never
 * publicly visible (see ListingStatus in types.ts).
 */
export function publishedEvents(): OnTrackEvent[] {
  return EVENTS.filter((e) => e.status === "published");
}

export function eventBySlug(slug: string): OnTrackEvent | undefined {
  return EVENTS.find((e) => e.slug === slug && e.status === "published");
}

export function eventById(id: string): OnTrackEvent | undefined {
  return EVENTS.find((e) => e.id === id && e.status === "published");
}
