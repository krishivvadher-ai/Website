const DAY_MS = 24 * 60 * 60 * 1000;

// Manual date formatting rather than toLocale* — ICU output differs between
// Node and browsers, which breaks hydration of server-rendered dates.
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatPrice(pence: number): string {
  if (pence === 0) return "Free";
  const pounds = pence / 100;
  return Number.isInteger(pounds) ? `£${pounds}` : `£${pounds.toFixed(2)}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${DAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  return `${DAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, "0");
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mins}${suffix}`;
}

export function dateBadge(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  return {
    day: String(d.getDate()),
    month: MONTHS_SHORT[d.getMonth()],
  };
}

/** Whole days until the given ISO date; negative when it has passed. */
export function daysUntil(iso: string): number {
  const target = new Date(iso);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTarget = new Date(target);
  startOfTarget.setHours(0, 0, 0, 0);
  return Math.round((startOfTarget.getTime() - startOfToday.getTime()) / DAY_MS);
}

export function deadlinePassed(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

/** Coral deadline flag copy, only when an application closes within seven days. */
export function deadlineFlag(iso?: string): string | null {
  if (!iso) return null;
  if (deadlinePassed(iso)) return "Applications closed";
  const days = daysUntil(iso);
  if (days > 7) return null;
  if (days === 0) return "Applications close today";
  if (days === 1) return "Applications close tomorrow";
  return `Applications close in ${days} days`;
}
