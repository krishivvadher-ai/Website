"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { EVENTS, eventBySlug } from "@/lib/events";
import { isEligible, eventAgeBadge } from "@/lib/age";
import { daysUntil } from "@/lib/format";
import { useApp } from "@/lib/store";
import { EventCard, EventCardSkeleton } from "@/components/EventCard";
import { EventDetail } from "./EventDetail";

/**
 * Age gate for deep links. If the event is outside the user's band, the
 * listing content is never rendered — a plain page explains the age
 * requirement and offers three eligible alternatives instead.
 */
export function EventDetailGate({ slug }: { slug: string }) {
  const { ready, profile } = useApp();
  const event = eventBySlug(slug);

  const alternatives = useMemo(() => {
    if (!event) return [];
    return EVENTS.filter(
      (e) => e.id !== event.id && daysUntil(e.date) >= 0 && isEligible(e, profile)
    )
      .sort((a, b) => {
        const sameCat = Number(b.category === event.category) - Number(a.category === event.category);
        if (sameCat !== 0) return sameCat;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, 3);
  }, [event, profile]);

  if (!event) return null;

  if (!ready) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="max-w-[640px]">
          <EventCardSkeleton />
        </div>
      </div>
    );
  }

  const eligible = isEligible(event, profile) || profile.showIneligible;

  if (!eligible) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="text-[28px] lg:text-[40px]">This one’s {eventAgeBadge(event)}</h1>
        <p className="mt-3 text-grey measure">
          This event has an age requirement of {eventAgeBadge(event)}, which is outside the age set
          on your profile — so we don’t show it. Here are three things you can go to instead.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
        <p className="mt-8 text-[14px] text-grey">
          <Link href="/browse" className="underline text-ink">
            Back to browsing
          </Link>
        </p>
      </div>
    );
  }

  return <EventDetail event={event} />;
}
