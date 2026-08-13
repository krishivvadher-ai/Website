"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { publishedEvents } from "@/lib/events";
import { CATEGORIES } from "@/lib/categories";
import { useApp } from "@/lib/store";
import { daysUntil, formatDate } from "@/lib/format";
import { eventAgeBadge } from "@/lib/age";
import { hashString } from "@/components/CardImage";

// The school dashboard — the £995/year product, built for a careers lead or
// head of sixth form. Everything here is aggregate-only: onTrack never
// shows a school an individual student's activity. That is a product
// decision and a legal one, and this page says so.

function fakeMetric(seed: string, min: number, max: number): number {
  return min + (hashString(seed) % (max - min));
}

export function SchoolDashboardClient() {
  const { ready, schoolSignedIn, setSchoolSignedIn, schoolPicks, toggleSchoolPick } = useApp();

  const upcoming = useMemo(
    () =>
      publishedEvents()
        .filter((e) => daysUntil(e.date) >= 0)
        .sort((a, b) => {
          const aKey = a.applicationDeadline ?? a.date;
          const bKey = b.applicationDeadline ?? b.date;
          return new Date(aKey).getTime() - new Date(bKey).getTime();
        }),
    []
  );
  const closingSoon = upcoming.filter(
    (e) => e.applicationDeadline && daysUntil(e.applicationDeadline) >= 0 && daysUntil(e.applicationDeadline) <= 30
  );

  if (!ready) return null;

  if (!schoolSignedIn) {
    return (
      <div className="max-w-[640px] mx-auto px-6 py-16">
        <p className="pill inline-block border border-ink px-3 py-1">School licence · £995/year</p>
        <h1 className="mt-4 text-[28px] lg:text-[40px]">School dashboard</h1>
        <p className="mt-3 text-grey measure">
          For careers leads and heads of sixth form: feature events for your students, see every
          application deadline in one place, and report destinations activity — without ever
          seeing an individual student’s data, because we never collect it.
        </p>
        <div className="card mt-8 p-6">
          <h2 className="text-[22px]">Sign in</h2>
          <p className="mt-1 text-[13px] text-grey">
            This demo signs you in as Example Sixth Form College. In production this is real
            staff authentication.
          </p>
          <button
            type="button"
            onClick={() => setSchoolSignedIn(true)}
            className="mt-4 min-h-[48px] px-6 rounded-full bg-ink text-paper font-display font-semibold"
          >
            Sign in as demo staff
          </button>
        </div>
      </div>
    );
  }

  const activeStudents = fakeMetric("students", 240, 420);
  const savesThisTerm = fakeMetric("saves-term", 700, 1400);
  const recordsBuilding = fakeMetric("ucas-records", 90, 210);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="text-[28px] lg:text-[40px]">Example Sixth Form College</h1>
        <span className="pill bg-signal text-ink border border-ink px-3 py-1 font-semibold">School licence</span>
        <Link href="/schools/demo-sixth-form" className="text-[14px] underline">
          View your public page
        </Link>
        <button type="button" onClick={() => setSchoolSignedIn(false)} className="ml-auto text-[14px] underline text-grey">
          Sign out
        </button>
      </div>

      {/* ------------------------------------------------------- overview */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-[12px] uppercase tracking-[0.04em] text-grey">Students active</p>
          <p className="mt-1 font-display font-bold text-[28px] leading-none">{activeStudents}</p>
          <p className="mt-1 text-[12px] text-grey">this term, aggregate</p>
        </div>
        <div className="card p-5">
          <p className="text-[12px] uppercase tracking-[0.04em] text-grey">Events saved</p>
          <p className="mt-1 font-display font-bold text-[28px] leading-none">{savesThisTerm.toLocaleString("en-GB")}</p>
          <p className="mt-1 text-[12px] text-grey">by your students, this term</p>
        </div>
        <div className="card p-5">
          <p className="text-[12px] uppercase tracking-[0.04em] text-grey">Deadlines this month</p>
          <p className="mt-1 font-display font-bold text-[28px] leading-none">{closingSoon.length}</p>
          <p className="mt-1 text-[12px] text-grey">applications still open</p>
        </div>
        <div className="card p-5">
          <p className="text-[12px] uppercase tracking-[0.04em] text-grey">UCAS records building</p>
          <p className="mt-1 font-display font-bold text-[28px] leading-none">{recordsBuilding}</p>
          <p className="mt-1 text-[12px] text-grey">students using “What I’ve done”</p>
        </div>
      </div>

      <p className="mt-3 text-[13px] text-grey measure">
        Every number on this page is an aggregate. onTrack never shows a school an individual
        student’s saves, bookings or record — we don’t collect them centrally at all.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 items-start">
        {/* -------------------------------------------------- staff picks */}
        <section className="card p-6" aria-labelledby="picks-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="picks-heading" className="text-[22px]">
              Staff picks
            </h2>
            <span className="text-[13px] text-grey">{schoolPicks.length} featured</span>
          </div>
          <p className="mt-1 text-[13px] text-grey measure">
            Feature events and they lead your school’s public page — the one your students
            actually see. Pick a mix: the page is not a careers portal.
          </p>
          <ul className="mt-4 space-y-3 max-h-[430px] overflow-y-auto pr-1">
            {upcoming.map((e) => {
              const picked = schoolPicks.includes(e.id);
              return (
                <li key={e.id} className="flex items-center gap-3 border-b border-line pb-3 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium leading-tight truncate">{e.title}</p>
                    <p className="text-[12px] text-grey">
                      {formatDate(e.date)} · {e.venue.area} · {eventAgeBadge(e)}
                      {e.applicationDeadline ? ` · apply by ${formatDate(e.applicationDeadline)}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSchoolPick(e.id)}
                    aria-pressed={picked}
                    className={`pill shrink-0 min-h-[40px] px-4 border ${
                      picked ? "bg-signal border-ink font-semibold" : "bg-white border-line hover:border-ink"
                    }`}
                  >
                    {picked ? "Featured" : "Feature"}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="grid gap-6">
          {/* -------------------------------------------- deadline digest */}
          <section className="card p-6" aria-labelledby="digest-heading">
            <h2 id="digest-heading" className="text-[22px]">
              Deadline digest — next 30 days
            </h2>
            <p className="mt-1 text-[13px] text-grey measure">
              Print it, put it on the sixth-form noticeboard, read it out in briefing.
            </p>
            {closingSoon.length === 0 ? (
              <p className="mt-4 text-[14px]">Nothing closes in the next 30 days.</p>
            ) : (
              <table className="mt-4 w-full text-[14px]">
                <tbody>
                  {closingSoon.slice(0, 8).map((e) => (
                    <tr key={e.id} className="border-b border-line last:border-0 align-top">
                      <td className="py-2 pr-3 whitespace-nowrap font-medium text-coral-deep">
                        {formatDate(e.applicationDeadline!)}
                      </td>
                      <td className="py-2 pr-3">
                        <Link href={`/events/${e.slug}`} className="hover:underline leading-tight">
                          {e.title}
                        </Link>
                        <span className="block text-[12px] text-grey">
                          {eventAgeBadge(e)} · {e.organiser}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-4 min-h-[44px] px-5 rounded-full border border-ink text-[14px] font-medium hover:bg-ink hover:text-paper transition-colors"
            >
              Print the digest
            </button>
          </section>

          {/* ------------------------------------------------ destinations */}
          <section className="card p-6" aria-labelledby="destinations-heading">
            <h2 id="destinations-heading" className="text-[22px]">
              Destinations snapshot
            </h2>
            <p className="mt-1 text-[13px] text-grey measure">
              What your students engage with, by category — formatted for Gatsby-benchmark and
              destinations reporting.
            </p>
            <div className="mt-4 space-y-3">
              {CATEGORIES.map((c) => {
                const v = fakeMetric(`dest-${c.slug}`, 40, 320);
                const max = 320;
                return (
                  <div key={c.slug}>
                    <div className="flex justify-between text-[13px]">
                      <span>{c.name}</span>
                      <span className="font-semibold">{v}</span>
                    </div>
                    <div className="mt-1 h-3 rounded-full bg-line overflow-hidden">
                      <div className="h-full bg-ink rounded-full" style={{ width: `${(v / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[12px] text-grey">
              Demo data. Live reporting exports term-by-term CSVs for your destinations returns.
            </p>
          </section>
        </div>
      </div>

      <section className="card mt-8 p-6 bg-ink text-paper border-ink md:flex items-center justify-between gap-8">
        <p className="text-[15px] measure text-paper/80">
          The new UCAS question 3 asks what applicants have done outside education. Your
          students’ “What I’ve done” records build the answer all year — on their own devices,
          owned by them.
        </p>
        <Link
          href="/you"
          className="mt-4 md:mt-0 shrink-0 inline-flex items-center min-h-[44px] px-6 rounded-full bg-signal text-ink font-display font-semibold text-[14px]"
        >
          See the student view
        </Link>
      </section>
    </div>
  );
}

