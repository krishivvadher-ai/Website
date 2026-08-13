import React from "react";
import Link from "next/link";
import type { OnTrackEvent, VerificationLevel } from "@/lib/types";
import { eventAgeBadge } from "@/lib/age";
import { dateBadge, deadlineFlag, formatPrice } from "@/lib/format";

/** Age band badge — a hard visual requirement on every card, top-right. */
export function AgeBadge({ event, className = "" }: { event: Pick<OnTrackEvent, "minAge" | "maxAge">; className?: string }) {
  return (
    <span className={`pill inline-flex items-center bg-ink text-paper px-2.5 py-1 ${className}`}>
      {eventAgeBadge(event)}
    </span>
  );
}

export function DateBadge({ iso, className = "" }: { iso: string; className?: string }) {
  const { day, month } = dateBadge(iso);
  return (
    <span
      className={`inline-flex flex-col items-center justify-center bg-paper text-ink rounded-lg border border-line w-11 h-11 leading-none ${className}`}
    >
      <span className="font-display font-bold text-[16px]">{day}</span>
      <span className="text-[10px] uppercase tracking-[0.04em]">{month}</span>
    </span>
  );
}

/** All-in price. Free events show a Signal “Free”, never “£0”. */
export function PriceTag({ event }: { event: Pick<OnTrackEvent, "price" | "feeBreakdown"> }) {
  if (event.price === 0) {
    return (
      <span className="pill bg-signal text-ink px-2.5 py-1 font-semibold">Free</span>
    );
  }
  return (
    <span className="inline-flex flex-col items-end">
      <span className="font-display font-semibold text-[16px]">{formatPrice(event.price)}</span>
      {event.feeBreakdown && <span className="text-[11px] text-grey">{event.feeBreakdown}</span>}
    </span>
  );
}

/** Coral deadline flag when applications close within seven days. */
export function DeadlineFlag({ iso }: { iso?: string }) {
  const flag = deadlineFlag(iso);
  if (!flag) return null;
  return <span className="text-[13px] font-semibold text-coral-deep">{flag}</span>;
}

/**
 * Safeguarding verification badge. The wording is deliberate and load-
 * bearing: "self-certified" when the organiser only made declarations,
 * "verified" only when onTrack has actually seen the documents. NEVER
 * render "safe", "trusted", "approved" or "vetted" here — that is an
 * overclaim with misrepresentation and ASA consequences.
 */
export function VerifiedBadge({ level, className = "" }: { level?: VerificationLevel; className?: string }) {
  if (!level) return null;
  return (
    <Link
      href="/verification"
      className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.04em] font-medium text-grey hover:text-ink underline decoration-line hover:decoration-ink ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        {level === "verified" && <path d="m8.5 12 2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      {level === "verified" ? "Safeguarding verified" : "Safeguarding self-certified"}
    </Link>
  );
}
