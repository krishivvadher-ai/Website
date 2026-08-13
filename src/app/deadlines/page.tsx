"use client";

import React from "react";
import Link from "next/link";
import { publishedEvents } from "@/lib/events";
import { useApp } from "@/lib/store";
import { visibleToProfile } from "@/lib/age";
import type { OnTrackEvent, ReminderPrefs } from "@/lib/types";
import { daysUntil, deadlinePassed, formatDate, formatDateLong } from "@/lib/format";
import { DeadlineCalendar } from "@/components/DeadlineCalendar";

const DEFAULT_REMINDERS: ReminderPrefs = {
  sevenDays: false,
  twoDays: false,
  morningOf: false,
  channel: "email",
};

// The Deadlines tab: a calendar, not a sales tactic. Sorted by what closes
// soonest; closed items group at the bottom rather than vanishing;
// reminders are opt-in and off by default.
export default function DeadlinesPage() {
  const { ready, saved, profile, reminders, setReminder } = useApp();

  const savedEvents = publishedEvents().filter((e) => saved.includes(e.id) && visibleToProfile(e, profile));
  const withDeadline = savedEvents.filter((e) => e.applicationDeadline);
  const open = withDeadline
    .filter((e) => !deadlinePassed(e.applicationDeadline!))
    .sort((a, b) => new Date(a.applicationDeadline!).getTime() - new Date(b.applicationDeadline!).getTime());
  const closed = withDeadline.filter((e) => deadlinePassed(e.applicationDeadline!));
  const noDeadline = savedEvents.filter((e) => !e.applicationDeadline);

  return (
    <div className="max-w-[840px] mx-auto px-6 py-8">
      <h1 className="text-[28px] lg:text-[40px]">Deadlines</h1>
      <p className="mt-2 text-grey measure">
        Application deadlines from your saved events, soonest first. The deadline is often weeks
        before the event — this tab exists so you find out in time.
      </p>

      {ready && (
        <div className="mt-8">
          <DeadlineCalendar savedEvents={savedEvents} />
        </div>
      )}

      {!ready ? null : withDeadline.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <h2 className="text-[22px]">No deadlines to track</h2>
          <p className="mt-2 text-grey measure mx-auto">
            Save events with an application deadline and they’ll line up here, soonest first.
          </p>
          <Link
            href="/browse"
            className="mt-4 inline-flex items-center min-h-[44px] px-6 rounded-full bg-signal text-ink border border-ink font-display font-semibold"
          >
            Find something worth applying to
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-4">
            {open.map((e) => (
              <DeadlineRow
                key={e.id}
                event={e}
                prefs={reminders[e.id] ?? DEFAULT_REMINDERS}
                onPrefs={(p) => setReminder(e.id, p)}
              />
            ))}
          </ul>

          {closed.length > 0 && (
            <section className="mt-12" aria-labelledby="closed-heading">
              <h2 id="closed-heading" className="text-[22px] text-grey">
                Closed
              </h2>
              <ul className="mt-4 space-y-3">
                {closed.map((e) => (
                  <li key={e.id} className="card p-4 opacity-70">
                    <p className="font-medium">{e.title}</p>
                    <p className="text-[13px] text-grey">
                      Applications closed {formatDate(e.applicationDeadline!)} · event{" "}
                      {formatDate(e.date)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {ready && noDeadline.length > 0 && (
        <p className="mt-10 text-[13px] text-grey measure">
          {noDeadline.length} of your saved events {noDeadline.length === 1 ? "has" : "have"} no
          application deadline — just turn up.
        </p>
      )}
    </div>
  );
}

function DeadlineRow({
  event,
  prefs,
  onPrefs,
}: {
  event: OnTrackEvent;
  prefs: ReminderPrefs;
  onPrefs: (p: ReminderPrefs) => void;
}) {
  const days = daysUntil(event.applicationDeadline!);
  const urgent = days <= 7;
  const [expanded, setExpanded] = React.useState(false);
  const anyOn = prefs.sevenDays || prefs.twoDays || prefs.morningOf;

  return (
    <li className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[18px] leading-tight">
            <Link href={`/events/${event.slug}`} className="hover:underline">
              {event.title}
            </Link>
          </h3>
          <p className={`mt-1 text-[14px] font-medium ${urgent ? "text-coral-deep" : "text-ink"}`}>
            {days === 0 ? "Closes today" : days === 1 ? "Closes tomorrow" : `Closes in ${days} days`} —{" "}
            {formatDateLong(event.applicationDeadline!)}
          </p>
          <p className="text-[13px] text-grey">Event: {formatDate(event.date)}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className={`pill shrink-0 min-h-[44px] px-4 border ${
            anyOn ? "bg-signal border-ink font-semibold" : "bg-white border-line"
          }`}
        >
          {anyOn ? "Reminders on" : "Remind me"}
        </button>
      </div>
      {expanded && (
        <fieldset className="mt-4 pt-4 border-t border-line">
          <legend className="text-[13px] font-semibold">Remind me</legend>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            {(
              [
                ["sevenDays", "7 days before"],
                ["twoDays", "2 days before"],
                ["morningOf", "The morning of"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 min-h-[44px]">
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={(e) => onPrefs({ ...prefs, [key]: e.target.checked })}
                  className="w-4 h-4 accent-[#111111]"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-2 flex gap-4 text-[14px]">
            {(["email", "push"] as const).map((ch) => (
              <label key={ch} className="flex items-center gap-2 min-h-[44px]">
                <input
                  type="radio"
                  name={`channel-${event.id}`}
                  checked={prefs.channel === ch}
                  onChange={() => onPrefs({ ...prefs, channel: ch })}
                  className="w-4 h-4 accent-[#111111]"
                />
                {ch === "email" ? "Email" : "Push"}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </li>
  );
}
