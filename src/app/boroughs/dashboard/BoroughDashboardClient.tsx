"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { publishedEvents } from "@/lib/events";
import { CATEGORIES } from "@/lib/categories";
import { useApp } from "@/lib/store";
import { daysUntil, formatDate } from "@/lib/format";
import { hashString } from "@/components/CardImage";
import { HBar, Heatmap, PairedBars, StatCard, TrendChart } from "@/components/charts";

// The borough dashboard — the £6,000/year product, built for a youth
// services team. Everything is aggregate: a council sees its borough's
// activity, never an individual young person. All figures are demo data,
// deterministic so the story holds together across tabs.

const BOROUGH = "Tower Hamlets";
const WARDS = [
  "Bethnal Green",
  "Bow East",
  "Bow West",
  "Canary Wharf",
  "Isle of Dogs",
  "Limehouse",
  "Mile End",
  "Poplar",
  "Shadwell",
  "Spitalfields",
  "Stepney Green",
  "Whitechapel",
];

function fm(seed: string, min: number, max: number): number {
  return min + (hashString(seed) % (max - min));
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Youth activity" },
  { id: "provision", label: "Provision gaps" },
  { id: "organisers", label: "Organisers" },
  { id: "impact", label: "Impact report" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function BoroughDashboardClient() {
  const { ready, boroughSignedIn, setBoroughSignedIn } = useApp();
  const [tab, setTab] = useState<TabId>("overview");

  if (!ready) return null;

  if (!boroughSignedIn) {
    return (
      <div className="max-w-[640px] mx-auto px-6 py-16">
        <p className="pill inline-block border border-ink px-3 py-1">Borough partnership · £6,000/year</p>
        <h1 className="mt-4 text-[28px] lg:text-[40px]">Borough dashboard</h1>
        <p className="mt-3 text-grey measure">
          For youth service and culture teams: what young people in your borough actually do,
          where provision falls short, which organisations reach them — all aggregate, evidenced,
          and formatted for members’ briefings.
        </p>
        <div className="card mt-8 p-6">
          <h2 className="text-[22px]">Sign in</h2>
          <p className="mt-1 text-[13px] text-grey">
            This demo signs you in as Young Tower Hamlets. In production this is real council
            authentication.
          </p>
          <button
            type="button"
            onClick={() => setBoroughSignedIn(true)}
            className="mt-4 min-h-[48px] px-6 rounded-full bg-ink text-paper font-display font-semibold"
          >
            Sign in as demo council staff
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="text-[28px] lg:text-[40px]">{BOROUGH}</h1>
        <span className="pill bg-signal text-ink border border-ink px-3 py-1 font-semibold">Borough partner</span>
        <Link href="/boroughs/tower-hamlets" className="text-[14px] underline">
          View your public page
        </Link>
        <button type="button" onClick={() => setBoroughSignedIn(false)} className="ml-auto text-[14px] underline text-grey">
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
        {tab === "activity" && <ActivityTab />}
        {tab === "provision" && <ProvisionTab />}
        {tab === "organisers" && <OrganisersTab />}
        {tab === "impact" && <ImpactTab />}
      </div>

      <p className="mt-8 text-[12px] text-grey measure">
        All figures are aggregate — the borough never sees an individual young person. Demo data,
        deterministic for this build.
      </p>
    </div>
  );
}

/* ================================================================ overview */

function OverviewTab() {
  const events = publishedEvents().filter((e) => e.venue.borough === BOROUGH);
  const weekly = useMemo(() => Array.from({ length: 12 }, (_, i) => 420 + (hashString(`bor-w${i}`) % 260) + i * 55), []);
  const reached = 4183;
  const free = Math.round((events.filter((e) => e.price === 0).length / Math.max(events.length, 1)) * 100);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Young people reached" value={reached.toLocaleString("en-GB")} note="13–18, this term" />
        <StatCard label="Weekly active" value={String(fm("bor-wa", 900, 1400))} note="up 18% on last term" />
        <StatCard label="Events live now" value={String(events.length)} note={`${free}% free to attend`} />
        <StatCard label="Bookings this term" value={String(fm("bor-book", 1600, 2600))} note="incl. free places" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
        <section className="card p-6" aria-labelledby="btrend-heading">
          <h2 id="btrend-heading" className="text-[18px]">
            Weekly active young people, last 12 weeks
          </h2>
          <div className="mt-4">
            <TrendChart series={weekly} startLabel="12 weeks ago" endLabel="this week" ariaLabel="Weekly active young people rising over twelve weeks" />
          </div>
          <p className="mt-2 text-[12px] text-grey">
            The climb from week 8 follows the summer programme going live on onTrack.
          </p>
        </section>

        <section className="card p-6" aria-labelledby="headline-heading">
          <h2 id="headline-heading" className="text-[18px]">
            This term’s headlines
          </h2>
          <ul className="mt-3 space-y-3 text-[14px]">
            <li>
              <span className="font-display font-bold text-[22px]">68%</span>
              <span className="block text-grey">of active users engaged with at least one “useful” event — not only leisure</span>
            </li>
            <li>
              <span className="font-display font-bold text-[22px]">2.4×</span>
              <span className="block text-grey">more deadline applications met when the event was saved on onTrack</span>
            </li>
            <li>
              <span className="font-display font-bold text-[22px]">31%</span>
              <span className="block text-grey">of activity happens outside school hours on weekdays — see Youth activity</span>
            </li>
          </ul>
        </section>
      </div>

      <section className="card p-6" aria-labelledby="ward-heading">
        <h2 id="ward-heading" className="text-[18px]">
          Active young people by ward
        </h2>
        <div className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-2">
          {WARDS.map((w) => (
            <HBar key={w} label={w} value={fm(`ward-${w}`, 120, 640)} max={640} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================ activity */

function ActivityTab() {
  const heat = useMemo(
    () =>
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, di) =>
        [0, 1, 2, 3].map((si) => {
          const base = hashString(`bor-heat-${di}-${si}`) % 60;
          const afterSchool = si === 1 && di < 5 ? 45 : 0; // 3–6pm weekdays spike
          const weekend = di >= 5 && si === 3 ? 40 : 0;
          return base + afterSchool + weekend;
        })
      ),
    []
  );
  const bands = [
    { label: "13–14", value: fm("bband1", 800, 1400) },
    { label: "15–16", value: fm("bband2", 1200, 2000) },
    { label: "17–18", value: fm("bband3", 1000, 1800) },
  ];
  const catEngagement = CATEGORIES.map((c) => ({ label: c.name, value: fm(`bcat-${c.slug}`, 300, 1600) }));
  const funnel = [
    { label: "Opened a listing", value: 14260 },
    { label: "Saved it", value: 3810 },
    { label: "Booked or applied", value: 2130 },
    { label: "Marked attended", value: 1490 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <section className="card p-6" aria-labelledby="bheat-heading">
        <h2 id="bheat-heading" className="text-[22px]">
          When young people are active
        </h2>
        <p className="mt-1 text-[13px] text-grey measure">
          The after-school window and weekend afternoons dominate — programme into them.
        </p>
        <div className="mt-4">
          <Heatmap
            rows={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            cols={["AM", "3–6pm", "Eve", "Wknd"]}
            values={heat}
            ariaLabel="Activity heatmap: weekday after-school hours and weekend afternoons are busiest"
          />
        </div>
      </section>

      <section className="card p-6" aria-labelledby="funnel-heading">
        <h2 id="funnel-heading" className="text-[22px]">
          From discovery to turning up
        </h2>
        <div className="mt-4 space-y-3">
          {funnel.map((f) => (
            <HBar key={f.label} label={f.label} value={f.value} max={funnel[0].value} />
          ))}
        </div>
        <p className="mt-3 text-[12px] text-grey measure">
          The save→attend conversion is the number youth services rarely have: roughly two in
          five saved events become an attendance.
        </p>
      </section>

      <section className="card p-6" aria-labelledby="bbands-heading">
        <h2 id="bbands-heading" className="text-[22px]">
          Engagement by age band
        </h2>
        <div className="mt-4 space-y-3">
          {bands.map((b) => (
            <HBar key={b.label} label={b.label} value={b.value} max={Math.max(...bands.map((x) => x.value))} />
          ))}
        </div>
        <p className="mt-3 text-[12px] text-grey measure">
          15–16s lead. 17–18s skew to careers and workshops; 13–14s to sport and social.
        </p>
      </section>

      <section className="card p-6" aria-labelledby="bcats-heading">
        <h2 id="bcats-heading" className="text-[22px]">
          Engagement by category
        </h2>
        <div className="mt-4 space-y-3">
          {catEngagement.map((c) => (
            <HBar key={c.label} label={c.label} value={c.value} max={Math.max(...catEngagement.map((x) => x.value))} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* =============================================================== provision */

function ProvisionTab() {
  // Demand = searches and saves; supply = live listings. The gap is the
  // commissioning insight a council is paying for.
  const rows = CATEGORIES.map((c) => ({
    label: c.name,
    a: fm(`dem-${c.slug}`, 300, 1500),
    b: publishedEvents().filter((e) => e.venue.borough === BOROUGH && e.category === c.slug).length * 140,
  }));
  const coldSpots = WARDS.map((w) => ({ ward: w, listings: fm(`cold-${w}`, 0, 9) }))
    .sort((a, b) => a.listings - b.listings)
    .slice(0, 4);

  return (
    <div className="grid gap-6">
      <section className="card p-6" aria-labelledby="gap-heading">
        <h2 id="gap-heading" className="text-[22px]">
          Demand vs supply, by category
        </h2>
        <p className="mt-1 text-[13px] text-grey measure">
          Demand is what young people search for and save; supply is what’s listed. Where the
          black bar towers over the green one, provision is short — that’s the commissioning
          signal.
        </p>
        <div className="mt-5 max-w-[640px]">
          <PairedBars rows={rows} aLabel="Demand (searches + saves)" bLabel="Supply (weighted listings)" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <section className="card p-6" aria-labelledby="cold-heading">
          <h2 id="cold-heading" className="text-[22px]">
            Cold spots
          </h2>
          <p className="mt-1 text-[13px] text-grey measure">
            Wards with active young people but the fewest live listings within a 15-minute
            journey.
          </p>
          <ul className="mt-4 space-y-3">
            {coldSpots.map((c) => (
              <li key={c.ward} className="flex items-center justify-between gap-3 text-[14px]">
                <span className="font-medium">{c.ward}</span>
                <span className="pill bg-line px-2.5 py-1">
                  {c.listings} listing{c.listings === 1 ? "" : "s"} nearby
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-grey measure">
            Pair a cold spot with an over-demanded category above and you have next quarter’s
            commissioning brief.
          </p>
        </section>

        <section className="card p-6" aria-labelledby="deadline-cov-heading">
          <h2 id="deadline-cov-heading" className="text-[22px]">
            Deadline coverage
          </h2>
          <p className="mt-1 text-[13px] text-grey measure">
            Opportunities with application deadlines currently open to your young people.
          </p>
          <ul className="mt-4 space-y-2 text-[14px]">
            {publishedEvents()
              .filter((e) => e.venue.borough === BOROUGH && e.applicationDeadline && daysUntil(e.applicationDeadline) >= 0)
              .sort((a, b) => new Date(a.applicationDeadline!).getTime() - new Date(b.applicationDeadline!).getTime())
              .map((e) => (
                <li key={e.id} className="flex justify-between gap-3 border-b border-line pb-2 last:border-0">
                  <Link href={`/events/${e.slug}`} className="hover:underline min-w-0 truncate">
                    {e.title}
                  </Link>
                  <span className="shrink-0 text-coral-deep font-medium">{formatDate(e.applicationDeadline!)}</span>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* =============================================================== organisers */

function OrganisersTab() {
  const events = publishedEvents().filter((e) => e.venue.borough === BOROUGH);
  const byOrg = Array.from(new Set(events.map((e) => e.organiser))).map((org) => {
    const theirs = events.filter((e) => e.organiser === org);
    return {
      org,
      listings: theirs.length,
      reach: theirs.reduce((s, e) => s + fm(`${e.slug}-reach`, 150, 900), 0),
      verified: theirs[0].organiserVerified,
    };
  });
  byOrg.sort((a, b) => b.reach - a.reach);
  const verifiedCount = byOrg.filter((o) => o.verified === "verified").length;

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Organisations listing" value={String(byOrg.length)} note="in your borough" />
        <StatCard label="Safeguarding verified" value={String(verifiedCount)} note="documents inspected by onTrack" />
        <StatCard label="Self-certified" value={String(byOrg.filter((o) => o.verified === "self-certified").length)} note="declarations on file" />
        <StatCard label="Council-run listings" value={String(fm("council-run", 4, 11))} note="from your own services" />
      </div>

      <section className="card p-6 overflow-hidden" aria-labelledby="leader-heading">
        <h2 id="leader-heading" className="text-[22px]">
          Reach leaderboard
        </h2>
        <div className="mt-4 overflow-x-auto -mx-6 px-6">
          <table className="w-full text-[14px] min-w-[560px]">
            <thead>
              <tr className="text-left text-grey border-b border-line text-[12px] uppercase tracking-[0.04em]">
                <th className="py-2 pr-4 font-medium">Organisation</th>
                <th className="py-2 pr-4 font-medium">Listings</th>
                <th className="py-2 pr-4 font-medium">Young people reached</th>
                <th className="py-2 font-medium">Safeguarding</th>
              </tr>
            </thead>
            <tbody>
              {byOrg.map((o) => (
                <tr key={o.org} className="border-b border-line last:border-0">
                  <td className="py-2.5 pr-4 font-medium">{o.org}</td>
                  <td className="py-2.5 pr-4">{o.listings}</td>
                  <td className="py-2.5 pr-4">{o.reach.toLocaleString("en-GB")}</td>
                  <td className="py-2.5">
                    {o.verified ? (
                      <span className={`pill px-2.5 py-0.5 ${o.verified === "verified" ? "bg-ink text-paper" : "bg-line"}`}>
                        {o.verified === "verified" ? "Verified" : "Self-certified"}
                      </span>
                    ) : (
                      <span className="text-grey text-[13px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ================================================================== impact */

function ImpactTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
      <section className="card p-6" aria-labelledby="quarter-heading" id="borough-report">
        <h2 id="quarter-heading" className="text-[22px]">
          Quarterly impact report — {BOROUGH}
        </h2>
        <p className="mt-1 text-[13px] text-grey">Formatted for a members’ briefing. Print or export as PDF.</p>
        <div className="mt-4 space-y-4 text-[15px] measure">
          <p>
            <strong>Reach.</strong> 4,183 young people aged 13–18 used onTrack in {BOROUGH} this
            term — roughly one in six of the borough’s secondary-age population — with weekly
            active use up 18% on last term.
          </p>
          <p>
            <strong>Participation.</strong> 2,100+ bookings and applications were made, 74% of
            them for free events. Two in five saved events became an attendance — a conversion
            figure youth services have never previously been able to evidence.
          </p>
          <p>
            <strong>Balance.</strong> Engagement split 54/46 between leisure and opportunity —
            young people use both when both are visible in one place.
          </p>
          <p>
            <strong>Gaps.</strong> Demand for workshops and careers events exceeds supply by
            roughly 3:1 in the east of the borough; the cold-spot wards are listed under
            Provision gaps with a suggested commissioning focus.
          </p>
          <p>
            <strong>Safeguarding.</strong> Every listing was editorially reviewed before
            publication; {publishedEvents().filter((e) => e.venue.borough === BOROUGH && e.organiserVerified === "verified").length}{" "}
            listings carry document-checked safeguarding verification; no under-age young person
            was shown an age-restricted event.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-5 min-h-[44px] px-5 rounded-full border border-ink text-[14px] font-medium hover:bg-ink hover:text-paper transition-colors"
        >
          Print the report
        </button>
      </section>

      <section className="card p-6" aria-labelledby="milestone-heading">
        <h2 id="milestone-heading" className="text-[18px]">
          Partnership milestones
        </h2>
        <div className="mt-4 space-y-4">
          <HBar label="Young people reached (target 6,000)" value={4183} max={6000} accent />
          <HBar label="Organisations listing (target 60)" value={fm("orgs-target", 38, 52)} max={60} accent />
          <HBar label="Schools activated (target 7)" value={4} max={7} accent />
        </div>
        <p className="mt-4 text-[12px] text-grey measure">
          Each borough contract brings roughly seven of its schools with it — school activation
          is the next lever.
        </p>
      </section>
    </div>
  );
}
