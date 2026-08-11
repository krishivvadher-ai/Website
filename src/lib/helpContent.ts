// Help content the support assistant is grounded in. Also served as the
// fallback answer source when no model key is configured, so the widget
// works end-to-end in every environment.

export interface HelpTopic {
  id: string;
  title: string;
  keywords: string[];
  answer: string;
  helpPath: string;
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "age",
    title: "Age eligibility",
    keywords: ["age", "old", "young", "18+", "eligible", "eligibility", "band", "restricted"],
    answer:
      "Every listing shows an age band on its card, top-right. Set your age once in the You tab and anything outside your band disappears from your feed, map and search — you never have to check. If a shared link points at something outside your band, we show you three things you can attend instead.",
    helpPath: "/you",
  },
  {
    id: "deadlines",
    title: "Application deadlines",
    keywords: ["deadline", "apply", "application", "close", "closes", "closed", "late", "miss"],
    answer:
      "Lots of events — insight days, work experience, taster days — close applications weeks before the event itself. Save an event and its deadline is tracked in your Deadlines tab, soonest first. You can turn on reminders for 7 days before, 2 days before, and the morning of; they're off unless you switch them on.",
    helpPath: "/deadlines",
  },
  {
    id: "refunds",
    title: "Refunds",
    keywords: ["refund", "money back", "cancel", "cancelled", "cancellation"],
    answer:
      "If an organiser cancels an event, you get an automatic full refund including fees, usually within 5 working days. If you can no longer go, refunds depend on the organiser's policy shown on the event page. If something looks wrong, talk to a person — the team can chase it.",
    helpPath: "/help",
  },
  {
    id: "transfers",
    title: "Ticket transfers",
    keywords: ["transfer", "give", "friend", "someone else", "swap", "name change"],
    answer:
      "Most tickets can be transferred to someone else from the ticket screen, as long as the other person also meets the event's age band. Some organisers turn transfers off — the event page says so under the price.",
    helpPath: "/help",
  },
  {
    id: "fees",
    title: "What the fee covers",
    keywords: ["fee", "booking fee", "charge", "why", "cost", "price"],
    answer:
      "The price you see is the all-in price — no surprise at checkout. Where there's a booking fee it's shown in small text under the price, and it covers card processing and running the service. Free events are genuinely free: no fee, ever.",
    helpPath: "/help",
  },
  {
    id: "finding",
    title: "How to find something",
    keywords: ["find", "search", "looking", "discover", "browse", "filter", "near me", "nothing"],
    answer:
      "Start on Browse and use the toggle at the top: Anything, Something fun, or Something useful. Filter by price (Free is one tap), distance, date and category. If nothing matches, loosen the filter the empty screen names — usually distance. The Map tab shows the same events with prices on the pins.",
    helpPath: "/browse",
  },
  {
    id: "accessibility",
    title: "Venue accessibility",
    keywords: ["accessible", "accessibility", "wheelchair", "step-free", "hearing", "quiet"],
    answer:
      "Venue accessibility details come from organisers and appear on the event page where provided. If the listing doesn't say what you need to know, ask us to check with the organiser — talk to a person and the team will find out before you book.",
    helpPath: "/help",
  },
];

export function findHelpTopic(query: string): HelpTopic | null {
  const q = query.toLowerCase();
  let best: { topic: HelpTopic; score: number } | null = null;
  for (const topic of HELP_TOPICS) {
    const score = topic.keywords.reduce((s, k) => s + (q.includes(k) ? 1 : 0), 0);
    if (score > 0 && (best === null || score > best.score)) best = { topic, score };
  }
  return best?.topic ?? null;
}

export const SUGGESTED_QUESTIONS = [
  "Why can’t I see an event my friend sent me?",
  "When do applications close for saved events?",
  "How do refunds work?",
  "How do I find free stuff near me?",
];
