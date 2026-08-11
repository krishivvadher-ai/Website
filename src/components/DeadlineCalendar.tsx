"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { OnTrackEvent } from "@/lib/types";
import { formatDateLong, formatTime } from "@/lib/format";

// Month calendar for the Deadlines tab. Application deadlines are marked in
// Coral, event dates in Ink; tapping a day shows what's on it. A calendar,
// not a sales tactic — no countdown pressure anywhere.

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

interface DayItems {
  deadlines: OnTrackEvent[];
  events: OnTrackEvent[];
}

export function DeadlineCalendar({ savedEvents }: { savedEvents: OnTrackEvent[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState<string>(dayKey(today));

  const byDay = useMemo(() => {
    const map = new Map<string, DayItems>();
    const add = (iso: string, event: OnTrackEvent, kind: keyof DayItems) => {
      const key = dayKey(new Date(iso));
      const entry = map.get(key) ?? { deadlines: [], events: [] };
      entry[kind].push(event);
      map.set(key, entry);
    };
    for (const e of savedEvents) {
      if (e.applicationDeadline) add(e.applicationDeadline, e, "deadlines");
      add(e.date, e, "events");
    }
    return map;
  }, [savedEvents]);

  const move = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadBlanks = (firstOfMonth.getDay() + 6) % 7; // Monday-first
  const cells: (Date | null)[] = [
    ...Array.from({ length: leadBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const selected = byDay.get(selectedKey);
  const selectedDate = useMemo(() => {
    const [y, m, d] = selectedKey.split("-").map(Number);
    return new Date(y, m, d);
  }, [selectedKey]);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[22px]">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous month"
            className="w-11 h-11 rounded-full border border-line flex items-center justify-center hover:border-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              setYear(today.getFullYear());
              setMonth(today.getMonth());
              setSelectedKey(dayKey(today));
            }}
            className="min-h-[44px] px-4 rounded-full border border-line text-[13px] font-medium hover:border-ink"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next month"
            className="w-11 h-11 rounded-full border border-line flex items-center justify-center hover:border-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 text-center text-[11px] uppercase tracking-[0.04em] text-grey">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" role="grid" aria-label={`${MONTHS[month]} ${year}`}>
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} aria-hidden="true" />;
          const key = dayKey(date);
          const items = byDay.get(key);
          const isToday = key === dayKey(today);
          const isSelected = key === selectedKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedKey(key)}
              aria-pressed={isSelected}
              aria-label={`${date.getDate()} ${MONTHS[month]}${items ? `, ${items.deadlines.length} deadline${items.deadlines.length === 1 ? "" : "s"}, ${items.events.length} event${items.events.length === 1 ? "" : "s"}` : ""}`}
              className={`relative min-h-[48px] rounded-lg border text-[14px] flex flex-col items-center justify-center gap-1 transition-colors ${
                isSelected
                  ? "bg-ink text-paper border-ink"
                  : isToday
                    ? "border-ink bg-white"
                    : "border-transparent hover:border-line bg-transparent"
              }`}
            >
              <span className={isToday && !isSelected ? "font-bold" : ""}>{date.getDate()}</span>
              {items && (
                <span className="flex gap-1" aria-hidden="true">
                  {items.deadlines.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-coral" />}
                  {items.events.length > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-signal" : "bg-ink"}`} />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-4 text-[12px] text-grey">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-coral" /> Application deadline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-ink" /> Event day
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-line" role="region" aria-live="polite">
        <h3 className="text-[15px] font-semibold">{formatDateLong(selectedDate.toISOString())}</h3>
        {!selected ? (
          <p className="mt-1 text-[14px] text-grey">Nothing saved on this day.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {selected.deadlines.map((e) => (
              <li key={`d-${e.id}`} className="text-[14px]">
                <span className="font-semibold text-coral">Applications close:</span>{" "}
                <Link href={`/events/${e.slug}`} className="underline">
                  {e.title}
                </Link>
              </li>
            ))}
            {selected.events.map((e) => (
              <li key={`e-${e.id}`} className="text-[14px]">
                <span className="font-semibold">{formatTime(e.date)}:</span>{" "}
                <Link href={`/events/${e.slug}`} className="underline">
                  {e.title}
                </Link>{" "}
                <span className="text-grey">— {e.venue.area}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
