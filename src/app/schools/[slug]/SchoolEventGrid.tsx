"use client";

import React from "react";
import { publishedEvents } from "@/lib/events";
import { daysUntil } from "@/lib/format";
import { useApp } from "@/lib/store";
import { EventCard, EventCardSkeleton } from "@/components/EventCard";
import { useMounted } from "@/lib/useMediaQuery";

// Staff picks (set in the school dashboard) lead; the rest follows
// deadline-first. The grid keeps the fun/useful mix — a school page is not
// a careers portal.
export function SchoolEventGrid() {
  const mounted = useMounted();
  const { schoolPicks } = useApp();

  const upcoming = publishedEvents()
    .filter((e) => daysUntil(e.date) >= 0)
    .sort((a, b) => {
      const aKey = a.applicationDeadline ?? a.date;
      const bKey = b.applicationDeadline ?? b.date;
      return new Date(aKey).getTime() - new Date(bKey).getTime();
    });

  const picked = upcoming.filter((e) => schoolPicks.includes(e.id));
  const rest = upcoming.filter((e) => !schoolPicks.includes(e.id)).slice(0, Math.max(0, 9 - picked.length));

  return (
    <section aria-label="Picked events">
      {!mounted ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {picked.length > 0 && (
            <>
              <h2 className="text-[22px]">Staff picks</h2>
              <div className="mt-4 mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {picked.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
              {rest.length > 0 && <h2 className="text-[22px]">Also on soon</h2>}
            </>
          )}
          <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${picked.length > 0 ? "mt-4" : ""}`}>
            {rest.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
