"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { OnTrackEvent } from "@/lib/types";
import { categoryBySlug } from "@/lib/categories";
import { formatDateLong, formatPrice, formatTime, deadlineFlag, deadlinePassed, formatDate } from "@/lib/format";
import { eventDistance } from "@/lib/filter";
import { formatMiles } from "@/lib/geo";
import { useApp } from "@/lib/store";
import { useIsDesktop } from "@/lib/useMediaQuery";
import { CardImage } from "@/components/CardImage";
import { AgeBadge, PriceTag } from "@/components/badges";
import { ShareActions } from "@/components/ShareActions";

const VenueMap = dynamic(() => import("@/components/VenueMap").then((m) => m.VenueMap), {
  ssr: false,
  loading: () => <div className="skeleton mt-3 h-[280px] !rounded-2xl" />,
});

export function EventDetail({ event }: { event: OnTrackEvent }) {
  const { isSaved, toggleSaved } = useApp();
  const isDesktop = useIsDesktop();
  const saved = isSaved(event.id);
  const [toast, setToast] = useState<string | null>(null);
  const category = categoryBySlug(event.category);
  const miles = eventDistance(event);
  const flag = deadlineFlag(event.applicationDeadline);
  const closed = event.applicationDeadline ? deadlinePassed(event.applicationDeadline) : false;

  const onSave = () => {
    toggleSaved(event.id);
    setToast(saved ? "Removed from saved" : "Saved");
    window.setTimeout(() => setToast(null), 2000);
  };

  const cta = closed ? "Applications closed" : event.price === 0 ? "Get a place" : "Get tickets";

  const BookingCard = (
    <div className="card p-6 bg-white">
      <div className="flex items-start justify-between gap-3">
        <PriceTag event={event} />
        <AgeBadge event={event} />
      </div>
      {flag && <p className="mt-3 text-[14px] font-semibold text-coral">{flag}</p>}
      <button
        type="button"
        disabled={closed}
        onClick={() => setToast("This is a demo — booking opens with the full launch")}
        className="mt-4 w-full min-h-[48px] rounded-full bg-signal text-ink border border-ink font-display font-semibold text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {cta}
      </button>
      <button
        type="button"
        onClick={onSave}
        aria-pressed={saved}
        className="mt-3 w-full min-h-[48px] rounded-full border border-ink text-ink font-medium text-[15px] hover:bg-ink hover:text-paper transition-colors"
      >
        {saved ? "Saved" : "Save"}
      </button>
      {event.applicationDeadline && !closed && (
        <p className="mt-3 text-[13px] text-grey">
          Saving adds the {formatDate(event.applicationDeadline)} deadline to{" "}
          <Link href="/deadlines" className="underline text-ink">
            your Deadlines tab
          </Link>
          .
        </p>
      )}
      <div className="mt-4 pt-4 border-t border-line">
        <ShareActions event={event} />
      </div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 lg:grid lg:grid-cols-[1fr_360px] lg:gap-12 lg:items-start">
      <article>
        <div className="relative rounded-2xl overflow-hidden border border-line">
          <CardImage event={event} />
          <AgeBadge event={event} className="absolute top-4 right-4" />
        </div>

        <p className="pill mt-6 text-grey">{category?.name ?? event.category}</p>
        <h1 className="mt-2 text-[28px] lg:text-[40px]">{event.title}</h1>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-[15px]">
          <div className="card p-4">
            <dt className="text-[12px] uppercase tracking-[0.04em] text-grey">When</dt>
            <dd className="mt-1 font-medium">
              {formatDateLong(event.date)}, {formatTime(event.date)}
            </dd>
          </div>
          <div className="card p-4">
            <dt className="text-[12px] uppercase tracking-[0.04em] text-grey">Where</dt>
            <dd className="mt-1 font-medium">
              {event.venue.name}, {event.venue.area}
            </dd>
            <dd className="text-[13px] text-grey">
              {formatMiles(miles)}
              {event.journeyMins !== undefined && <> · ~{event.journeyMins} min by public transport</>}
            </dd>
          </div>
          {event.applicationDeadline && (
            <div className="card p-4 sm:col-span-2">
              <dt className="text-[12px] uppercase tracking-[0.04em] text-grey">
                {closed ? "Applications closed" : "Apply by"}
              </dt>
              <dd className={`mt-1 font-medium ${closed ? "text-grey" : ""}`}>
                {formatDateLong(event.applicationDeadline)}
              </dd>
              {!closed && (
                <dd className="text-[13px] text-grey">
                  The application deadline is separate from the event date — save this and we’ll
                  keep it in your Deadlines tab.
                </dd>
              )}
            </div>
          )}
        </dl>

        <h2 className="mt-10 text-[22px]">About</h2>
        <p className="mt-3 text-[16px] leading-relaxed measure whitespace-pre-line">{event.description}</p>

        <h2 className="mt-10 text-[22px]">Where you’re going</h2>
        <p className="mt-2 text-[15px] text-grey">
          {event.venue.name}, {event.venue.area}
        </p>
        <VenueMap event={event} />

        <h2 className="mt-10 text-[22px]">Run by</h2>
        <p className="mt-2 text-[15px] text-grey">{event.organiser}</p>

        <div className="mt-10 lg:hidden">
          <ShareActions event={event} />
        </div>
      </article>

      {/* Desktop: sticky 360px booking card on the right */}
      {isDesktop && <aside className="sticky top-20">{BookingCard}</aside>}

      {/* Mobile: sticky bottom bar with price and CTA, above the tab bar */}
      {isDesktop === false && (
        <div className="fixed inset-x-0 bottom-14 z-30 bg-paper border-t border-line px-4 py-3 tabbar-safe">
          <div className="flex items-center gap-4">
            <PriceTag event={event} />
            {flag && <span className="text-[12px] font-semibold text-coral leading-tight">{flag}</span>}
            <button
              type="button"
              onClick={onSave}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save"}
              className="ml-auto w-11 h-11 flex items-center justify-center border border-line rounded-full"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} aria-hidden="true">
                <path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              disabled={closed}
              onClick={() => setToast("This is a demo — booking opens with the full launch")}
              className="min-h-[44px] px-5 rounded-full bg-signal text-ink border border-ink font-display font-semibold text-[15px] disabled:opacity-40"
            >
              {cta}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-32 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper text-[14px] px-4 py-2 rounded-full"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
