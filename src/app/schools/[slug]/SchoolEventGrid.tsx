"use client";

import React from "react";
import { publishedEvents } from "@/lib/events";
import { daysUntil } from "@/lib/format";
import { EventCard, EventCardSkeleton } from "@/components/EventCard";
import { useMounted } from "@/lib/useMediaQuery";

// Deadline-first for a school audience: what closes soonest leads, but the
// grid keeps the fun/useful mix — a school page is not a careers portal.
export function SchoolEventGrid() {
  const mounted = useMounted();
  const events = publishedEvents()
    .filter((e) => daysUntil(e.date) >= 0)
    .sort((a, b) => {
      const aKey = a.applicationDeadline ?? a.date;
      const bKey = b.applicationDeadline ?? b.date;
      return new Date(aKey).getTime() - new Date(bKey).getTime();
    })
    .slice(0, 9);

  return (
    <section aria-label="Picked events">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mounted
          ? events.map((e) => <EventCard key={e.id} event={e} />)
          : Array.from({ length: 6 }, (_, i) => <EventCardSkeleton key={i} />)}
      </div>
    </section>
  );
}
