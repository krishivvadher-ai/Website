"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { publishedEvents } from "@/lib/events";
import { daysUntil } from "@/lib/format";
import { EventCard, EventCardSkeleton } from "./EventCard";
import { useMounted } from "@/lib/useMediaQuery";

/**
 * A six-card sample of the feed for the landing page — a visible mix, always:
 * two fun, two useful, two both. A demo feed of six talks would communicate
 * the wrong product.
 */
export function LandingFeed() {
  const mounted = useMounted();
  const sample = useMemo(() => {
    const upcoming = publishedEvents().filter((e) => daysUntil(e.date) >= 0).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const pick = (intent: string, n: number) => upcoming.filter((e) => e.intent === intent).slice(0, n);
    const mix = [...pick("fun", 2), ...pick("useful", 2), ...pick("both", 2)];
    return mix.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[28px] lg:text-[40px]">On soon, near you</h2>
        <Link href="/browse" className="text-[14px] font-medium underline whitespace-nowrap">
          See everything
        </Link>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mounted
          ? sample.map((e) => <EventCard key={e.id} event={e} />)
          : Array.from({ length: 6 }, (_, i) => <EventCardSkeleton key={i} />)}
      </div>
    </section>
  );
}
