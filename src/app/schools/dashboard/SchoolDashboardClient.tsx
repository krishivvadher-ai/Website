"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { publishedEvents } from "@/lib/events";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import { useApp } from "@/lib/store";
import { daysUntil, formatDate } from "@/lib/format";
import { eventAgeBadge } from "@/lib/age";
import { hashString } from "@/components/CardImage";
import { DEMO_STUDENTS, type DemoStudent } from "@/lib/demoStudents";
import { HBar, Heatmap, StatCard, TrendChart } from "@/components/charts";

// The school dashboard — the £995/year product, built for a careers lead or
// head of sixth form. Individual students appear ONLY where they have
// chosen to share their record with the school (consent-based, revocable,
// visible to the student). Everything else is aggregate. Safeguarding
// concern reports are never visible here, by design.

function fakeMetric(seed: string, min: number, max: number): number {
  return min + (hashString(seed) % (max - min));
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "students", label: "Students" },
  { id: "picks", label: "Staff picks" },
  { id: "deadlines", label: "Deadlines" },
  { id: "reports", label: "Reports" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function SchoolDashboardClient() {
  const { ready, schoolSignedIn, setSchoolSignedIn } = useApp();
  const [tab, setTab] = useState<TabId>("overview");

  if (!ready) return null;

  if (!schoolSignedIn) {
    return (
      <div className="max-w-[640px] mx-auto px-6 py-16">
        <p className="pill inline-block border border-ink px-3 py-1">School licence · £995/year</p>
        <h1 className="mt-4 text-[28px] lg:text-[40px]">School dashboard</h1>
        <p className="mt-3 text-grey measure">
          For careers leads and heads of sixth form: see the students who share their records
          with you, feature events, track every deadline, and report destinations activity.
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

      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]" aria-label="Dashboard sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={`shrink-0 min-h-[48px] px-4 text-[14px] font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-ink text-ink" : "border-transparent text-grey hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "overview" && <OverviewTab />}
        {tab === "students" && <StudentsTab />}
        {tab === "picks" && <PicksTab />}
        {tab === "deadlines" && <DeadlinesTab />}
        {tab === "reports" && <ReportsTab />}
      </div>
    </div>
  );
}

/* ================================================================ overview */

function OverviewTab() {
  const sharing = DEMO_STUDENTS.filter((s) => s.sharing);
  const closingSoon = publishedEvents().filter(
    (e) => e.applicationDeadline && daysUntil(e.applicationDeadline) >= 0 && daysUntil(e.applicationDeadline) <= 30
  );
  const weekly = useMemo(() => Array.from({ length: 12 }, (_, i) => 60 + (hashString(`sch-w${i}`) % 80) + i * 9), []);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students sharing with you" value={String(sharing.length)} note={`of ${DEMO_STUDENTS.length} on the roster`} />
        <StatCard label="Active this week" value={String(sharing.filter((s) => s.lastActiveDays <= 7).length)} note="of students sharing" />
        <StatCard label="Deadlines this month" value={String(closingSoon.length)} note="applications still open" />
        <StatCard label="UCAS records building" value={String(sharing.filter((s) => s.attended.length > 0).length)} note="students with attended events" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
        <section className="card p-6" aria-labelledby="trend-heading">
          <h2 id="trend-heading" className="text-[18px]">
            Student activity, last 12 weeks
          </h2>
          <p className="text-[12px] text-grey">Saves, bookings and record entries by students sharing with you</p>
          <div className="mt-4">
            <TrendChart series={weekly} startLabel="12 weeks ago" endLabel="this week" ariaLabel="Weekly student activity, rising over twelve weeks" />
          </div>
        </section>

        <section className="card p-6" aria-labelledby="consent-heading">
          <h2 id="consent-heading" className="text-[18px]">
            How you see students
          </h2>
          <p className="mt-2 text-[13px] text-grey measure">
            A student appears here only after choosing “Share my record with my school” on their
            own device. Sharing is visible to them and revocable at any time. Safeguarding
            reports are never shown to schools — they go to onTrack’s safeguarding lead and
            statutory services.
          </p>
          <p className="mt-3 text-[13px]">
            <span className="font-display font-bold text-[22px]">{Math.round((sharing.length / DEMO_STUDENTS.length) * 100)}%</span>{" "}
            <span className="text-grey">of your roster currently shares</span>
          </p>
        </section>
      </div>
    </div>
  );
}

/* ================================================================ students */

function StudentsTab() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<"all" | 12 | 13>("all");
  const [open, setOpen] = useState<string | null>(null);

  const students = DEMO_STUDENTS.filter(
    (s) =>
      (year === "all" || s.yearGroup === year) &&
      (!query.trim() || s.name.toLowerCase().includes(query.trim().toLowerCase()))
  );

  const exportCsv = () => {
    const rows = [
      ["Student", "Year", "Sharing", "Saved", "Booked", "Attended", "Last active (days)"],
      ...DEMO_STUDENTS.filter((s) => s.sharing).map((s) => [
        s.name,
        String(s.yearGroup),
        "yes",
        String(s.saved.length),
        String(s.booked.length),
        String(s.attended.length),
        String(s.lastActiveDays),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ontrack-students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="student-search">
          Search students
        </label>
        <input
          id="student-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name"
          className="h-11 px-4 rounded-full border border-line bg-white text-[14px] w-[240px]"
        />
        {(["all", 12, 13] as const).map((y) => (
          <button
            key={String(y)}
            type="button"
            onClick={() => setYear(y)}
            aria-pressed={year === y}
            className={`pill min-h-[44px] px-4 border ${year === y ? "bg-ink text-paper border-ink" : "bg-white border-line"}`}
          >
            {y === "all" ? "All years" : `Year ${y}`}
          </button>
        ))}
        <button
          type="button"
          onClick={exportCsv}
          className="ml-auto min-h-[44px] px-5 rounded-full border border-ink text-[14px] font-medium hover:bg-ink hover:text-paper transition-colors"
        >
          Export CSV
        </button>
      </div>

      <p className="mt-3 text-[13px] text-grey measure">
        Students who chose to share their record appear in full. Students who haven’t shared
        appear by name only, with nothing else — and nothing you do here changes that; sharing
        is theirs to give and take back. Demo roster with generated names.
      </p>

      <ul className="mt-5 space-y-3">
        {students.map((s) => (
          <StudentRow key={s.id} student={s} open={open === s.id} onToggle={() => setOpen(open === s.id ? null : s.id)} />
        ))}
        {students.length === 0 && <li className="card p-6 text-[14px] text-grey">No students match.</li>}
      </ul>
    </div>
  );
}

function StudentRow({ student, open, onToggle }: { student: DemoStudent; open: boolean; onToggle: () => void }) {
  if (!student.sharing) {
    return (
      <li className="card p-4 flex items-center gap-3 opacity-70">
        <span className="w-9 h-9 rounded-full bg-line flex items-center justify-center font-display font-semibold text-[13px]">
          {student.name.split(" ").map((p) => p[0]).join("")}
        </span>
        <div>
          <p className="text-[15px] font-medium">{student.name}</p>
          <p className="text-[12px] text-grey">Year {student.yearGroup} · not sharing their record</p>
        </div>
      </li>
    );
  }

  return (
    <li className="card p-4">
      <button type="button" onClick={onToggle} aria-expanded={open} className="w-full flex items-center gap-3 text-left">
        <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-display font-semibold text-[13px]">
          {student.name.split(" ").map((p) => p[0]).join("")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium">{student.name}</p>
          <p className="text-[12px] text-grey">
            Year {student.yearGroup} · sharing since {student.sharedSince} · active{" "}
            {student.lastActiveDays === 0 ? "today" : `${student.lastActiveDays}d ago`}
          </p>
        </div>
        <span className="hidden sm:flex gap-2 text-[12px]">
          <span className="pill bg-line px-2.5 py-1">{student.saved.length} saved</span>
          <span className="pill bg-line px-2.5 py-1">{student.booked.length} booked</span>
          <span className="pill bg-signal text-ink px-2.5 py-1 font-semibold">{student.attended.length} attended</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-line grid gap-4 md:grid-cols-3 text-[13px]">
          <div>
            <h3 className="font-semibold text-[13px] uppercase tracking-[0.04em] text-grey">Attended — their record</h3>
            <ul className="mt-2 space-y-2">
              {student.attended.map(({ event, note }) => (
                <li key={event.id}>
                  <Link href={`/events/${event.slug}`} className="font-medium hover:underline">
                    {event.title}
                  </Link>
                  <span className="block text-grey">
                    {formatDate(event.date)} · {categoryBySlug(event.category)?.name}
                  </span>
                  {note && <span className="block italic text-grey">“{note}”</span>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[13px] uppercase tracking-[0.04em] text-grey">Booked</h3>
            <ul className="mt-2 space-y-1.5">
              {student.booked.map((e) => (
                <li key={e.id}>
                  <Link href={`/events/${e.slug}`} className="hover:underline">
                    {e.title}
                  </Link>
                  <span className="block text-grey">{formatDate(e.date)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[13px] uppercase tracking-[0.04em] text-grey">Saved</h3>
            <ul className="mt-2 space-y-1.5">
              {student.saved.map((e) => (
                <li key={e.id}>
                  <Link href={`/events/${e.slug}`} className="hover:underline">
                    {e.title}
                  </Link>
                  {e.applicationDeadline && daysUntil(e.applicationDeadline) >= 0 && (
                    <span className="block text-coral-deep">apply by {formatDate(e.applicationDeadline)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

/* =================================================================== picks */

function PicksTab() {
  const { schoolPicks, toggleSchoolPick } = useApp();
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

  return (
    <section className="card p-6" aria-labelledby="picks-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="picks-heading" className="text-[22px]">
          Staff picks
        </h2>
        <span className="text-[13px] text-grey">{schoolPicks.length} featured</span>
      </div>
      <p className="mt-1 text-[13px] text-grey measure">
        Feature events and they lead your school’s public page — the one your students actually
        see. Pick a mix: the page is not a careers portal.
      </p>
      <ul className="mt-4 space-y-3">
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
  );
}

/* =============================================================== deadlines */

function DeadlinesTab() {
  const closingSoon = publishedEvents()
    .filter((e) => e.applicationDeadline && daysUntil(e.applicationDeadline) >= 0 && daysUntil(e.applicationDeadline) <= 30)
    .sort((a, b) => new Date(a.applicationDeadline!).getTime() - new Date(b.applicationDeadline!).getTime());
  const interested = (id: string) => DEMO_STUDENTS.filter((s) => s.sharing && s.saved.some((e) => e.id === id)).length;

  return (
    <section className="card p-6" aria-labelledby="digest-heading">
      <h2 id="digest-heading" className="text-[22px]">
        Deadline digest — next 30 days
      </h2>
      <p className="mt-1 text-[13px] text-grey measure">
        Every application closing in the next month, with how many of your sharing students have
        it saved. Print it for the noticeboard, read it in briefing.
      </p>
      <table className="mt-4 w-full text-[14px]">
        <thead>
          <tr className="text-left text-grey border-b border-line text-[12px] uppercase tracking-[0.04em]">
            <th className="py-2 pr-3 font-medium">Closes</th>
            <th className="py-2 pr-3 font-medium">Event</th>
            <th className="py-2 font-medium">Students interested</th>
          </tr>
        </thead>
        <tbody>
          {closingSoon.map((e) => (
            <tr key={e.id} className="border-b border-line last:border-0 align-top">
              <td className="py-2.5 pr-3 whitespace-nowrap font-medium text-coral-deep">{formatDate(e.applicationDeadline!)}</td>
              <td className="py-2.5 pr-3">
                <Link href={`/events/${e.slug}`} className="hover:underline leading-tight">
                  {e.title}
                </Link>
                <span className="block text-[12px] text-grey">
                  {eventAgeBadge(e)} · {e.organiser}
                </span>
              </td>
              <td className="py-2.5">
                <span className="pill bg-line px-2.5 py-1">{interested(e.id)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={() => window.print()}
        className="mt-4 min-h-[44px] px-5 rounded-full border border-ink text-[14px] font-medium hover:bg-ink hover:text-paper transition-colors"
      >
        Print the digest
      </button>
    </section>
  );
}

/* ================================================================= reports */

function ReportsTab() {
  const byCategory = CATEGORIES.map((c) => ({
    label: c.name,
    value: DEMO_STUDENTS.filter((s) => s.sharing).reduce(
      (n, s) => n + s.attended.filter((a) => a.event.category === c.slug).length + s.booked.filter((e) => e.category === c.slug).length,
      0
    ),
  }));
  const max = Math.max(...byCategory.map((c) => c.value), 1);
  const heat = useMemo(
    () =>
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, di) =>
        ["Morning", "After school", "Evening", "Weekend day"].map((_, si) => hashString(`sch-heat-${di}-${si}`) % 100)
      ),
    []
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <section className="card p-6" aria-labelledby="dest-heading">
        <h2 id="dest-heading" className="text-[22px]">
          Destinations snapshot
        </h2>
        <p className="mt-1 text-[13px] text-grey measure">
          Activity by category among students sharing with you — formatted for Gatsby-benchmark
          and destinations returns.
        </p>
        <div className="mt-4 space-y-3">
          {byCategory.map((c) => (
            <HBar key={c.label} label={c.label} value={c.value} max={max} />
          ))}
        </div>
      </section>

      <section className="card p-6" aria-labelledby="when-heading">
        <h2 id="when-heading" className="text-[22px]">
          When your students are active
        </h2>
        <p className="mt-1 text-[13px] text-grey measure">
          Aggregate app activity by day and time — useful for timing announcements and trips.
        </p>
        <div className="mt-4">
          <Heatmap
            rows={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            cols={["AM", "3–6pm", "Eve", "Wknd"]}
            values={heat}
            ariaLabel="Activity heatmap by day and time slot"
          />
        </div>
        <p className="mt-3 text-[12px] text-grey">
          Demo data. Live reporting exports term-by-term CSVs for your destinations returns.
        </p>
      </section>
    </div>
  );
}
