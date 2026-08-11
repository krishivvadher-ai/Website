"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { EVENTS } from "@/lib/events";
import { daysUntil, formatDate, formatPrice } from "@/lib/format";
import { eventAgeBadge } from "@/lib/age";
import { categoryBySlug } from "@/lib/categories";
import { CategoryMotif, hashString, posterTheme } from "./CardImage";
import { Logo } from "./Logo";
import { useMounted } from "@/lib/useMediaQuery";

// Hero slideshow: five promotions — one for onTrack itself, four for events
// (two fun, two useful, per the balance principle). Auto-advances every 6s,
// pauses on hover/focus, stops entirely under reduced motion, and is fully
// operable with the dot and arrow controls.

const SLIDE_MS = 6000;

export function HeroSlideshow() {
  const mounted = useMounted();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  const promoEvents = useMemo(() => {
    const upcoming = EVENTS.filter((e) => daysUntil(e.date) >= 0).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    // Alternate fun and useful so the hero itself shows the mix
    const fun = upcoming.filter((e) => e.intent === "fun");
    const useful = upcoming.filter((e) => e.intent === "useful");
    return [fun[0], useful[0], fun[1], useful[1]].filter(Boolean);
  }, []);

  const count = 1 + promoEvents.length;

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!mounted || paused || reducedMotion.current || count <= 1) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => window.clearInterval(t);
  }, [mounted, paused, count]);

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  return (
    <section
      className="relative bg-ink text-paper overflow-hidden"
      aria-roledescription="carousel"
      aria-label="onTrack and featured events"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[560px] lg:h-[620px]">
        <PromoSlide active={index === 0} />
        {mounted &&
          promoEvents.map((e, i) => <EventSlide key={e.id} event={e} active={index === i + 1} />)}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 inset-x-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-4">
          <div className="flex gap-2" role="tablist" aria-label="Slides">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={index === i}
                aria-label={i === 0 ? "About onTrack" : `Featured event ${i}`}
                onClick={() => go(i)}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  index === i ? "w-8 bg-signal" : "w-2.5 bg-paper/40 hover:bg-paper/70"
                }`}
              />
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="w-11 h-11 rounded-full border border-paper/40 flex items-center justify-center hover:bg-paper hover:text-ink transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="w-11 h-11 rounded-full border border-paper/40 flex items-center justify-center hover:bg-paper hover:text-ink transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideShell({ active, children, art }: { active: boolean; children: React.ReactNode; art: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
      aria-hidden={!active}
      role="group"
      aria-roledescription="slide"
    >
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {art}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
      <div className="relative z-10 h-full max-w-[1200px] mx-auto px-6 flex flex-col justify-center pb-16">{children}</div>
    </div>
  );
}

function PromoSlide({ active }: { active: boolean }) {
  return (
    <SlideShell
      active={active}
      art={
        <>
          <CategoryMotif category="music" seed={7} fg="#FBF9F5" accent="#D9FF3D" opacity={0.35} />
          <g transform="translate(0 40)">
            <CategoryMotif category="careers" seed={3} fg="#FBF9F5" accent="#FF5A3D" opacity={0.25} />
          </g>
        </>
      }
    >
      <Logo light markClass="h-8 w-8" textClass="text-[30px] lg:text-[34px]" />
      <p className="pill mt-5 inline-block w-fit border border-paper/50 px-3 py-1">Across the UK · free to use</p>
      <h1 className="mt-5 text-[36px] lg:text-[56px] max-w-[16ch] text-paper">Find things worth your time.</h1>
      <p className="mt-4 font-display font-semibold text-[18px] lg:text-[24px] text-signal">
        Find it. Fit it. Never miss it.
      </p>
      <p className="mt-3 text-[16px] lg:text-[19px] text-paper/80 measure">
        Gigs and insight days. Open decks and open lectures. One place to find what’s on, filtered
        to what you can actually attend — and it tells you before applications close, not after.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/browse"
          className="inline-flex items-center min-h-[48px] px-7 rounded-full bg-signal text-ink font-display font-semibold text-[16px]"
        >
          See what’s on
        </Link>
        <Link
          href="/map"
          className="inline-flex items-center min-h-[48px] px-7 rounded-full border border-paper text-paper font-display font-semibold text-[16px] hover:bg-paper hover:text-ink transition-colors"
        >
          Open the map
        </Link>
      </div>
    </SlideShell>
  );
}

function EventSlide({ event, active }: { event: (typeof EVENTS)[number]; active: boolean }) {
  const theme = posterTheme(event.slug);
  const catName = categoryBySlug(event.category)?.name ?? event.category;
  return (
    <SlideShell
      active={active}
      art={<CategoryMotif category={event.category} seed={hashString(event.slug)} fg="#FBF9F5" accent={theme.accent} opacity={0.5} />}
    >
      <p className="pill inline-block w-fit px-3 py-1 text-ink" style={{ background: theme.accent }}>
        {catName}
      </p>
      <h2 className="mt-5 text-[32px] lg:text-[48px] max-w-[18ch] text-paper">{event.title}</h2>
      <p className="mt-4 text-[16px] lg:text-[18px] text-paper/80">
        {formatDate(event.date)} · {event.venue.name}, {event.venue.area}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="pill bg-paper text-ink px-3 py-1">{eventAgeBadge(event)}</span>
        <span className={`pill px-3 py-1 font-semibold ${event.price === 0 ? "bg-signal text-ink" : "bg-paper/20 text-paper"}`}>
          {formatPrice(event.price)}
        </span>
      </div>
      <div className="mt-7">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center min-h-[48px] px-7 rounded-full bg-signal text-ink font-display font-semibold text-[16px]"
        >
          See event
        </Link>
      </div>
    </SlideShell>
  );
}
