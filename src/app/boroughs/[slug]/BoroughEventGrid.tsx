"use client";

import React from "react";
import type { Borough } from "@/lib/types";
import { eventsInBorough } from "@/lib/boroughs";
import { EventCard, EventCardSkeleton } from "@/components/EventCard";
import { useMounted } from "@/lib/useMediaQuery";

export function BoroughEventGrid({ boroughName }: { boroughName: Borough }) {
  const mounted = useMounted();
  const events = eventsInBorough(boroughName);

  return (
    <section aria-label={`Events in ${boroughName}`}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mounted
          ? events.map((e) => <EventCard key={e.id} event={e} />)
          : Array.from({ length: 6 }, (_, i) => <EventCardSkeleton key={i} />)}
      </div>
    </section>
  );
}
