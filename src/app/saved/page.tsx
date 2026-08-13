"use client";

import React from "react";
import Link from "next/link";
import { publishedEvents } from "@/lib/events";
import { useApp } from "@/lib/store";
import { visibleToProfile } from "@/lib/age";
import { EventCard, EventCardSkeleton } from "@/components/EventCard";

export default function SavedPage() {
  const { ready, saved, profile } = useApp();
  // Age filtering applies to saved items too — it applies everywhere.
  const events = publishedEvents().filter((e) => saved.includes(e.id) && visibleToProfile(e, profile)).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <h1 className="text-[28px] lg:text-[40px]">Saved</h1>
      {!ready ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <h2 className="text-[22px]">Nothing saved yet</h2>
          <p className="mt-2 text-grey measure mx-auto">
            Save anything that looks good and its deadline lands in your Deadlines tab
            automatically.
          </p>
          <Link
            href="/browse"
            className="mt-4 inline-flex items-center min-h-[44px] px-6 rounded-full bg-signal text-ink border border-ink font-display font-semibold"
          >
            See what’s on
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
