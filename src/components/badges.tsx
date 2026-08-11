import React from "react";
import type { OnTrackEvent } from "@/lib/types";
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
  return <span className="text-[13px] font-semibold text-coral">{flag}</span>;
}
