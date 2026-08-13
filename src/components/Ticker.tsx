"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { publishedEvents } from "@/lib/events";
import { formatDate, formatPrice } from "@/lib/format";
import { daysUntil } from "@/lib/format";
import { useMounted } from "@/lib/useMediaQuery";

/**
 * The proof strip: real upcoming events under the hero, strictly alternating
 * fun and useful so the mix is visible at a glance. 78% of users don't
 * believe anything is on near them — this exists to disprove that before
 * they scroll. Pauses on hover, focus, and under reduced motion.
 */
export function Ticker() {
  const mounted = useMounted();
  const items = useMemo(() => {
    const upcoming = publishedEvents().filter((e) => daysUntil(e.date) >= 0).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const funSide = upcoming.filter((e) => e.intent === "fun" || e.intent === "both");
    const usefulSide = upcoming.filter((e) => e.intent === "useful" || e.intent === "both");
    const out: typeof upcoming = [];
    const used = new Set<string>();
    for (let i = 0; out.length < 10 && i < upcoming.length; i++) {
      const pool = out.length % 2 === 0 ? funSide : usefulSide;
      const next = pool.find((e) => !used.has(e.id));
      if (!next) break;
      used.add(next.id);
      out.push(next);
    }
    return out;
  }, []);

  const row = (keyPrefix: string, hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((e) => (
        <li key={`${keyPrefix}-${e.id}`} className="flex items-center whitespace-nowrap px-6 py-3 text-[14px]">
          <Link href={`/events/${e.slug}`} className="group flex items-center gap-3" tabIndex={hidden ? -1 : 0}>
            <span className="font-display font-semibold text-signal">{formatDate(e.date)}</span>
            <span className="group-hover:underline">{e.title}</span>
            <span className="text-paper/60">{e.venue.area}</span>
            <span className={e.price === 0 ? "text-signal font-semibold" : "text-paper/80"}>
              {formatPrice(e.price)}
            </span>
          </Link>
          <span className="ml-6 text-paper/30" aria-hidden="true">
            ●
          </span>
        </li>
      ))}
    </ul>
  );

  if (!mounted) {
    return <section className="bg-ink h-[46px]" aria-hidden="true" />;
  }
  if (items.length === 0) return null;

  return (
    <section className="ticker bg-ink text-paper overflow-hidden" aria-label="Upcoming events near you">
      <div className="ticker-track flex w-max">
        {row("a", false)}
        {row("b", true)}
      </div>
    </section>
  );
}
