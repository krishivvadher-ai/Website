"use client";

import React from "react";
import Link from "next/link";
import type { OnTrackEvent } from "@/lib/types";
import { categoryBySlug } from "@/lib/categories";
import { formatDate, formatTime } from "@/lib/format";
import { eventDistance } from "@/lib/filter";
import { formatMiles } from "@/lib/geo";
import { CardImage } from "./CardImage";
import { AgeBadge, DateBadge, DeadlineFlag, PriceTag } from "./badges";
import { useApp } from "@/lib/store";

// One card component for every listing. A gig and a networking evening use
// the same structure — no per-intent styling, ever.

export function EventCard({
  event,
  onHover,
  highlighted = false,
}: {
  event: OnTrackEvent;
  onHover?: (id: string | null) => void;
  highlighted?: boolean;
}) {
  const { isSaved, toggleSaved } = useApp();
  const saved = isSaved(event.id);
  const miles = eventDistance(event);
  const category = categoryBySlug(event.category);

  return (
    <article
      className={`card card-hover overflow-hidden flex flex-col ${highlighted ? "border-ink" : ""}`}
      onMouseEnter={() => onHover?.(event.id)}
      onMouseLeave={() => onHover?.(null)}
      data-event-id={event.id}
    >
      <Link href={`/events/${event.slug}`} className="block relative" tabIndex={-1} aria-hidden="true">
        <CardImage event={event} />
        <DateBadge iso={event.date} className="absolute top-3 left-3" />
        <AgeBadge event={event} className="absolute top-3 right-3" />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="pill text-grey">{category?.name ?? event.category}</p>
            <h3 className="mt-1 text-[18px] leading-tight">
              <Link href={`/events/${event.slug}`} className="clamp-2 hover:underline">
                {event.title}
              </Link>
            </h3>
          </div>
          <button
            type="button"
            onClick={() => toggleSaved(event.id)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${event.title} from saved` : `Save ${event.title}`}
            className="shrink-0 w-11 h-11 -mr-2 -mt-1 flex items-center justify-center text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} aria-hidden="true">
              <path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="text-[14px] text-grey">
          {formatDate(event.date)}, {formatTime(event.date)} · {event.venue.name}, {event.venue.area}
        </p>
        <p className="text-[13px] text-grey">
          {formatMiles(miles)}
          {event.journeyMins !== undefined && <> · ~{event.journeyMins} min by public transport</>}
        </p>
        <div className="mt-auto pt-2 flex items-end justify-between gap-3 border-t border-line">
          <DeadlineFlag iso={event.applicationDeadline} />
          <span className="ml-auto">
            <PriceTag event={event} />
          </span>
        </div>
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton aspect-video rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
  );
}
